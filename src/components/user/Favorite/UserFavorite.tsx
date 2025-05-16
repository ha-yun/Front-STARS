// UserFavorite.tsx
import React, { useState, useEffect } from "react";
import { Favorite } from "../../../data/adminData";
import { getUserFavoriteList, deleteFavorite } from "../../../api/mypageApi";

// 타입별 색상 정의
const typeColors = {
    attraction: {
        badge: "bg-blue-100 text-blue-800",
        border: "border-l-8 border-blue-500",
    },
    restaurant: {
        badge: "bg-green-100 text-green-800",
        border: "border-l-8 border-green-500",
    },
    cafe: {
        badge: "bg-orange-100 text-orange-800",
        border: "border-l-8 border-orange-500",
    },
    hotel: {
        badge: "bg-purple-100 text-purple-800",
        border: "border-l-8 border-purple-500",
    },
    default: {
        badge: "bg-gray-100 text-gray-800",
        border: "border-l-8 border-gray-500",
    },
};

// 타입에 따른 색상 반환 함수
const getTypeColor = (type: string) => {
    const key = type as keyof typeof typeColors;
    return typeColors[key] || typeColors.default;
};

const UserFavorite = () => {
    // 즐겨찾기 데이터 상태
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    // 로딩 상태
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // 에러 상태
    const [error, setError] = useState<string | null>(null);
    // 삭제 진행 중인 항목의 ID
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // 모바일 여부를 저장하는 상태
    const [isMobile, setIsMobile] = useState(false);

    // 즐겨찾기 데이터 로드 함수
    const loadFavorites = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // 실제 호출해야한 API, response 처리 로직을 다시 짜야할 수 있음
            const response = await getUserFavoriteList();

            if (response) {
                setFavorites(response);
                console.log(response);
            } else {
                setError(
                    response.message ||
                        "즐겨찾기 목록을 불러오는데 실패했습니다."
                );
                // 에러 발생 시 빈 배열로 초기화
                setFavorites([]);
            }
        } catch (err) {
            setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
            console.log(err);
            // 예외 발생 시 빈 배열로 초기화
            setFavorites([]);
        } finally {
            setIsLoading(false);
        }
    };

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

    // 컴포넌트 마운트 시 즐겨찾기 데이터 로드
    useEffect(() => {
        loadFavorites();
    }, []);

    // 삭제 핸들러
    const handleDelete = async (fav: Favorite) => {
        if (window.confirm("즐겨찾기를 삭제하시겠습니까?")) {
            setDeletingId(fav.favorite_id); // 삭제 중인 항목 표시

            try {
                // 모의 API, 실제 API로 바꿔야함
                // const response = await ddeleteFavorite(fav.favorite_id);

                // 실제 호출해야하는 API
                const response = await deleteFavorite(fav);
                console.log("삭제 결과: ", response);

                if (response.message === "즐겨찾기 삭제 완료") {
                    alert("삭제되었습니다.");
                    // 성공적으로 삭제되면 상태에서도 삭제
                    await loadFavorites();
                } else {
                    // 실패 시 알림
                    alert(response.message || "삭제에 실패했습니다.");
                }
            } catch (err) {
                alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
                console.log(err);
            } finally {
                setDeletingId(null); // 삭제 중 표시 제거
            }
        }
    };

    // 로딩 상태 표시
    if (isLoading) {
        return (
            <div className="p-2 md:p-4">
                <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                    내 즐겨찾기
                </h2>
                <div className="flex justify-center items-center h-48">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-64 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
                        <div className="text-gray-500 text-sm">
                            즐겨찾기를 불러오는 중...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 에러 상태 표시
    if (error) {
        return (
            <div className="p-2 md:p-4">
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                    role="alert"
                >
                    <strong className="font-bold">오류 발생! </strong>
                    <span className="block sm:inline">{error}</span>
                    <button
                        className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                        onClick={loadFavorites}
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 md:p-4">
            <div className="flex justify-between items-center mb-2 md:mb-4">
                <button
                    className="bg-white text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                    onClick={loadFavorites}
                >
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        ></path>
                    </svg>
                    새로고침
                </button>
            </div>

            {/* 모바일에서는 스크롤 가능한 컨테이너, 데스크탑에서는 그리드 */}
            <div className={isMobile ? "h-96 overflow-y-auto pr-1" : ""}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {favorites.map((item) => {
                        const typeColor = getTypeColor(item.type);
                        return (
                            <div
                                key={item.favorite_id}
                                className={`p-2 md:p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 ${typeColor.border} ${
                                    deletingId === item.favorite_id
                                        ? "opacity-50"
                                        : ""
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <span className="text-gray-700 font-bold text-sm md:text-base">
                                            {item.name}
                                        </span>
                                        <span
                                            className={`ml-2 px-2 py-1 text-xs rounded-full ${typeColor.badge}`}
                                        >
                                            {item.type}
                                        </span>
                                    </div>
                                    <button
                                        className="bg-white text-red-500 hover:text-red-700 text-xs md:text-sm disabled:text-gray-400 ml-2"
                                        onClick={() => handleDelete(item)}
                                        disabled={
                                            deletingId === item.favorite_id
                                        }
                                    >
                                        {deletingId === item.favorite_id ? (
                                            <span className="flex items-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                삭제중...
                                            </span>
                                        ) : (
                                            "삭제"
                                        )}
                                    </button>
                                </div>
                                <p className="text-gray-600 text-xs md:text-sm mt-2">
                                    {item.address}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex gap-1">
                                        <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                                            상세보기
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
