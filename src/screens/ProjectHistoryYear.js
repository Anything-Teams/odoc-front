import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";
import { post } from "../api/api";
import { useAuth } from "../common/AuthContext";
import "../css/common.css";

export default function ProjectHistoryYear() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [years, setYears] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        post("/getProjectName", { 
            userId: user?.userId,
            odocSn: projectId
        })
        .then((data) => {
            setTitle(data.odocNm);
        })
        .catch(console.error);
    }, [projectId]);

    useEffect(() => {
        post("/getHistYearList", { 
            userId: user?.userId,
            odocSn: projectId
        })
        .then((data) => {
            setYears(data);
            setLoading(false);
        })
        .catch(console.error);
    }, [projectId]);

    if (loading) {
        return <Loading />;
    }

    if (years.length === 0) {
        return (
            <div className="project-container">
                <div className="list-container empty_padding">
                    <div className="title">{title}</div>

                    <div className="empty-container">
                        <div className="empty">ODOC 내역이 없습니다</div>
                    </div>
                </div>
            </div>
        );
    }

      
    return (
        <div className="project-history-year">
            <div className="project-detail">
                <h2 className="title">{title}</h2>

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
                                    src={`/images/${item.odocThemaType}/${Math.floor(Number(item.progress/10) || 0)}.png`}
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
        </div>
    )
}