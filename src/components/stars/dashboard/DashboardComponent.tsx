import { motion, useScroll } from "framer-motion";
import { useEffect, useRef, useMemo, useState } from "react";
import { usePlace } from "../../../context/PlaceContext";
import { CountUp } from "countup.js";
import VisitorCountCard from "./VisitorCountCard";
import AreaInfoCard from "./AreaInfoCard";
import WeatherCard from "./WeatherCard";
import ChartCard from "./ChartCard";
import POICardList from "./POICardList";
import ReviewAnalysisCard from "./ReviewAnalysisCard";
import TrafficInfoCard from "./TrafficInfoCard";
import ParkingInfoCard from "./ParkingInfoCard";
import CongestionStatusCard from "./CongestionStatusCard";
import { scrollToTop } from "../../../utils/scrollToTop";

// API 호출
import { getAreaList } from "../../../api/starsApi";

interface Area {
    area_id: number;
    area_name: string;
    lat: number;
    lon: number;
    category: string;
    name_eng: string;
}

function isValidStatus(
    level: string | undefined
): level is "여유" | "보통" | "약간 붐빔" | "붐빔" {
    return ["여유", "보통", "약간 붐빔", "붐빔"].includes(level ?? "");
}

export default function DashboardComponent() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    useScroll({ container: containerRef });

    const {
        selectedAreaId,
        triggerCountUp,
        setTriggerCountUp,
        congestionInfo,
    } = usePlace();

    const [areaName, setAreaName] = useState("");
    const [areaCategory, setAreaCategory] = useState("");
    const [areaEngName, setAreaEngName] = useState("");

    const visitorCountRef = useRef<HTMLSpanElement | null>(null);

    const forecastChartData = useMemo(() => {
        if (!congestionInfo?.fcst_ppltn) return [];

        return congestionInfo.fcst_ppltn.map((item) => {
            const avg = Math.round(
                (item.fcst_ppltn_min + item.fcst_ppltn_max) / 2
            );
            return {
                time: item.fcst_time.slice(11, 16), // '16:00' 형식
                forecast: avg,
            };
        });
    }, [congestionInfo]);

    // 관광특구 이름, 카테고리, 영문명 정보 가져오기
    useEffect(() => {
        if (!selectedAreaId) return;
        getAreaList().then((areas: Area[]) => {
            const found = areas.find((a: Area) => a.area_id === selectedAreaId);
            if (found) {
                setAreaName(found.area_name);
                setAreaCategory(found.category);
                setAreaEngName(found.name_eng);
            }
        });
    }, [selectedAreaId]);

    // 혼잡도 기반 CountUp 애니메이션 실행
    useEffect(() => {
        if (
            triggerCountUp &&
            visitorCountRef.current &&
            congestionInfo?.area_ppltn_min &&
            congestionInfo?.area_ppltn_max
        ) {
            const avg = Math.round(
                (congestionInfo.area_ppltn_min +
                    congestionInfo.area_ppltn_max) /
                    2
            );
            const countUp = new CountUp(visitorCountRef.current, avg, {
                duration: 1.2,
                useEasing: true,
                separator: ",",
            });
            countUp.start();
            setTriggerCountUp(false);
        }
    }, [triggerCountUp, congestionInfo, setTriggerCountUp]);

    const dummyPOIs = useMemo(
        () =>
            Array.from({ length: 30 }, (_, i) => ({
                name: `상권 ${i + 1}번`,
                address: `서울 중구 상권로 ${i + 1}길`,
                tel: `02-0000-00${String(i + 1).padStart(2, "0")}`,
            })),
        []
    );

    const [cardStyles, setCardStyles] = useState<{
        [key: number]: { opacity: number; y: number; scale: number };
    }>({});
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const updateStyles = () => {
            if (!containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const containerTop = containerRect.top;
            const containerBottom = containerRect.bottom;
            const fadeMargin = 50;

            const newStyles: {
                [key: number]: { opacity: number; y: number; scale: number };
            } = {};

            cardRefs.current.forEach((el, i) => {
                if (!el) return;

                const cardRect = el.getBoundingClientRect();
                const cardCenter = cardRect.top + cardRect.height / 2;

                if (
                    cardCenter >= containerTop + fadeMargin &&
                    cardCenter <= containerBottom - fadeMargin
                ) {
                    newStyles[i] = { opacity: 1, y: 0, scale: 1 };
                    return;
                }

                const opacity = 1;
                let y = 0;
                const scale = 1;

                if (cardCenter < containerTop + fadeMargin) {
                    const ratio = (cardCenter - containerTop) / fadeMargin;
                    // opacity = Math.max(0, ratio);
                    // scale = Math.max(0, ratio);
                    y = -15 * (1 - ratio);
                } else if (cardCenter > containerBottom - fadeMargin) {
                    const ratio = (containerBottom - cardCenter) / fadeMargin;
                    // opacity = Math.max(0, ratio);
                    // scale = Math.max(0.8, ratio);
                    y = 15 * (1 - ratio);
                }

                newStyles[i] = { opacity, y, scale };
            });

            setCardStyles(newStyles);
        };

        updateStyles();
        const interval = setInterval(updateStyles, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            ref={containerRef}
            className="h-screen w-full overflow-y-scroll bg-gray-100 text-black px-10 md:py-[120px] py-[100px]"
        >
            <motion.div className="max-w-[1000px] mx-auto grid grid-cols-12 gap-4">
                {/*<ActionButton*/}
                {/*    style={cardStyles[0]}*/}
                {/*    cardRef={(el) => (cardRefs.current[0] = el)}*/}
                {/*/>*/}

                <AreaInfoCard
                    placeName={areaName} // ✅ 관광특구 이름
                    category={areaCategory}
                    nameEng={areaEngName}
                    style={cardStyles[1]}
                    cardRef={(el) => (cardRefs.current[1] = el)}
                />

                <VisitorCountCard
                    refEl={visitorCountRef}
                    style={cardStyles[2]}
                    cardRef={(el) => (cardRefs.current[2] = el)}
                    status={
                        isValidStatus(congestionInfo?.area_congest_lvl)
                            ? congestionInfo.area_congest_lvl
                            : "보통"
                    }
                />

                <CongestionStatusCard
                    status={
                        isValidStatus(congestionInfo?.area_congest_lvl)
                            ? congestionInfo.area_congest_lvl
                            : "보통"
                    }
                    style={cardStyles[3]}
                    cardRef={(el) => (cardRefs.current[3] = el)}
                />

                {/*<PlaceImageCard*/}
                {/*    image={place.image}*/}
                {/*    style={cardStyles[4]}*/}
                {/*    cardRef={(el) => (cardRefs.current[4] = el)}*/}
                {/*/>*/}

                <WeatherCard
                    style={cardStyles[5]}
                    cardRef={(el) => (cardRefs.current[5] = el)}
                />

                <ChartCard
                    data={forecastChartData}
                    style={cardStyles[6]}
                    cardRef={(el) => (cardRefs.current[6] = el)}
                />

                <ReviewAnalysisCard
                    datas={[
                        { name: "좋아요", value: 70, fill: "#00bc7d" },
                        { name: "별로예요", value: 30, fill: "#ef4444" },
                    ]}
                    style={cardStyles[7]}
                    cardRef={(el) => (cardRefs.current[7] = el)}
                />

                <TrafficInfoCard
                    style={cardStyles[8]}
                    cardRef={(el) => (cardRefs.current[8] = el)}
                />

                <ParkingInfoCard
                    style={cardStyles[9]}
                    cardRef={(el) => (cardRefs.current[9] = el)}
                />

                <POICardList
                    pois={dummyPOIs}
                    baseIndex={10} // 중요! 인덱스 충돌 방지
                    cardRefs={cardRefs}
                    cardStyles={cardStyles}
                />
            </motion.div>
            <div className="absolute top-8 right-8 z-10 justify-between flex gap-2">
                <div
                    className="bg-gray-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-medium rounded-2xl p-4 w-auto h-12 flex items-center justify-center text-lg shadow-lg transition cursor-pointer"
                    onClick={() => {
                        scrollToTop(containerRef.current);
                        setTimeout(() => {
                            window.fullpage_api?.moveSectionUp();
                        }, 500);
                    }}
                >
                    맵으로 가기
                </div>
                <div
                    onClick={() => scrollToTop(containerRef.current)}
                    className="bg-indigo-600 hover:bg-gray-50 text-white hover:text-indigo-600 font-medium rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg transition cursor-pointer"
                    aria-label="최상단으로 이동"
                >
                    ↑
                </div>
            </div>
        </div>
    );
}
