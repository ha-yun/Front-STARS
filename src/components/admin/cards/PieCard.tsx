import React, { useRef, useEffect, useState } from "react";
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

// 파이차트 내 비율 숫자 넣기 위한 데이터타입
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
            fontSize="10"
            fontWeight="bold"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const PieCard = ({ datas, name }: PieCardProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 300, height: 200 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 컴포넌트가 마운트된 후 약간의 지연을 두고 차트를 표시
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } =
                    containerRef.current.getBoundingClientRect();
                if (width > 0 && height > 0) {
                    setDimensions({ width, height });
                }
            }
        };

        // 초기 크기 설정
        updateDimensions();

        // ResizeObserver를 사용하여 컨테이너 크기 변화 감지
        const resizeObserver = new ResizeObserver(updateDimensions);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // 윈도우 리사이즈 이벤트 리스너
        window.addEventListener("resize", updateDimensions);

        return () => {
            clearTimeout(timer);
            if (resizeObserver && containerRef.current) {
                resizeObserver.disconnect();
            }
            window.removeEventListener("resize", updateDimensions);
        };
    }, []);

    // 컨테이너 사이즈에 비례하여 반지름 계산
    const smallerDimension = Math.min(dimensions.width, dimensions.height);
    const outerRadius = Math.max(30, smallerDimension * 0.4); // 크기 약간 감소

    return (
        <div
            ref={containerRef}
            className="bg-white shadow rounded-lg p-2 flex flex-col w-full h-full"
        >
            <h3 className="font-semibold text-xl text-black mb-1">{name}</h3>
            <div
                className="flex-grow flex items-center justify-center"
                style={{ height: "120px" }}
            >
                {isVisible && dimensions.width > 0 && dimensions.height > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart
                            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                            <Legend
                                layout="horizontal"
                                align="right"
                                wrapperStyle={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                }}
                                iconSize={8}
                            />
                            <Tooltip
                                formatter={(value) => [`${value}%`, "비율"]}
                                contentStyle={{ fontSize: "20px" }}
                            />
                            <Pie
                                data={datas}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="80%"
                                startAngle={0}
                                endAngle={180}
                                label={renderCustomizedLabel}
                                labelLine={false}
                                outerRadius={outerRadius}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-xs">
                            로딩 중...
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PieCard;
