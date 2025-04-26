import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
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
        <div className="bg-white p-2 shadow rounded-lg md:col-span-1 xl:col-span-2">
            <h3 className="font-semibold text-xl text-black">연령대별 분포</h3>
            <ResponsiveContainer
                width="100%"
                height={isSmallScreen ? 350 : 250}
            >
                <BarChart
                    data={population}
                    margin={{
                        top: 20,
                        right: 30,
                        left: -20,
                        bottom: -10,
                    }}
                    // barSize={40}
                    barCategoryGap={10}
                    barGap={0}
                >
                    <XAxis
                        dataKey="name"
                        padding={{ left: 5 }}
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "비율"]} />
                    <Bar
                        dataKey="value"
                        fill="#EB6927"
                        name="연령 비율(%)"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PopulationRateCard;
