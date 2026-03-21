import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

export default function ProjectLayout() {
    
    const navigate = useNavigate();
    const location = useLocation();
  
    const isProjectList = location.pathname === "/projects";
    
    return (
        <div>
            <header>
            <div className="header">
                <div
                    className="header-back"
                    onClick={() => navigate(-1)}
                    style={{ visibility: isProjectList ? "hidden" : "visible" }}
                >
                    뒤로가기
                </div>


                <div className="header-logo">
                ODOC
                </div>

                <div
                className="header-logout"
                onClick={() => navigate("/login")}
                >
                로그아웃
                </div>
            </div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}