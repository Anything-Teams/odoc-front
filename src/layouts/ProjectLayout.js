import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { TbArrowBackUp, TbSettings } from "react-icons/tb";
export default function ProjectLayout() {
    
    const navigate = useNavigate();
    const location = useLocation();
    const [userOption, setUserOption] = useState(false);
    const isProjectList = location.pathname === "/projects";
    const [value, setValue] = useState("Y");

    return (
        <div>
            <header>
            <div className="header">
                <div
                    className="header-left"
                    onClick={() => navigate(-1)}
                    style={{ visibility: isProjectList ? "hidden" : "visible" }}
                >
                    <TbArrowBackUp />
                </div>


                <div className="header-center">
                    <div className="header-logo-top">
                        ODOC
                    </div>
                    <div className="header-logo-bottom">
                        One Day One Commit
                    </div>
                </div>

                <div className="header-right" onClick={() => {setUserOption(!userOption)}}>
                    <TbSettings />
                </div>
            </div>
            </header>
            <main>
                <div className={`project-container layout-option z-index-99 ${userOption ? "open" : ""}`}>
                    <div className="project-detail layout-option-inner">
                        <div className="detail-title">
                            <div className="input-wrapper">
                                <span className="input-ghost visibled">SETTING</span>
                            </div>
                        </div>
                        <div className="setting-content">
                            <label className={`radio-item ${value === "Y" ? "active" : ""}`}>
                              <input
                                type="radio"
                                name="setting"
                                value="Y"
                                checked={value === "Y"}
                                onChange={(e) => setValue(e.target.value)}
                              />
                              <span>명언 알림 ON</span>
                            </label>

                            <label className={`radio-item ${value === "N" ? "active" : ""}`}>
                              <input
                                type="radio"
                                name="setting"
                                value="N"
                                checked={value === "N"}
                                onChange={(e) => setValue(e.target.value)}
                              />
                              <span>명언 알림 OFF</span>
                            </label>
                        </div>
                        <div className="setting-bottom">
                            <div className="setting-bottom-inner-top">
                                <button className="btn secondary"
                                        onClick={() => navigate("/login")}
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