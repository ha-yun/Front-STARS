import React, { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

interface ForecastPopulation {
    fcst_time: string; // 예측 시간
    fcst_congest_lvl: string; // 예측 혼잡도 수준
    fcst_ppltn_min: number; // 예측 최소 인구
    fcst_ppltn_max: number; // 예측 최대 인구
}

// 차트 데이터를 위한 명확한 인터페이스 정의
interface ChartDataItem {
    time: string;
    min: number;
    max: number;
    average: number;
    congestionLevel: string;
    fill: string;
}

interface ForecastPopulationProps {
    fcst_ppltn: ForecastPopulation[];
}

const getCongestionColor = (level: string): string => {
    switch (level) {
        case "붐빔":
            return "#FF3B30";
        case "약간 붐빔":
            return "#FF9500";
        case "보통":
            return "#FFCC00";
        case "여유":
            return "#34C759";
        default:
            return "#8E8E93";
    }
};

const ForecastPopulationCard = ({ fcst_ppltn }: ForecastPopulationProps) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (fcst_ppltn && fcst_ppltn.length > 0) {
            const formattedData = fcst_ppltn.map((item) => ({
                time: item.fcst_time,
                min: item.fcst_ppltn_min,
                max: item.fcst_ppltn_max,
                average: Math.round(
                    (item.fcst_ppltn_min + item.fcst_ppltn_max) / 2
                ),
                congestionLevel: item.fcst_congest_lvl,
                fill: getCongestionColor(item.fcst_congest_lvl),
            }));

            setChartData(formattedData);
        }
    }, [fcst_ppltn]);

    const isSmallScreen = windowWidth < 768;

    const formatPopulation = (value: number) => {
        if (value >= 10000) {
            return `${(value / 10000).toFixed(1)}만`;
        }
        return value.toLocaleString();
    };

    return (
        <div className="bg-white p-4 shadow rounded-lg md:col-span-2 xl:col-span-2 h-full">
            <h3 className="font-semibold text-xl text-black mb-2">
                12시간 인구 추이 예측
            </h3>
            <div
                style={{ minHeight: "180px", width: "100%" }}
                className="flex-grow"
            >
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: -40 }}
                        barCategoryGap={5}
                        barGap={0}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 12 }}
                            height={60}
                        />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar
                            dataKey="min"
                            fill="#34C759"
                            name="최소 인구"
                            radius={[8, 8, 0, 0]}
                        />
                        <Bar
                            dataKey="max"
                            fill="#FF3B30"
                            name="최대 인구"
                            radius={[8, 8, 0, 0]}
                        />
                        <Bar
                            dataKey="average"
                            fill="#FFCC00"
                            name="평균 인구"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ForecastPopulationCard;
