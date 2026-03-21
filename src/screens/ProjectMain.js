import { useParams, useNavigate } from "react-router-dom";
import "../css/common.css";

export default function ProjectMain() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // 임시 데이터 (추후 API)
  const data = {
    1: { title: "어플개발하기", progress: "3월 51%" },
    2: { title: "블로그 만들기", progress: "2월 100%" },
  };

  const project = data[projectId];

  if (!project) {
    return <div>데이터 없음</div>;
  }

  return (
    <div className="project-container">
        <div className="project-detail">
        <h2 className="detail-title">{project.title}</h2>

        <div className="image-box">
            <div className="image-placeholder">DOT IMAGE</div>
        </div>
        <div className="progress">
            {project.progress}
        </div>

        <div className="button-group">
            <button
            className="btn secondary btn-8"
            onClick={() => alert("ODOC!")}
            >
            ODOC!
            </button>

            <button
            className="btn tertiary"
            onClick={() => navigate("history-year")}
            >
            내역
            </button>
        </div>
        </div>
    </div>
  );
}