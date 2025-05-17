import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CountUp } from "countup.js";
import { getAreaList, getPlaceListByArea } from "../../../api/starsApi";
import { SearchResult } from "../../../api/searchApi"; // 이걸로 통일

interface AreaFocusCardProps {
    areaId: number;
    show: boolean;
    onClose: () => void;
    onDetail: () => void;
    onCategoryClick?: (items: SearchResult[]) => void;
}

interface AreaDetail {
    area_id: number;
    area_name: string;
    category: string;
    lat: number;
    lon: number;
    seoul_id: string;
    name_eng: string;
}

interface PlaceCategoryContent {
    type: string;
    content: PlaceContent[];
}

interface PlaceContent {
    place_id?: string; // 추가
    cafe_id?: number;
    cafe_name?: string;
    restaurant_id?: number;
    restaurant_name?: string;
    attraction_id?: number;
    attraction_name?: string;
    accommodation_id?: number;
    accommodation_name?: string;
    event_id?: number;
    event_name?: string;
    title?: string;
    address: string;
    phone?: string;
    kakaomap_url?: string;
    lat: number;
    lon: number;
}

const getPlaceName = (place: PlaceContent) =>
    place.cafe_name ||
    place.restaurant_name ||
    place.attraction_name ||
    place.accommodation_name ||
    place.event_name ||
    place.title ||
    "";

const AreaFocusCard: React.FC<AreaFocusCardProps> = ({
    areaId,
    show,
    onClose,
    onDetail,
    onCategoryClick,
}) => {
    const [area, setArea] = useState<AreaDetail | null>(null);
    const [placeSummary, setPlaceSummary] = useState<Record<string, number>>(
        {}
    );
    const visitorCountRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (!show || !areaId) return;

        getAreaList().then((areaList: AreaDetail[]) => {
            const selected = areaList.find((a) => a.area_id === Number(areaId));
            if (selected) setArea(selected);
        });

        getPlaceListByArea(areaId).then((placeList: PlaceCategoryContent[]) => {
            const summary: Record<string, number> = {};
            placeList.forEach((item) => {
                summary[item.type] = item.content.length;
            });
            setPlaceSummary(summary);
        });
    }, [areaId, show]);

    useEffect(() => {
        if (!show || !visitorCountRef.current) return;

        const countUp = new CountUp(
            visitorCountRef.current,
            Math.floor(Math.random() * 50000 + 5000),
            {
                duration: 1.5,
                useEasing: true,
                separator: ",",
            }
        );

        if (!countUp.error) countUp.start();
    }, [area, show]);

    const handleCategoryClick = async (type: string) => {
        const placeList = await getPlaceListByArea(areaId);
        const categoryItem = placeList.find(
            (item: PlaceCategoryContent) => item.type === type
        );
        if (!categoryItem) return;

        const items: SearchResult[] = categoryItem.content.map((place: any) => {
            // place_id 우선, 없으면 id 사용
            const place_id =
                place.place_id ?? (place.id ? String(place.id) : "");
            // cultural_event/culturalevent면 title, 아니면 name
            const isEvent =
                type === "cultural_event" ||
                type === "culturalevent" ||
                place.type === "cultural_event" ||
                place.type === "culturalevent";
            return {
                place_id,
                name: isEvent ? (place.title ?? "") : (place.name ?? ""),
                title: isEvent ? (place.title ?? "") : undefined,
                address: place.address,
                lon: place.lon,
                lat: place.lat,
                type,
            };
        });

        onCategoryClick?.(items);
    };

    return (
        <div
            className={`absolute inset-0 z-20 flex justify-center items-center transition-opacity duration-500 ${
                show
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
            }`}
        >
            <div
                className="absolute inset-0 z-10 bg-white/30 backdrop-blur-sm"
                onClick={onClose}
            />

            <div
                className="relative z-20 flex flex-col items-center gap-6 w-auto px-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 방문자 수 */}
                <motion.div
                    className="bg-white rounded-2xl shadow-lg p-4 w-4/5 md:w-96"
                    whileHover={{ y: -8 }}
                >
                    <h3 className="md:text-xl text-lg text-gray-500 mb-2">
                        {area?.area_name} 방문자 수
                    </h3>
                    <p className="md:text-5xl text-3xl font-bold text-gray-900">
                        <span ref={visitorCountRef}></span>명
                    </p>
                </motion.div>

                {/* 장소 요약 */}
                <motion.div
                    className="bg-blue-500 text-white rounded-2xl shadow-lg p-4 w-4/5 md:w-96"
                    whileHover={{ y: -8 }}
                >
                    <h3 className="text-lg font-bold mb-2">장소 요약</h3>
                    <ul>
                        {Object.entries(placeSummary).map(([type, count]) => (
                            <li
                                key={type}
                                className="cursor-pointer hover:underline"
                                onClick={() => handleCategoryClick(type)}
                            >
                                {type} : {count}곳
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* 카테고리 정보 */}
                <motion.div
                    className="bg-indigo-600 text-white rounded-2xl shadow-lg p-4 w-4/5 md:w-96"
                    whileHover={{ y: -8 }}
                >
                    <p className="text-sm">
                        <strong>카테고리:</strong> {area?.category}
                    </p>
                    <p className="text-sm mt-1">
                        <strong>영문명:</strong> {area?.name_eng}
                    </p>
                </motion.div>

                {/* 버튼 */}
                <motion.div
                    onClick={onDetail}
                    className="cursor-pointer bg-white rounded-2xl shadow-lg md:p-6 p-4 flex items-center justify-center md:text-4xl text-xl font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white"
                    whileHover={{ y: -8 }}
                >
                    자세히 보기 ↓
                </motion.div>
            </div>
        </div>
    );
};

export default AreaFocusCard;
