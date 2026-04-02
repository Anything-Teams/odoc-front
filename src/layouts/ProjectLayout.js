import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { TbArrowBackUp, TbSettings } from "react-icons/tb";
import { post } from "../api/api";
import { useAuth } from "../common/AuthContext";
import { TbLock } from "react-icons/tb";

export default function ProjectLayout() {
    
    const navigate = useNavigate();
    const location = useLocation();
    const [userOption, setUserOption] = useState(false);
    const isProjectList = location.pathname === "/projects";
    const [isMotivationAlert, setIsMotivationAlert] = useState("Y");
    const [code, setCode] = useState("");
    const [noticeContent, setNoticeContent] = useState(null);
    const { user, logout } = useAuth();

    useEffect(() => {
        setIsMotivationAlert(user?.isMotivationAlert);
    }, []);

    useEffect(() => {
        const fetchNotice = () => {
            post("/selectNotice", {
                userId: user?.userId,
                noticeYn: 'Y',
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
            <header>
            <div className="header">
                <div
                    className="header-left"
                >
                    <span
                        onClick={() => navigate(-1)}
                        style={{ visibility: isProjectList ? "hidden" : "visible" }}
                    >
                        <TbArrowBackUp />
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
                        <span className="notice-text">{noticeContent}</span>
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