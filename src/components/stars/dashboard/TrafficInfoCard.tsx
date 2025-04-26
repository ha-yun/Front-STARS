import { motion } from "framer-motion";

interface TrafficInfoCardProps {
    style: { opacity: number; y: number };
    cardRef: (el: HTMLDivElement | null) => void;
}

export default function TrafficInfoCard({
    style,
    cardRef,
}: TrafficInfoCardProps) {
    return (
        <motion.div
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 bg-white rounded-xl shadow-lg p-4 my-2"
            whileHover={{ y: -6 }}
            animate={style}
            style={style}
            ref={cardRef}
        >
            <p className="text-sm text-gray-500">교통 상황</p>
            <p className="text-xs text-gray-400 mt-2">
                예시 텍스트 예시 텍스트 예시 텍스트
            </p>
        </motion.div>
    );
}
