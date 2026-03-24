import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { post } from "../api/api";
import "../css/common.css";

export default function ProjectMain() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({}); 
  const [odocBtn, setOdocBtn] = useState(""); 

  const getProjectMain = useCallback(() => {
    post("/getProjectMain", { 
      userId: "test001",
      odocSn: projectId
    })  
    .then((data) => {
      setData(data);
      setOdocBtn((data.delYn === "Y")?"종료된 ODOC 입니다":(data.odocYn)?"ODOC 완료!":"ODOC!");
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
        <h2 className="detail-title">{data.odocNm}</h2>

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