import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../css/common.css";

function fn_btn_event(param) {
    if(param === "Y") alert("재진행 하시겠습니까?");
    else alert("종료 하시겠습니까?");
    
}

export default function ProjectList() {
  const navigate = useNavigate();

  const [activeId, setActiveId] = useState(null);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (id) => {
    const diff = startX.current - currentX.current;

    // 왼쪽으로 50px 이상 밀었을 때 열림
    if (diff > 50) {
      setActiveId(id);
    } else {
      setActiveId(null);
    }
  };

    // 예시 데이터 (추후 API로 교체)
    const odocs = [
        { id: 1, title: "어플개발하기", date: "2026.02.13", delYn: "N" },
        { id: 2, title: "블로그 만들기", date: "2026.02.14", delYn: "Y" },
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
                    <div
                        key={item.id}
                        className="card"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEnd(item.id)}
                    >
                        <div
                            className="card-inner"
                            style={{
                            transform: activeId === item.id ? "translateX(-100px)" : "translateX(0)",
                            transition: "transform 0.3s ease"
                            }}
                            onClick={() => navigate(`/projects/${item.id}`)}
                        >
                            <div className="card-title">
                                {item.delYn === "Y" ? "[종료] " : ""}
                                {item.title}
                            </div>
                            <div className="card-date">{item.date}</div>
                        </div>

                        <div className="card-action">
                            <button
                                className="card-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fn_btn_event(item.delYn);
                                }}
                            >
                                {item.delYn === "Y" ? "재진행" : "종료"}
                            </button>
                        </div>
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