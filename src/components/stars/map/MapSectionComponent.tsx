import { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { usePlace } from "../../../context/PlaceContext";
import { places } from "../../../data/placesData";
import FocusCard from "./FocusCard";
import SearchBar from "./SearchBar";
import useCustomLogin from "../../../hooks/useCustomLogin";
import { getAttractionList } from "../../../api/starsApi";
import AlertModal from "../../alert/AlertModal";
import useCongestionAlert from "../../../hooks/useCongestionAlert";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface Attraction {
    attraction_id: number;
    attraction_name: string;
    address: string;
    lat: number;
    lon: number;
}

export default function MapSectionComponent() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const { setSelectedPlace, setTriggerCountUp } = usePlace();
    const [showFocusCard, setShowFocusCard] = useState(false);
    const [focusedPlace, setFocusedPlace] = useState<
        keyof typeof places | null
    >(null);

    // 리덕스 로그인 상태 및 액션 사용
    const { isLogin, doLogout, moveToLogin } = useCustomLogin();
    // AlertModal 관련 상태 및 함수
    const { alerts, dismissAlert } = useCongestionAlert();

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/minseoks/cm99kn1ni00fl01sx4ygw7kiq",
            center: [126.9779692, 37.566535] as LngLatLike,
            zoom: 10,
        });

        getAttractionList().then(
            (
                areaList: { area_name: string; attraction_list: Attraction[] }[]
            ) => {
                areaList.forEach((area) => {
                    area.attraction_list.forEach((attraction) => {
                        const { lat, lon, attraction_id } = attraction;

                        // 마커 생성
                        const marker = new mapboxgl.Marker()
                            .setLngLat([lon, lat])
                            .addTo(map);

                        const markerElement = marker.getElement();
                        markerElement.style.cursor = "pointer";

                        markerElement.addEventListener("click", () => {
                            setSelectedPlace(attraction_id.toString());
                            setFocusedPlace(attraction_id.toString());

                            map.flyTo({
                                center: [lon, lat],
                                zoom: 16,
                                pitch: 45,
                            });

                            map.once("moveend", () => {
                                requestAnimationFrame(() => {
                                    setShowFocusCard(true);
                                });
                            });
                        });
                    });
                });
            }
        );

        return () => map.remove();
    }, [setSelectedPlace]);

    return (
        <div className="relative w-screen app-full-height">
            {/* 우측 상단 로그인/로그아웃 버튼 */}
            <div className="absolute md:top-6 top-24 right-6 z-10">
                {isLogin ? (
                    <div className=" flex gap-2">
                        <button
                            className="bg-white shadow-md px-4 py-2 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition"
                            onClick={doLogout}
                        >
                            로그아웃
                        </button>
                        <button
                            className="bg-white shadow-md px-4 py-2 text-indigo-500 font-semibold hover:bg-indigo-500 hover:text-white transition"
                            onClick={() =>
                                window.fullpage_api?.moveSlideRight()
                            }
                        >
                            MyPage →
                        </button>
                    </div>
                ) : (
                    <button
                        className="bg-white shadow-md px-4 py-2 text-indigo-500 font-semibold hover:bg-indigo-500 hover:text-white transition"
                        onClick={moveToLogin}
                    >
                        로그인
                    </button>
                )}
            </div>
            {/* 검색 바 */}
            <SearchBar />
            {/* Mapbox 지도 */}
            <div className="w-full h-full" ref={mapContainer} />

            {/* 선택된 관광지 정보 카드 */}
            {focusedPlace && (
                <FocusCard
                    placeId={focusedPlace}
                    show={showFocusCard}
                    onClose={() => setShowFocusCard(false)}
                    onDetail={() => {
                        setShowFocusCard(false);
                        setTriggerCountUp(true);
                        window.fullpage_api?.moveSectionDown();
                    }}
                />
            )}
            <AlertModal alerts={alerts} onDismiss={dismissAlert} />
        </div>
    );
}
