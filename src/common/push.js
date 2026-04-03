import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "../firebase";
import { post } from "../api/api";

const VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY;

function getDeviceInfo() {
  const ua = navigator.userAgent || "";
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);

  let browserName = "Unknown";
  if (ua.includes("Edg")) browserName = "Edge";
  else if (ua.includes("Chrome")) browserName = "Chrome";
  else if (ua.includes("Safari")) browserName = "Safari";
  else if (ua.includes("Firefox")) browserName = "Firefox";

  let platform = "Unknown";
  if (ua.includes("Android")) platform = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod")) platform = "iOS";
  else if (ua.includes("Macintosh")) platform = "macOS";
  else if (ua.includes("Windows")) platform = "Windows";

  return {
    deviceType: isMobile ? "mobile" : "desktop",
    browserName,
    platform,
    userAgent: ua,
    deviceName: `${platform} ${browserName}`
  };
}

export async function registerPush(userId) {
  try {
    if (!("Notification" in window)) return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) return null;

    const deviceInfo = getDeviceInfo();

    await post("/insertPushToken", {
      userId,
      pushToken: token,
      deviceType: deviceInfo.deviceType,
      browserName: deviceInfo.browserName,
      platform: deviceInfo.platform,
      userAgent: deviceInfo.userAgent,
      deviceName: deviceInfo.deviceName,
    });

    return token;
  } catch (e) {
    console.error("registerPush 오류:", e);
    return null;
  }
}

let foregroundBound = false;

export async function bindForegroundMessageHandler() {
  if (foregroundBound) return;
  foregroundBound = true;

  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("onMessage 수신", payload);

    window.dispatchEvent(
      new CustomEvent("odoc-push-message", {
        detail: {
          title:
            payload.notification?.title ||
            payload.data?.title ||
            "ODOC",
          body:
            payload.notification?.body ||
            payload.data?.body ||
            "알림이 도착했습니다.",
          link: "/projects",
        },
      })
    );
  });
}