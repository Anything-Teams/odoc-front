import { useNavigate } from "react-router-dom";
import "../css/common.css";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div></div>
      <div className="login-box">
        <h1 className="logo">ODOC 가입</h1>

        <input type="text" placeholder="ID" className="input" />
        <input type="password" placeholder="PW" className="input" />
        <input type="password" placeholder="PW확인" className="input" />

        <button className="btn tertiary"
          onClick={() => alert("가입완료.\n승인 후 로그인이 가능합니다.")}
        >신청</button>
        <button className="btn secondary"
          onClick={() => navigate("/login")}
        >
          취소
        </button>
      </div>
      <div></div>
    </div>
  );
}