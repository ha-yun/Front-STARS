import React, { useState, useEffect } from "react";
import { UserFavoriteList, Favorite } from "../../data/adminData";
import AdminHeader from "./AdminHeader";
import { getFavoriteList } from "../../api/adminApi";

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
    const [userFavorites, setUserFavorites] = useState<UserFavoriteList[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [currentFavorites, setCurrentFavorites] = useState<Favorite[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredUsers, setFilteredUsers] = useState<UserFavoriteList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);

    // API 호출을 시뮬레이션하는 함수
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getFavoriteList();
            console.log(response);
            setUserFavorites(response);
            setFilteredUsers(response);
            // 첫 번째 사용자 선택
            if (response.length > 0) {
                setSelectedUserId(response[0].user_id);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        fetchData();
    }, []);

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

    // 사용자 ID 기반 색상 생성 (사용자 목록용)
    const getUserColor = (userId: string | undefined) => {
        // userId가 undefined이면 기본 색상 반환
        if (!userId) {
            return "bg-gray-100";
        }

        // 간단한 해시 함수 (userId 문자열을 숫자로 변환)
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        }

        // 4가지 색상 중 하나를 선택
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

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col w-full">
            {/* Header */}
            <AdminHeader path={"/manage"} />
            {/* End of Header */}

            {/* Main Container */}
            <div className="flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4">
                {/* 사용자 목록 섹션 - 왼쪽에 배치 */}
                <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg md:text-xl p-3 font-bold text-black border-b flex justify-between items-center">
                        <span>사용자 목록</span>
                        {loading && (
                            <span className="text-sm text-blue-500 font-normal">
                                로딩 중...
                            </span>
                        )}
                    </h2>

                    {/* 검색창 */}
                    <div className="p-3 border-b">
                        <input
                            type="text"
                            placeholder="사용자 ID 검색..."
                            className="w-full px-3 py-2 border rounded-lg text-black bg-gray-50 focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* 사용자 목록 */}
                    <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
                        {loading ? (
                            // 로딩 중 스켈레톤 UI
                            [...Array(5)].map((_, index) => (
                                <UserSkeleton key={index} />
                            ))
                        ) : filteredUsers.length > 0 ? (
                            // 사용자 목록 표시
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
                                            className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${getUserColor(user.user_id)}`}
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
                                                즐겨찾기 {user.content.length}개
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // 검색 결과 없음
                            <div className="p-4 text-center text-gray-500">
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                {/* 즐겨찾기 목록 섹션 - 오른쪽에 배치 */}
                <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg md:text-xl p-3 font-bold text-black border-b flex justify-between items-center">
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
                    <div className="p-3 border-b flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-gray-700 self-center">
                            타입:
                        </span>
                        {[
                            "cafe",
                            "restaurant",
                            "accommodation",
                            "attraction",
                        ].map((type) => {
                            const styles = getTypeStylesAndIcon(type);
                            return (
                                <button
                                    key={type}
                                    className={`px-3 py-1 rounded-full text-xs font-medium 
                                    ${type === "전체" ? "bg-gray-200 text-gray-800" : `${styles.tag} ${styles.tagText}`}`}
                                >
                                    {type === "전체"
                                        ? "전체"
                                        : `${styles.icon} ${type}`}
                                </button>
                            );
                        })}
                    </div>

                    {/* 즐겨찾기 그리드 */}
                    <div className="p-4">
                        {loading || favoriteLoading ? (
                            // 로딩 중 스켈레톤 UI
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[...Array(4)].map((_, index) => (
                                    <FavoriteSkeleton key={index} />
                                ))}
                            </div>
                        ) : currentFavorites.length > 0 ? (
                            // 즐겨찾기 목록 표시
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentFavorites.map((item) => {
                                    const typeStyles = getTypeStylesAndIcon(
                                        item.type
                                    );
                                    return (
                                        <div
                                            key={item.favorite_id}
                                            className={`p-3 rounded-lg shadow border ${typeStyles.bg} ${typeStyles.border} hover:shadow-lg transition-shadow duration-300`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <span className="mr-2">
                                                        {typeStyles.icon}
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
                                                    ID: {item.favorite_id}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            // 즐겨찾기 없음
                            <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200 text-gray-500">
                                {selectedUserId
                                    ? "사용자의 즐겨찾기 항목이 없습니다."
                                    : "사용자를 선택해주세요."}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* End of Main Container */}
        </div>
    );
};

export default AdminUserFavorite;
