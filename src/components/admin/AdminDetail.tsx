import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PieCard from "./cards/PieCard";
import SimpleInfoCard from "./cards/SimpleInfoCard";
import AreaPopulationCard from "./cards/AreaPopulationCard";
import PopulationRateCard from "./cards/PopulationRateCard";
import ForecastPopulationCard from "./cards/ForecastPopulationCard";
import RodeCard from "./cards/RodeCard";
import AdminHeader from "./AdminHeader";

// 예측 인구 데이터 인터페이스
interface ForecastPopulation {
    fcst_time: string; // 예측 시간
    fcst_congest_lvl: string; // 예측 혼잡도 수준
    fcst_ppltn_min: number; // 예측 최소 인구
    fcst_ppltn_max: number; // 예측 최대 인구
}

// 예측 인구 데이터 래퍼 인터페이스
interface ForecastPopulationWrapper {
    fcst_ppltn: ForecastPopulation[]; // 예측 인구 데이터 배열
}

interface PopulationData {
    area_nm: string; // 지역명
    area_cd: string; // 지역 코드
    area_congest_lvl: string; // 지역 혼잡도 수준
    area_congest_msg: string; // 지역 혼잡도 메시지
    area_ppltn_min: number; // 지역 최소 인구
    area_ppltn_max: number; // 지역 최대 인구
    male_ppltn_rate: number; // 남성 인구 비율
    female_ppltn_rate: number; // 여성 인구 비율
    ppltn_rate_0: number; // 0-9세 인구 비율
    ppltn_rate_10: number; // 10-19세 인구 비율
    ppltn_rate_20: number; // 20-29세 인구 비율
    ppltn_rate_30: number; // 30-39세 인구 비율
    ppltn_rate_40: number; // 40-49세 인구 비율
    ppltn_rate_50: number; // 50-59세 인구 비율
    ppltn_rate_60: number; // 60-69세 인구 비율
    ppltn_rate_70: number; // 70세 이상 인구 비율
    resnt_ppltn_rate: number; // 거주 인구 비율
    non_resnt_ppltn_rate: number; // 비거주 인구 비율
    replace_yn: string; // 대체 여부
    ppltn_time: string; // 인구 데이터 시간
    fcst_yn: string; // 예측 여부
    fcst_ppltn_wrapper: ForecastPopulationWrapper; // 예측 인구 데이터 래퍼
}

// 전체 데이터 구조 인터페이스
interface PopulationResponse {
    ppltn_data: PopulationData; // 인구 데이터
}

interface Data {
    name: string;
    value: number;
    fill: string;
}

// 더미 데이터 생성
const dummyData: PopulationResponse = {
    ppltn_data: {
        area_nm: "광화문·덕수궁",
        area_cd: "POI009",
        area_congest_lvl: "보통",
        area_congest_msg:
            "사람이 몰려있을 수 있지만 크게 붐비지는 않아요. 도보 이동에 큰 제약이 없어요.",
        area_ppltn_min: 40000,
        area_ppltn_max: 43000,
        male_ppltn_rate: 48.1,
        female_ppltn_rate: 51.9,
        ppltn_rate_0: 0.1,
        ppltn_rate_10: 2.5,
        ppltn_rate_20: 16.4,
        ppltn_rate_30: 24.1,
        ppltn_rate_40: 26.5,
        ppltn_rate_50: 18.8,
        ppltn_rate_60: 8.0,
        ppltn_rate_70: 3.6,
        resnt_ppltn_rate: 29.6,
        non_resnt_ppltn_rate: 70.4,
        replace_yn: "N",
        ppltn_time: "2025-04-18 16:05",
        fcst_yn: "Y",
        fcst_ppltn_wrapper: {
            fcst_ppltn: [
                {
                    fcst_time: "2025-04-18 00:00",
                    fcst_congest_lvl: "원활",
                    fcst_ppltn_min: 18000,
                    fcst_ppltn_max: 20000,
                },
                {
                    fcst_time: "2025-04-18 01:00",
                    fcst_congest_lvl: "원활",
                    fcst_ppltn_min: 14000,
                    fcst_ppltn_max: 16000,
                },
                {
                    fcst_time: "2025-04-18 02:00",
                    fcst_congest_lvl: "원활",
                    fcst_ppltn_min: 10000,
                    fcst_ppltn_max: 12000,
                },
                {
                    fcst_time: "2025-04-18 03:00",
                    fcst_congest_lvl: "원활",
                    fcst_ppltn_min: 8000,
                    fcst_ppltn_max: 10000,
                },
                {
                    fcst_time: "2025-04-18 04:00",
                    fcst_congest_lvl: "원활",
                    fcst_ppltn_min: 6000,
                    fcst_ppltn_max: 8000,
                },
                {
                    fcst_time: "2025-04-18 05:00",
                    fcst_congest_lvl: "원활",
                    fcst_ppltn_min: 10000,
                    fcst_ppltn_max: 12000,
                },
                {
                    fcst_time: "2025-04-18 06:00",
                    fcst_congest_lvl: "원활",
                    fcst_ppltn_min: 15000,
                    fcst_ppltn_max: 17000,
                },
                {
                    fcst_time: "2025-04-18 07:00",
                    fcst_congest_lvl: "보통",
                    fcst_ppltn_min: 22000,
                    fcst_ppltn_max: 24000,
                },
                {
                    fcst_time: "2025-04-18 08:00",
                    fcst_congest_lvl: "보통",
                    fcst_ppltn_min: 28000,
                    fcst_ppltn_max: 30000,
                },
                {
                    fcst_time: "2025-04-18 09:00",
                    fcst_congest_lvl: "약간 붐빔",
                    fcst_ppltn_min: 32000,
                    fcst_ppltn_max: 34000,
                },
                {
                    fcst_time: "2025-04-18 10:00",
                    fcst_congest_lvl: "약간 붐빔",
                    fcst_ppltn_min: 36000,
                    fcst_ppltn_max: 38000,
                },
                {
                    fcst_time: "2025-04-18 11:00",
                    fcst_congest_lvl: "붐빔",
                    fcst_ppltn_min: 40000,
                    fcst_ppltn_max: 42000,
                },
                {
                    fcst_time: "2025-04-18 12:00",
                    fcst_congest_lvl: "붐빔",
                    fcst_ppltn_min: 44000,
                    fcst_ppltn_max: 46000,
                },
                {
                    fcst_time: "2025-04-18 13:00",
                    fcst_congest_lvl: "붐빔",
                    fcst_ppltn_min: 46000,
                    fcst_ppltn_max: 48000,
                },
                {
                    fcst_time: "2025-04-18 14:00",
                    fcst_congest_lvl: "붐빔",
                    fcst_ppltn_min: 45000,
                    fcst_ppltn_max: 47000,
                },
                {
                    fcst_time: "2025-04-18 15:00",
                    fcst_congest_lvl: "약간 붐빔",
                    fcst_ppltn_min: 42000,
                    fcst_ppltn_max: 44000,
                },
                {
                    fcst_time: "2025-04-18 16:00",
                    fcst_congest_lvl: "약간 붐빔",
                    fcst_ppltn_min: 40000,
                    fcst_ppltn_max: 42000,
                },
                {
                    fcst_time: "2025-04-18 17:00",
                    fcst_congest_lvl: "약간 붐빔",
                    fcst_ppltn_min: 38000,
                    fcst_ppltn_max: 40000,
                },
                {
                    fcst_time: "2025-04-18 18:00",
                    fcst_congest_lvl: "약간 붐빔",
                    fcst_ppltn_min: 36000,
                    fcst_ppltn_max: 38000,
                },
                {
                    fcst_time: "2025-04-18 19:00",
                    fcst_congest_lvl: "약간 붐빔",
                    fcst_ppltn_min: 36000,
                    fcst_ppltn_max: 38000,
                },
                {
                    fcst_time: "2025-04-18 20:00",
                    fcst_congest_lvl: "보통",
                    fcst_ppltn_min: 34000,
                    fcst_ppltn_max: 36000,
                },
                {
                    fcst_time: "2025-04-18 21:00",
                    fcst_congest_lvl: "보통",
                    fcst_ppltn_min: 32000,
                    fcst_ppltn_max: 34000,
                },
                {
                    fcst_time: "2025-04-18 22:00",
                    fcst_congest_lvl: "원활",
                    fcst_ppltn_min: 28000,
                    fcst_ppltn_max: 30000,
                },
                {
                    fcst_time: "2025-04-18 23:00",
                    fcst_congest_lvl: "원활",
                    fcst_ppltn_min: 24000,
                    fcst_ppltn_max: 26000,
                },
            ],
        },
    },
};

const AdminDetail = () => {
    // const navigate = useNavigate();
    // spotCode별로 API를 불러와야 하는데 아직 없어서 그러지 못하는중
    const { spotCode } = useParams<{ spotCode: string }>();

    const [gender, setGender] = useState<Data[]>([]);
    const [resnt, setResnt] = useState<Data[]>([]);
    const [ppltnRate, setPpltnRate] = useState<Data[]>([]);
    const [forecastData, setForecastData] = useState<ForecastPopulation[]>([]);

    // 데이터 전처리
    useEffect(() => {
        // 성별 비율 파싱 -> Data
        // name(category), male/female_ppltn_rate
        setGender([
            {
                name: "남자",
                value: dummyData.ppltn_data.male_ppltn_rate,
                fill: "#EB6927",
            },
            {
                name: "여자",
                value: dummyData.ppltn_data.female_ppltn_rate,
                fill: "#2D8CFF",
            },
        ]);

        // 거주, 비거주 비율 파싱 -> Data
        // name(category), (non)_resnt_ppltn_rate
        setResnt([
            {
                name: "거주자",
                value: dummyData.ppltn_data.resnt_ppltn_rate,
                fill: "#7f22fe",
            },
            {
                name: "비거주자",
                value: dummyData.ppltn_data.non_resnt_ppltn_rate,
                fill: "#00a63e",
            },
        ]);

        // 연령별 분포 파싱 -> Data
        // name(category), ppltn_rate_@
        setPpltnRate([
            {
                name: "10대>",
                value: dummyData.ppltn_data.ppltn_rate_0,
                fill: "#EB6927",
            },
            {
                name: "10대",
                value: dummyData.ppltn_data.ppltn_rate_10,
                fill: "#EB6927",
            },
            {
                name: "20대",
                value: dummyData.ppltn_data.ppltn_rate_20,
                fill: "#EB6927",
            },
            {
                name: "30대",
                value: dummyData.ppltn_data.ppltn_rate_30,
                fill: "#EB6927",
            },
            {
                name: "40대",
                value: dummyData.ppltn_data.ppltn_rate_40,
                fill: "#EB6927",
            },
            {
                name: "50대",
                value: dummyData.ppltn_data.ppltn_rate_50,
                fill: "#EB6927",
            },
            {
                name: "60대",
                value: dummyData.ppltn_data.ppltn_rate_60,
                fill: "#EB6927",
            },
            {
                name: "<70대",
                value: dummyData.ppltn_data.ppltn_rate_70,
                fill: "#EB6927",
            },
        ]);

        // 24시간 인구 추이 예측 파싱
        // ppltn_min, ppltn_max, fcst_time, fcst_congest_lvl
        if (
            dummyData.ppltn_data.fcst_ppltn_wrapper &&
            dummyData.ppltn_data.fcst_ppltn_wrapper.fcst_ppltn
        ) {
            const forecastChartData =
                dummyData.ppltn_data.fcst_ppltn_wrapper.fcst_ppltn.map(
                    (item) => {
                        // 시간 포맷팅 (2025-04-18 17:00 -> 17:00)
                        const timeString = item.fcst_time.split(" ")[1];

                        return {
                            fcst_time: timeString,
                            fcst_ppltn_min: item.fcst_ppltn_min,
                            fcst_ppltn_max: item.fcst_ppltn_max,
                            fcst_congest_lvl: item.fcst_congest_lvl,
                        };
                    }
                );
            setForecastData(forecastChartData);
        }
    }, []);

    // AdminDetail.tsx의 return문 일부
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col w-full">
            {/* Header */}
            <AdminHeader path={"/manage"} />
            {/* End of Header */}

            {/* Main Container - 반응형 그리드 사용 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6 flex-grow">
                {/*grid-rows-[0.7fr_1fr_1fr]*/}
                {/* layer1 */}
                <SimpleInfoCard
                    info={{
                        area_name: dummyData.ppltn_data.area_nm,
                        area_code: dummyData.ppltn_data.area_cd,
                        area_congest_lvl: dummyData.ppltn_data.area_congest_lvl,
                    }}
                />

                <AreaPopulationCard
                    population={{
                        area_ppltn_min: dummyData.ppltn_data.area_ppltn_min,
                        area_ppltn_max: dummyData.ppltn_data.area_ppltn_max,
                    }}
                />

                <RodeCard />

                {/* layer2 */}
                <PieCard datas={gender} name="남여 비율" />

                <PopulationRateCard population={ppltnRate} />

                {/* layer3 */}
                <PieCard datas={resnt} name="거주자 비율" />

                <ForecastPopulationCard fcst_ppltn={forecastData} />
            </div>
            {/* End of Main Container */}
        </div>
    );
};

export default AdminDetail;
