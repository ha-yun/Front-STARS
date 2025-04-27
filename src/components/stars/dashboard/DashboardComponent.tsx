import { motion, useScroll } from "framer-motion";
import { useEffect, useRef, useMemo, useState } from "react";
import { usePlace } from "../../../context/PlaceContext";
import { places } from "../../../data/placesData";
import { CountUp } from "countup.js";
import VisitorCountCard from "./VisitorCountCard";
import PlaceInfoCard from "./PlaceInfoCard";
import WeatherCard from "./WeatherCard";
import ChartCard from "./ChartCard";
import ActionButton from "./ActionButton";
import POICardList from "./POICardList";
import ReviewAnalysisCard from "./ReviewAnalysisCard";
import TrafficInfoCard from "./TrafficInfoCard";
import ParkingInfoCard from "./ParkingInfoCard";
import PlaceImageCard from "./PlaceImageCard";
import CongestionStatusCard from "./CongestionStatusCard";

export default function DashboardComponent() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    useScroll({ container: containerRef });

    const {
        selectedPlace = "seoulPlaza",
        triggerCountUp,
        setTriggerCountUp,
    } = usePlace();
    const place = places[selectedPlace] ?? places["seoulPlaza"];

    const visitorCountRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (triggerCountUp && visitorCountRef.current) {
            const countUp = new CountUp(
                visitorCountRef.current,
                place.todayVisitors,
                {
                    duration: 2,
                    useEasing: true,
                    separator: ",",
                }
            );
            countUp.start();
            setTriggerCountUp(false);
        }
    }, [triggerCountUp, place, setTriggerCountUp]);

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

                let opacity = 1;
                let y = 0;
                let scale = 1;

                if (cardCenter < containerTop + fadeMargin) {
                    const ratio = (cardCenter - containerTop) / fadeMargin;
                    // opacity = Math.max(0, ratio);
                    // scale = Math.max(0.9, ratio);
                    y = -15 * (1 - ratio);
                } else if (cardCenter > containerBottom - fadeMargin) {
                    const ratio = (containerBottom - cardCenter) / fadeMargin;
                    opacity = Math.max(0, ratio);
                    scale = Math.max(0, ratio);
                    y = 30 * (1 - ratio);
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
            className="h-screen w-full overflow-y-scroll bg-gray-100 text-black px-10 py-[150px]"
        >
            <motion.div className="max-w-[1000px] mx-auto grid grid-cols-12 gap-4">
                <ActionButton
                    style={cardStyles[0]}
                    cardRef={(el) => (cardRefs.current[0] = el)}
                />

                <PlaceInfoCard
                    place={place}
                    style={cardStyles[1]}
                    cardRef={(el) => (cardRefs.current[1] = el)}
                />

                <VisitorCountCard
                    refEl={visitorCountRef}
                    style={cardStyles[2]}
                    cardRef={(el) => (cardRefs.current[2] = el)}
                />

                <CongestionStatusCard
                    status="약간붐빔" // 또는 place.congestionStatus
                    style={cardStyles[3]}
                    cardRef={(el) => (cardRefs.current[3] = el)}
                />

                <PlaceImageCard
                    image={place.image}
                    style={cardStyles[4]}
                    cardRef={(el) => (cardRefs.current[4] = el)}
                />

                <WeatherCard
                    style={cardStyles[5]}
                    cardRef={(el) => (cardRefs.current[5] = el)}
                />

                <ChartCard
                    data={place.weeklyStats}
                    style={cardStyles[6]}
                    cardRef={(el) => (cardRefs.current[6] = el)}
                />

                <ReviewAnalysisCard
                    image={place.image}
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
        </div>
    );
}
