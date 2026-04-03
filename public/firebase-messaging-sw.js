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
    console.log("onBackgroundMessage 수신", payload);
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