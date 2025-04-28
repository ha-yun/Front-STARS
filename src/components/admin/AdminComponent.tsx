import { useNavigate } from "react-router-dom";
import { touristInfo, touristSpots, weatherData } from "../../data/adminData";
import { WeatherCard } from "./cards/weatherCard";
import { SpotCard } from "./cards/spotCard";
import AdminHeader from "./AdminHeader";
import CongestionTag from "./cards/CongestionTag";
import { useState } from "react";

export default function AdminComponent() {
    const navigate = useNavigate();
    const [sortField, setSortField] = useState<string>("spotName"); // 기본값: 관광지명
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // 기본값: 오름차순

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
    const sortedTouristInfo = [...touristInfo].sort((a, b) => {
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

    return (
        <div className="bg-gray-100 h-auto flex flex-col w-full overflow-y-auto">
            {/* Header */}
            <AdminHeader path={"/"} />
            {/* End of Header */}
            {/* Main Container*/}
            <div className="flex flex-col lg:flex-row p-2 md:p-4 space-y-4 lg:space-y-0 lg:space-x-4">
                {/* 주요 인구 혼잡 현황 섹션 - 왼쪽에 배치 (큰 화면) / 위에 배치 (작은 화면) */}
                <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md order-1">
                    <h2 className="text-lg md:text-xl p-3 font-bold text-black border-b">
                        주요 인구 혼잡 현황
                    </h2>
                    <div className="p-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[calc(100vh-200px)]">
                        <div
                            className="flex flex-nowrap lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3 pb-2"
                            style={{ minWidth: "max-content", width: "100%" }}
                        >
                            {touristSpots.map((spot, idx) => (
                                <div
                                    key={idx}
                                    className="w-60 lg:w-full flex-none"
                                >
                                    <SpotCard key={idx} {...spot} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 오른쪽 컨텐츠 컨테이너 */}
                <div className="flex flex-col w-full lg:w-2/3 space-y-4 order-2">
                    {/* 날씨 정보 섹션 */}
                    <div className="w-full border-2 rounded-lg shadow-md bg-white">
                        <h2 className="text-lg md:text-xl p-3 font-bold text-black border-b">
                            날씨 정보
                        </h2>
                        <div className="p-2 overflow-x-auto">
                            <div
                                className="flex flex-nowrap space-x-3 pb-2"
                                style={{ minWidth: "max-content" }}
                            >
                                {weatherData.map((data, idx) => (
                                    <div key={idx} className="w-40 flex-auto">
                                        <WeatherCard key={idx} {...data} />
                                    </div>
                                ))}
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
                                {sortedTouristInfo.map((info, idx) => (
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
                                                level={info.participantCount}
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End of Main Container*/}
        </div>
    );
}
