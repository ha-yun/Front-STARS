// MyPage.tsx
import React, { useState, useEffect } from "react";
import UserInfo from "./Info/UserInfo";
import UserFavorite from "./Favorite/UserFavorite";

interface item {
    id: number;
    title: string;
}

export default function MyPage() {
    // 선택된 항목의 상태를 관리합니다
    const [selectedItem, setSelectedItem] = useState<item>({
        id: 1,
        title: "회원정보", // 기본 선택 항목을 회원정보로 변경
    });

    // 목록 데이터
    const listItems: item[] = [
        {
            id: 1,
            title: "회원정보",
        },
        {
            id: 2,
            title: "즐겨찾기",
        },
    ];

    // 모바일 여부를 저장하는 상태
    const [isMobile, setIsMobile] = useState(false);

    // 모바일 메뉴 표시 상태
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // 화면 크기가 변경될 때 모바일 여부 감지
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // 초기 체크
        checkIfMobile();

        // 리사이즈 이벤트 리스너 추가
        window.addEventListener("resize", checkIfMobile);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    // 항목 선택 핸들러
    const handleSelectItem = (item: item) => {
        setSelectedItem(item);
        // 모바일에서 항목 선택 시 드롭다운 메뉴 닫기
        if (isMobile) {
            setMobileMenuOpen(false);
        }
    };

    // 선택된 항목에 따라 적절한 컴포넌트를 렌더링하는 함수
    const renderSelectedComponent = () => {
        switch (selectedItem.id) {
            case 1:
                return <UserInfo />;
            case 2:
                return <UserFavorite />;
            default:
                return <div>선택된 항목이 없습니다.</div>;
        }
    };

    // 드롭다운 토글 핸들러
    const toggleDropdown = () => {
        if (isMobile) {
            setMobileMenuOpen(!mobileMenuOpen);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center relative py-4 md:py-10">
            {/* Back Button (Absolute positioned) */}
            <div className="absolute md:top-6 top-4 left-4 md:left-6 z-10 flex justify-center items-center">
                <button
                    className="bg-white shadow-md px-3 py-1 md:px-4 md:py-2 text-indigo-500 font-semibold hover:bg-indigo-500 hover:text-white transition text-sm md:text-base"
                    onClick={() => window.fullpage_api?.moveSlideLeft()}
                >
                    메인으로
                </button>
            </div>

            {/* Main Content Container - 모바일에서는 전체 너비, 데스크탑에서는 중앙 정렬 */}
            <div className="flex flex-col md:flex-row w-11/12 lg:w-10/12 h-auto md:h-4/5 mx-auto gap-4 mt-12 md:mt-0">
                {/* Mobile Menu Toggle Button with Dropdown - 모바일에서만 표시 */}
                {isMobile && (
                    <div className="relative">
                        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-lg mb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                마이페이지: {selectedItem.title}
                            </h2>
                            <button
                                onClick={toggleDropdown}
                                className="bg-indigo-100 text-indigo-500 p-2 rounded-lg flex items-center"
                            >
                                <span>
                                    {mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
                                </span>
                                <svg
                                    className={`w-4 h-4 ml-2 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Dropdown Menu - 모바일에서 토글 시에만 표시 */}
                        {mobileMenuOpen && (
                            <div className="absolute w-full bg-white p-4 shadow-lg rounded-lg z-20">
                                <ul className="space-y-2">
                                    {/* 목록 항목을 동적으로 생성 */}
                                    {listItems.map((item) => (
                                        <li
                                            key={item.id}
                                            className={`p-2 rounded cursor-pointer transition text-black ${
                                                selectedItem.id === item.id
                                                    ? "bg-indigo-100"
                                                    : "hover:bg-indigo-50"
                                            }`}
                                            onClick={() =>
                                                handleSelectItem(item)
                                            }
                                        >
                                            {item.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Left Column - List Card (데스크탑에서만 표시) */}
                {!isMobile && (
                    <div className="w-1/3 bg-white p-4 shadow-lg rounded-lg mb-4 md:mb-0">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            마이페이지
                        </h2>
                        <ul className="space-y-2">
                            {/* 목록 항목을 동적으로 생성 */}
                            {listItems.map((item) => (
                                <li
                                    key={item.id}
                                    className={`p-2 rounded cursor-pointer transition text-black ${
                                        selectedItem.id === item.id
                                            ? "bg-indigo-100"
                                            : "hover:bg-indigo-50"
                                    }`}
                                    onClick={() => handleSelectItem(item)}
                                >
                                    {item.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Right Column - Detail Card */}
                <div
                    className={`w-full ${!isMobile ? "md:w-2/3" : ""} bg-white p-4 md:p-6 shadow-lg rounded-lg overflow-auto`}
                >
                    {/* 데스크탑에서만 제목 표시 - 모바일은 상단 토글 메뉴에 표시됨 */}
                    {!isMobile && (
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            {selectedItem.title}
                        </h2>
                    )}
                    {/* 상단 구분바가 있는 div이므로 삭제금지 */}
                    <div className="border-t border-gray-200 pt-4">
                        {/* 선택된 항목에 따라 다른 컴포넌트 렌더링 */}
                        {renderSelectedComponent()}
                    </div>
                </div>
            </div>
        </div>
    );
}
