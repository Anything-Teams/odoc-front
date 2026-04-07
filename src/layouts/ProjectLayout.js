import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { TbArrowBackUp, TbSettings, TbLock, TbInfoCircle } from "react-icons/tb";
import { post } from "../api/api";
import { useAuth } from "../common/AuthContext";

export default function ProjectLayout() {
    
    const navigate = useNavigate();
    const location = useLocation();
    const [userOption, setUserOption] = useState(false);
    const isProjectList = location.pathname === "/projects";
    const [isMotivationAlert, setIsMotivationAlert] = useState("Y");
    const [code, setCode] = useState("");
    const [noticeContent, setNoticeContent] = useState(null);
    const [info, setInfo] = useState(false);
    const [notice, setNotice] = useState(false);
    const { user, logout } = useAuth();
    const infoRef = useRef(null);

    useEffect(() => {
        setIsMotivationAlert(user?.isMotivationAlert);
        
    }, []);


    useEffect(() => {
        const fetchNotice = () => {
            post("/selectNotice", {
                userId: user?.userId,
                noticeYn: 'Y',
                noticeType: '1',
                noticeSn: '1'
            })
            .then((data) => {
                if (data?.noticeContent) setNoticeContent(data.noticeContent);
                else setNoticeContent(null);
            })
            .catch(console.error);
        };

        fetchNotice();

        window.addEventListener("noticeUpdated", fetchNotice);
        return () => window.removeEventListener("noticeUpdated", fetchNotice);
    }, []);

    useEffect(() => {
      if (!user) {
        navigate("/login", { replace: true });
      }
    }, [user]);

    useEffect(() => {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (!isIOS) return;

        let startX = 0;
        let startY = 0;
        let tracking = false;
        let paused = false;

        const clearGesture = () => {
            tracking = false;
            paused = false;
            document.body.classList.remove("back-gesture-active");
        };

        const onTouchStart = (e) => {
            const touch = e.touches?.[0];
            if (!touch) return;

            // 왼쪽 가장자리에서 시작한 터치만 추적
            if (touch.clientX <= 24) {
                startX = touch.clientX;
                startY = touch.clientY;
                tracking = true;
            }
        };

        const onTouchMove = (e) => {
            if (!tracking) return;

            const touch = e.touches?.[0];
            if (!touch) return;

            const deltaX = touch.clientX - startX;
            const deltaY = Math.abs(touch.clientY - startY);

            // 세로 스크롤보다 가로 스와이프가 분명할 때만 활성화
            if (deltaX > 18 && deltaY < 30) {
                if (!paused) {
                    paused = true;
                    document.body.classList.add("back-gesture-active");
                }
            }
        };

        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", clearGesture, { passive: true });
        window.addEventListener("touchcancel", clearGesture, { passive: true });
        window.addEventListener("pageshow", clearGesture);
        window.addEventListener("pagehide", clearGesture);

        return () => {
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", clearGesture);
            window.removeEventListener("touchcancel", clearGesture);
            window.removeEventListener("pageshow", clearGesture);
            window.removeEventListener("pagehide", clearGesture);
        };
    }, []);

    const updateOption = (data) => {
        post("/updateAlert", { 
            userId: user?.userId,
            isMotivationAlert: data
        })
        .then(() => {
            setIsMotivationAlert((isMotivationAlert==="Y")?"N":"Y");
        })
        .catch(console.error);
    }

    const codeSubmit = (data) => {
        if(code==="") {
            alert("코드를 입력해주세요");
            return;
          }

        post("/codeRegist", { 
            userId: user?.userId,
            themaGetCd: code
        })
        .then((data) => {
            alert(data.result);
            setCode("");
        })
        .catch(console.error);
    }

    useEffect(() => {
        if (info && infoRef.current) {
            infoRef.current.scrollTo({
                top: 0,
                behavior: "auto"
            });
        }
    }, [info]);

    const fn_layoutLeftEvent = () => {
        if(isProjectList) {
            setInfo(true);
        } else {
            navigate(-1);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
            <header>
            <div className="header">
                <div
                    className="header-left"
                >
                    <span
                        onClick={() => fn_layoutLeftEvent()}
                    >
                        {isProjectList?<TbInfoCircle />:<TbArrowBackUp />}
                    </span>
                </div>

                <div className="header-center">
                    <div className="header-logo-top">
                        ODOC
                    </div>
                    <div className="header-logo-bottom">
                        One Day One Commit
                    </div>
                </div>

                <div className="header-right">
                    {user?.adminYn === "Y" && (
                        <span className="admin-btn"
                            onClick={() => navigate("/projects/admin")}
                        >
                            <TbLock />
                        </span>
                    )}
                    <span
                        onClick={() => {setUserOption(!userOption)}}    
                    >
                        <TbSettings />
                    </span>
                </div>
            </div>
            </header>
            <main>
                <div className={`layout-option z-index-99 ${info ? "open" : ""}`}>
                    <div className="project-detail layout-option-inner" ref={infoRef}>
                        <img
                                src={"/images/info/infomation.png"}
                                alt="progress"
                        />
                        <div className="setting-bottom-inner-bottom">
                            <div onClick={() => {setInfo(!info)}}>
                                닫기
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`layout-option z-index-99 ${userOption ? "open" : ""}`}>
                    <div className="project-detail layout-option-inner">
                        <div className="detail-title">
                            <div className="input-wrapper">
                                <span className="input-ghost visibled">SETTING</span>
                            </div>
                        </div>
                        <div className="setting-content">
                            <h3>데일리 메시지</h3>
                            <label className={`radio-item ${isMotivationAlert === "Y" ? "active" : ""}`}>
                              <input
                                type="radio"
                                name="setting"
                                value="Y"
                                checked={isMotivationAlert === "Y"}
                                onChange={(e) => updateOption(e.target.value)}
                              />
                              <span>데일리 메시지 ON</span>
                            </label>

                            <label className={`radio-item ${isMotivationAlert === "N" ? "active" : ""}`}>
                              <input
                                type="radio"
                                name="setting"
                                value="N"
                                checked={isMotivationAlert === "N"}
                                onChange={(e) => updateOption(e.target.value)}
                              />
                              <span>데일리 메시지 OFF</span>
                            </label>

                            <div className="code-input">
                                <h3>코드등록</h3> 
                                <input type="text" placeholder="코드 입력란" className="input" value={code} onChange={(e) => setCode(e.target.value)}/>
                                <button className="btn tertiary"
                                    onClick={() => codeSubmit()}
                                >
                                    코드등록
                                </button>
                            </div>
                        </div>
                        <div className="setting-bottom">
                            <div className="setting-bottom-inner-top">
                                <button className="btn secondary"
                                        onClick={logout}
                                >
                                    로그아웃
                                </button>
                            </div>
                            <div className="setting-bottom-inner-bottom">
                                <div onClick={() => {setUserOption(!userOption)}}>
                                    취소
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {noticeContent != null ?
                    <div className="notice-bar">
                        <span 
                            onClick={() => {setNotice(!notice)}}
                            className="notice-text"
                        >{noticeContent}</span>
                    </div>
                    :<></>
                }
                <div className="outlet-wrapper">
                    <Outlet />
                </div>   
            </main>
        </div>
    );
}