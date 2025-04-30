import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PieCard from "./cards/PieCard";
import SimpleInfoCard from "./cards/SimpleInfoCard";
import AreaPopulationCard from "./cards/AreaPopulationCard";
import PopulationRateCard from "./cards/PopulationRateCard";
import ForecastPopulationCard from "./cards/ForecastPopulationCard";
import { ForecastPopulation, dummyData, Data } from "../../data/adminData";
import RodeCard from "./cards/RodeCard";
import AdminHeader from "./AdminHeader";

const AdminDetail = () => {
    // spotCode별로 API를 불러와야 하는데 아직 없어서 그러지 못하는중
    const { spotCode } = useParams<{ spotCode: string }>();
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    console.log(spotCode);

    const [gender, setGender] = useState<Data[]>([]);
    const [resnt, setResnt] = useState<Data[]>([]);
    const [ppltnRate, setPpltnRate] = useState<Data[]>([]);
    const [forecastData, setForecastData] = useState<ForecastPopulation[]>([]);

    // 데이터 전처리
    useEffect(() => {
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

                <PieCard datas={gender} name="남여 비율" />

                <PopulationRateCard population={ppltnRate} />

                <PieCard datas={resnt} name="거주자 비율" />

                <ForecastPopulationCard fcst_ppltn={forecastData} />
            </div>
            {/* End of Main Container */}
        </div>
    );
};

export default AdminDetail;
