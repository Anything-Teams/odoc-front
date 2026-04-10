import { createContext, useState, useContext, useEffect } from "react";
import { post, get } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAutoLogin, setIsAutoLogin] = useState(false);

  useEffect(() => {
    get("/sessionUser", null, { skipUnauthorizedEvent: true })
      .then((data) => {
        setUser(data);
        setIsAutoLogin(true);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem("user");
        setUser(null);
        setIsAutoLogin(false);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = () => {
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/login";
    };

    window.addEventListener("unauthorized", handler);
    return () => window.removeEventListener("unauthorized", handler);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAutoLogin(false);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await post("/userLogout");
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAutoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);