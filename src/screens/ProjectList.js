import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Loading } from "../components/Loading";
import { post } from "../api/api";

import "../css/common.css";

export default function ProjectList() {
    const navigate = useNavigate();
    const [odocs, setOdocs] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const startX = useRef(0);
    const currentX = useRef(0);
    const [loading, setLoading] = useState(true);

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        currentX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (id) => {
        const diff = startX.current - currentX.current;

        if (diff > 50) {
            setActiveId(id);
        } else {
            setActiveId(null);
        }
    };

    const fetchList = () => {
        post("/getProjectMainList", { 
            userId: "test001" 
        })
        .then((data) => {
            setOdocs(data);
            setLoading(false);
        })
        .catch(console.error);
    };

    useEffect(() => {
        fetchList();
    }, []);

    const fn_btn_event = async (odocSn, delYn) => {
        try {
            await post("/updateProject", {
                userId: "test001",
                odocSn: odocSn,
                delYn: delYn === "Y" ? "N" : "Y"
            })
            .then((data) => {
                setActiveId(null);
                fetchList();
            })
            .catch(console.error);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="project-container">
            <div className="list-container">
            <h2 className="title">나의 ODOC</h2>

            {odocs.length === 0 ? (
                <div className="empty-container">
                    <div className="empty">목표를 설정하세요!</div>
                </div>
            ) : (
                <div className="card-list">
                {odocs.map((item) => (
                    <div
                        key={item.odocSn}
                        className="card"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEnd(item.odocSn)}
                    >
                        <div
                            className={`card-inner ${item.delYn === 'Y' ? 'card-end' : ''}`}
                            style={{
                            transform: activeId === item.odocSn ? "translateX(-100px)" : "translateX(0)",
                            transition: "transform 0.3s ease"
                            }}
                            onClick={() => navigate(`/projects/${item.odocSn}`)}
                        >
                            <div className="card-title">
                                {item.delYn === "Y" ? "[종료] " : ""}
                                {item.odocNm}
                            </div>
                            <div className="card-date">{item.frstRegDt}</div>
                        </div>

                        <div className="card-action">
                            <button
                                className="card-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fn_btn_event(item.odocSn, item.delYn);
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