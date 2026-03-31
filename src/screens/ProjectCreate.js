import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { post } from "../api/api";
import { useAuth } from "../common/AuthContext";
import "../css/common.css";

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [odocNm, setOdocNm] = useState(""); 
  const [odocType, setOdocType] = useState("1");  
  const [odocThemaType, setOdocThemaType] = useState("1");  
  const { user } = useAuth();

  const insertProject = () => {
    if(odocNm==="") {
      alert("ODOC명을 입력해주세요");
      return;
    }
    post("/insertProject", { 
        userId: user?.userId,
        odocNm: odocNm,
        odocType: odocType,
        odocThemaType: odocThemaType
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
        <h1 className="logo">{odocType === "1" ? "ODOC 명" : "기록 명"}</h1>

        <input type="text" placeholder={`${odocType === "1" ? "목표습관명(10자제한)" : "기록명(10자제한)"}`} className="input" value={odocNm} onChange={(e) => setOdocNm(e.target.value)} maxLength={10}/>
        
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

        <div>
          <div className="image-box create">
              <img
                    src={`/images/${odocThemaType}/0.png`}
                    alt="progress"
                    className="image-placeholder create"
              />
          </div>
          <div className="odoc-type-setting">
            <label className={`radio-item odoc-item ${odocThemaType === "1" ? "odoc-active" : ""}`}>
              <input
                type="radio" name="odocThemaType" value="1"
                checked={odocThemaType === "1"}
                onChange={(e) => setOdocThemaType(e.target.value)}
              />
              <span className="odoc-item-span">사쿠라</span>
            </label>

            <label className={`radio-item odoc-item ${odocThemaType === "2" ? "odoc-active" : ""}`}>
              <input
                type="radio" name="odocThemaType" value="2"
                checked={odocThemaType === "2"}
                onChange={(e) => setOdocThemaType(e.target.value)}
              />
              <span className="odoc-item-span">립파이</span>
            </label>
            <label className={`radio-item odoc-item ${odocThemaType === "3" ? "odoc-active" : ""}`}>
              <input
                type="radio" name="odocThemaType" value="3"
                checked={odocThemaType === "3"}
                onChange={(e) => setOdocThemaType(e.target.value)}
              />
              <span className="odoc-item-span">초요잉</span>
            </label>
          </div>
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