import { useNavigate } from "react-router-dom";
import "../css/common.css";

export default function ProjectHistoryYear() {
    const navigate = useNavigate();

    const data = {
        title: "어플개발하기",
    };

    const months = [
        { month: "2월", progress: 100 },
        { month: "3월", progress: 80 },
    ];

  return (
    <div className="project-history-year">
        <h2 className="detail-title">{data.title}</h2>
        
        <div className="year-title">2026년</div>

        <div className="year-grid">
            {months.map((item, idx) => (
                <div
                    key={idx}
                    className="year-card"
                    onClick={() => navigate(`/projects/1/history-month`)}
                >
                    <div className="year-image-box">
                    <div className="year-image-placeholder">DOT</div>
                    </div>

                    <div className="year-progress">{item.progress}%</div>
                    <div className="year-month">{item.month}</div>
                </div>
            ))}
        </div>
    </div>
  )
}