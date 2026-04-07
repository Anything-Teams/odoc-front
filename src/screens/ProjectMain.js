import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { Loading } from "../components/Loading";
import { BiEditAlt } from "react-icons/bi";
import { MdOutlineAccessAlarm, MdOutlineAlarmOff } from "react-icons/md";
import { post } from "../api/api";
import { useAuth } from "../common/AuthContext";
import "../css/common.css";

export default function ProjectMain() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({}); 
  const [tempName, setTempName] = useState("");
  const [odocBtn, setOdocBtn] = useState(""); 
  const [odocType, setOdocType] = useState("1");
  const [loading, setLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [odocThemaList, setOdocThemaList] = useState([]); 
  const [userThemaList, setUserThemaList] = useState([]);
  const [unlockedThemaId, setUnlockedThemaId] = useState(null);
  const [showUnlockedModal, setShowUnlockedModal] = useState(false); 
  const [showUnlockedText, setShowUnlockedText] = useState(""); 
  const [onAlarm, setOnAlarm] = useState(false);
  const [odocMemo, setOdocMemo] = useState("");
  const [odocAlarmTime, setOdocAlarmTime] = useState("");
  const [odocDaySn, setOdocDaySn] = useState(0);
  const inputRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.userId) {
      post("/selectThemaList", {})
      .then((data) => {
        setOdocThemaList(data);
      })
      .catch(console.error);
    }
  }, []);

  useEffect(() => {
    post("/selectUserThemaList", {
      userId: user?.userId
    })
    .then((data) => {
      setUserThemaList(data);
    })
    .catch(console.error);
  }, []);

  useEffect(() => {
    if (!isReadOnly) {
      inputRef.current?.focus();
    }
  }, [isReadOnly]);

  const getProjectMain = useCallback(() => {
    post("/getProjectMain", { 
      userId: user?.userId,
      odocSn: projectId
    })  
    .then((data) => {
      setData(data);

      if(data.odocType === "1") {
        setOdocBtn((data.endYn === "Y")?"종료된 ODOC 입니다":(data.odocYn)?"ODOC 완료!":"ODOC!");
        setOdocType("1");
      } else {
        setOdocBtn((data.endYn === "Y")?"종료된 기록 입니다":(data.odocYn)?"남겨두기 완료!":"남겨두기!");
        setOdocType("2");
      }
      setLoading(false);
      setTempName(data.odocNm);
      setOnAlarm(data.odocAlarmYn==="Y"?true:false);
      setOdocAlarmTime(data.odocAlarmTime);
      setOdocMemo(data.odocMemo);
      setOdocDaySn(data.odocDaySn);

      if(data.endYn==="Y") setIsEnd(true);
    })
    .catch(console.error);
  }, [projectId, userThemaList]);

  useEffect(() => {
    getProjectMain();
  }, [getProjectMain]);

  const updateMemo = (odocSn) => {
    post("/updateMemo", {
      userId: user?.userId,
      odocMemo: odocMemo,
      odocDaySn: odocDaySn,
      odocSn
    })
    .then((data) => {
      alert("기록을 다시 남겼습니다");
    })
    .catch(console.error);
  }

  const one_day_one_commit = async (odocSn) => {
    try {
      await post("/commitProject", {
        userId: user?.userId,
        odocMemo: odocMemo,
        odocSn
      });
  
      const newData = await post("/getProjectMain", {
        userId: user?.userId,
        odocSn
      });
  
      setData(newData);
  
      if (odocType === "1") alert(getOdocTypeMessage(newData.streamSn));
      else alert("오늘의 기록을 남겼습니다!");

      for (const thema of odocThemaList) {
        if (thema.themaGetMethod !== "day") continue;

        const isUnlockDay = newData.streamSn === thema.themaGetDay;

        if (!isUnlockDay) continue;

        const alreadyHasThema = userThemaList.some(
          (userGetThema) => userGetThema.themaId === thema.themaId
        );

        if (alreadyHasThema) continue;

        await post("/insertUserThema", {
          userId: user?.userId,
          themaId: thema.themaId,
        });
  
        setUnlockedThemaId(thema.themaId);
        setShowUnlockedText(`🎉 ${thema.themaNm} 테마가 잠금해제되었습니다!`);

        setShowUnlockedModal(true);
        setTimeout(() => setShowUnlockedModal(false), 3000);
  
        setUserThemaList((prev) => [...prev, { themaId: thema.themaId }]);

      };
  
    } catch (err) {
      console.error(err);
    }
  };

  const fn_odocNm_change = () => {
    if(tempName==="") {

      if(odocType === "1") alert("ODOC명을 입력해주세요");
      else alert("기록명을 입력해주세요");

      return;
    }

    if (!odocAlarmTime) {
      alert("알람시간을 입력해주세요");
      return;
    }

    post("/updateProject", {
        userId: user?.userId,
        odocNm: tempName,
        odocSn: data.odocSn,
        odocAlarmTime: odocAlarmTime
    })
    .then((data) => {
      alert("변경완료!");
      setIsReadOnly(true);
    })
    .catch(console.error);
  }

  const handleEditStart = () => {
    setIsReadOnly(false);
  };

  const handleEditEnd = () => {
    setIsReadOnly(true);
    setTempName(data.odocNm);
  };

  const fn_alarm_on = async () => {
    const newAlarm = !onAlarm;
    setOnAlarm(newAlarm);
  
    try {
      await post("/updateProject", {
        userId: user?.userId,
        odocSn: data.odocSn,
        odocAlarmYn: newAlarm ? "Y" : "N"
      })
      .then((data) => {
        let message = newAlarm?"알람이 설정되었습니다":"알람이 해제되었습니다";
        alert(message);
      });
    } catch (err) {
      console.error(err);
    }
  };

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

  const getOdocTypeMessage = (streak = 0) => {
    const prefix = getStreakPrefix(streak);
  
    if (streak >= 120) return `${prefix} 장기 루틴이 유지되고 있습니다`;
    if (streak >= 60) return `${prefix} 지속 흐름이 강화되고 있습니다`;
    if (streak >= 30) return `${prefix} 안정적인 루틴이 유지되고 있습니다`;
    if (streak >= 14) return `${prefix} 꾸준한 흐름이 유지되고 있습니다`;
    if (streak >= 7) return `${prefix} 흐름이 안정적으로 이어지고 있습니다`;
    if (streak >= 4) return `${prefix} 꾸준함이 유지되고 있습니다`;
    if (streak >= 2) return `${prefix} 흐름이 이어지고 있습니다`;
    if (streak >= 1) return `${prefix} 습관의 첫걸음을 응원합니다!`;
  
    return `기록이 반영되었습니다`;
  };

  const getStreakPrefix = (streak) => {
    if (streak >= 365) return "🌌";
    if (streak >= 300) return "🪐";
    if (streak >= 250) return "👑";
    if (streak >= 200) return "🏆";
    if (streak >= 150) return "💎";
    if (streak >= 120) return "🔥🔥";
    if (streak >= 90)  return "🏅"; 
    if (streak >= 60)  return "🌿"; 
    if (streak >= 30)  return "🔥";
    if (streak >= 14)  return "🌱";
    if (streak >= 7)   return "🌼";
    if (streak >= 1)   return "👍";
    return "";
  };
  
  const MILESTONE = {
    1: "첫 걸음을 시작했습니다",
    2: "이틀째 흐름이 이어지고 있습니다",
    3: "3일째, 연속성이 생기고 있습니다",
    5: "5일 동안 흐름이 유지되고 있습니다",
    7: "7일 동안 안정 구간에 들어섰습니다",
  
    10: "10일 동안 루틴이 자리잡아가고 있습니다",
    14: "14일 동안 패턴이 유지되고 있습니다",
    20: "20일 동안 일관성이 강화되고 있습니다",
    30: "30일 동안 습관이 생활화되고 있습니다",
  
    35: "35일 동안 흐름이 안정적으로 이어지고 있습니다",
    40: "40일 동안 중단 없이 유지되고 있습니다",
    50: "50일 동안 꾸준함이 구조가 되고 있습니다",
    60: "60일 동안 루틴이 안정 단계에 있습니다",
    70: "70일 동안 지속력이 강화되고 있습니다",
    80: "80일 동안 거의 자동화 단계에 접근하고 있습니다",
    90: "90일 동안 강한 지속 패턴이 형성되고 있습니다",
  
    100: "100일 동안 장기 루틴이 정착되고 있습니다",
    120: "120일 동안 자기관리 구조가 안정적으로 작동하고 있습니다",
    150: "150일 동안 높은 수준의 지속 시스템이 유지되고 있습니다",
  
    200: "200일 동안 습관이 시스템으로 전환되고 있습니다",
    250: "250일 동안 생활 구조가 루틴화되고 있습니다",
    300: "300일 동안 엘리트 지속 구조가 형성되고 있습니다",
    365: "365일 동안 1년 지속 구조가 완성되었습니다",
  
    MAX: "장기 지속 구조가 안정적으로 유지되고 있습니다"
  };

  const getStreamStr = (streak, maxStreak) => {
    const prefix = getStreakPrefix(streak);

    if (streak <= 0) {
      return maxStreak > 0
        ? `최대 ${maxStreak}일 기록에 도전!`
        : "";
    }

    if (MILESTONE[streak]) {
      return `${prefix} ${MILESTONE[streak]}`.trim();
    }

    if (streak < maxStreak) {
      return `${prefix} ${streak}일 연속 (최대 ${maxStreak}일)`.trim();
    }

    if (streak <= 365) {
      return `${prefix} 현재 ${streak}일 최대 기록 유지 중`.trim();
    }

    return `${prefix} ${MILESTONE.MAX}`.trim();
  };

  return (
    <div className="project-container">
      <div className="project-detail">
        <div className="detail-title">
          
          <div className="input-wrapper">
            <span className="icon-wrapper">
              <span className="alarm-icon " onClick={() => fn_alarm_on()}>
                {isEnd?"":onAlarm?<span className="alarm-time-view"><MdOutlineAccessAlarm /><span>{odocAlarmTime}</span></span>:<MdOutlineAlarmOff/>}
              </span>
            </span>

            <input ref={inputRef} type="text" className="odocNm-class" id="odocNm" value={tempName} readOnly={isReadOnly} onChange={(e) => setTempName(e.target.value)} maxLength={10}
            />
            <span className="icon-wrapper">
              {isEnd?"":(isReadOnly ? (
                  <span className="edit-icon" onClick={handleEditStart}>
                    <BiEditAlt />
                  </span>
              ) : (
                  <span className="edit-icon"></span>
              ))}
            </span>
          </div>
        </div>

        {isEnd?"":(isReadOnly ? (
          <></>
        ) : (
          <div className="edit-wrapper">
            <input
              type="time"
              className="alarm-time m-b-10 font-15 width70"
              value={odocAlarmTime}
              step="300"
              onChange={(e) => setOdocAlarmTime(e.target.value)}
            />
            <span className="odoc-btn-container">
              <button className="btn primary margin0 width40 btn-small" onClick={() => fn_odocNm_change()}>저장</button>
              <button className="btn tertiary margin0 width40 btn-small" onClick={() => handleEditEnd()}>취소</button>
            </span>
          </div>
        ))}
        
        <div className="image-box">
            <img
                  src={`/images/${data.odocThemaType}/${Math.floor(Number(data.progress/10) || 0)}.png`}
                  alt="progress"
                  className="image-placeholder"
            />
        </div>
        <div className="progress">
            {Number(data.odocMonth)}월 {data.progress}%
            <span className="odoc-main-stream">
              {(data.odocType === "1"&&data.endYn === "N")?getStreamStr(data.streamSn, data.maxStreamSn):<></>}
            </span>

        </div>
        
        {data.odocType === "2" && data.endYn === "N"
          ?
          <div className="memo-container">
              <input className="odocMemo-input" id="odocMemo" placeholder="짧은 기록 작성(6자제한) 생략가능" value={odocMemo} onChange={(e) => setOdocMemo(e.target.value)} maxLength={6} />
              {data.odocYn === 1
                ?            
                  <button className="secondary btn-memo" onClick={() => updateMemo(data.odocSn)}>수정</button>
                :
                <></>
              }
          </div>
          :
          <></>
        }
        
        <div className="button-group">
            <button
              className="btn secondary btn-8"
              disabled={data.odocYn === 1 || data.endYn === "Y"}
              onClick={() => one_day_one_commit(data.odocSn)}
            >
            {odocBtn}
            </button>

            <button
              className="btn tertiary"
              onClick={() => navigate(`/projects/${projectId}/history-year`)}
            >
            내역
            </button>
        </div>
        {showUnlockedModal && (
          <div className="unlocked-modal">
            <div className="unlocked-content">
              <img
                src={`/images/${unlockedThemaId}/0.png`}
                alt="unlocked"
                className="unlocked-image"
              />
              <p>{showUnlockedText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}