import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    ComposedChart,
} from "recharts";

interface ForecastPopulation {
    fcst_time: string;
    fcst_congest_lvl: string;
    fcst_ppltn_min: number;
    fcst_ppltn_max: number;
}

interface ForecastPopulationCardProps {
    fcst_ppltn: ForecastPopulation[];
}

// Get color based on congestion level
const getCongestionColor = (level: string): string => {
    switch (level) {
        case "붐빔":
            return "#EF4444"; // Red
        case "약간 붐빔":
            return "#F97316"; // Orange
        case "보통":
            return "#FBBF24"; // Yellow
        case "여유":
            return "#10B981"; // Green
        default:
            return "#6B7280"; // Gray
    }
};

// Format time to Korean hour format
const formatTimeToKoreanHour = (timeString: string): string => {
    // fcst_time이 다양한 형식으로 올 수 있으므로 안전하게 처리
    let hour;

    // 형식 1: "17:00"
    if (timeString.includes(":")) {
        hour = timeString.split(":")[0];
    }
    // 형식 2: "2025-04-18 17:00"
    else if (timeString.includes(" ")) {
        const parts = timeString.split(" ");
        if (parts.length > 1 && parts[1].includes(":")) {
            hour = parts[1].split(":")[0];
        } else {
            // 알 수 없는 형식인 경우
            return timeString;
        }
    }
    // 기타 알 수 없는 형식
    else {
        return timeString;
    }

    // 시간이 한 자리인 경우도 대응 (예: "9:00" -> "9시")
    return `${hour}시`;
};

const ForecastPopulationCard = ({
    fcst_ppltn,
}: ForecastPopulationCardProps) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Process forecast data
    useEffect(() => {
        if (fcst_ppltn && fcst_ppltn.length > 0) {
            console.log("Original fcst_ppltn data:", fcst_ppltn);

            // Format data for chart
            const formattedData = fcst_ppltn.map((item) => {
                // fcst_time 형식 로깅으로 디버깅
                console.log("Processing fcst_time:", item.fcst_time);

                // 안전하게 시간 형식 변환
                let koreanTime;
                try {
                    koreanTime = formatTimeToKoreanHour(item.fcst_time);
                } catch (error) {
                    console.error(
                        "Error formatting time:",
                        error,
                        item.fcst_time
                    );
                    koreanTime = item.fcst_time; // 오류 시 원본 시간 유지
                }

                return {
                    time: koreanTime,
                    originalTime: item.fcst_time, // 원본 시간 보존
                    min: item.fcst_ppltn_min,
                    max: item.fcst_ppltn_max,
                    average: Math.round(
                        (item.fcst_ppltn_min + item.fcst_ppltn_max) / 2
                    ),
                    level: item.fcst_congest_lvl,
                    color: getCongestionColor(item.fcst_congest_lvl),
                };
            });

            console.log("Formatted chart data:", formattedData);
            setChartData(formattedData);
        }
    }, [fcst_ppltn]);

    // Format large numbers for readability
    const formatYAxis = (value: number): string => {
        if (value >= 10000) {
            return `${Math.round(value / 1000)}k`;
        }
        return value.toString();
    };

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div className="bg-white p-3 border shadow-lg rounded-lg">
                    <p className="font-bold text-gray-800">{label}</p>
                    <div className="mt-2">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-blue-500 text-sm">최소:</span>
                            <span className="font-medium">
                                {data.min.toLocaleString()}명
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-red-500 text-sm">최대:</span>
                            <span className="font-medium">
                                {data.max.toLocaleString()}명
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-purple-500 text-sm">
                                평균:
                            </span>
                            <span className="font-medium">
                                {data.average.toLocaleString()}명
                            </span>
                        </div>
                    </div>
                    <div className="mt-2 pt-2 border-t">
                        <p className="text-sm flex justify-between">
                            <span>혼잡도:</span>
                            <span
                                className="font-medium"
                                style={{ color: data.color }}
                            >
                                {data.level}
                            </span>
                        </p>
                    </div>
                </div>
            );
        }

        return null;
    };

    // 데이터가 없는 경우 대체 UI
    if (!chartData || chartData.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
                <div className="mb-4">
                    <h3 className="font-semibold text-lg text-gray-700">
                        인구 예측 추이
                    </h3>
                    <p className="text-sm text-gray-500">
                        향후 12시간 예상 인구 변화
                    </p>
                </div>
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-gray-500">
                        예측 데이터를 불러오는 중이거나 데이터가 없습니다.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
            <div className="mb-4">
                <h3 className="font-semibold text-lg text-gray-700">
                    인구 예측 추이
                </h3>
                <p className="text-sm text-gray-500">
                    향후 12시간 예상 인구 변화
                </p>
            </div>

            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                    <ComposedChart data={chartData}>
                        <defs>
                            <linearGradient
                                id="colorUv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#3B82F6"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#3B82F6"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient
                                id="colorPv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#EF4444"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#EF4444"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f0f0f0"
                        />

                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                            axisLine={{ stroke: "#E5E7EB" }}
                        />

                        <YAxis
                            tickFormatter={formatYAxis}
                            tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                            axisLine={{ stroke: "#E5E7EB" }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Legend
                            verticalAlign="top"
                            height={36}
                            wrapperStyle={{ paddingTop: "10px" }}
                        />

                        {/* Area chart for min-max range */}
                        <Area
                            type="monotone"
                            dataKey="min"
                            stroke="#3B82F6"
                            fillOpacity={0.3}
                            fill="url(#colorUv)"
                            name="최소 인구"
                        />

                        <Area
                            type="monotone"
                            dataKey="max"
                            stroke="#EF4444"
                            fillOpacity={0.3}
                            fill="url(#colorPv)"
                            name="최대 인구"
                        />

                        {/* Line for average */}
                        <Line
                            type="monotone"
                            dataKey="average"
                            stroke="#8B5CF6"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2 }}
                            name="평균 인구"
                            activeDot={{
                                r: 8,
                                stroke: "#8B5CF6",
                                strokeWidth: 2,
                            }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Color legend for congestion levels */}
            <div className="flex flex-wrap mt-4 justify-end gap-2 pt-2 border-t border-gray-100">
                {["여유", "보통", "약간 붐빔", "붐빔"].map((level) => (
                    <div key={level} className="flex items-center">
                        <div
                            className="w-3 h-3 rounded-full mr-1"
                            style={{
                                backgroundColor: getCongestionColor(level),
                            }}
                        />
                        <span className="text-xs text-gray-600">{level}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForecastPopulationCard;
