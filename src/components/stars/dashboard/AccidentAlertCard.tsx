import { motion } from "framer-motion";

interface AccidentAlertCardProps {
    style: { opacity: number; y: number; scale: number };
    cardRef: (el: HTMLDivElement | null) => void;
}

export default function AccidentAlertCard({
    style,
    cardRef,
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
            <p className="text-sm text-gray-500">사고 데이터</p>
            <p className="text-3xl font-bold mt-2">테스트</p>
            <p className="text-sm text-gray-500 mt-2">그릇입니다</p>
        </motion.div>
    );
}
