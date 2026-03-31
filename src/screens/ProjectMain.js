import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { Loading } from "../components/Loading";
import { BiEditAlt } from "react-icons/bi";
import { post } from "../api/api";
import { useAuth } from "../common/AuthContext";
import "../css/common.css";

export default function ProjectMain() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({}); 
  const [tempName, setTempName] = useState("");
  const [odocBtn, setOdocBtn] = useState(""); 
  const [odocType, setOdocType] = useState("1");
  const [loading, setLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const inputRef = useRef(null);
  const { user } = useAuth();

  const getProjectMain = useCallback(() => {
    post("/getProjectMain", { 
      userId: user?.userId,
      odocSn: projectId
    })  
    .then((data) => {
      setData(data);
      if(data.odocType === "1") {
        setOdocBtn((data.endYn === "Y")?"종료된 ODOC 입니다":(data.odocYn)?"ODOC 완료!":"ODOC!");
        setOdocType(1);
      } else {
        setOdocType(2);
        setOdocBtn((data.endYn === "Y")?"종료된 기록 입니다":(data.odocYn)?"남겨두기 완료!":"남겨두기!");
      }
      setLoading(false);
      setTempName(data.odocNm);

      if(data.endYn==="Y") setIsEnd(true);
    })
    .catch(console.error);
  }, [projectId]);

  useEffect(() => {
    getProjectMain();
  }, [getProjectMain]);

  const one_day_one_commit = async (odocSn) => {
    try {
      await post("/commitProject", {
        userId: user?.userId,
        odocSn: odocSn
      });

      if(odocType === "1") alert("오늘도 해냈다!");
      else alert("오늘의 기록을 남겼습니다!");

      getProjectMain();
    } catch (err) {
      console.error(err);
    }
  };

  const fn_odocNm_change = () => {
    if(tempName==="") {

      if(odocType === "1") alert("ODOC명을 입력해주세요");
      else alert("기록명을 입력해주세요");


      return;
    }

    post("/updateProject", {
        userId: user?.userId,
        odocNm: tempName,
        odocSn: data.odocSn
    })
    .then((data) => {
      alert("변경완료!");
      setIsReadOnly(true);
    })
    .catch(console.error);
  }

  const handleEditStart = () => {
    setIsReadOnly(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleEditEnd = () => {
    setIsReadOnly(true);
    setTempName(data.odocNm);
  };

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return (
      <div className="empty-container">
        <div className="empty">데이터 없음</div>
      </div>
    );
  }

  return (
    <div className="project-container">
      <div className="project-detail">
        <div className="detail-title">
          <div className="input-wrapper">
            <span className="input-ghost">{tempName}</span>
            <input ref={inputRef} type="text" className="odocNm-class" id="odocNm" value={tempName} readOnly={isReadOnly} onChange={(e) => setTempName(e.target.value)} maxLength={10}
            />
            {isEnd?"":(isReadOnly ? (
              <span className="edit-icon" onClick={handleEditStart}>
                <BiEditAlt />
              </span>
            ) : (
              <span className="odoc-btn-container">
                <button className="btn tertiary margin0" onClick={fn_odocNm_change}>저장</button>
                <button className="btn secondary margin0" onClick={handleEditEnd}>취소</button>
              </span>
            ))}
          </div>
        </div>

        <div className="image-box">
            <img
                  src={`/images/${data.odocThemaType}/${Math.floor(Number(data.progress/10) || 0)}.png`}
                  alt="progress"
                  className="image-placeholder"
            />
        </div>
        <div className="progress">
            {Number(data.odocMonth)}월 {data.progress}%
        </div>

        <div className="button-group">
            <button
              className="btn secondary btn-8"
              disabled={data.odocYn === 1 || data.endYn === "Y"}
              onClick={() => one_day_one_commit(data.odocSn)}
            >
            {odocBtn}
            </button>

            <button
              className="btn tertiary"
              onClick={() => navigate(`/projects/${projectId}/history-year`)}
            >
            내역
            </button>
        </div>
      </div>
    </div>
  );
}