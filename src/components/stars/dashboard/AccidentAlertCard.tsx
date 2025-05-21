// ✅ src/components/.../AccidentAlertCard.tsx

import { motion } from "framer-motion";
import { AccidentData } from "../../../data/adminData";

interface AccidentAlertCardProps {
    style: { opacity: number; y: number; scale: number };
    cardRef: (el: HTMLDivElement | null) => void;
    accidents: AccidentData[]; // ✅ 이 부분 추가!
}

export default function AccidentAlertCard({
    style,
    cardRef,
    accidents,
}: AccidentAlertCardProps) {
    return (
        <motion.div
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-8 bg-white rounded-3xl shadow-lg p-4 my-2"
            whileHover={{ y: -6 }}
            animate={
                style
                    ? { opacity: style.opacity, y: style.y, scale: style.scale }
                    : {}
            }
            style={style}
            ref={cardRef}
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                사건·사고 알림
            </h2>

            {accidents.length === 0 ? (
                <p className="text-sm text-gray-500">
                    현재 이 관광특구에는 사고 정보가 없습니다.
                </p>
            ) : (
                <ul className="space-y-2 text-sm text-gray-700">
                    {accidents.map((accident, idx) => (
                        <li key={idx} className="border-b pb-2">
                            <p className="font-medium">
                                {accident.acdnt_type} - {accident.acdnt_dtype}
                            </p>
                            <p className="text-gray-600">
                                {accident.acdnt_info}
                            </p>
                            <p className="text-gray-500">
                                발생: {accident.acdnt_occr_dt} / 해제 예정:{" "}
                                {accident.exp_clr_dt}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </motion.div>
    );
}
