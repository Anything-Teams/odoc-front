export default function RutifyPrivacy() {
    return (
        <main style={styles.page}>
            <section style={styles.container}>
                <h1 style={styles.title}>Rutify 개인정보처리방침</h1>
                <p style={styles.date}>시행일: 2026년 5월 3일</p>

                <p style={styles.paragraph}>
                    Rutify는 사용자의 개인정보를 중요하게 생각하며, 관련 법령에 따라
                    개인정보를 보호하기 위해 노력합니다.
                </p>

                <h2 style={styles.subTitle}>1. 수집하는 정보</h2>
                <p style={styles.paragraph}>
                    Rutify는 운동 루틴 생성, 운동 기록 저장, 통계 확인 기능을 제공합니다.
                    앱 내에서 생성되는 루틴 정보, 운동 기록, 설정 정보는 기본적으로
                    사용자의 기기 내에 저장됩니다.
                </p>
                <p style={styles.paragraph}>
                    단, 사용자가 루틴 공유 기능을 사용하는 경우 공유 코드 생성을 위해
                    루틴 이름, 루틴 구성 정보, 운동 목록 등의 데이터가 서버에 저장될 수
                    있습니다.
                </p>

                <h2 style={styles.subTitle}>2. 수집 및 이용 목적</h2>
                <ul style={styles.list}>
                    <li>운동 루틴 생성 및 관리</li>
                    <li>운동 기록 저장 및 통계 제공</li>
                    <li>루틴 공유 코드 생성 및 가져오기</li>
                    <li>앱 기능 개선 및 오류 확인</li>
                    <li>Pro 기능 제공 및 광고 제거 상태 확인</li>
                </ul>

                <h2 style={styles.subTitle}>3. 광고</h2>
                <p style={styles.paragraph}>
                    Rutify는 무료 사용자에게 광고를 표시할 수 있습니다. 광고 제공을 위해
                    Google AdMob 등 제3자 광고 서비스가 사용될 수 있으며, 광고 식별자 등
                    광고 제공에 필요한 정보가 처리될 수 있습니다.
                </p>

                <h2 style={styles.subTitle}>4. 인앱결제</h2>
                <p style={styles.paragraph}>
                    Rutify Pro 구매는 Google Play 결제 시스템을 통해 처리됩니다. 개발자는
                    사용자의 카드번호, 계좌정보 등 결제수단 정보를 직접 수집하거나
                    저장하지 않습니다.
                </p>

                <h2 style={styles.subTitle}>5. 개인정보의 보관 및 삭제</h2>
                <p style={styles.paragraph}>
                    기기 내에 저장된 루틴 및 운동 기록은 사용자가 앱을 삭제하거나 앱
                    데이터를 삭제하면 함께 삭제될 수 있습니다.
                </p>
                <p style={styles.paragraph}>
                    루틴 공유 기능으로 서버에 저장된 데이터는 서비스 운영 목적에 따라
                    보관될 수 있으며, 삭제 요청이 있는 경우 확인 후 처리합니다.
                </p>

                <h2 style={styles.subTitle}>6. 제3자 제공</h2>
                <p style={styles.paragraph}>
                    Rutify는 사용자의 개인정보를 별도 동의 없이 제3자에게 판매하거나
                    제공하지 않습니다. 다만 광고, 결제, 앱 배포 등 서비스 제공을 위해
                    Google Play, Google AdMob 등 외부 서비스가 사용될 수 있습니다.
                </p>

                <h2 style={styles.subTitle}>7. 아동 개인정보</h2>
                <p style={styles.paragraph}>
                    Rutify는 아동을 주요 대상으로 하는 앱이 아니며, 만 13세 미만 아동의
                    개인정보를 의도적으로 수집하지 않습니다.
                </p>

                <h2 style={styles.subTitle}>8. 문의</h2>
                <p style={styles.paragraph}>
                    개인정보처리방침 또는 개인정보 관련 문의는 아래 이메일로 연락해
                    주세요.
                </p>
                <p style={styles.paragraph}>이메일: hcd1228@gmail.com</p>

                <h2 style={styles.subTitle}>9. 변경 사항</h2>
                <p style={styles.paragraph}>
                    본 개인정보처리방침은 앱 기능 변경 또는 관련 법령 변경에 따라 수정될
                    수 있습니다.
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
    },
};