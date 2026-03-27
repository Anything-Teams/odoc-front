import { createContext, useState, useContext, useEffect } from "react";
import { post, get } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const savedUser = localStorage.getItem("user");
  
    if (!savedUser) {
      setUser(null);
      setLoading(false);
      return;
    }
  
    get("/sessionUser")
      .then(() => {
        setUser(JSON.parse(savedUser));
      })
      .catch(() => {
        localStorage.removeItem("user");
        setUser(null);
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
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await post("/userLogout");
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);