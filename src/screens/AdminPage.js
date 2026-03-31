import "../css/common.css";
import { useEffect, useState } from "react";
import { post} from "../api/api";
import { useAuth } from "../common/AuthContext";
import {TbTarget, TbTargetOff} from "react-icons/tb";
import {MdDelete, MdOutlinePause, MdPlayArrow} from "react-icons/md";

export default function AdminPage() {
    const [noticeContent, setNoticeContent] = useState("");
    const [noticeYn, setNoticeYn] = useState("Y");
    const [noticeSn, setNoticeSn] = useState("");
    const [users, setUsers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        selectNotice();
        userList();
    }, [user]);
    const selectNotice = () => {
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
    }

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

    const userList = () => {
        post("/userList", {
        })
        .then((data) => {
            setUsers(Array.isArray(data) ? data : []);
        })
        .catch(console.error);
    }

    const updateUserState = (userState, userId) => {
        post("/updateUser", {
            userId: userId,
            userState: userState
        })
        .then((data) => {
            alert("설정이 변경되었습니다");
        })
        .catch(console.error);
    }

    const updateUserAdminState = (adminYn, userId) => {
        post("/updateUser", {
            userId: userId,
            adminYn: adminYn
        })
        .then((data) => {
            alert("설정이 변경되었습니다");
            userList();
        })
        .catch(console.error);
    }

    const deleteUser = (userId) => {
        post("/deleteUser", {
            userId: userId
        })
            .then((data) => {
                alert("삭제되었습니다");
                userList();
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
                    <div className="bottom-area">
                        <button className="btn primary" onClick={() => updateOption()}>
                            저장
                        </button>
                    </div>

                    <span className="admin-content-top user-set-padding-top">사용자 관리</span>

                    <div className="admin-content-bottom">
                        {users.length === 0 ?
                            <>
                            </>
                        :
                            <>
                                {users.map((item) => (
                                    <div
                                        key={item.userId}
                                        className="card"
                                    >
                                        <div className={`card-inner`} >
                                            <div className="card-title user-set-margin-bottom">
                                                <span className="user-title">
                                                    {item.userId}
                                                    <button className="user-delete" onClick={() => deleteUser(item.userId)}>
                                                        삭제
                                                    </button>
                                                </span>
                                                <span className="user-admin-set">
                                                    <label className={`radio-item user-item ${item.adminYn === "N" ? "user-active" : ""}`}>
                                                        <input
                                                          type="radio" name="state" value="N"
                                                          checked={item.adminYn === "N"}
                                                          onChange={(e) => updateUserAdminState(e.target.value, item.userId)}
                                                        />
                                                        <span className="user-item-span">사용자</span>
                                                      </label>

                                                      <label className={`radio-item user-item ${item.adminYn === "Y" ? "user-active" : ""}`}>
                                                        <input
                                                          type="radio" name="state" value="Y"
                                                          checked={item.adminYn === "Y"}
                                                          onChange={(e) => updateUserAdminState(e.target.value, item.userId)}
                                                        />
                                                        <span className="user-item-span">관리자</span>
                                                      </label>
                                                </span>
                                            </div>
                                            <div className="card-bottom">
                                                <label className={`radio-item odoc-item ${item.userState === "N" ? "odoc-active" : ""}`}>
                                                    <input
                                                      type="radio" name="state" value="N"
                                                      checked={item.userState === "N"}
                                                      onChange={(e) => updateUserState(e.target.value, item.userId)}
                                                    />
                                                    <span className="odoc-item-span">대기</span>
                                                  </label>

                                                  <label className={`radio-item odoc-item ${item.userState === "Y" ? "odoc-active" : ""}`}>
                                                    <input
                                                      type="radio" name="state" value="Y"
                                                      checked={item.userState === "Y"}
                                                      onChange={(e) => updateUserState(e.target.value, item.userId)}
                                                    />
                                                    <span className="odoc-item-span">승인</span>
                                                  </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}