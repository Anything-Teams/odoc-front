import "../css/common.css";
import { useEffect, useState } from "react";
import { post} from "../api/api";
import { useAuth } from "../common/AuthContext";

export default function AdminPage() {
    const [noticeContent, setNoticeContent] = useState("");
    const [noticeYn, setNoticeYn] = useState("Y");
    const [noticeSn, setNoticeSn] = useState("");
    const { user } = useAuth();


    useEffect(() => {
        post("/selectNotice", {
            userId: user?.userId,
            noticeSn: "1"
        })
        .then((data) => {
            if (data?.noticeContent) {
                setNoticeContent(data.noticeContent);
                setNoticeYn(data.noticeYn);
                setNoticeSn(data.noticeSn);
            }
        })
        .catch(console.error);
    }, []);

    const updateOption = (data) => {
        post("/insertNotice", {
            userId: user?.userId,
            noticeSn: noticeSn,
            noticeTitle: '공지사항',
            noticeContent: noticeContent,
            beforeNoticeYn: noticeYn
        })
        .then((data) => {
            alert("공지사항이 저장되었습니다!");
            window.dispatchEvent(new Event("noticeUpdated"));
        })
        .catch(console.error);
    }


    return (
        <div className="project-container">
            <div className="project-detail">
                <div className="title">관리자페이지</div>
                <div className="admin-content">
                    <span className="admin-content-top">공지내용</span>
                    <input type="text" placeholder="공지내용" className="input admin-input" value={noticeContent} onChange={(e) => setNoticeContent(e.target.value)} />


                    <span className="admin-content-inner">
                        <label className={`radio-item ${noticeYn === "Y" ? "active" : ""}`}>
                             <input
                               type="radio"
                               name="setting"
                               value="Y"
                               checked={noticeYn === "Y"}
                               onChange={(e) => setNoticeYn(e.target.value)}
                             />
                             <span>공지</span>
                           </label>

                           <label className={`radio-item ${noticeYn === "N" ? "active" : ""}`}>
                             <input
                               type="radio"
                               name="setting"
                               value="N"
                               checked={noticeYn === "N"}
                               onChange={(e) => setNoticeYn(e.target.value)}
                             />
                             <span>해제</span>
                           </label>
                    </span>

                </div>
                <div className="bottom-area">
                    <button className="btn primary" onClick={() => updateOption()}>
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}