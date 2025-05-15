// src/context/AdminDataContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useMemo,
} from "react";
import {
    subscribeCongestionUpdate,
    subscribeCongestionAlert,
    subscribeWeatherUpdate,
    subscribeTrafficUpdate,
    subscribeParkUpdate,
    subscribeAccidentUpdate,
} from "../api/starsApi";
import {
    PopulationData,
    TouristSpot,
    WeatherData,
    ParkInfo,
    CombinedAreaData,
    AccidentData,
} from "../data/adminData";
// test용 더미데이터, SSE 통신은 고려하지 않음
import { dummyTouristData } from "../data/dummy/population";
import { dummyWeatherData } from "../data/dummy/weather";
import { dummyAccidentData } from "../data/dummy/accident";

// 컨텍스트에서 제공할 데이터 타입 정의
interface AdminDataContextType {
    touristInfoData: PopulationData[];
    touristSpotsData: TouristSpot[];
    weatherInfoData: WeatherData[];
    parkData: ParkInfo[];
    accidentData: AccidentData[];
    combinedAreaData: CombinedAreaData[];
    findAreaData: (areaId: number) => CombinedAreaData | undefined;
    isLoading: boolean;
    spotsLoading: boolean;
    weatherLoading: boolean;
    error: string | null;
    refreshAllData: () => Promise<void>; // 새로고침, 근데 이걸 넘길 필요가 있나?
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
    const [weatherInfoData, setWeatherInfoData] = useState<WeatherData[]>([]);
    const [parkData, setParkData] = useState<ParkInfo[]>([]);
    const [accidentData, setAccidentData] = useState<AccidentData[]>([]);
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
        accidentUpdate?: EventSource;
    }>({});

    // 지역 ID로 통합 데이터 조회 함수
    const findAreaData = (area_id: number): CombinedAreaData | undefined => {
        return combinedAreaData.find((data) => data.area_id === area_id);
    };

    // 기존에는 area_cd를 이용해서 관리하고 있었는데
    // weather과 통합하기 위해서 area_id를 사용하는 구조로 변경해야함
    const combinedAreaData = useMemo<CombinedAreaData[]>(() => {
        // area_id를 기준으로 인구 데이터와 날씨 데이터 병합
        const combinedMap = new Map<number, CombinedAreaData>();

        // 인구 데이터 처리
        touristInfoData.forEach((populationData) => {
            const areaId = populationData.area_id;

            if (!combinedMap.has(areaId)) {
                combinedMap.set(areaId, {
                    area_id: areaId,
                    area_nm: populationData.area_nm,
                    population: null,
                    weather: null,
                });
            }

            const entry = combinedMap.get(areaId)!;
            entry.population = {
                area_id: 0,
                area_nm: "",
                fcst_yn: "",
                get_time: 0,
                replace_yn: "",
                area_cd: populationData.area_cd,
                area_congest_lvl: populationData.area_congest_lvl,
                area_congest_msg: populationData.area_congest_msg,
                area_ppltn_min: populationData.area_ppltn_min,
                area_ppltn_max: populationData.area_ppltn_max,
                male_ppltn_rate: populationData.male_ppltn_rate,
                female_ppltn_rate: populationData.female_ppltn_rate,
                resnt_ppltn_rate: populationData.resnt_ppltn_rate,
                non_resnt_ppltn_rate: populationData.non_resnt_ppltn_rate,
                ppltn_rates: populationData.ppltn_rates,
                ppltn_time: populationData.ppltn_time,
                fcst_ppltn: populationData.fcst_ppltn,
            };
        });

        // 날씨 데이터 처리
        weatherInfoData.forEach((weatherItem) => {
            const areaId = weatherItem.area_id;

            if (!combinedMap.has(areaId)) {
                combinedMap.set(areaId, {
                    area_id: areaId,
                    area_nm: weatherItem.area_nm,
                    population: null,
                    weather: null,
                });
            }

            const entry = combinedMap.get(areaId)!;
            entry.weather = {
                area_id: 0,
                area_nm: "",
                get_time: 0,
                temp: weatherItem.temp,
                max_temp: weatherItem.max_temp,
                min_temp: weatherItem.min_temp,
                sensible_temp: weatherItem.sensible_temp,
                precipitation: weatherItem.precipitation,
                precpt_type: weatherItem.precpt_type,
                pcp_msg: weatherItem.pcp_msg,
                pm10: weatherItem.pm10,
                pm25: weatherItem.pm25,
                weather_time: weatherItem.weather_time,
                fcst24hours: weatherItem.fcst24hours,
            };
        });

        return Array.from(combinedMap.values());
    }, [touristInfoData, weatherInfoData]);

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
                    console.log("updateData", updateData);

                    setTouristInfoData(updateData);
                    if (error) {
                        setError(null);
                    }
                });

                // 이벤트 소스 저장
                eventSources.current.congestionUpdate = event;
            } else {
                setTouristInfoData(dummyTouristData);
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
                    console.log("도착한 날씨데이터: ", data);
                    setWeatherInfoData(data as unknown as WeatherData[]);
                });

                // 이벤트 소스 저장
                eventSources.current.weatherUpdate = event;
            } else {
                // 더미데이터로 교체
                setWeatherInfoData(dummyWeatherData);
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
    const fetchTrafficUpdate = () => {
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
    const fetchParkUpdate = () => {
        if (!test) {
            // 기존 이벤트 소스가 있다면 닫기
            if (eventSources.current.parkUpdate) {
                eventSources.current.parkUpdate.close();
            }

            // 새 이벤트 소스 생성
            const event = subscribeParkUpdate((data) => {
                // 필요한 상태 업데이트 로직 추가
                setParkData(data as unknown as ParkInfo[]);
            });

            // 이벤트 소스 저장
            eventSources.current.parkUpdate = event;
        }
    };

    const fetchAccidentUpdate = () => {
        if (!test) {
            if (eventSources.current.accidentUpdate) {
                eventSources.current.accidentUpdate.close();
            }
            const event = subscribeAccidentUpdate((data) => {
                setAccidentData(data as unknown as AccidentData[]);
            });

            eventSources.current.accidentUpdate = event;
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
        fetchTrafficUpdate();
        fetchParkUpdate();
        fetchAccidentUpdate();

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
        parkData,
        accidentData,
        combinedAreaData,
        findAreaData,
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
