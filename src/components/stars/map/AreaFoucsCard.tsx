import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CountUp } from "countup.js";
import { getAreaList, getPlaceListByArea } from "../../../api/starsApi";

interface AreaFocusCardProps {
    areaId: number;
    show: boolean;
    onClose: () => void;
    onDetail: () => void;
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
    content: any[];
}

const AreaFocusCard: React.FC<AreaFocusCardProps> = ({
    areaId,
    show,
    onClose,
    onDetail,
}) => {
    const [area, setArea] = useState<AreaDetail | null>(null);
    const [placeSummary, setPlaceSummary] = useState<Record<string, number>>(
        {}
    );
    const visitorCountRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (!show || !areaId) return;

        // 실제 지역 리스트에서 해당 areaId에 맞는 지역 정보 추출
        getAreaList().then((areaList: AreaDetail[]) => {
            const selected = areaList.find((a) => a.area_id === Number(areaId));
            if (selected) setArea(selected);
        });

        // 장소 요약 정보 호출
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
                    <ul className="text-sm space-y-1">
                        {Object.entries(placeSummary).map(([type, count]) => (
                            <li key={type}>
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
