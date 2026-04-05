import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { post } from "../api/api";
import "../css/common.css";

export default function Signup() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [nickNm, setNickNm] = useState("");
  const [userPwCheck, setUserPwCheck] = useState("");

  const idRegex = /^[a-zA-Z0-9_-]+$/;


  const signUp = ()=> {
    if(userId && userPw && (userPw === userPwCheck)) {
      const cleanNick = nickNm.trim();

      if (!idRegex.test(userId)) {
        alert("아이디는 영문, 숫자만 사용할 수 있습니다");
        return;
      }

      if (/^\d+$/.test(userId)) {
        alert("아이디는 숫자만으로 구성할 수 없습니다");
        return;
      }

      if (!cleanNick) {
        alert("닉네임을 입력해주세요");
        setNickNm(cleanNick);
        return;
      }

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
              userPw: userPw,
              nickNm: nickNm
          })
          .then((data) => {
            alert("가입완료!\n꾸준한 오독생활 되세요!");
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

      if (!(nickNm.trim())) {
        alert("닉네임를 입력해주세요");
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

        <input type="text" placeholder="ID" className="input" onChange={(e) => setUserId(e.target.value)} maxLength={30}/>
        <input type="text" placeholder="닉네임" className="input" value={nickNm} onChange={(e) => setNickNm(e.target.value)} maxLength={30}/>
        <input type="password" placeholder="PW" className="input" onChange={(e) => setUserPw(e.target.value)}/>
        <input type="password" placeholder="PW확인" className="input" onChange={(e) => setUserPwCheck(e.target.value)} />

        <button className="btn tertiary" onClick={signUp}>
          가입
        </button>
        <button className="btn secondary" onClick={() => navigate("/login")}>
          취소
        </button>
      </div>
      <div></div>
    </div>
    );
}
