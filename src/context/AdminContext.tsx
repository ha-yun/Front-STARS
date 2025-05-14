// src/context/AdminDataContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import {
    subscribeCongestionUpdate,
    subscribeCongestionAlert,
    subscribeWeatherUpdate,
    subscribeTrafficUpdate,
    subscribeParkUpdate,
} from "../api/starsApi";
import {
    PopulationData,
    TouristSpot,
    WeatherResponse,
    WeatherCardType,
} from "../data/adminData";

// 컨텍스트에서 제공할 데이터 타입 정의
interface AdminDataContextType {
    touristInfoData: PopulationData[];
    touristSpotsData: TouristSpot[];
    weatherInfoData: WeatherCardType[];
    isLoading: boolean;
    spotsLoading: boolean;
    weatherLoading: boolean;
    error: string | null;
    refreshAllData: () => Promise<void>;
    refreshing: boolean;
}

// 기본값으로 사용할 컨텍스트 생성
const AdminDataContext = createContext<AdminDataContextType | undefined>(
    undefined
);

// 컨텍스트 제공자 Props 타입 정의
interface AdminDataProviderProps {
    children: ReactNode;
    test?: boolean; // 테스트 모드 여부 (더미 데이터 사용 시)
}

// 컨텍스트 제공자 컴포넌트
export const AdminDataProvider: React.FC<AdminDataProviderProps> = ({
    children,
    test = false,
}) => {
    // 데이터 상태 및 로딩 상태
    const [touristInfoData, setTouristInfoData] = useState<PopulationData[]>(
        []
    );
    const [touristSpotsData, setTouristSpotsData] = useState<TouristSpot[]>([]);
    const [weatherInfoData, setWeatherInfoData] = useState<WeatherCardType[]>(
        []
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [spotsLoading, setSpotsLoading] = useState<boolean>(true);
    const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    // SSE 이벤트 소스 저장을 위한 refs
    const eventSources = React.useRef<{
        congestionUpdate?: EventSource;
        congestionAlert?: EventSource;
        weatherUpdate?: EventSource;
        trafficUpdate?: EventSource;
        parkUpdate?: EventSource;
    }>({});

    // 혼잡도 레벨과 스카이 상태에 따른 아이콘/색상 반환 함수
    const getDustLevelText = (value: number): string => {
        if (value <= 15) return "좋음";
        if (value <= 35) return "보통";
        if (value <= 75) return "나쁨";
        return "매우나쁨";
    };

    // 관광지 정보 데이터 로드 함수
    const fetchTouristInfo = async () => {
        setLoading(true);
        setError(null);

        try {
            // 테스트 모드가 아닐 때 실제 SSE 연결
            if (!test) {
                // 기존 이벤트 소스가 있다면 닫기
                if (eventSources.current.congestionUpdate) {
                    eventSources.current.congestionUpdate.close();
                }

                // 새 이벤트 소스 생성
                const event: EventSource = subscribeCongestionUpdate((data) => {
                    // for debug
                    // console.log(
                    //     "subscribeCongestionUpdate event received:",
                    //     data
                    // );
                    const updateData = data as unknown as PopulationData[];

                    // for debug
                    // console.log("updateData", updateData);

                    setTouristInfoData(updateData);
                    if (error) {
                        setError(null);
                    }
                });

                // 이벤트 소스 저장
                eventSources.current.congestionUpdate = event;
            }
        } catch (err) {
            console.error("Failed to fetch tourist info:", err);
            setError("정보를 불러오는데 실패했습니다.");
            setTouristInfoData([]);
        } finally {
            setLoading(false);
        }
    };

    // 혼잡 현황 데이터 로드 함수
    const fetchTouristSpots = async () => {
        setSpotsLoading(true);

        try {
            if (!test) {
                // 기존 이벤트 소스가 있다면 닫기
                if (eventSources.current.congestionAlert) {
                    eventSources.current.congestionAlert.close();
                }

                // 새 이벤트 소스 생성
                const event: EventSource = subscribeCongestionAlert(
                    (data): void => {
                        // for Debug
                        // console.log("subscribeCongestionAlert event:", data);

                        console.log("혼잡 데이터 도착");

                        // 데이터 타입 변환 및 처리
                        setTouristSpotsData(data as unknown as TouristSpot[]);

                        if (error) {
                            setError(null);
                        }
                    }
                );

                // 이벤트 소스 저장
                eventSources.current.congestionAlert = event;
            }
        } catch (err) {
            console.error("Failed to fetch tourist spots:", err);
            setError("정보를 불러오는데 실패했습니다");
            setTouristSpotsData([]);
        } finally {
            setSpotsLoading(false);
        }
    };

    // 날씨 정보 데이터 로드 함수
    const fetchWeatherData = async () => {
        setWeatherLoading(true);
        setError(null);

        try {
            if (!test) {
                // 기존 이벤트 소스가 있다면 닫기
                if (eventSources.current.weatherUpdate) {
                    eventSources.current.weatherUpdate.close();
                }

                // 새 이벤트 소스 생성
                const event = subscribeWeatherUpdate((data) => {
                    try {
                        console.log("subscribeWeatherUpdate event", data);

                        if (typeof data === "object" && data !== null) {
                            // 데이터를 WeatherResponse 타입으로 처리
                            const weatherResponse =
                                data as unknown as WeatherResponse;

                            if (
                                weatherResponse.data &&
                                weatherResponse.data.length > 0
                            ) {
                                // API 응답을 WeatherCardType 형식으로 변환
                                const transformedData: WeatherCardType[] =
                                    weatherResponse.data.map((item) => {
                                        // weather_time에서 날짜와 시간 추출
                                        const dateTime = new Date(
                                            item.weather_time
                                        );
                                        const formattedDate = `${String(dateTime.getMonth() + 1).padStart(2, "0")}-${String(dateTime.getDate()).padStart(2, "0")}`;
                                        const formattedHour = `${String(dateTime.getHours()).padStart(2, "0")}:${String(dateTime.getMinutes()).padStart(2, "0")}`;

                                        // 현재 일기 예보의 하늘 상태에 따라 날씨 아이콘 결정
                                        let weatherIcon = "☀️"; // 기본값: 맑음
                                        let currentSkyStatus = "맑음";

                                        if (
                                            item.fcst24hours &&
                                            item.fcst24hours.length > 0
                                        ) {
                                            currentSkyStatus =
                                                item.fcst24hours[0]
                                                    ?.pre_sky_stts || "맑음";

                                            if (
                                                currentSkyStatus.includes(
                                                    "맑음"
                                                )
                                            ) {
                                                weatherIcon = "☀️";
                                            } else if (
                                                currentSkyStatus.includes(
                                                    "구름"
                                                )
                                            ) {
                                                weatherIcon =
                                                    currentSkyStatus.includes(
                                                        "많음"
                                                    )
                                                        ? "☁️"
                                                        : "🌤️";
                                            } else if (
                                                currentSkyStatus.includes("비")
                                            ) {
                                                weatherIcon = "🌧️";
                                            } else if (
                                                currentSkyStatus.includes("눈")
                                            ) {
                                                weatherIcon = "❄️";
                                            }
                                        }

                                        // 미세먼지 수준 결정
                                        const fineDustLevel = getDustLevelText(
                                            item.pm10
                                        );
                                        const ultraFineDustLevel =
                                            getDustLevelText(item.pm25);

                                        return {
                                            date: formattedDate,
                                            hour: formattedHour,
                                            status: currentSkyStatus,
                                            icon: weatherIcon,
                                            temperature: `${item.temp}°C`,
                                            maxTemp: `${item.max_temp}°C`,
                                            minTemp: `${item.min_temp}°C`,
                                            sensibleTemp: `${item.sensible_temp}°C`,
                                            precipitation: item.precipitation,
                                            precipitationType: item.precpt_type,
                                            precipitationMessage: item.pcp_msg,
                                            areaName: item.area_nm,
                                            dust: {
                                                fineDust: fineDustLevel,
                                                ultraFineDust:
                                                    ultraFineDustLevel,
                                            },
                                            forecast: item.fcst24hours,
                                        };
                                    });

                                // 변환된 데이터로 상태 업데이트
                                setWeatherInfoData(transformedData);

                                // 유효한 데이터를 가져왔으면 오류 초기화
                                if (error) {
                                    setError(null);
                                }
                            }
                        }
                    } catch (err) {
                        console.error("날씨 데이터 처리 중 오류:", err);
                    }
                });

                // 이벤트 소스 저장
                eventSources.current.weatherUpdate = event;
            }
        } catch (err) {
            console.error("날씨 데이터 가져오기 실패:", err);
            setError("날씨 정보를 불러오는데 실패했습니다");
            setWeatherInfoData([]);
        } finally {
            setWeatherLoading(false);
        }
    };

    // 트래픽 정보 구독 설정
    const setupTrafficUpdate = () => {
        if (!test) {
            // 기존 이벤트 소스가 있다면 닫기
            if (eventSources.current.trafficUpdate) {
                eventSources.current.trafficUpdate.close();
            }

            // 새 이벤트 소스 생성
            const event = subscribeTrafficUpdate((data) => {
                console.log("Traffic data update received:", data);
                // 필요한 상태 업데이트 로직 추가
            });

            // 이벤트 소스 저장
            eventSources.current.trafficUpdate = event;
        }
    };

    // 주차 정보 구독 설정
    const setupParkUpdate = () => {
        if (!test) {
            // 기존 이벤트 소스가 있다면 닫기
            if (eventSources.current.parkUpdate) {
                eventSources.current.parkUpdate.close();
            }

            // 새 이벤트 소스 생성
            const event = subscribeParkUpdate((data) => {
                console.log("Park data update received:", data);
                // 필요한 상태 업데이트 로직 추가
            });

            // 이벤트 소스 저장
            eventSources.current.parkUpdate = event;
        }
    };

    // 모든 데이터 새로고침 함수
    // 새로고침을 하면 SSE 연결을 새로하는 문제가 있음

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

    // 컴포넌트 마운트 시 데이터 로드 및 이벤트 소스 설정
    useEffect(() => {
        fetchTouristInfo();
        fetchTouristSpots();
        fetchWeatherData();
        setupTrafficUpdate();
        setupParkUpdate();

        // 정기적인 새로고침 설정 (10분)
        const interval = setInterval(() => {
            refreshAllData();
        }, 600000); // 10분 = 600,000ms

        // 컴포넌트 언마운트 시 정리
        return () => {
            clearInterval(interval);

            // 모든 이벤트 소스 닫기
            Object.values(eventSources.current).forEach((source) => {
                if (source) source.close();
            });
        };
    }, []);

    // 컨텍스트 값
    const contextValue: AdminDataContextType = {
        touristInfoData,
        touristSpotsData,
        weatherInfoData,
        isLoading: loading,
        spotsLoading,
        weatherLoading,
        error,
        refreshAllData,
        refreshing,
    };

    return (
        <AdminDataContext.Provider value={contextValue}>
            {children}
        </AdminDataContext.Provider>
    );
};

// 컨텍스트 사용을 위한 훅
export const useAdminData = (): AdminDataContextType => {
    const context = useContext(AdminDataContext);
    if (context === undefined) {
        throw new Error("useAdminData must be used within a AdminDataProvider");
    }
    return context;
};
