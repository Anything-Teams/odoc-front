importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDEbRpCNSUY5y9hlSvAcFluDs3ckCzezaU",
  authDomain: "odoc-9db34.firebaseapp.com",
  projectId: "odoc-9db34",
  messagingSenderId: "912765486991",
  appId: "1:912765486991:web:b6b0a655373baf06a66dfa",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  const title = payload.notification?.title || "ODOC";
  const options = {
    body: payload.notification?.body || "오늘 ODOC를 확인해보세요.",
    icon: "/logo192.png",
    data: {
      url: payload.fcmOptions?.link || "/projects",
    },
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url || "/projects";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});