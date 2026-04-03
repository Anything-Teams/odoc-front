import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { post } from "../api/api";
import { useAuth } from "../common/AuthContext";
import "../css/common.css";
import { Loading } from "../components/Loading";
import { registerPush } from "../common/push";

export default function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const { login, user, loading  } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/projects", { replace: true });
    }
  }, []);

  if (loading) return <Loading />;

  const doLogin = () => {
    if (!userId) {
      alert("아이디를 입력해주세요");
      return;
    }

    if (!userPw) {
      alert("비밀번호를 입력해주세요");
      return;
    }

    post("/userLogin", {
      userId: userId,
      userPw: userPw,
    })
    .then(async (data) => {
      login({ userId: userId, ...data });
    
      await registerPush(userId);
      await bindForegroundMessageHandler();
    
      navigate("/projects", { state: { showAlert: true } });
    })
    .catch((error) => {
      console.error(error);
      alert("아이디 또는 비밀번호를 확인해주세요.");
    });
  };

  return (
    <div className="login-container">
      <div></div>
      <div className="login-box">
        <h1 className="logo">ODOC</h1>
        <p className="sub-text">One Day One Commit!</p>

        <input type="text" placeholder="ID" className="input" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <input type="password" placeholder="PW" className="input" value={userPw} onChange={(e) => setUserPw(e.target.value)} />

        <button className="btn primary" onClick={doLogin}>
            로그인
        </button>
        <button className="btn tertiary" onClick={() => navigate("/signup")} >
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