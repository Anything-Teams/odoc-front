import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Loading } from "../components/Loading";

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return <Navigate to={user ? "/projects" : "/login"} replace />;
}

export default RootRedirect;