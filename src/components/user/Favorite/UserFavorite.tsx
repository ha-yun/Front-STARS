// UserFavorite.tsx
import React, { useState, useEffect } from "react";
import { Favorite } from "../../../data/adminData";

// 샘플 데이터 - 나중에 API에서 받아올 데이터
const sampleFavorites: Favorite[] = [
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
];

// API 응답 타입 정의
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

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

    // 즐겨찾기 데이터를 가져오는 모의 API 함수
    const fetchFavorites = (): Promise<ApiResponse<Favorite[]>> => {
        return new Promise((resolve) => {
            // 실제 axios 사용 시:
            // return axios.get('/api/favorites');

            // 1초 지연 후 응답 (네트워크 지연 시뮬레이션)
            setTimeout(() => {
                // 80% 확률로 성공
                if (Math.random() < 0.8) {
                    resolve({
                        success: true,
                        data: sampleFavorites,
                        message: "즐겨찾기 목록을 성공적으로 불러왔습니다.",
                    });
                } else {
                    resolve({
                        success: false,
                        message:
                            "즐겨찾기 목록을 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요.",
                    });
                }
            }, 1000);
        });
    };

    // 즐겨찾기 항목을 삭제하는 모의 API 함수
    const deleteFavorite = (id: number): Promise<ApiResponse<null>> => {
        return new Promise((resolve) => {
            // 실제 axios 사용 시:
            // return axios.delete(`/api/favorites/${id}`);

            // 800ms 지연 후 응답 (네트워크 지연 시뮬레이션)
            setTimeout(() => {
                // 90% 확률로 성공
                if (Math.random() < 0.9) {
                    resolve({
                        success: true,
                        message: "즐겨찾기가 성공적으로 삭제되었습니다.",
                    });
                } else {
                    resolve({
                        success: false,
                        message:
                            "즐겨찾기 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.",
                    });
                }
            }, 800);
        });
    };

    // 즐겨찾기 데이터 로드 함수
    const loadFavorites = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetchFavorites();

            if (response.success && response.data) {
                setFavorites(response.data);
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
    const handleDelete = async (id: number) => {
        if (window.confirm("즐겨찾기를 삭제하시겠습니까?")) {
            setDeletingId(id); // 삭제 중인 항목 표시

            try {
                const response = await deleteFavorite(id);

                if (response.success) {
                    // 성공적으로 삭제되면 상태에서도 삭제
                    setFavorites(favorites.filter((item) => item.id !== id));
                } else {
                    // 실패 시 알림
                    alert(response.message || "삭제에 실패했습니다.");
                }
            } catch (err) {
                alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
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
                <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                    내 즐겨찾기
                </h2>
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
                    className="bg-white border-gray-400 text-indigo-600 hover:text-indigo-800 text-sm"
                    onClick={loadFavorites}
                >
                    <span className="flex items-center">
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
                    </span>
                </button>
            </div>

            {/* 모바일에서는 스크롤 가능한 컨테이너, 데스크탑에서는 그리드 */}
            <div className={isMobile ? "h-96 overflow-y-auto pr-1" : ""}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                    {favorites.map((item) => (
                        <div
                            key={item.id}
                            className={`p-2 md:p-3 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ${
                                deletingId === item.id ? "opacity-50" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-gray-700 font-bold text-sm md:text-base">
                                        {item.name}
                                    </span>
                                </div>
                                <div className="flex">
                                    <button
                                        className="bg-white text-red-500 hover:text-red-700 text-xs md:text-sm disabled:text-gray-400"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deletingId === item.id}
                                    >
                                        {deletingId === item.id ? (
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
