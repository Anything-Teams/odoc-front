import "../css/common.css";
import { useEffect, useState, useRef } from "react";
import { post} from "../api/api";
import { useAuth } from "../common/AuthContext";

export default function AdminPage() {
    const [noticeContent, setNoticeContent] = useState("");
    const [noticeYn, setNoticeYn] = useState("Y");
    const [noticeSn, setNoticeSn] = useState("");
    const [users, setUsers] = useState([]);
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef(null);

    useEffect(() => {
        if (!user) return;
    
        selectNotice();
    
        setUsers([]);
        setPage(1);
        setHasMore(true);
    
        userList(1, true);
    }, [user]);
    
    const selectNotice = () => {
        post("/selectNotice", {
            userId: user?.userId,
            noticeType: "1"
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

    const userList = async (pageNum = 1, reset = false) => {
        if (loading) return;
        if (!reset && !hasMore) return;
    
        setLoading(true);
    
        try {
            const data = await post("/userList", {
                page: pageNum,
                pageSize
            });
    
            const newUsers = Array.isArray(data) ? data : [];
    
            if (reset) {
                setUsers(newUsers);
            } else {
                setUsers((prev) => [...prev, ...newUsers]);
            }
    
            setPage(pageNum);
            setHasMore(newUsers.length === pageSize);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!observerRef.current) return;
        if (!hasMore) return;
    
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
    
            if (entry.isIntersecting && !loading && hasMore) {
                userList(page + 1);
            }
        });
    
        observer.observe(observerRef.current);
    
        return () => observer.disconnect();
    }, [page, loading, hasMore]);

    const updateUserState = (userState, userId) => {
        post("/updateUser", {
            userId: userId,
            userState: userState
        })
        .then((data) => {
            alert("설정이 변경되었습니다");

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.userId === userId ? { ...user, userState: userState } : user
                )
            );
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
        if(window.confirm("삭제 하시겠습니까?"))
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
                    <span className="admin-content-top">간략공지내용</span>
                    <input type="text" placeholder="간략공지내용" className="input admin-input" value={noticeContent} onChange={(e) => setNoticeContent(e.target.value)} />


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
                                <div>사용자가 없습니다</div>
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
                                                          type="radio" name="type1" value="N"
                                                          checked={item.adminYn === "N"}
                                                          onChange={(e) => updateUserAdminState(e.target.value, item.userId)}
                                                        />
                                                        <span className="user-item-span">사용자</span>
                                                      </label>

                                                      <label className={`radio-item user-item ${item.adminYn === "Y" ? "user-active" : ""}`}>
                                                        <input
                                                          type="radio" name="type2" value="Y"
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
                                                      type="radio" name="state1" value="N"
                                                      checked={item.userState === "N"}
                                                      onChange={(e) => updateUserState(e.target.value, item.userId)}
                                                    />
                                                    <span className="odoc-item-span">대기</span>
                                                  </label>

                                                  <label className={`radio-item odoc-item ${item.userState === "Y" ? "odoc-active" : ""}`}>
                                                    <input
                                                      type="radio" name="state2" value="Y"
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
                <div ref={observerRef} style={{ height: "20px" }} />
            </div>
        </div>
    );
}