import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { post } from "../api/api";
import { useAuth } from "../common/AuthContext";
import "../css/common.css";

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [odocNm, setOdocNm] = useState(""); 
  const [odocType, setOdocType] = useState("1");  
  const { user } = useAuth();

  const insertProject = () => {
    if(odocNm==="") {
      alert("ODOC명을 입력해주세요");
      return;
    }
    post("/insertProject", { 
        userId: user?.userId,
        odocNm: odocNm,
        odocType: odocType
    })
    .then((data) => {
      navigate("/projects")
    })
    .catch(console.error);
  };

  const updateOdocType = (data) => {
    setOdocType(data);
}

  return (
    <div className="login-container">
      <div></div>
      <div className="login-box">
        <h1 className="logo">ODOC 명</h1>

        <input type="text" placeholder="목표습관명(10자제한)" className="input" value={odocNm} onChange={(e) => setOdocNm(e.target.value)} maxLength={10}/>
        
        <div className="odoc-type-setting">
          <label className={`radio-item odoc-item ${odocType === "1" ? "odoc-active" : ""}`}>
            <input
              type="radio" name="odocType" value="1"
              checked={odocType === "1"}
              onChange={(e) => updateOdocType(e.target.value)}
            />
            <span className="odoc-item-span">ODOC</span>
          </label>

          <label className={`radio-item odoc-item ${odocType === "2" ? "odoc-active" : ""}`}>
            <input
              type="radio" name="odocType" value="2"
              checked={odocType === "2"}
              onChange={(e) => updateOdocType(e.target.value)}
            />
            <span className="odoc-item-span">기록</span>
          </label>
        </div>

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