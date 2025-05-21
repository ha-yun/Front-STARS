import { motion } from "framer-motion";
import { AccidentData } from "../../../data/adminData";

interface AccidentAlertCardProps {
    style: { opacity: number; y: number; scale: number };
    cardRef: (el: HTMLDivElement | null) => void;
    accidents: AccidentData[];
}

const getAccidentIcon = (type: string): string => {
    switch (type) {
        case "공사":
            return "🔧";
        case "낙하물":
            return "⚠️";
        case "사고":
            return "🚧";
        default:
            return "❗️";
    }
};

export default function AccidentAlertCard({
    style,
    cardRef,
    accidents,
}: AccidentAlertCardProps) {
    return (
        <motion.div
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 bg-blue-500 rounded-3xl shadow-lg p-5 my-2"
            whileHover={{ y: -6 }}
            animate={
                style
                    ? { opacity: style.opacity, y: style.y, scale: style.scale }
                    : {}
            }
            style={style}
            ref={cardRef}
        >
            <h2 className="text-lg font-bold text-white mb-3">
                사건·사고 알림
            </h2>

            {accidents.length === 0 ? (
                <p className="text-sm text-white flex items-center justify-center">
                    현재 이 관광특구에는 사고 정보가 없습니다.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {accidents.map((acc, idx) => (
                        <div
                            key={idx}
                            className="bg-blue-100 rounded-2xl shadow-lg p-3 text-sm"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {/* 아이콘과 유형 뱃지 */}
                                <span className="text-xl">
                                    {getAccidentIcon(acc.acdnt_type)}
                                </span>
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500 text-white">
                                    {acc.acdnt_type}
                                </span>
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500 text-white">
                                    {acc.acdnt_dtype}
                                </span>
                            </div>
                            <p className="text-sm text-gray-800 leading-snug">
                                {acc.acdnt_info}
                            </p>
                            <p className="text-xs text-blue-500 mt-1">
                                발생: {acc.acdnt_occr_dt} / 해제:{" "}
                                {acc.exp_clr_dt}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
