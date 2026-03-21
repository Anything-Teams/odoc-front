import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import ProjectList from "../screens/ProjectList";
import ProjectCreate from "../screens/ProjectCreate";
import ProjectMain from "../screens/ProjectMain";
import ProjectLayout from "../layouts/ProjectLayout";
import ProjectHistoryYear from "../screens/ProjectHistoryYear";
import ProjectHistoryMonth from "../screens/ProjectHistoryMonth";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/projects" element={<ProjectLayout />}>
                    <Route index element={<ProjectList />} />
                    <Route path="new" element={<ProjectCreate />} />
                    <Route path=":projectId" element={<ProjectMain />} />
                    <Route path=":projectId/history-year" element={<ProjectHistoryYear />} />
                    <Route path=":projectId/history-month" element={<ProjectHistoryMonth />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}