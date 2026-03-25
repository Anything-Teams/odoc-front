import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { post } from "../api/api";
import "../css/common.css";

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [odocNm, setOdocNm] = useState(""); 

  const insertProject = () => {
    if(odocNm==="") {
      alert("ODOC명을 입력해주세요");
      return;
    }
    post("/insertProject", { 
        userId: "test001",
        odocNm: odocNm
    })
    .then((data) => {
      navigate("/projects")
    })
    .catch(console.error);
  };

  return (
    <div className="login-container">
      <div></div>
      <div className="login-box">
        <h1 className="logo">ODOC 명</h1>

        <input type="text" placeholder="목표습관명(13자제한)" className="input" value={odocNm} onChange={(e) => setOdocNm(e.target.value)} maxLength={13}/>

        <button className="btn primary"
          onClick={() => insertProject()}
        >
          추가
        </button>
        <button className="btn secondary"
          onClick={() => navigate(-1)}
        >
          취소
        </button>
      </div>
      <div></div>
    </div>
  );
}