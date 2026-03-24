import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { post } from "../api/api";
import "../css/common.css";

export default function ProjectHistoryYear() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [years, setYears] = useState([]);
    const [title, setTitle] = useState("");

    useEffect(() => {
        post("/getHistYearList", { 
            userId: "test001",
            odocSn: projectId
        })
        .then((data) => {
            setYears(data);
        })
        .catch(console.error);
    }, [projectId]);

    useEffect(() => {
        post("/getProjectName", { 
            userId: "test001",
            odocSn: projectId
        })
        .then((data) => {
            setTitle(data.odocNm);
        })
        .catch(console.error);
    }, [projectId]);


    if (years.length === 0) {
        return (
            <div className="project-history-year">
                <h2 className="detail-title">{title}</h2>

                <div className="empty">데이터 없음</div>
            </div>
        );
    }

      
    return (
        <div className="project-history-year">
            <h2 className="detail-title">{title}</h2>

            {years.map((yearItem) => (
                <div className="year-container" key={yearItem.year}>
                    
                    <div className="year-title">{yearItem.year}년</div>

                    <div className="year-grid">
                    {yearItem.months.map((item) => (
                        <div
                        key={item.month}
                        className="year-card"
                        onClick={() =>
                            navigate(`/projects/${projectId}/history-month?year=${yearItem.year}&month=${item.month}`)
                        }
                        >
                        <div className="year-image-box">
                            <img
                                src={`/images/${Math.floor(Number(item.progress/10) || 0)}.png`}
                                alt="progress"
                                className="image-placeholder"
                            />
                        </div>

                        <div className="year-progress">{item.progress}%</div>
                        <div className="year-month">{Number(item.month)}월</div>
                        </div>
                    ))}
                    </div>

                </div>
                ))}
        </div>
    )
}