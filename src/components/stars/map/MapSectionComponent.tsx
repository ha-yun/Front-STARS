import { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { usePlace } from "../../../context/PlaceContext";
import SearchBar from "./SearchBar";
import useCustomLogin from "../../../hooks/useCustomLogin";
import AlertModal from "../../alert/AlertModal";
import useCongestionAlert from "../../../hooks/useCongestionAlert";
import { getAreaList } from "../../../api/starsApi";
import AreaFocusCard from "./AreaFoucsCard"; // 관광특구 카드

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface Area {
    area_id: number;
    area_name: string;
    lat: number;
    lon: number;
    category: string;
    name_eng: string;
}

export default function MapSectionComponent() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null); // 추가
    const {
        selectedAreaId,
        setSelectedAreaId,
        triggerCountUp,
        setTriggerCountUp,
    } = usePlace();
    const [showFocusCard, setShowFocusCard] = useState(false);
    // AlertModal 관련 상태 및 함수
    const { alerts, dismissAlert } = useCongestionAlert();
    const { isLogin } = useCustomLogin();

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/minseoks/cm99kn1ni00fl01sx4ygw7kiq",
            center: [126.9779692, 37.566535] as LngLatLike,
            zoom: 11.3,
            minZoom: 11.3,
        });
        mapRef.current = map; // 추가

        // 관광특구 마커 생성
        getAreaList().then((areaList: Area[]) => {
            areaList.forEach((area) => {
                const { lat, lon, area_id } = area;

                const marker = new mapboxgl.Marker()
                    .setLngLat([lon, lat])
                    .addTo(map);

                const markerElement = marker.getElement();
                markerElement.style.cursor = "pointer";

                markerElement.addEventListener("click", () => {
                    setSelectedAreaId(area_id);
                    map.flyTo({ center: [lon, lat], zoom: 14, pitch: 45 });

                    map.once("moveend", () => {
                        requestAnimationFrame(() => {
                            setShowFocusCard(true);
                        });
                    });
                });
            });
        });

        return () => map.remove();
    }, [setSelectedAreaId]);

    const handleViewArea = (areaId: number) => {
        console.log(areaId + "번 지역으로 이동");
        getAreaList().then((areaList: Area[]) => {
            const area = areaList.find((a) => a.area_id === areaId);
            if (area && mapRef.current) {
                mapRef.current.flyTo({
                    center: [area.lon, area.lat],
                    zoom: 15,
                    pitch: 45,
                });
                setSelectedAreaId(areaId);
                mapRef.current.once("moveend", () => {
                    requestAnimationFrame(() => {
                        setShowFocusCard(true);
                    });
                });
            }
        });
    };

    return (
        <div className="relative w-screen app-full-height">
            {isLogin && (
                <div className="fixed bottom-8 right-8 z-20">
                    <button
                        className="bg-white shadow-md px-6 py-3 text-indigo-500 font-semibold rounded-full hover:bg-indigo-500 hover:text-white transition"
                        onClick={() => window.fullpage_api?.moveSlideRight()}
                    >
                        MyPage →
                    </button>
                </div>
            )}

            {/* 검색 바 */}
            <SearchBar />

            {/* Mapbox 지도 */}
            <div className="w-full h-full" ref={mapContainer} />

            {/* 지역 정보 카드 */}
            {selectedAreaId && (
                <AreaFocusCard
                    areaId={selectedAreaId}
                    show={showFocusCard}
                    onClose={() => setShowFocusCard(false)}
                    onDetail={() => {
                        setShowFocusCard(false);
                        setTriggerCountUp(true);
                        window.fullpage_api?.moveSectionDown();
                    }}
                />
            )}
            <AlertModal
                alerts={alerts}
                onDismiss={dismissAlert}
                onViewArea={handleViewArea}
            />
        </div>
    );
}
