import { useSearchParams, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";
import { post } from "../api/api";
import { useAuth } from "../common/AuthContext";
import "../css/common.css";

export default function ProjectHistoryMonth() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const year = searchParams.get("year");
  const month = searchParams.get("month");

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
    post("/getHistMonth", {
      userId: user?.userId,
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
      <div className="empty-container empty_padding">
        <div className="empty">데이터 없음</div>
      </div>
    );
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const checkedDays = data.dateTime.checkedDays || [];

  return (
    <div className="project-history-month">
      <div className="project-detail">
        <h2 className="title">{title}</h2>

        <div className="month-title">
          {year}년 {Number(month)}월
        </div>

        <div className="month-image-box">
          <img
            src={`/images/${data.odocThemaType}/${Math.floor(Number(data.odocRate/10) || 0)}.png`}
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

            const dayIndex = checkedDays.indexOf(String(day).padStart(2, "0"));
            const checkedTime = dayIndex !== -1 ? data.dateTime.checkedTimestamps[dayIndex] : null;

            const memo =
            isChecked && dayIndex > -1
              ? data.memos?.[dayIndex] ?? ""
              : "";

            return (
              <div key={day} className="day-item" onClick={()=>{
                  if (isChecked && checkedTime) {
                  alert(`${data.odocType === "1"?"오독시간":"기록 남긴 시간"}: ${checkedTime}`);
              }}}>
                <div className="day-number">{day}일</div>

                {
                  data.odocType==="1"
                  ?
                    <>
                      <div className="day-box">
                        {/* {isChecked && <div className="check-mark">✔</div>} */}
                        <div className="check-mark">
                          {isChecked ? "✔" : "\u00A0"}
                        </div>
                      </div>

                      <div className="odoc-created">
                        {isCreated?"ODOC!":"\u00A0"}
                      </div>
                    </>
                  :
                    <>
                      <div className="day-box">
                        <div className="check-mark font-12">
                          {isChecked ? (memo === "" ? "✔" : memo) : "\u00A0"}
                        </div>
                      </div>

                      <div className="odoc-created">
                        {isCreated?"첫 기록!":"\u00A0"}
                      </div>
                    </>
                }
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}