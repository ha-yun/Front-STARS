import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

interface ChartCardProps {
    data: { time: string; forecast: number }[];
    style: { opacity: number; y: number; scale: number };
    cardRef: (el: HTMLDivElement | null) => void;
}

export default function ChartCard({ data, style, cardRef }: ChartCardProps) {
    return (
        <motion.div
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-6 bg-white rounded-3xl shadow-lg p-4 my-2"
            whileHover={{ y: -6 }}
            animate={
                style
                    ? { opacity: style.opacity, y: style.y, scale: style.scale }
                    : {}
            }
            style={style}
            ref={cardRef}
        >
            <p className="text-sm text-gray-500 mb-2">예측 유동인구 추이</p>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
                        formatter={(value: number) => [
                            `${value}명`,
                            "예상 인구 수",
                        ]}
                    />
                    <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#2b7fff"
                        strokeWidth={5}
                        dot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
