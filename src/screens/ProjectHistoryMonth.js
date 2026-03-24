import { useSearchParams, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { post } from "../api/api";
import "../css/common.css";

export default function ProjectHistoryMonth() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [data, setData] = useState(null);

  const year = searchParams.get("year");
  const month = searchParams.get("month");

  useEffect(() => {
    post("/getHistMonth", {
      userId: "test001",
      odocSn: projectId,
      year,
      month
    }).then((data) => {
      setData(data)
    });
  }, [projectId, year, month]);

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
      <h2 className="detail-title">{data.title}</h2>

      <div className="month-title">
        {year}년 {Number(month)}월
      </div>

      <div className="month-image-box">
        <img
          src={`/images/${Math.floor(Number(data.progress/10) || 0)}.png`}
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
  );
}