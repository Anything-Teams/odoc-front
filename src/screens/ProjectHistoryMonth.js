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
  const [openedDay, setOpenedDay] = useState(null);
  const { user } = useAuth();

  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const [modal, setModal] = useState({
    open: false,
    text: ""
  });

  useEffect(() => {
    if (!user?.userId) return;

    post("/getProjectName", {
      userId: user.userId,
      odocSn: projectId,
    })
      .then((data) => {
        setTitle(data.odocNm);
      })
      .catch(console.error);
  }, [projectId, user]);

  useEffect(() => {
    if (!user?.userId || !year || !month) return;

    setLoading(true);

    post("/getHistMonth", {
      userId: user.userId,
      odocSn: projectId,
      year,
      month,
    })
      .then((data) => {
        setData(data);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [projectId, year, month, user]);

  if (loading) return <Loading />;

  if (!data) {
    return (
      <div className="empty-container empty_padding">
        <div className="empty">데이터 없음</div>
      </div>
    );
  }

  const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const checkedDays = data.dateTime?.checkedDays || [];

  return (
    <div className="project-history-month">
      <div className="project-detail">
        <h2 className="title">{title}</h2>

        <div className="month-title">
          {year}년 {Number(month)}월
        </div>

        <div className="month-image-box">
          <img
            src={`/images/${data.odocThemaType}/${Math.floor(Number(data.odocRate / 10) || 0)}.png`}
            alt="progress"
            className="image-placeholder"
          />
        </div>

        <div className="month-rate">
          {data.month}월 오독률 {data.odocRate}%
        </div>

        <div className="day-grid">
          {days.map((day) => {
            const dayStr = String(day).padStart(2, "0");
            const isChecked = checkedDays.includes(dayStr);
            const isCreated = day === data.createdDay;

            const dayIndex = checkedDays.indexOf(dayStr);
            const checkedTime =
              dayIndex !== -1 ? data.dateTime?.checkedTimestamps?.[dayIndex] : null;

            const memo =
              isChecked && dayIndex > -1 ? data.memos?.[dayIndex] ?? "" : "";

            const isToday =
              Number(year) === currentYear &&
              Number(month) === currentMonth &&
              day === currentDay;

            const isOpened = openedDay === day;

            return (
              <div
                key={day}
                className={`day-item ${isToday ? "today-box" : ""} ${isOpened ? "opened" : ""}`}
                onClick={() => {
                  if (!isChecked || !checkedTime) return;
                
                  setModal({
                    open: true,
                    text: `${data.odocType === "1" ? "오독시간" : "기록시간"}: ${checkedTime}`
                  });
                }}
                title={
                  isChecked && checkedTime
                    ? `${data.odocType === "1" ? "오독시간" : "기록 남긴 시간"}: ${checkedTime}`
                    : ""
                }
              >
                <div className="day-number">{day}일</div>

                {data.odocType === "1" ? (
                  <>
                    <div className="day-box">
                      <div className="check-mark">
                        {isChecked ? "✔" : "\u00A0"}
                      </div>
                    </div>

                    <div className="odoc-created">
                      {isCreated ? "ODOC!" : "\u00A0"}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="day-box">
                      <div className="check-mark font-12">
                        {isChecked ? (memo === "" ? "✔" : memo) : "\u00A0"}
                      </div>
                    </div>

                    <div className="odoc-created">
                      {isCreated ? "첫 기록!" : "\u00A0"}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {modal.open && (
        <div className="time-modal-backdrop" onClick={() => setModal({ open: false, text: "" })}>
          <div className="time-modal" onClick={(e) => e.stopPropagation()}>
            <div>{modal.text}</div>
            <button className="btn tertiary btn-modal"onClick={() => setModal({ open: false, text: "" })}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
