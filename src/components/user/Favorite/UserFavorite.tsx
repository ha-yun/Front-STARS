// UserFavorite.tsx
import React, { useState, useEffect } from "react";
import { Favorite } from "../../../data/adminData";

const UserFavorite = () => {
    // 샘플 데이터로 초기화 (실제로는 API 등에서 가져올 수 있음)
    const [favorites, setFavorites] = useState<Favorite[]>([
        {
            id: 1,
            name: "에버랜드",
            address: "경기도 용인시",
        },
        {
            id: 2,
            name: "맛있는 식당",
            address: "서울시 강남구",
        },
        {
            id: 3,
            name: "스타벅스 강남점",
            address: "서울시 강남구",
        },
        {
            id: 4,
            name: "그랜드 호텔",
            address: "제주도 서귀포시",
        },
        {
            id: 5,
            name: "롯데월드",
            address: "서울시 송파구",
        },
        { id: 6, name: "한식당", address: "서울시 중구" },
        { id: 7, name: "투썸플레이스", address: "서울시 종로구" },
        {
            id: 8,
            name: "웨스틴 조선",
            address: "서울시 중구",
        },
    ]);

    // 모바일 여부를 저장하는 상태
    const [isMobile, setIsMobile] = useState(false);

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

    // 삭제 핸들러
    const handleDelete = (id: number) => {
        if (window.confirm("즐겨찾기를 삭제하시겠습니까?")) {
            setFavorites(favorites.filter((item) => item.id !== id));
        }
    };

    return (
        <div className="p-2 md:p-4">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                내 즐겨찾기
            </h2>

            {/* 모바일에서는 스크롤 가능한 컨테이너, 데스크탑에서는 그리드 */}
            <div className={isMobile ? "h-96 overflow-y-auto pr-1" : ""}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                    {favorites.map((item) => (
                        <div
                            key={item.id}
                            className={`p-2 md:p-3 rounded-lg shadow hover:shadow-lg transition-shadow duration-300`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-gray-700 font-bold text-sm md:text-base">
                                        {item.name}
                                    </span>
                                </div>
                                <div className="flex">
                                    <button
                                        className="bg-white text-red-500 hover:text-red-700 text-xs md:text-sm"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600 text-xs md:text-sm mt-1">
                                {item.address}
                            </p>
                        </div>
                    ))}
                    {favorites.length === 0 && (
                        <div className="col-span-1 sm:col-span-2 p-4 text-center bg-gray-50 rounded-lg border border-gray-200 text-gray-500">
                            즐겨찾기 항목이 없습니다.
                        </div>
                    )}
                </div>
            </div>

            {/* 모바일에서만 보이는 스크롤 안내 */}
            {isMobile && favorites.length > 4 && (
                <div className="text-center text-gray-500 text-xs mt-2 animate-pulse">
                    스크롤하여 더 많은 항목 보기
                </div>
            )}
        </div>
    );
};

export default UserFavorite;
