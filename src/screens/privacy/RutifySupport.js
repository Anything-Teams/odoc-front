export default function RutifySupport() {
    return (
        <main style={styles.page}>
            <section style={styles.container}>
                <h1 style={styles.title}>Rutify 고객지원</h1>
                <p style={styles.date}>RUTIFY Support</p>

                <p style={styles.paragraph}>
                    Rutify를 이용해 주셔서 감사합니다. 앱 사용 중 문제가 발생했거나,
                    Pro 구매, 광고, 루틴 생성 및 공유 기능과 관련하여 문의가 필요한 경우
                    아래 이메일로 연락해 주세요.
                </p>

                <h2 style={styles.subTitle}>문의 이메일</h2>
                <p style={styles.paragraph}>
                    이메일: <a style={styles.link} href="mailto:hcd1228@gmail.com">hcd1228@gmail.com</a>
                </p>

                <h2 style={styles.subTitle}>문의 가능 항목</h2>
                <ul style={styles.list}>
                    <li>앱 사용 중 발생한 오류</li>
                    <li>운동 루틴 생성, 수정, 삭제 관련 문제</li>
                    <li>운동 기록 및 통계 관련 문제</li>
                    <li>루틴 공유 코드 생성 및 가져오기 관련 문제</li>
                    <li>Pro 구매 및 복원 관련 문의</li>
                    <li>광고 표시 또는 광고 제거 상태 관련 문의</li>
                    <li>기타 피드백 및 기능 제안</li>
                </ul>

                <h2 style={styles.subTitle}>문의 시 포함하면 좋은 정보</h2>
                <ul style={styles.list}>
                    <li>사용 중인 기기 종류</li>
                    <li>운영체제 버전</li>
                    <li>문제가 발생한 화면 또는 기능</li>
                    <li>오류 상황을 확인할 수 있는 스크린샷</li>
                    <li>문제가 반복되는 순서</li>
                </ul>

                <p style={styles.paragraph}>
                    보내주신 문의는 확인 후 가능한 빠르게 답변드리겠습니다.
                </p>

                <hr style={styles.divider} />

                <h1 style={styles.title}>RUTIFY Support</h1>
                <p style={styles.date}>Customer Support</p>

                <p style={styles.paragraph}>
                    Thank you for using RUTIFY. If you experience any issues while using
                    the app or need help with Pro purchases, ads, routine creation, workout
                    records, or sharing features, please contact us by email.
                </p>

                <h2 style={styles.subTitle}>Contact Email</h2>
                <p style={styles.paragraph}>
                    Email: <a style={styles.link} href="mailto:hcd1228@gmail.com">hcd1228@gmail.com</a>
                </p>

                <h2 style={styles.subTitle}>Support Topics</h2>
                <ul style={styles.list}>
                    <li>App errors or unexpected behavior</li>
                    <li>Issues with creating, editing, or deleting workout routines</li>
                    <li>Workout records and statistics issues</li>
                    <li>Routine share code creation or import issues</li>
                    <li>Pro purchase or restore questions</li>
                    <li>Ad display or ad removal status questions</li>
                    <li>General feedback and feature requests</li>
                </ul>

                <h2 style={styles.subTitle}>Helpful Information to Include</h2>
                <ul style={styles.list}>
                    <li>Your device model</li>
                    <li>Your operating system version</li>
                    <li>The screen or feature where the issue occurred</li>
                    <li>Screenshots that show the issue</li>
                    <li>Steps to reproduce the issue</li>
                </ul>

                <p style={styles.paragraph}>
                    We will review your inquiry and respond as soon as possible.
                </p>
            </section>
        </main>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f7f8fa",
        padding: "32px 16px",
        boxSizing: "border-box",
    },
    container: {
        maxWidth: "860px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "36px 24px",
        boxSizing: "border-box",
        color: "#222",
        lineHeight: 1.7,
    },
    title: {
        fontSize: "28px",
        marginBottom: "8px",
        color: "#111827",
    },
    date: {
        color: "#6b7280",
        fontSize: "14px",
        marginBottom: "32px",
    },
    subTitle: {
        fontSize: "20px",
        marginTop: "32px",
        marginBottom: "10px",
        color: "#111827",
    },
    paragraph: {
        fontSize: "15px",
        color: "#374151",
        marginBottom: "12px",
    },
    list: {
        fontSize: "15px",
        color: "#374151",
        paddingLeft: "22px",
        marginBottom: "12px",
    },
    link: {
        color: "#2563eb",
        fontWeight: 700,
        textDecoration: "none",
    },
    divider: {
        border: "none",
        borderTop: "1px solid #e5e7eb",
        margin: "48px 0",
    },
};