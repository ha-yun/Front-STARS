import React, { useState, useEffect } from "react";
import { UserFavoriteList, Favorite } from "../../data/adminData";
import AdminHeader from "./AdminHeader";
import { getFavoriteList } from "../../api/adminApi";
import { useLocation, useParams } from "react-router-dom";

// 로딩 스켈레톤 컴포넌트
const UserSkeleton = () => (
    <div className="p-3 border-b animate-pulse">
        <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
    </div>
);

// 즐겨찾기 스켈레톤 컴포넌트
const FavoriteSkeleton = () => (
    <div className="p-3 rounded-lg shadow bg-gray-50 animate-pulse">
        <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-48 mt-3"></div>
    </div>
);

const AdminUserFavorite = () => {
    const location = useLocation();
    const params = useParams();

    const [userFavorites, setUserFavorites] = useState<UserFavoriteList[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [currentFavorites, setCurrentFavorites] = useState<Favorite[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredUsers, setFilteredUsers] = useState<UserFavoriteList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);
    const [dataFetched, setDataFetched] = useState<boolean>(false);
    const [isMobileView, setIsMobileView] = useState<boolean>(false);
    const [showUsersList, setShowUsersList] = useState<boolean>(true);

    // 윈도우 크기 변경 감지 핸들러
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        // 초기 설정
        handleResize();

        // 리사이즈 이벤트 리스너 등록
        window.addEventListener("resize", handleResize);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // 모바일에서 사용자 선택 시 자동으로 즐겨찾기 목록으로 전환
    useEffect(() => {
        if (isMobileView && selectedUserId) {
            setShowUsersList(false);
        }
    }, [selectedUserId, isMobileView]);

    // API 호출을 하는 함수
    const fetchData = async () => {
        if (loading && dataFetched) {
            return;
        }

        setLoading(true);
        try {
            console.log("Fetching User Favorite data from:", location.pathname);
            const response = await getFavoriteList();

            setUserFavorites(response);
            setFilteredUsers(response);

            if (response.length > 0 && !selectedUserId) {
                setSelectedUserId(response[0].user_id);
            }
            setDataFetched(true);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // 라우팅 정보가 변경될 때마다 데이터 다시 로드
    useEffect(() => {
        console.log("Route changed:", location.pathname);
        setDataFetched(false);
        fetchData();

        return () => {
            console.log(
                "AdminUserFavorite unmounting from:",
                location.pathname
            );
        };
    }, [location.pathname]);

    // 선택된 사용자가 변경될 때 즐겨찾기 로드
    useEffect(() => {
        const loadFavorites = async () => {
            if (selectedUserId) {
                setFavoriteLoading(true);
                try {
                    const selectedUser = userFavorites.find(
                        (user) => user.user_id === selectedUserId
                    );
                    if (selectedUser) {
                        console.log(
                            `Loading favorites for user: ${selectedUserId}`
                        );
                        setCurrentFavorites(selectedUser.content);
                    } else {
                        setCurrentFavorites([]);
                    }
                } catch (error) {
                    console.error("Error loading favorites:", error);
                } finally {
                    setFavoriteLoading(false);
                }
            } else {
                setCurrentFavorites([]);
            }
        };

        loadFavorites();
    }, [selectedUserId, userFavorites]);

    // 검색어 변경 시 사용자 필터링
    useEffect(() => {
        if (searchTerm) {
            const filtered = userFavorites.filter((user) =>
                user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(userFavorites);
        }
    }, [searchTerm, userFavorites]);

    // 사용자 ID 기반 색상 생성
    const getUserColor = (userId: string | undefined) => {
        if (!userId) {
            return "bg-gray-100";
        }

        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        }

        const colors = [
            "bg-blue-100",
            "bg-green-100",
            "bg-yellow-100",
            "bg-red-100",
        ];
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    // 타입별 색상 및 아이콘 반환 함수
    const getTypeStylesAndIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "cafe":
                return {
                    bg: "bg-amber-50",
                    border: "border-amber-200",
                    text: "text-amber-800",
                    tag: "bg-amber-100",
                    tagText: "text-amber-800",
                    icon: "☕",
                };
            case "restaurant":
                return {
                    bg: "bg-red-50",
                    border: "border-red-200",
                    text: "text-red-800",
                    tag: "bg-red-100",
                    tagText: "text-red-800",
                    icon: "🍽️",
                };
            case "accommodation":
                return {
                    bg: "bg-purple-50",
                    border: "border-purple-200",
                    text: "text-purple-800",
                    tag: "bg-purple-100",
                    tagText: "text-purple-800",
                    icon: "🏨",
                };
            case "attraction":
                return {
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                    text: "text-blue-800",
                    tag: "bg-blue-100",
                    tagText: "text-blue-800",
                    icon: "🎭",
                };
            default:
                return {
                    bg: "bg-gray-50",
                    border: "border-gray-200",
                    text: "text-gray-800",
                    tag: "bg-gray-100",
                    tagText: "text-gray-800",
                    icon: "📍",
                };
        }
    };

    // 새로고침 핸들러
    const handleRefresh = () => {
        setDataFetched(false);
        setLoading(true);
        fetchData();
    };

    // 뒤로가기 핸들러 (모바일용)
    const handleBack = () => {
        setShowUsersList(true);
    };

    // 사용자 유형 필터 - 모바일에서는 수평 스크롤 가능
    const TypeFilter = () => (
        <div className="p-3 border-b overflow-x-auto scrollbar-hide whitespace-nowrap flex gap-2">
            <span className="text-sm font-medium text-gray-700 self-center flex-shrink-0">
                타입:
            </span>
            {["cafe", "restaurant", "accommodation", "attraction"].map(
                (type) => {
                    const styles = getTypeStylesAndIcon(type);
                    return (
                        <button
                            key={type}
                            className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0
                            ${type === "전체" ? "bg-gray-200 text-gray-800" : `${styles.tag} ${styles.tagText}`}`}
                        >
                            {type === "전체"
                                ? "전체"
                                : `${styles.icon} ${type}`}
                        </button>
                    );
                }
            )}
        </div>
    );

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col w-full h-screen overflow-hidden">
            {/* Header */}
            <AdminHeader path={"/manage"} />

            {/* Main Container */}
            <div className="p-2 sm:p-4 flex-1 overflow-hidden flex flex-col">
                {/* 모바일 뷰에서 토글 버튼 */}
                {isMobileView && (
                    <div className="mb-2 flex">
                        {!showUsersList && selectedUserId && (
                            <button
                                onClick={handleBack}
                                className="flex items-center text-blue-600 mb-1 bg-white    "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                사용자 목록으로 돌아가기
                            </button>
                        )}
                    </div>
                )}

                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 flex-1 overflow-hidden">
                    {/* 사용자 목록 섹션 */}
                    {(!isMobileView || (isMobileView && showUsersList)) && (
                        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md flex flex-col h-full">
                            <h2 className="text-lg md:text-xl p-3 font-bold text-black border-b flex justify-between items-center flex-shrink-0">
                                <span>사용자 목록</span>
                                <div className="flex items-center">
                                    {loading && (
                                        <span className="text-sm text-blue-500 font-normal mr-2">
                                            로딩 중...
                                        </span>
                                    )}
                                    <button
                                        onClick={handleRefresh}
                                        className="ml-2 text-sm bg-white text-black hover:text-blue-500"
                                        title="새로고침"
                                        disabled={loading}
                                    >
                                        새로고침
                                    </button>
                                </div>
                            </h2>

                            {/* 검색창 */}
                            <div className="p-3 border-b flex-shrink-0">
                                <input
                                    type="text"
                                    placeholder="사용자 ID 검색..."
                                    className="w-full px-3 py-2 border rounded-lg text-black bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    disabled={loading}
                                />
                            </div>

                            {/* 사용자 목록 */}
                            <div
                                className="overflow-y-auto flex-1"
                                style={{ WebkitOverflowScrolling: "touch" }}
                            >
                                {loading ? (
                                    [...Array(5)].map((_, index) => (
                                        <UserSkeleton key={index} />
                                    ))
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <div
                                            key={user.user_id}
                                            className={`p-3 border-b cursor-pointer text-black hover:bg-gray-100 transition-colors ${
                                                selectedUserId === user.user_id
                                                    ? "bg-blue-50"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setSelectedUserId(user.user_id)
                                            }
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${getUserColor(
                                                        user.user_id
                                                    )}`}
                                                >
                                                    {user.user_id
                                                        ? user.user_id
                                                              .charAt(0)
                                                              .toUpperCase()
                                                        : "?"}
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        @{user.user_id}
                                                    </div>
                                                    <div className="text-gray-500 text-sm">
                                                        즐겨찾기{" "}
                                                        {user.content.length}개
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500">
                                        검색 결과가 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 즐겨찾기 목록 섹션 */}
                    {(!isMobileView || (isMobileView && !showUsersList)) && (
                        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md flex flex-col h-[calc(100vh-150px)]">
                            <h2 className="text-lg md:text-xl p-3 font-bold text-black border-b flex justify-between items-center flex-shrink-0">
                                <span>
                                    {selectedUserId
                                        ? `@${selectedUserId}님의 즐겨찾기`
                                        : "즐겨찾기 목록"}
                                </span>
                                <div className="flex items-center">
                                    {favoriteLoading && (
                                        <span className="text-sm text-blue-500 font-normal mr-2">
                                            로딩 중...
                                        </span>
                                    )}
                                    <span className="text-sm text-gray-500 font-normal">
                                        총 {currentFavorites.length}개
                                    </span>
                                </div>
                            </h2>

                            {/* 타입별 필터 */}
                            <TypeFilter />

                            {/* 즐겨찾기 그리드 - 스크롤 가능하도록 설정 */}
                            <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-220px)]">
                                {loading || favoriteLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[...Array(4)].map((_, index) => (
                                            <FavoriteSkeleton key={index} />
                                        ))}
                                    </div>
                                ) : currentFavorites.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16 md:pb-4">
                                        {currentFavorites.map((item) => {
                                            const typeStyles =
                                                getTypeStylesAndIcon(item.type);
                                            return (
                                                <div
                                                    key={item.favorite_id}
                                                    className={`p-3 rounded-lg shadow border ${typeStyles.bg} ${typeStyles.border} hover:shadow-lg transition-shadow duration-300`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <span className="mr-2">
                                                                {
                                                                    typeStyles.icon
                                                                }
                                                            </span>
                                                            <span
                                                                className={`font-bold text-base ${typeStyles.text}`}
                                                            >
                                                                {item.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex">
                                                            <span
                                                                className={`text-xs px-2 py-1 rounded-full ${typeStyles.tag} ${typeStyles.tagText}`}
                                                            >
                                                                {item.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 text-sm mt-1">
                                                        {item.address}
                                                    </p>
                                                    <div className="mt-2 text-right">
                                                        <span className="text-gray-500 text-xs">
                                                            ID:{" "}
                                                            {item.favorite_id}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200 text-gray-500">
                                        {selectedUserId
                                            ? "사용자의 즐겨찾기 항목이 없습니다."
                                            : "사용자를 선택해주세요."}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 모바일 하단 네비게이션 (선택사항) */}
            {isMobileView && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4 flex justify-around z-10">
                    <button
                        onClick={() => setShowUsersList(true)}
                        className={`flex flex-col items-center ${showUsersList ? "text-blue-600" : "text-gray-500"} bg-white`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        <span className="text-xs mt-1">사용자</span>
                    </button>
                    <button
                        onClick={() => {
                            if (selectedUserId) setShowUsersList(false);
                        }}
                        className={`flex flex-col items-center ${!showUsersList ? "text-blue-600" : "text-gray-500"} bg-white`}
                        disabled={!selectedUserId}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <span className="text-xs mt-1">즐겨찾기</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminUserFavorite;
