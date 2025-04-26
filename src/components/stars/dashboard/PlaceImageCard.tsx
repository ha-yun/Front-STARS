import { motion } from "framer-motion";

interface PlaceImageCardProps {
    image: string;
    style: { opacity: number; y: number };
    cardRef: (el: HTMLDivElement | null) => void;
}

export default function PlaceImageCard({
    image,
    style,
    cardRef,
}: PlaceImageCardProps) {
    return (
        <motion.div
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-12 bg-white rounded-xl shadow-lg p-4 my-2"
            whileHover={{ y: -6 }}
            animate={style}
            style={style}
            ref={cardRef}
        >
            {/*<p className="text-sm text-gray-500 mb-2">관광지 미리보기</p>*/}
            <img
                src={image}
                alt="place preview"
                className="rounded-xl object-cover w-full shadow-lg"
            />
        </motion.div>
    );
}
