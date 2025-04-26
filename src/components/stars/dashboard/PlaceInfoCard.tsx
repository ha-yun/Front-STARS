import { motion } from "framer-motion";
import { places } from "../../../data/placesData";

interface PlaceInfoCardProps {
    place: (typeof places)[keyof typeof places];
    style: { opacity: number; y: number };
    cardRef: (el: HTMLDivElement | null) => void;
}

export default function PlaceInfoCard({
    place,
    style,
    cardRef,
}: PlaceInfoCardProps) {
    return (
        <motion.div
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-5 bg-white rounded-xl shadow-lg p-4 my-2"
            whileHover={{ y: -6 }}
            animate={style}
            style={style}
            ref={cardRef}
        >
            <p className="text-sm text-gray-500">관광지</p>
            <p className="text-3xl font-bold mt-2">{place.name}</p>
            <p className="text-sm text-gray-500 mt-2">{place.address}</p>
        </motion.div>
    );
}
