import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";
import { post } from "../api/api";
import { useAuth } from "../common/AuthContext";
import "../css/common.css";

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [odocNm, setOdocNm] = useState(""); 
  const [odocType, setOdocType] = useState("1");  
  const [odocThemaList, setOdocThemaList] = useState([]);  
  const [userThemaList, setUserThemaList] = useState([]);  
  const [isInsertOdocThema, setIsInsertOdocThema] = useState(false);  
  const [alertMessage, setAlertMessage] = useState("");  
  const [odocThemaType, setOdocThemaType] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [onAlarm, setOnAlarm] = useState("N");
  const [themaDesc, setThemaDesc] = useState("");
  const [odocAlarmTime, setOdocAlarmTime] = useState("09:00");
  const { user } = useAuth();

  useEffect(() => {
    if(user?.userId) {
      post("/selectThemaList", {
        userId: user?.userId
      })
      .then((data) => {
        setOdocThemaList(data);
        setIsLoading(false);
        setThemaDesc(data[0].themaDesc);
      })
      .catch(console.error);
    }
  }, [user?.userId]);

  useEffect(() => {
    if (user?.userId) {
      post("/selectUserThemaList", { 
        userId: user?.userId
      })
      .then((data) => {
        setUserThemaList(data);
      })
      .catch(console.error);
    }
  }, []);
  
  const insertProject = () => {
    if(odocNm==="") {
      alert("ODOC명을 입력해주세요");
      return;
    }
    if (!odocAlarmTime) {
      alert("알람시간을 입력해주세요");
      return;
    }
    
    post("/insertProject", { 
        userId: user?.userId,
        odocNm: odocNm,
        odocType: odocType,
        odocThemaType: odocThemaType,
        odocAlarmYn: onAlarm,
        odocAlarmTime: odocAlarmTime
    })
    .then((data) => {
      navigate("/projects")
    })
    .catch(console.error);
  };

  const updateOdocType = (data) => {
    setOdocType(data);
  }
  const updateOnAlarm = (data) => {
    setOnAlarm(data);
  }

  const setThema = (data) => {
    setOdocThemaType(data.themaId); 
    setIsInsertOdocThema(!userThemaList.some((thema) => String(thema.themaId) === String(data.themaId)));
    setAlertMessage(data.themaGetMethod === "day"?`${data.themaGetDay}일 연속 습관 완성 시 잠금해제 됩니다!`:'코드필요');
    setThemaDesc(data.themaDesc);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="project-container">
      <div className="project-detail">
        
        <div className="detail-title">
          
          <div className="input-wrapper">
            <div className="odocNm-class">{odocType === "1" ? "ODOC 명" : "기록명"}</div>
          </div>  
        </div>


        <div className="create-inner">

          <input type="text" placeholder={`${odocType === "1" ? "목표 습관명(10자제한)" : "기록명(10자제한)"}`} className="input" value={odocNm} onChange={(e) => setOdocNm(e.target.value)} maxLength={10}/>
          
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

          <div className="project-create-image">
            <div className="odoc-type-setting">
              <label className={`radio-item odoc-item ${onAlarm === "Y" ? "odoc-active" : ""}`}>
                <input
                  type="radio" name="onAlarm" value="Y"
                  checked={onAlarm === "Y"}
                  onChange={(e) => updateOnAlarm(e.target.value)}
                />
                <span className="odoc-item-span">알람 ON</span>
              </label>

              <label className={`radio-item odoc-item ${onAlarm === "N" ? "odoc-active" : ""}`}>
                <input
                  type="radio" name="onAlarm" value="N"
                  checked={onAlarm === "N"}
                  onChange={(e) => updateOnAlarm(e.target.value)}
                />
                <span className="odoc-item-span">알람 OFF</span>
              </label>
              <input
                type="time"
                className="alarm-time"
                value={odocAlarmTime}
                onChange={(e) => setOdocAlarmTime(e.target.value)}
              />
            </div>

            <div className="image-box create">
                <img
                      src={isInsertOdocThema?`/images/empty/0.png`:`/images/${odocThemaType}/0.png`}
                      alt="progress"
                      className="image-placeholder create"
                />
            </div>
            <span className="thema-desc">{themaDesc}</span>

            {isInsertOdocThema && (
              <div className="odoc-main-stream">
                {alertMessage}
              </div>
            )}

            <div className="odoc-type-setting">
              <div className="thema-list">
                {odocThemaList.map((item) => (
                  <label key={item.themaId} className={`radio-item thema-item ${odocThemaType === item.themaId? "thema-active" : ""}`}>
                    <input
                      type="radio" name="odocThemaType" value={item.themaId}
                      checked={odocThemaType === item.themaId}
                      onChange={() => setThema(item)}
                    />
                    <span className="thema-item-span">{item.themaNm}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button className="btn primary" disabled={isInsertOdocThema}
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
      </div>
    </div>
  );
}