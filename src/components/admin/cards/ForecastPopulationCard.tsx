import React, { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
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
        case "원활":
            return "#34C759";
        default:
            return "#8E8E93";
    }
};

const ForecastPopulationCard = ({ fcst_ppltn }: ForecastPopulationProps) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // any 타입 대신 명확한 인터페이스 사용
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
        <div className="bg-white p-3 shadow rounded-lg md:col-span-2 xl:col-span-2">
            <h3 className="font-semibold text-xl text-black">
                24시간 인구 추이 예측
            </h3>
            <ResponsiveContainer
                width="100%"
                height={isSmallScreen ? 300 : 250}
            >
                <BarChart
                    data={chartData}
                    margin={{
                        top: 30,
                        right: 30,
                        left: 20,
                        bottom: 10,
                    }}
                    barSize={30}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} height={40} />
                    <YAxis
                        tickFormatter={formatPopulation}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value, name) => {
                            if (name === "average") {
                                return [
                                    `${formatPopulation(value as number)}명`,
                                    "평균 인구",
                                ];
                            }
                            return [
                                `${formatPopulation(value as number)}명`,
                                name === "min" ? "최소 인구" : "최대 인구",
                            ];
                        }}
                        labelFormatter={(label) => `시간: ${label}`}
                    />
                    <Bar
                        dataKey="average"
                        name="평균 인구"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={true}
                    />
                </BarChart>
            </ResponsiveContainer>

            <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                    {["원활", "보통", "약간 붐빔", "붐빔"].map((level) => (
                        <div key={level} className="flex items-center">
                            <div
                                className="w-3 h-3 rounded-full mr-1"
                                style={{
                                    backgroundColor: getCongestionColor(level),
                                }}
                            />
                            <span className="text-xs text-gray-600">
                                {level}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ForecastPopulationCard;
