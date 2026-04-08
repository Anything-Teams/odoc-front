import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import ProjectList from "../screens/ProjectList";
import ProjectCreate from "../screens/ProjectCreate";
import ProjectMain from "../screens/ProjectMain";
import ProjectLayout from "../layouts/ProjectLayout";
import ProjectHistoryYear from "../screens/ProjectHistoryYear";
import ProjectHistoryMonth from "../screens/ProjectHistoryMonth";
import AdminPage from "../screens/AdminPage";
import PrivateRoute from "./PrivateRoute";
import RootRedirect from "../common/RootRedirect";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/projects"
        element={
          <PrivateRoute>
            <ProjectLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<ProjectList />} />
        <Route path="new" element={<ProjectCreate />} />
        <Route path=":projectId" element={<ProjectMain />} />
        <Route path=":projectId/history-year" element={<ProjectHistoryYear />} />
        <Route path=":projectId/history-month" element={<ProjectHistoryMonth />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}