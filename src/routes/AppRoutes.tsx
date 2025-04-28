import { Routes, Route } from "react-router-dom";
import FullPageLayout from "../layouts/FullPageLayout";
import AdminPage from "../pages/admin/AdminPage";
import AdminDetail from "../components/admin/AdminDetail";
import AdminTour from "../components/admin/AdminTour";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<FullPageLayout />} />
            <Route path="/manage" element={<AdminPage />} />
            <Route path="/manage/:spotCode" element={<AdminDetail />} />
            <Route path="/manage/tour" element={<AdminTour />} />
        </Routes>
    );
}
