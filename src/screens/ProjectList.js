import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Loading } from "../components/Loading";
import { quotes } from "../components/quotes";
import { post } from "../api/api";
import { useAuth } from "../common/AuthContext";
import "../css/common.css";
import { MdOutlinePause, MdPlayArrow, MdDelete } from "react-icons/md";
import { TbTargetOff, TbTarget } from "react-icons/tb";
import { bindForegroundMessageHandler } from "../common/push";

export default function ProjectList() {
    const location = useLocation();
    const navigate = useNavigate();
    const [odocs, setOdocs] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const startX = useRef(0);
    const currentX = useRef(0);
    const [loading, setLoading] = useState(true);
    const [odocType, setOdocType] = useState("0");
    const [odocEndYn, setOdocEndYn] = useState("");
    const isFirstAlert = useRef(true);
    const showAlert = location.state?.showAlert;
    const [isMotivationAlert, setIsMotivationAlert] = useState("N");
    const { user, isAutoLogin } = useAuth();
    const [sortType, setSortType] = useState("latest");

    const autoLoginQuoteShown = sessionStorage.getItem("autoLoginQuoteShown") === "Y";
    const shouldShowAlert = showAlert || (isAutoLogin && !autoLoginQuoteShown);

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        currentX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (id) => {
        const diff = startX.current - currentX.current;

        if (diff > 50) {
            setActiveId(id);
        } else if (diff < -50) {
            setActiveId(null);
        } else {
            setActiveId(null);
        }
    };

    const fetchList = () => {
        post("/getProjectMainList", { 
            userId: user?.userId,
            odocType: odocType==="0"?"":odocType,
            endYn: odocEndYn
        })
        .then((data) => {
            sortOdoc(sortType, data);
            setLoading(false);

            setIsMotivationAlert(user?.isMotivationAlert);
        })
        .catch(console.error);
    };

    useEffect(() => {
        const pendingTarget = sessionStorage.getItem("pendingPushTarget");

        if (pendingTarget) shouldShowAlert = false;

        const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
        if (!isStandalone) return;

        if (window.history.state?.guard !== 'active') {
            window.history.pushState({ guard: 'active' }, '', window.location.pathname);
        }

        const handlePopState = (e) => {
            window.history.pushState({ guard: 'active' }, '', window.location.pathname);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []); 

    useEffect(() => {
        if (!loading) {
            const pendingTarget = sessionStorage.getItem("pendingPushTarget");

            if (pendingTarget) {
                sessionStorage.removeItem("pendingPushTarget");

                window.history.replaceState({ guard: 'active' }, '', window.location.pathname);
                
                navigate(`/projects/${pendingTarget}`);
            }
        }
    }, [loading, location.search, navigate]);

    useEffect(() => {
        bindForegroundMessageHandler();
    }, []);

    useEffect(() => {
        if (user?.userId) {
            fetchList();
        }
    }, [user]);
    
    useEffect(() => {
        if (!loading && isFirstAlert.current && shouldShowAlert && isMotivationAlert === "Y") {
            isFirstAlert.current = false;
    
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                    alert(randomQuote);
    
                    if (isAutoLogin) {
                        sessionStorage.setItem("autoLoginQuoteShown", "Y");
                    }
    
                    navigate(
                        `${location.pathname}${location.search}${location.hash}`,
                        { replace: true, state: null }
                    );
                });
            });
        }
    }, [loading, shouldShowAlert, isMotivationAlert, isAutoLogin]);

    useEffect(() => {
        if (user?.userId) {
            fetchList();
        }
    }, [odocType, odocEndYn]);


    const fn_btn_event = async (odocSn, endYn) => {
        try {
            await post("/updateProject", {
                userId: user?.userId,
                odocSn: odocSn,
                endYn: endYn === "Y" ? "N" : "Y"
            })
            .then((data) => {
                setActiveId(null);
                fetchList();
            })
            .catch(console.error);
        } catch (err) {
            console.error(err);
        }
    };

    const fn_btn_odoc_fav = async (odocSn, odocFavYn) => {
        try {
            await post("/updateProject", {
                userId: user?.userId,
                odocSn: odocSn,
                odocFavYn: odocFavYn === "Y" ? "N" : "Y"
            })
            .then((data) => {
                setActiveId(null);
                fetchList();
            })
            .catch(console.error);
        } catch (err) {
            console.error(err);
        }
    };

    const fn_delete_event = async (odocSn) => {
        if (!window.confirm("삭제 시 목록에서 제외됩니다")) return;
        try {
            await post("/updateProject", {
               userId: user?.userId,
               odocSn: odocSn,
               delYn: "Y"
           })
           .then((data) => {
               setActiveId(null);
               fetchList();
           })
           .catch(console.error);
        } catch (err) {
            console.error(err);
        }
    };

    const updateOdocType = (data) => {
        setOdocType(data);
        setOdocEndYn("");
        setSortType("latest");
    }

    const parseDate = (str) => {
        if (!str) return new Date(0);
        return new Date(str.replace(/\.\s*/g, "-").replace(/-$/, ""));
    };
    
    const sortOdoc = (sortType, list = odocs) => {
        const sorted = [...list];
        if (sortType === "latest") {
            sorted.sort((a, b) => parseDate(b.frstRegDt) - parseDate(a.frstRegDt));
        } else if (sortType === "oldest") {
            sorted.sort((a, b) => parseDate(a.frstRegDt) - parseDate(b.frstRegDt));
        } else if (sortType === "lastOdoc") {
            sorted.sort((a, b) => parseDate(b.lastOdocDt) - parseDate(a.lastOdocDt));
        } else if (sortType === "name") {
            sorted.sort((a, b) => a.odocNm.localeCompare(b.odocNm, "ko"));
        }
    
        sorted.sort((a, b) => {
            if (a.odocFavYn !== "Y" && b.odocFavYn === "Y") return 1;
            if (a.odocFavYn === "Y" && b.odocFavYn !== "Y") return -1;
            if (a.endYn === "Y" && b.endYn !== "Y") return 1;
            if (a.endYn !== "Y" && b.endYn === "Y") return -1;
            return 0;
        });
    
        setOdocs(sorted);
    };

    const sortOdocDetail = (sortType) => {
        setOdocEndYn(sortType);

        setSortType("latest");
        sortOdoc("latest");
    };


    if (loading) {
        return <Loading />;
    }

    const getStreamStr = (streamSn, maxStreamSn) => {
        if (streamSn <= 0) {
            return maxStreamSn > 0
                ? <>최대 {maxStreamSn}일 기록에 도전해보세요</>
                : <></>;
        }
    
        if (streamSn < maxStreamSn) {
            return <>{streamSn > 2 ? '🔥 ' : ''} {streamSn}일 연속 (최대 {maxStreamSn}일)</>;
        }
    
        return <>{streamSn > 2 ? '🔥 ' : ''} 현재 {streamSn}일 최대 기록 유지 중</>;
    };

    return (
        <div className="project-container x-defend">
            <div className="project-detail">
                <div className="input-wrapper">
                    <div className="odocNm-class">나의 ODOC</div>
                </div>  
            {/* <div className="title">나의 ODOC</div> */}
            <div className="odoc-list-sort">
                <span className="odoc-type-sort">
                    <label className={`radio-item odoc-sort-item ${(odocType === "0" || odocType === "") ? "odoc-active" : ""}`}>
                        <input
                        type="radio" name="odocType" value=""
                        checked={odocType === "0"}
                        onChange={(e) => updateOdocType(e.target.value)}
                        />
                        <span className="odoc-item-span">전체</span>
                    </label>

                    <label className={`radio-item odoc-sort-item ${odocType === "1" ? "odoc-active" : ""}`}>
                        <input
                        type="radio" name="odocType" value="1"
                        checked={odocType === "1"}
                        onChange={(e) => updateOdocType(e.target.value)}
                        />
                        <span className="odoc-item-span">ODOC</span>
                    </label>

                    <label className={`radio-item odoc-sort-item ${odocType === "2" ? "odoc-active" : ""}`}>
                        <input
                        type="radio" name="odocType" value="2"
                        checked={odocType === "2"}
                        onChange={(e) => updateOdocType(e.target.value)}
                        />
                        <span className="odoc-item-span">기록</span>
                    </label>
                </span>
                <span>
                    <select className="sort-odoc" value={sortType} id="sortOdoc" 
                        onChange={(e) => {
                            setSortType(e.target.value);
                            sortOdoc(e.target.value);
                    }}>
                        <option value="latest">최신순</option>
                        <option value="oldest">시작일순</option>
                        <option value="lastOdoc">마지막 ODOC순</option>
                        <option value="name">이름순</option>
                    </select>
                </span>
            </div>

            {odocs.length === 0 ? 
                <>
                    {odocType === "1"?
                    <>
                        <div className="odoc-list-sort sort-detail-container">
                            <label className={`radio-item odoc-sort-item odoc-detail-sort all ${(odocEndYn === "") ? "odoc-active" : ""}`}>
                                <input
                                type="radio" name="odocEndYn" value=""
                                checked={odocEndYn === ""}
                                onChange={(e) => sortOdocDetail(e.target.value)}
                                />
                                <span className="odoc-item-span">전체</span>
                            </label>

                            <label className={`radio-item odoc-sort-item odoc-detail-sort ing ${odocEndYn === "N" ? "odoc-active" : ""}`}>
                                <input
                                type="radio" name="odocEndYn" value="N"
                                checked={odocEndYn === "N"}
                                onChange={(e) => sortOdocDetail(e.target.value)}
                                />
                                <span className="odoc-item-span">도전 중</span>
                            </label>

                            <label className={`radio-item odoc-sort-item odoc-detail-sort end ${odocEndYn === "Y" ? "odoc-active" : ""}`}>
                                <input
                                type="radio" name="odocEndYn" value="Y"
                                checked={odocEndYn === "Y"}
                                onChange={(e) => sortOdocDetail(e.target.value)}
                                />
                                <span className="odoc-item-span">종료</span>
                            </label>
                        </div>
                    </>
                    :<></>}
                    <div className="empty-container">
                        <div className="empty">{odocType === "2"?"첫 번째 기록을 남겨보세요!":"목표를 설정하세요!"}</div>
                    </div>
                </>
            : 
                <>
                    {odocType === "1"?
                        <>
                            <div className="odoc-list-sort sort-detail-container">
                                <label className={`radio-item odoc-sort-item odoc-detail-sort all ${(odocEndYn === "") ? "odoc-active" : ""}`}>
                                    <input
                                    type="radio" name="odocEndYn" value=""
                                    checked={odocEndYn === ""}
                                    onChange={(e) => sortOdocDetail(e.target.value)}
                                    />
                                    <span className="odoc-item-span">전체</span>
                                </label>

                                <label className={`radio-item odoc-sort-item odoc-detail-sort ing ${odocEndYn === "N" ? "odoc-active" : ""}`}>
                                    <input
                                    type="radio" name="odocEndYn" value="N"
                                    checked={odocEndYn === "N"}
                                    onChange={(e) => sortOdocDetail(e.target.value)}
                                    />
                                    <span className="odoc-item-span">도전 중</span>
                                </label>

                                <label className={`radio-item odoc-sort-item odoc-detail-sort end ${odocEndYn === "Y" ? "odoc-active" : ""}`}>
                                    <input
                                    type="radio" name="odocEndYn" value="Y"
                                    checked={odocEndYn === "Y"}
                                    onChange={(e) => sortOdocDetail(e.target.value)}
                                    />
                                    <span className="odoc-item-span">종료</span>
                                </label>
                            </div>
                        </>
                        :<></>}
                    <div className="card-list">
                    {odocs.map((item) => (
                        <div
                            key={item.odocSn}
                            className="card"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={() => handleTouchEnd(item.odocSn)}
                        >
                            <div
                                className={`card-inner ${item.endYn === 'Y' ? 'odoc-completed-color' : ''}`}
                                style={{
                                    transform: activeId === item.odocSn
                                        ? "translateX(-160px)"
                                        : "translateX(0)",
                                    transition: "transform 0.3s ease"
                                }}
                                onClick={() => navigate(`/projects/${item.odocSn}`)}
                            >
                                <div className="label-content">
                                    <span>
                                    {item.odocType === '2' ? 
                                        <>
                                            <><span className="card-label card-record">기록</span></>
                                            {item.endYn === 'Y'?<span className="card-label card-end">종료</span>:<></>}
                                            {item.odocFavYn === 'Y'?<span className="card-label card-fav">집중⭐</span>:<></>}
                                        </>
                                    : 
                                    (
                                        <>
                                            <span className="card-label card-odoc">ODOC</span>
                                            <span className={`card-label ${item.endYn === 'Y' ? 'card-end' : 'card-ing'}`}>{item.endYn === "Y" ? "종료" : "도전 중"}</span>
                                            {item.odocFavYn === 'Y'?<span className="card-label card-fav">집중⭐</span>:<></>}
                                        </>
                                    )}
                                    </span>
                                    <span className="odoc-stream">
                                        { (item.odocType === "1"&&item.endYn === "N")?getStreamStr(`${item.streamSn}`, `${item.maxStreamSn}`):<></>}
                                    </span>
                                </div>
                                <div className="card-title">
                                    <span>{item.odocNm}</span>
                                </div>
                                <div className="card-bottom">
                                    <span className="card-bottom-date">
                                        {item.odocType === "1"?`${item.frstRegDt} 시작`: item.lastOdocDt?`마지막 ${item.lastOdocDt}`: "아직 기록이 없어요"} 
                                    </span>
                                    <span className="card-bottom-odoc">
                                        {item.odocYn === 1?"ODOC!":""}
                                    </span>
                                </div>
                            </div>

                            <div className="card-action">
                                <button
                                    className={`card-btn ${item.odocFavYn === 'Y' ? 'fav-Y' : 'fav'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fn_btn_odoc_fav(item.odocSn, item.odocFavYn);
                                    }}
                                >
                                    {item.odocFavYn === "Y" ? <TbTarget/> : <TbTargetOff/>}
                                </button>

                                <button
                                    className="card-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fn_btn_event(item.odocSn, item.endYn);
                                    }}
                                >
                                    {item.endYn === "Y" ? <MdPlayArrow/> : <MdOutlinePause/>}
                                </button>

                                <button
                                    className="card-btn delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fn_delete_event(item.odocSn);
                                    }}
                                >
                                    <MdDelete />
                                </button>
                            </div>

                        </div>
                    ))}
                    </div>
                </>
            }
            </div>
            <div className="bottom-area btn-top-border">
                <button
                    className="btn primary btn-8"
                    onClick={() => navigate("/projects/new")}
                >
                    ODOC 추가
                </button>
            </div>
        </div>
    );
}
