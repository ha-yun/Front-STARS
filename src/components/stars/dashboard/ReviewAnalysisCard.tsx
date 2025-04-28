import { motion } from "framer-motion";
import { PieChart, Pie, Legend, ResponsiveContainer, Tooltip } from "recharts";

interface ReviewAnalysisCardProps {
    style: { opacity: number; y: number; scale: number };
    cardRef: (el: HTMLDivElement | null) => void;
    datas: { name: string; value: number; fill: string }[]; // ✅ 차트 데이터
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
}) => {
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
            fontSize={10}
            fontWeight="bold"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function ReviewAnalysisCard({
    style,
    cardRef,
    datas,
}: ReviewAnalysisCardProps) {
    return (
        <motion.div
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4 my-2"
            whileHover={{ y: -6 }}
            animate={
                style
                    ? { opacity: style.opacity, y: style.y, scale: style.scale }
                    : {}
            }
            style={style}
            ref={cardRef}
        >
            <div className="flex-grow">
                <h3 className="font-semibold text-lg text-black mb-2">
                    AI 리뷰 분석
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <Legend
                            layout="horizontal"
                            align="right"
                            wrapperStyle={{
                                fontSize: "14px",
                                fontWeight: "bold",
                            }}
                            iconSize={8}
                        />
                        <Tooltip
                            formatter={(value) => [`${value}%`, "비율"]}
                            contentStyle={{ fontSize: "10px" }}
                        />
                        <Pie
                            data={datas}
                            dataKey="value"
                            nameKey="name"
                            // cx="50%"
                            // cy="50%"
                            startAngle={0}
                            endAngle={360}
                            outerRadius={100}
                            label={renderCustomizedLabel}
                            labelLine={false}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
