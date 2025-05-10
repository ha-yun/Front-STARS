import { Routes, Route, Navigate } from "react-router-dom";
import FullPageLayout from "../layouts/FullPageLayout";
import AdminPage from "../pages/admin/AdminPage";
import AdminDetail from "../components/admin/AdminDetail";
import AdminTour from "../components/admin/AdminTour";
import AdminUserFavorite from "../components/admin/AdminUserFavorite";
import LoginPage from "../pages/login/LoginPage";

export default function AppRoutes() {
    return (
        <Routes>
            // 홈페이지 리다이렉트 to /map
            <Route path="/" element={<Navigate to="/map" replace />} />
            <Route path="/map" element={<FullPageLayout />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/manage" element={<AdminPage />} />
            <Route path="/manage/:spotCode" element={<AdminDetail />} />
            <Route path="/manage/tour" element={<AdminTour />} />
            <Route path="/manage/user" element={<AdminUserFavorite />} />
        </Routes>
    );
}
