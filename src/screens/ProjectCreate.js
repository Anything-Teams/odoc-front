import { useNavigate } from "react-router-dom";
import "../css/common.css";

export default function ProjectCreate() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">ODOC 이름</h1>

        <input type="text" placeholder="계획명" className="input" />

        <button className="btn primary"
          onClick={() => navigate("/projects")}
        >
          추가
        </button>
        <button className="btn secondary"
          onClick={() => navigate("/projects")}
        >
          취소
        </button>
      </div>
    </div>
  );
}