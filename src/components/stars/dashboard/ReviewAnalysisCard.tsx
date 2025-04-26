import { motion } from "framer-motion";

interface ReviewAnalysisCardProps {
    style: { opacity: number; y: number };
    cardRef: (el: HTMLDivElement | null) => void;
    image: string;
}

export default function ReviewAnalysisCard({
    style,
    cardRef,
    image,
}: ReviewAnalysisCardProps) {
    return (
        <motion.div
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4 my-2"
            whileHover={{ y: -6 }}
            animate={style}
            style={style}
            ref={cardRef}
        >
            <img
                src={image}
                alt="preview"
                className="rounded-xl shadow-lg object-cover w-full h-40"
            />
            <div>
                <p className="text-sm text-gray-700 font-semibold">
                    AI 리뷰 분석
                </p>
                <p className="text-xs text-gray-500">
                    Good : 혼잡도 완화여지
                    <br />
                    Bad : 날씨로 인한 만족도 하락
                </p>
                <div className="w-full h-24 flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                </div>
            </div>
        </motion.div>
    );
}
