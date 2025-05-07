import { useNavigate } from "react-router-dom";
import { touristInfo, touristSpots, weatherData } from "../../data/adminData";
import { WeatherCard } from "./cards/weatherCard";
import { SpotCard } from "./cards/spotCard";
import AdminHeader from "./AdminHeader";
import CongestionTag from "./cards/CongestionTag";
import { useState, useEffect } from "react";

// 타입 가져오기
import {
    TouristInfo,
    TouristSpot,
    WeatherCard as WeatherCardType,
} from "../../data/adminData";

export default function AdminComponent() {
    const navigate = useNavigate();
    const [sortField, setSortField] = useState<string>("spotName"); // 기본값: 관광지명
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // 기본값: 오름차순

    // 데이터 상태 및 로딩 상태
    const [touristInfoData, setTouristInfoData] = useState<TouristInfo[]>([]);
    const [touristSpotsData, setTouristSpotsData] = useState<TouristSpot[]>([]);
    const [weatherInfoData, setWeatherInfoData] = useState<WeatherCardType[]>(
        []
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [spotsLoading, setSpotsLoading] = useState<boolean>(true);
    const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    // 테스트용 실패확률
    const persent: number = 0.2;

    // 혼잡도 값에 대한 우선순위 매핑
    const congestionOrder = {
        원활: 1,
        보통: 2,
        "약간 붐빔": 3,
        붐빔: 4,
    };

    // 정렬 함수
    const handleSort = (field: string) => {
        if (sortField === field) {
            // 같은 필드를 클릭하면 방향 전환
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // 새 필드를 클릭하면 기본 오름차순으로 시작
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // 정렬된 데이터
    const sortedTouristInfo = [...touristInfoData].sort((a, b) => {
        if (sortField === "spotName") {
            return sortDirection === "asc"
                ? a.spotName.localeCompare(b.spotName)
                : b.spotName.localeCompare(a.spotName);
        }

        if (sortField === "congestion") {
            const valueA =
                congestionOrder[
                    a.participantCount as keyof typeof congestionOrder
                ] || 0;
            const valueB =
                congestionOrder[
                    b.participantCount as keyof typeof congestionOrder
                ] || 0;

            return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        }

        return 0;
    });

    // 정렬 표시 아이콘 렌더링 (유니코드 문자 사용)
    const renderSortIcon = (field: string) => {
        if (sortField !== field) return null;

        return sortDirection === "asc" ? (
            <span className="ml-1">▲</span>
        ) : (
            <span className="ml-1">▼</span>
        );
    };

    // 관광지 정보 데이터 로드 함수
    const fetchTouristInfo = async () => {
        setLoading(true);
        setError(null);

        try {
            // API 통신 시뮬레이션 (2초 지연)
            const response = await new Promise<TouristInfo[]>(
                (resolve, reject) => {
                    setTimeout(() => {
                        if (Math.random() > persent) {
                            resolve(touristInfo);
                        } else {
                            reject(
                                new Error(
                                    "관광지 정보를 불러오는데 실패했습니다."
                                )
                            );
                        }
                    }, 1000);
                }
            );

            setTouristInfoData(response);
        } catch (err) {
            console.error("Failed to fetch tourist info:", err);
            setError("정보를 불러오는데 실패했습니다.");
            // 초기화
            setTouristInfoData([]);
            // 에러 발생시 더미 데이터 사용
            // setTouristInfoData(touristInfo);
        } finally {
            setLoading(false);
        }
    };

    // 혼잡 현황 데이터 로드 함수
    const fetchTouristSpots = async () => {
        setSpotsLoading(true);

        try {
            // API 통신 시뮬레이션 (1.5초 지연)
            const response = await new Promise<TouristSpot[]>(
                (resolve, reject) => {
                    setTimeout(() => {
                        if (Math.random() > persent) {
                            resolve(touristSpots);
                        } else {
                            reject(
                                new Error(
                                    "관광지 정보를 불러오는데 실패했습니다."
                                )
                            );
                        }
                    }, 1000);
                }
            );

            setTouristSpotsData(response);
        } catch (err) {
            console.error("Failed to fetch tourist spots:", err);
            setError("정보를 불러오는데 실패했습니다");
            // 초기화
            setTouristSpotsData([]);
            // 에러 발생시 더미 데이터 사용
            // setTouristSpotsData(touristSpots);
        } finally {
            setSpotsLoading(false);
        }
    };

    // 날씨 정보 데이터 로드 함수
    // 날씨 API를 보고 다시 만들던지 해야 할 수도 있음
    const fetchWeatherData = async () => {
        setWeatherLoading(true);

        try {
            // API 통신 시뮬레이션 (2.5초 지연)
            const response = await new Promise<WeatherCardType[]>(
                (resolve, reject) => {
                    setTimeout(() => {
                        // 95% 확률로 성공, 5% 확률로 실패 (테스트용)
                        if (Math.random() > persent) {
                            resolve(weatherData);
                        } else {
                            reject(
                                new Error(
                                    "날씨 데이터를 불러오는데 실패했습니다."
                                )
                            );
                        }
                    }, 1000);
                }
            );

            setWeatherInfoData(response);
        } catch (err) {
            console.error("Failed to fetch weather data:", err);
            setError("정보를 불러오는데 실패했습니다");
            // 초기화
            setWeatherInfoData([]);
            // 에러 발생시 더미 데이터 사용
            // setWeatherInfoData(weatherData);
        } finally {
            setWeatherLoading(false);
        }
    };

    // 모든 데이터 새로고침 함수
    const refreshAllData = async () => {
        setRefreshing(true);

        try {
            await Promise.all([
                fetchTouristInfo(),
                fetchTouristSpots(),
                fetchWeatherData(),
            ]);
        } catch (error) {
            console.error("데이터 새로고침 중 오류 발생:", error);
        } finally {
            setRefreshing(false);
        }
    };

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        fetchTouristInfo();
        fetchTouristSpots();
        fetchWeatherData();

        // 10분마다 데이터 갱신 (실시간 데이터를 위한 폴링)
        const interval = setInterval(() => {
            refreshAllData();
        }, 600000); // 10분 = 600,000ms

        // 컴포넌트 언마운트 시 인터벌 정리
        return () => clearInterval(interval);
    }, []);

    // 로딩 스켈레톤 컴포넌트
    const SpotCardSkeleton = () => (
        <div className="p-3 bg-white border rounded-lg shadow-sm animate-pulse">
            <div className="flex justify-between items-center mb-2">
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-full bg-gray-200 rounded h-3 mb-2"></div>
            <div className="mt-2 h-5 bg-gray-200 rounded w-1/3"></div>
        </div>
    );

    const WeatherCardSkeleton = () => (
        <div className="p-3 bg-white border rounded-lg shadow-sm animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded-full w-8 mx-auto mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
    );

    const TableRowSkeleton = () => (
        <div className="flex py-3 border-b animate-pulse">
            <div className="w-1/4 px-1">
                <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-1/4 px-1">
                <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-1/4 px-1">
                <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-1/4 flex justify-center">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-100 h-auto flex flex-col w-full overflow-y-auto">
            {/* Header */}
            <AdminHeader path={"/login"} />
            {/* End of Header */}

            {/* 오류 메시지 표시 */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-4 relative">
                    <strong className="font-bold">오류 발생!</strong>
                    <span className="block sm:inline"> {error}</span>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                        onClick={() => refreshAllData()}
                    >
                        재시도
                    </button>
                </div>
            )}

            {/* 새로고침 버튼 */}
            <div className="flex justify-end px-4 py-2">
                <button
                    className={`flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${refreshing ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={refreshAllData}
                    disabled={refreshing}
                >
                    {refreshing ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            새로고침 중...
                        </>
                    ) : (
                        "데이터 새로고침"
                    )}
                </button>
            </div>

            {/* Main Container*/}
            <div className="flex flex-col lg:flex-row p-2 md:p-4 space-y-4 lg:space-y-0 lg:space-x-4">
                {/* 주요 인구 혼잡 현황 섹션 - 왼쪽에 배치 (큰 화면) / 위에 배치 (작은 화면) */}
                <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md order-1">
                    <h2 className="text-lg md:text-xl p-3 font-bold text-black border-b flex justify-between items-center">
                        <span>주요 인구 혼잡 현황</span>
                        {spotsLoading && (
                            <span className="text-sm text-blue-500 font-normal flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500"
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
                                로딩 중
                            </span>
                        )}
                    </h2>
                    <div className="p-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[calc(100vh-200px)]">
                        <div
                            className="flex flex-nowrap lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3 pb-2"
                            style={{ minWidth: "max-content", width: "100%" }}
                        >
                            {spotsLoading ? (
                                // 로딩 스켈레톤
                                [...Array(5)].map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="w-60 lg:w-full flex-none"
                                    >
                                        <SpotCardSkeleton />
                                    </div>
                                ))
                            ) : touristSpotsData.length > 0 ? (
                                // 실제 데이터
                                touristSpotsData.map((spot, idx) => (
                                    <div
                                        key={idx}
                                        className="w-60 lg:w-full flex-none"
                                    >
                                        <SpotCard key={idx} {...spot} />
                                    </div>
                                ))
                            ) : (
                                // 데이터 없음
                                <div className="p-4 text-center text-gray-500">
                                    현재 혼잡 현황 데이터가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 오른쪽 컨텐츠 컨테이너 */}
                <div className="flex flex-col w-full lg:w-2/3 space-y-4 order-2">
                    {/* 날씨 정보 섹션 */}
                    <div className="w-full border-2 rounded-lg shadow-md bg-white">
                        <h2 className="text-lg md:text-xl p-3 font-bold text-black border-b flex justify-between items-center">
                            <span>날씨 정보</span>
                            {weatherLoading && (
                                <span className="text-sm text-blue-500 font-normal flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500"
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
                                    로딩 중
                                </span>
                            )}
                        </h2>
                        <div className="p-2 overflow-x-auto">
                            <div
                                className="flex flex-nowrap space-x-3 pb-2"
                                style={{ minWidth: "max-content" }}
                            >
                                {weatherLoading ? (
                                    // 로딩 스켈레톤
                                    [...Array(5)].map((_, idx) => (
                                        <div
                                            key={idx}
                                            className="w-40 flex-auto"
                                        >
                                            <WeatherCardSkeleton />
                                        </div>
                                    ))
                                ) : weatherInfoData.length > 0 ? (
                                    // 실제 데이터
                                    weatherInfoData.map((data, idx) => (
                                        <div
                                            key={idx}
                                            className="w-40 flex-auto"
                                        >
                                            <WeatherCard key={idx} {...data} />
                                        </div>
                                    ))
                                ) : (
                                    // 데이터 없음
                                    <div className="p-4 text-center text-gray-500 w-full">
                                        날씨 정보가 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 관광지 정보 테이블 */}
                    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border-2">
                        <div
                            className="flex bg-gray-100 py-2 md:py-3 border-b font-medium text-sm md:text-lg w-full"
                            style={{ minWidth: "650px" }}
                        >
                            <div
                                className="w-1/4 text-center text-black cursor-pointer"
                                onClick={() => handleSort("spotName")}
                            >
                                관광지명 {renderSortIcon("spotName")}
                            </div>
                            <div className="w-1/4 text-center text-black">
                                코드
                            </div>
                            <div className="w-1/4 text-center text-black">
                                시간
                            </div>
                            <div
                                className="w-1/4 text-center text-black cursor-pointer"
                                onClick={() => handleSort("congestion")}
                            >
                                혼잡도 {renderSortIcon("congestion")}
                            </div>
                        </div>
                        <div className="overflow-y-auto max-h-[410px]">
                            <div style={{ minWidth: "650px" }}>
                                {loading ? (
                                    // 로딩 스켈레톤
                                    [...Array(10)].map((_, idx) => (
                                        <TableRowSkeleton key={idx} />
                                    ))
                                ) : sortedTouristInfo.length > 0 ? (
                                    // 실제 데이터
                                    sortedTouristInfo.map((info, idx) => (
                                        <div
                                            key={idx}
                                            className="flex py-3 border-b hover:bg-gray-100 transition-colors text-xs md:text-base cursor-pointer"
                                            onClick={() => {
                                                // 페이지 이동 전 스크롤 위치 초기화
                                                window.scrollTo(0, 0);
                                                navigate(
                                                    `/manage/${info.spotCode}`
                                                );
                                            }}
                                        >
                                            <div className="w-1/4 text-center text-black overflow-hidden text-ellipsis px-1">
                                                {info.spotName}
                                            </div>
                                            <div className="w-1/4 text-center text-black overflow-hidden text-ellipsis px-1">
                                                {info.spotCode}
                                            </div>
                                            <div className="w-1/4 text-center text-black overflow-hidden text-ellipsis px-1">
                                                {info.timestamp}
                                            </div>
                                            <div className="w-1/4 text-center overflow-hidden flex justify-center">
                                                <CongestionTag
                                                    level={
                                                        info.participantCount
                                                    }
                                                    size="sm"
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // 데이터 없음
                                    <div className="p-4 text-center text-gray-500">
                                        관광지 정보가 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End of Main Container*/}
        </div>
    );
}
