// MyPage.jsx
import { useState } from "react";
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

    // 항목 선택 핸들러
    const handleSelectItem = (item: item) => {
        setSelectedItem(item);
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

    return (
        <div className="w-full h-screen bg-gray-100 flex items-center justify-center relative">
            {/* Back Button (Absolute positioned) */}
            <div className="absolute md:top-6 top-24 left-6 z-10">
                <button
                    className="bg-white shadow-md px-4 py-2 text-indigo-500 font-semibold hover:bg-indigo-500 hover:text-white transition"
                    onClick={() => window.fullpage_api?.moveSlideLeft()}
                >
                    메인으로
                </button>
            </div>

            {/* Main Content Container */}
            <div className="flex w-11/12 h-4/5 mx-auto gap-4">
                {/* Left Column - List Card */}
                <div className="w-1/3 bg-white p-4 shadow-lg rounded-lg overflow-auto">
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

                {/* Right Column - Detail Card */}
                <div className="w-2/3 bg-white p-6 shadow-lg rounded-lg overflow-auto">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        {selectedItem.title}
                    </h2>
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
