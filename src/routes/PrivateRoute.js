import { Navigate } from "react-router-dom";
import { useAuth } from "../common/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // 또는 로딩 컴포넌트
  if (!user) return <Navigate to="/login" replace />;

  return children;
}