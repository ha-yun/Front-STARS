import React, { useState, useEffect } from "react";
import { PieChart, Pie, Legend, ResponsiveContainer, Tooltip } from "recharts";

interface Data {
    name: string;
    value: number;
    fill: string;
}

interface PieCardProps {
    name: string;
    datas: Data[];
}

interface RenderLabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: RenderLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const PieCard = ({ datas, name }: PieCardProps) => {
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

    // Determine if we should use vertical or horizontal layout based on window width
    const isSmallScreen = windowWidth < 768;

    return (
        <>
            <h3 className="font-semibold text-lg text-black mb-2 mt-2 ml-2">
                {name}
            </h3>
            <ResponsiveContainer
                width="100%"
                height={isSmallScreen ? 350 : 300}
            >
                <PieChart>
                    <Legend
                        layout={isSmallScreen ? "horizontal" : "vertical"}
                        align={isSmallScreen ? "center" : "right"}
                        verticalAlign={isSmallScreen ? "bottom" : "middle"}
                        iconSize={10}
                        wrapperStyle={isSmallScreen ? {} : { paddingRight: 20 }}
                        payload={[
                            {
                                value: `${datas[0]?.name || ""} : ${datas[0]?.value || 0}%`,
                                type: "square",
                                color: `${datas[0]?.fill || "#ffffff"}`,
                            },
                            {
                                value: `${datas[1]?.name || ""} : ${datas[1]?.value || 0}%`,
                                type: "square",
                                color: `${datas[1]?.fill || "#ffffff"}`,
                            },
                        ]}
                    />
                    <Tooltip />
                    <Pie
                        data={datas}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        label={renderCustomizedLabel}
                        labelLine={false}
                        outerRadius={isSmallScreen ? 90 : 120}
                        innerRadius={0}
                    />
                </PieChart>
            </ResponsiveContainer>
        </>
    );
};

export default PieCard;
