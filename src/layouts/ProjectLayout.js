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
    const { user, logout } = useAuth();

    useEffect(() => {
        setIsMotivationAlert(user?.isMotivationAlert);
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

    return (
        <div>
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
                <Outlet />
            </main>
        </div>
    );
}