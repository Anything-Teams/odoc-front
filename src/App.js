import { useEffect, useState } from "react";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./common/AuthContext";
import { bindForegroundMessageHandler } from "./common/push";
import { BrowserRouter } from "react-router-dom";
import "./css/common.css";

function InAppPushToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    bindForegroundMessageHandler();

    const handler = (event) => {
      const message = event.detail;

      setToast({
        title: message.title,
        body: message.body,
        link: message.link,
      });

      setTimeout(() => {
        setToast(null);
      }, 4000);
    };

    window.addEventListener("odoc-push-message", handler);
    return () => window.removeEventListener("odoc-push-message", handler);
  }, []);

  if (!toast) return null;

  return (
    <div
      className="inapp-push-toast"
      onClick={() => {
        window.location.href = toast.link || "/projects";
      }}
    >
      <div className="inapp-push-title">{toast.title}</div>
      <div className="inapp-push-body">{toast.body}</div>
    </div>
  );
}

function AppInner() {
  return (
    <>
      <InAppPushToast />
      <AppRouter />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;