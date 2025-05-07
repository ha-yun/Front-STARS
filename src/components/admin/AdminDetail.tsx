import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PieCard from "./cards/PieCard";
import SimpleInfoCard from "./cards/SimpleInfoCard";
import AreaPopulationCard from "./cards/AreaPopulationCard";
import PopulationRateCard from "./cards/PopulationRateCard";
import ForecastPopulationCard from "./cards/ForecastPopulationCard";
import {
    ForecastPopulation,
    dummyData,
    Data,
    PopulationResponse,
} from "../../data/adminData";
import RodeCard from "./cards/RodeCard";
import AdminHeader from "./AdminHeader";

// API 응답 타입 정의, 더미 API용
interface ApiResponse {
    success: boolean;
    message: string;
    data: PopulationResponse;
}

const AdminDetail = () => {
    // URL 파라미터에서 spotCode 가져오기
    const { spotCode } = useParams<{ spotCode: string }>();

    // 상태 관리
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // 데이터 상태
    const [areaData, setAreaData] = useState<PopulationResponse | null>(null);
    const [gender, setGender] = useState<Data[]>([]);
    const [resnt, setResnt] = useState<Data[]>([]);
    const [ppltnRate, setPpltnRate] = useState<Data[]>([]);
    const [forecastData, setForecastData] = useState<ForecastPopulation[]>([]);

    console.log("Current spotCode:", spotCode);

    // 모의 API 함수 - Promise 반환
    const mockApiCall = (code: string): Promise<ApiResponse> => {
        // 나중에 실제 API로 변경해야함
        return new Promise((resolve, reject) => {
            // 실제 API 통신을 시뮬레이션하기 위한 타임아웃
            setTimeout(() => {
                // 50% 확률로 성공, 50% 확률로 실패 (테스트 목적)
                const shouldSucceed = Math.random() < 0.5;

                if (shouldSucceed) {
                    // 성공 시 더미 데이터 반환 (실제로는 API에서 받은 데이터)
                    // 코드에 따라 다른 데이터를 반환하도록 할 수 있음
                    let responseData = dummyData;

                    // 특정 spotCode에 대해 다른 값 반환 (선택 사항)
                    if (code === "POI001") {
                        // 강남역 데이터 - 더 붐비는 데이터로 수정
                        responseData = {
                            ...dummyData,
                            ppltn_data: {
                                ...dummyData.ppltn_data,
                                area_nm: "강남역",
                                area_cd: "POI001",
                                area_congest_lvl: "붐빔",
                                area_ppltn_min: 60000,
                                area_ppltn_max: 65000,
                            },
                        };
                    } else if (code === "POI031") {
                        // 반포 한강공원 데이터
                        responseData = {
                            ...dummyData,
                            ppltn_data: {
                                ...dummyData.ppltn_data,
                                area_nm: "반포 한강공원",
                                area_cd: "POI031",
                                area_congest_lvl: "원활",
                                area_ppltn_min: 20000,
                                area_ppltn_max: 25000,
                            },
                        };
                    }

                    resolve({
                        success: true,
                        message: "데이터를 성공적으로 가져왔습니다.",
                        data: responseData,
                    });
                } else {
                    // 실패 시 에러 반환 (실제 API 에러 시뮬레이션)
                    reject(new Error("API 요청 중 오류가 발생했습니다."));
                }
            }, 500); // 1초 지연으로 로딩 상태 시뮬레이션
        });
    };

    // 데이터 가져오기 함수
    const fetchAreaData = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            // 모의 API 호출
            const response = await mockApiCall(spotCode || "");

            // 호출 성공시 데이터 파싱
            if (response.success) {
                setAreaData(response.data);
                processChartData(response.data);
                setLastUpdated(new Date());
            } else {
                throw new Error(response.message || "데이터 가져오기 실패");
            }
        } catch (err) {
            console.error("Error fetching area data:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "알 수 없는 오류가 발생했습니다."
            );

            // 첫 로드 시 오류인 경우에만 더미 데이터 사용 (개발 중에만)
            // if (!isRefresh && !areaData) {
            //     setAreaData(dummyData);
            //     processChartData(dummyData);
            //     setLastUpdated(new Date());
            // }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // 차트 데이터 가공 함수
    const processChartData = (data: PopulationResponse) => {
        const ppltnData = data.ppltn_data;

        // 성별 비율 파싱
        setGender([
            {
                name: "남자",
                value: ppltnData.male_ppltn_rate,
                fill: "#EB6927",
            },
            {
                name: "여자",
                value: ppltnData.female_ppltn_rate,
                fill: "#2D8CFF",
            },
        ]);

        // 거주, 비거주 비율 파싱
        setResnt([
            {
                name: "거주자",
                value: ppltnData.resnt_ppltn_rate,
                fill: "#7f22fe",
            },
            {
                name: "비거주자",
                value: ppltnData.non_resnt_ppltn_rate,
                fill: "#00a63e",
            },
        ]);

        // 연령별 분포 파싱
        setPpltnRate([
            {
                name: "10대>",
                value: ppltnData.ppltn_rate_0,
                fill: "#EB6927",
            },
            {
                name: "10대",
                value: ppltnData.ppltn_rate_10,
                fill: "#EB6927",
            },
            {
                name: "20대",
                value: ppltnData.ppltn_rate_20,
                fill: "#EB6927",
            },
            {
                name: "30대",
                value: ppltnData.ppltn_rate_30,
                fill: "#EB6927",
            },
            {
                name: "40대",
                value: ppltnData.ppltn_rate_40,
                fill: "#EB6927",
            },
            {
                name: "50대",
                value: ppltnData.ppltn_rate_50,
                fill: "#EB6927",
            },
            {
                name: "60대",
                value: ppltnData.ppltn_rate_60,
                fill: "#EB6927",
            },
            {
                name: "<70대",
                value: ppltnData.ppltn_rate_70,
                fill: "#EB6927",
            },
        ]);

        // 24시간 인구 추이 예측 파싱
        if (
            ppltnData.fcst_ppltn_wrapper &&
            ppltnData.fcst_ppltn_wrapper.fcst_ppltn
        ) {
            const forecastChartData =
                ppltnData.fcst_ppltn_wrapper.fcst_ppltn.map((item) => {
                    // 시간 포맷팅 (2025-04-18 17:00 -> 17:00)
                    const timeString = item.fcst_time.split(" ")[1];

                    return {
                        fcst_time: timeString,
                        fcst_ppltn_min: item.fcst_ppltn_min,
                        fcst_ppltn_max: item.fcst_ppltn_max,
                        fcst_congest_lvl: item.fcst_congest_lvl,
                    };
                });
            setForecastData(forecastChartData);
        }
    };

    // 첫 로드 시 데이터 가져오기 및 자동 새로고침 설정
    useEffect(() => {
        if (spotCode) {
            fetchAreaData(false);

            // 1분마다 데이터 자동 갱신 (60000ms)
            const refreshInterval = setInterval(() => {
                fetchAreaData(true);
            }, 60000);

            // 컴포넌트 언마운트 시 interval 정리
            return () => clearInterval(refreshInterval);
        }
    }, [spotCode]);

    // 수동 새로고침 핸들러
    const handleRefresh = () => {
        fetchAreaData(true);
    };

    // 로딩 스피너 컴포넌트
    const LoadingSpinner = ({ message = "데이터를 불러오는 중..." }) => (
        <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
        </div>
    );

    // 에러 메시지 컴포넌트
    const ErrorMessage = ({
        message,
        onRetry,
    }: {
        message: string;
        onRetry?: () => void;
    }) => (
        <div className="text-center p-6 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">오류 발생</h2>
            <p className="text-gray-700 mb-6">{message}</p>
            {onRetry && (
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={onRetry}
                >
                    다시 시도
                </button>
            )}
        </div>
    );

    // 업데이트 인디케이터 컴포넌트
    const UpdateIndicator = () => {
        // 시간 포맷팅 함수
        const formatTime = (date: Date) => {
            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        };

        return (
            <div className="flex items-center justify-end mb-4 text-sm text-gray-600">
                {lastUpdated && (
                    <span className="mr-2">
                        마지막 업데이트: {formatTime(lastUpdated)}
                    </span>
                )}
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center bg-white border-gray-400 text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M23 4v6h-6"></path>
                        <path d="M1 20v-6h6"></path>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                        <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
                    </svg>
                    {refreshing ? "새로고침 중..." : "새로고침"}
                </button>
            </div>
        );
    };

    // 로딩 UI
    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen flex flex-col w-full">
                <AdminHeader path={"/manage"} />
                <div className="flex-grow flex items-center justify-center">
                    <LoadingSpinner message="지역 데이터를 불러오는 중..." />
                </div>
            </div>
        );
    }

    // 에러 UI
    if (error && !areaData) {
        return (
            <div className="bg-gray-100 min-h-screen flex flex-col w-full">
                <AdminHeader path={"/manage"} />
                <div className="flex-grow flex items-center justify-center">
                    <ErrorMessage
                        message={error}
                        onRetry={() => fetchAreaData(false)}
                    />
                </div>
            </div>
        );
    }

    // 데이터가 없는 경우
    if (!areaData || !areaData.ppltn_data) {
        return (
            <div className="bg-gray-100 min-h-screen flex flex-col w-full">
                <AdminHeader path={"/manage"} />
                <div className="flex-grow flex items-center justify-center">
                    <ErrorMessage
                        message="데이터를 찾을 수 없습니다"
                        onRetry={() => fetchAreaData(false)}
                    />
                </div>
            </div>
        );
    }

    // 메인 UI
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col w-full">
            {/* Header */}
            <AdminHeader path={"/manage"} />
            {/* End of Header */}

            {/* Main Container - 반응형 그리드 사용 */}
            <div className="p-6 flex-grow">
                {/* 업데이트 인디케이터 */}
                <UpdateIndicator />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 grid-rows-[0.7fr_1fr_1fr]">
                    {/* SimpleInfoCard */}
                    <SimpleInfoCard
                        info={{
                            area_name: areaData.ppltn_data.area_nm,
                            area_code: areaData.ppltn_data.area_cd,
                            area_congest_lvl:
                                areaData.ppltn_data.area_congest_lvl,
                        }}
                    />

                    {/* AreaPopulationCard */}
                    <AreaPopulationCard
                        population={{
                            area_ppltn_min: areaData.ppltn_data.area_ppltn_min,
                            area_ppltn_max: areaData.ppltn_data.area_ppltn_max,
                        }}
                    />

                    {/* RodeCard */}
                    <RodeCard />

                    {/* 성별 비율 PieCard */}
                    <PieCard datas={gender} name="남여 비율" />

                    {/* 연령대별 분포 */}
                    <PopulationRateCard population={ppltnRate} />

                    {/* 거주자 비율 PieCard */}
                    <PieCard datas={resnt} name="거주자 비율" />

                    {/* 인구 예측 차트 */}
                    {forecastData.length > 0 && (
                        <ForecastPopulationCard fcst_ppltn={forecastData} />
                    )}
                </div>
            </div>
            {/* End of Main Container */}
        </div>
    );
};

export default AdminDetail;
