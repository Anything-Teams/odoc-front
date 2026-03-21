import "../css/common.css";

export default function ProjectHistoryMonth() {
  const data = {
    title: "어플개발하기",
    year: 2026,
    month: 3,
    odocRate: 51,
    createdDay: 5, // 프로젝트 생성일 (예시)
  };

  // 예시: 1~31일
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // 예시: 체크된 날짜
  const checkedDays = [5, 6, 7, 12, 13, 15];

  return (
    <div className="project-history-month">
      <h2 className="detail-title">{data.title}</h2>

      <div className="month-title">
        {data.year}년 {String(data.month).padStart(2, "0")}월
      </div>

      <div className="month-image-box">
        <div className="month-image-placeholder">DOT IMAGE</div>
      </div>

      <div className="month-rate">
        {data.month}월 오독률 {data.odocRate}%
      </div>

      <div className="day-grid">
        {days.map((day) => {
          const isChecked = checkedDays.includes(day);
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