import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ChartCardProps {
    data: { day: string; population: number }[];
    style: { opacity: number; y: number };
    cardRef: (el: HTMLDivElement | null) => void;
}

export default function ChartCard({ data, style, cardRef }: ChartCardProps) {
    return (
        <motion.div
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-6 bg-white rounded-xl shadow-lg p-4 my-2"
            whileHover={{ y: -6 }}
            animate={style}
            style={style}
            ref={cardRef}
        >
            <p className="text-sm text-gray-500 mb-2">유동인구 추이</p>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="population"
                        stroke="#60A5FA"
                        strokeWidth={3}
                    />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
