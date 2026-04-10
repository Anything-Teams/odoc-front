import { Navigate } from "react-router-dom";
import { useAuth } from "../common/AuthContext";
import { Loading } from "../components/Loading";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  const isLoggedHint = localStorage.getItem("isLoggedIn") === "Y";

  if (loading && !isLoggedHint) {
    return <Loading />;
  }

  if (!loading && !user && !isLoggedHint) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}