import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Loading } from "../components/Loading";
import { quotes } from "../components/quotes";
import { post } from "../api/api";
import { useAuth } from "../common/AuthContext";
import "../css/common.css";

export default function ProjectList() {
    const location = useLocation();
    const navigate = useNavigate();
    const [odocs, setOdocs] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const startX = useRef(0);
    const currentX = useRef(0);
    const [loading, setLoading] = useState(true);
    const [odocType, setOdocType] = useState("0");
    const isFirstAlert = useRef(true);
    const showAlert = location.state?.showAlert;
    const [isMotivationAlert, setIsMotivationAlert] = useState("N");
    const { user } = useAuth();

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
            odocType: odocType==="0"?"":odocType
        })
        .then((data) => {
            setOdocs(data);
            setLoading(false);

            setIsMotivationAlert(user?.isMotivationAlert);
        })
        .catch(console.error);
    };

    useEffect(() => {
        if (user?.userId) {
            fetchList();
        }
    }, [user]);

    useEffect(() => {
        if (showAlert && !loading && isFirstAlert.current) {
            isFirstAlert.current = false;
            
            if(isMotivationAlert === "Y") {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                        alert(randomQuote);
        
                        window.history.replaceState({}, document.title);
                    });
                });
            }
        }
    }, [loading, showAlert, isMotivationAlert]);

    useEffect(() => {
        if (user?.userId) {
            fetchList();
        }
    }, [odocType]);


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
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="project-container">
            <div className="project-detail">
            <div className="title">나의 ODOC</div>
            <div className="odoc-list-sort">
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
            </div>

            {odocs.length === 0 ? (
                <div className="empty-container">
                    <div className="empty">{odocType === "2"?"첫 번째 기록을 남겨보세요!":"목표를 설정하세요!"}</div>
                </div>
            ) : (
                <>
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
                                        ? "translateX(-180px)"
                                        : "translateX(0)",
                                    transition: "transform 0.3s ease"
                                }}
                                onClick={() => navigate(`/projects/${item.odocSn}`)}
                            >
                                <div className="card-title">
                                    <span>
                                    {item.odocType === '2' ? 
                                        <>
                                            <span className="card-label card-record">기록</span>
                                            <span className={`card-label ${item.endYn === 'Y' ? 'card-end' : ''}`}>{item.endYn === "Y" ? "종료" : ""}</span>
                                        </>
                                    : 
                                    (
                                        <>
                                            <span className="card-label card-odoc">ODOC</span>
                                            <span className={`card-label ${item.endYn === 'Y' ? 'card-end' : 'card-ing'}`}>{item.endYn === "Y" ? "종료" : "도전 중"}</span>
                                        </>
                                    )}
                                    </span>
                                    <span>{item.odocNm}</span>
                                </div>
                                <div className="card-bottom-odoc">
                                    {item.odocYn === 1?"ODOC!":""}
                                </div>
                                <div className="card-bottom-date">
                                    {item.frstRegDt}
                                </div>
                            </div>

                            <div className="card-action">
                                <button
                                    className="card-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fn_btn_event(item.odocSn, item.endYn);
                                    }}
                                >
                                    {item.endYn === "Y" ? "재개" : "종료"}
                                </button>

                                <button
                                    className="card-btn delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fn_delete_event(item.odocSn);
                                    }}
                                >
                                    삭제
                                </button>
                            </div>

                        </div>
                    ))}
                    </div>
                </>
            )}
            </div>
            <div className="bottom-area">
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