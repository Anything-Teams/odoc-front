import { useNavigate } from "react-router-dom";
import "../css/common.css";

export default function ProjectList() {
    const navigate = useNavigate();

  // 예시 데이터 (추후 API로 교체)
  const odocs = [
    { id: 1, title: "어플개발하기", date: "2026.02.13" },
    { id: 2, title: "블로그 만들기", date: "2026.02.14" },
  ];

  return (
    <div className="project-container">
        <div className="list-container">
        <h2 className="title">ODOC 내역</h2>

        {odocs.length === 0 ? (
            <div className="empty">ODOC 내역이 없습니다.</div>
        ) : (
            <div className="card-list">
            {odocs.map((item) => (
                <div key={item.id} className="card" onClick={() => navigate(`/projects/${item.id}`)}>
                <div className="card-title">{item.title}</div>
                <div className="card-date">{item.date}</div>
                </div>
            ))}
            </div>
        )}
        </div>
        <div className="bottom-area">
            <button
                className="btn primary btn-8"
                onClick={() => navigate("/projects/new")}
            >
                ODOC 추가
            </button>
        </div>
    </div>
  );
}