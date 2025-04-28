import { motion } from "framer-motion";

interface ActionButtonProps {
    // style?: React.CSSProperties;
    style: { opacity: number; y: number; scale: number };
    cardRef?: (el: HTMLDivElement | null) => void;
}

export default function ActionButton({ style, cardRef }: ActionButtonProps) {
    return (
        <motion.div
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center text-2xl md:text-xl sm:text-2xl font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white cursor-pointer my-2"
            whileHover={{ y: -8 }}
            animate={
                style
                    ? { opacity: style.opacity, y: style.y, scale: style.scale }
                    : {}
            }
            style={style}
            ref={cardRef}
            onClick={() => window.fullpage_api?.moveSectionUp()}
        >
            돌아가기 ↑
        </motion.div>
    );
}
