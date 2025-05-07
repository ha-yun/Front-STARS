import React, { useState, useEffect } from "react";
import { UserFavoriteList, Favorite } from "../../data/adminData";
import AdminHeader from "./AdminHeader";

// 더미 데이터
const dummyListData: UserFavoriteList[] = [
    {
        userId: "minseok",
        favoriteList: [
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
        ],
    },
    {
        userId: "jungu",
        favoriteList: [
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
            {
                id: 6,
                name: "광안리 해수욕장",
                address: "부산시 수영구",
            },
        ],
    },
    {
        userId: "seungho",
        favoriteList: [
            {
                id: 7,
                name: "장충동 왕족발보쌈",
                address: "서울시 중구",
            },
            {
                id: 8,
                name: "물향기수목원",
                address: "경기도 오산시",
            },
        ],
    },
    {
        userId: "jiwon",
        favoriteList: [
            {
                id: 9,
                name: "경복궁",
                address: "서울시 종로구",
            },
            {
                id: 10,
                name: "남산타워",
                address: "서울시 용산구",
            },
            {
                id: 11,
                name: "카페 드 파리",
                address: "서울시 마포구",
            },
        ],
    },
    {
        userId: "yujin",
        favoriteList: [
            {
                id: 12,
                name: "해운대 해수욕장",
                address: "부산시 해운대구",
            },
            {
                id: 13,
                name: "전주 한옥마을",
                address: "전북 전주시",
            },
            {
                id: 14,
                name: "설악산 국립공원",
                address: "강원도 속초시",
            },
            {
                id: 15,
                name: "더문 카페",
                address: "제주도 서귀포시",
            },
        ],
    },
    {
        userId: "woojin",
        favoriteList: [
            {
                id: 16,
                name: "서울숲",
                address: "서울시 성동구",
            },
            {
                id: 17,
                name: "한강공원",
                address: "서울시 용산구",
            },
        ],
    },
    {
        userId: "hyerin",
        favoriteList: [
            {
                id: 18,
                name: "감천문화마을",
                address: "부산시 사하구",
            },
            {
                id: 19,
                name: "보라카이 펜션",
                address: "강원도 강릉시",
            },
            {
                id: 20,
                name: "오설록 티 뮤지엄",
                address: "제주도 서귀포시",
            },
        ],
    },
    {
        userId: "minjae",
        favoriteList: [
            {
                id: 21,
                name: "명동 거리",
                address: "서울시 중구",
            },
            {
                id: 22,
                name: "홍대 거리",
                address: "서울시 마포구",
            },
            {
                id: 23,
                name: "쌍용동 맛집거리",
                address: "충남 천안시",
            },
        ],
    },
];

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
            // Axios 요청을 시뮬레이션 (2초 지연)
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setUserFavorites(dummyListData);
            setFilteredUsers(dummyListData);
            // 첫 번째 사용자 선택
            if (dummyListData.length > 0) {
                setSelectedUserId(dummyListData[0].userId);
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
                    // Axios 요청을 시뮬레이션 (1초 지연)
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    const selectedUser = userFavorites.find(
                        (user) => user.userId === selectedUserId
                    );
                    if (selectedUser) {
                        setCurrentFavorites(selectedUser.favoriteList);
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
                user.userId.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(userFavorites);
        }
    }, [searchTerm, userFavorites]);

    // 색상 생성 (같은 ID는 같은 색상을 유지하기 위함)
    const getRandomColor = (userId: string) => {
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
                                    key={user.userId}
                                    className={`p-3 border-b cursor-pointer text-black hover:bg-gray-100 transition-colors ${
                                        selectedUserId === user.userId
                                            ? "bg-blue-50"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedUserId(user.userId)
                                    }
                                >
                                    <div className="flex items-center">
                                        <div
                                            className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${getRandomColor(user.userId)}`}
                                        >
                                            {user.userId
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                @{user.userId}
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                즐겨찾기{" "}
                                                {user.favoriteList.length}개
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
                                {currentFavorites.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`p-3 rounded-lg shadow ${getRandomColor(item.name)} hover:shadow-lg transition-shadow duration-300`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-gray-700 font-bold text-base">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div className="flex">
                                                <span className="text-gray-500 text-xs px-2 py-1 bg-white rounded-full">
                                                    ID: {item.id}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {item.address}
                                        </p>
                                    </div>
                                ))}
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
