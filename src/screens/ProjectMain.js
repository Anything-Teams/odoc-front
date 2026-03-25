import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { Loading } from "../components/Loading";
import { BiEditAlt } from "react-icons/bi";
import { post } from "../api/api";
import "../css/common.css";

export default function ProjectMain() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({}); 
  const [tempName, setTempName] = useState("");
  const [odocBtn, setOdocBtn] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const inputRef = useRef(null);

  const getProjectMain = useCallback(() => {
    post("/getProjectMain", { 
      userId: "test001",
      odocSn: projectId
    })  
    .then((data) => {
      setData(data);
      setOdocBtn((data.delYn === "Y")?"종료된 ODOC 입니다":(data.odocYn)?"ODOC 완료!":"ODOC!");
      setLoading(false);
      setTempName(data.odocNm);

      if(data.delYn==="Y") setIsEnd(true);
    })
    .catch(console.error);
  }, [projectId]);

  useEffect(() => {
    getProjectMain();
  }, [getProjectMain]);

  const one_day_one_commit = async (odocSn) => {
    try {
      await post("/commitProject", {
        userId: "test001",
        odocSn: odocSn
      });
      alert("오늘도 해냈다!");
      getProjectMain();
    } catch (err) {
      console.error(err);
    }
  };

  const fn_odocNm_change = () => {
    if(tempName==="") {
      alert("ODOC명을 입력해주세요");
      return;
    }

    post("/updateProject", {
        userId: "test001",
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
                    src={`/images/${Math.floor(Number(data.progress/10) || 0)}.png`}
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
                disabled={data.odocYn === 1 || data.delYn === "Y"}
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