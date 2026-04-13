import { Navigate } from "react-router-dom";
import { useAuth } from "../common/AuthContext";
import { Loading } from "../components/Loading";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}