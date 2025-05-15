// src/components/admin/AdminContainer.tsx
import React from "react";
import { AdminDataProvider } from "../../context/AdminContext";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminComponent from "./AdminComponent";
import AdminDetail from "./AdminDetail";
import AdminTour from "./AdminTour";
import AdminUserFavorite from "./AdminUserFavorite";
import AdminTraffic from "./AdminTraffic";

/**
 * Admin 컴포넌트들의 컨테이너 역할을 하는 컴포넌트
 * - 하위 컴포넌트들이 공유하는 데이터와 SSE 연결을 관리
 * - 라우팅을 통합적으로 처리
 */
const AdminContainer: React.FC = () => {
    const location = useLocation();

    return (
        <AdminDataProvider>
            <Routes>
                {/* 중첩 라우팅 처리 */}
                <Route path="/" element={<AdminComponent />} />
                <Route path="/:spotCode" element={<AdminDetail />} />
                <Route path="/tour" element={<AdminTour />} />
                <Route path="/user" element={<AdminUserFavorite />} />
                <Route path="/traffic" element={<AdminTraffic />} />
                {/* 기본 리다이렉션 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AdminDataProvider>
    );
};

export default AdminContainer;
