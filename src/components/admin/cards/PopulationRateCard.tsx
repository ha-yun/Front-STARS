import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid,
} from "recharts";

interface Data {
    name: string;
    value: number;
    fill: string;
}

interface PopulationRateProps {
    population: Data[];
}

const PopulationRateCard = ({ population }: PopulationRateProps) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const getBarSize = () => {
        if (windowWidth < 640) return 15; // 모바일 화면
        if (windowWidth < 1024) return 25; // 태블릿 화면
        return 35; // 데스크톱 화면
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const isSmallScreen = windowWidth < 768;

    return (
        <div className="bg-white p-4 shadow rounded-lg md:col-span-1 xl:col-span-2 h-full">
            <h3 className="font-semibold text-xl text-black mb-2">
                연령대별 분포
            </h3>
            <div
                style={{ minHeight: "180px", width: "100%" }}
                className="flex-grow"
            >
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                        data={population}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                        barSize={getBarSize()}
                        barCategoryGap={5}
                        barGap={0}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            tick={{ fontSize: 11 }}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            formatter={(value) => [`${value}%`, "비율"]}
                            contentStyle={{ fontSize: "12px" }}
                        />
                        <Bar
                            dataKey="value"
                            fill="#EB6927"
                            name="연령 비율"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PopulationRateCard;
