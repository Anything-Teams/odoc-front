import { useSearchParams, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";
import { post } from "../api/api";
import "../css/common.css";

export default function ProjectHistoryMonth() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const year = searchParams.get("year");
  const month = searchParams.get("month");

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

  useEffect(() => {
    post("/getHistMonth", {
      userId: "test001",
      odocSn: projectId,
      year,
      month
    }).then((data) => {
      setData(data);
      setLoading(false);
      
    });
  }, [projectId, year, month]);

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

  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const checkedDays = data.checkedDays || [];

  return (
    <div className="project-history-month">
      <div className="project-detail">
        <h2 className="detail-title">{title}</h2>

        <div className="month-title">
          {year}년 {Number(month)}월
        </div>

        <div className="month-image-box">
          <img
            src={`/images/${Math.floor(Number(data.odocRate/10) || 0)}.png`}
            alt="progress"
            className="image-placeholder"
          />
        </div>

        <div className="month-rate">
          {data.month}월 오독률 {data.odocRate}%
        </div>

        <div className="day-grid">
          {days.map((day) => {
            const isChecked = checkedDays.includes(String(day).padStart(2, "0"));
            const isCreated = day === data.createdDay;

            return (
              <div key={day} className="day-item">
                <div className="day-number">{day}일</div>

                <div className="day-box">
                  {isChecked && <div className="check-mark">✔</div>}
                </div>

                {isCreated && (
                  <div className="odoc-created">ODOC!</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}