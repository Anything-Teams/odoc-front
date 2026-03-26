import { useNavigate } from "react-router-dom";
import "../css/common.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div></div>
      <div className="login-box">
        <h1 className="logo">ODOC</h1>
        <p className="sub-text">One Day One Commit!</p>

        <input type="text" placeholder="ID" className="input" />
        <input type="password" placeholder="PW" className="input" />

        <button 
            className="btn primary"
            onClick={() => navigate("/projects", { state: { showAlert: true } })}
        >
            로그인
        </button>
        <button
            className="btn tertiary"
            onClick={() => navigate("/signup")}
        >
            ODOC 가입
        </button>
      </div>
      <div className="faq-container">
        <div>
          email 문의
        </div>
        <div>
          hcd1228@gmail.com
        </div>
      </div>
    </div>
  );
}