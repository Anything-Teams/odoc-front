import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { post } from "../api/api";
import "../css/common.css";

export default function Signup() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [userPwCheck, setUserPwCheck] = useState("");

  
  const signUp = ()=> {
    if(userId && userPw && (userPw === userPwCheck)) {
      post("/userIdCheck", { 
          userId: userId
      })
      .then((data) => {
        if(data > 0 ) {
          alert("중복된 아이디가 있습니다");
          return;

        } else {
          post("/userRegister", { 
              userId: userId,
              userPw: userPw
          })
          .then((data) => {
            alert("가입완료.\n승인 후 로그인이 가능합니다.");
            navigate("/login");
          })
          .catch(console.error);
        }
      })
      .catch(console.error);

    } else {
      if (!userId) {
        alert("아이디를 입력해주세요"); 
        return;
      }

      if(!userPw) {
        alert("비밀번호를 입력해 주세요"); 
        return;
      }


      if(userPw !== userPwCheck) {
        alert("비밀번호를 동일하게 입력해 주세요"); 
        return;
      }
    }
    

  }

  return (
    <div className="login-container">
      <div></div>
      <div className="login-box">
        <h1 className="logo">ODOC 가입</h1>

        <input type="text" placeholder="ID" className="input" onChange={(e) => setUserId(e.target.value)}/>
        <input type="password" placeholder="PW" className="input" onChange={(e) => setUserPw(e.target.value)}/>
        <input type="password" placeholder="PW확인" className="input" onChange={(e) => setUserPwCheck(e.target.value)} />

        <button className="btn tertiary" onClick={signUp}>
          신청
        </button>
        <button className="btn secondary" onClick={() => navigate("/login")}>
          취소
        </button>
      </div>
      <div></div>
    </div>
    );
}
