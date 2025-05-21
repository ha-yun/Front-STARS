// ✅ TrafficMapComponent.tsx (무한 렌더링/로그 방지 버전)
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatLike, NavigationControl } from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import { ParkNode, TrafficData } from "../../data/adminData";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface TrafficMapProps {
    trafficData?: TrafficData;
    parkData?: { prk_stts: ParkNode[] };
    initialCenter?: LngLatLike;
    initialZoom?: number;
    height?: string;
    width?: string;
}

const TrafficMapDemo: React.FC<TrafficMapProps> = ({
    trafficData,
    parkData,
    initialCenter = [126.978, 37.5665],
    initialZoom = 11,
    height = "500px",
    width = "100%",
}) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markerRefs = useRef<mapboxgl.Marker[]>([]);
    const parkingMarkerRefs = useRef<mapboxgl.Marker[]>([]);

    const [isMapActive, setIsMapActive] = useState(false);

    const [mapLoaded, setMapLoaded] = useState(false);
    const [flyCompleted, setFlyCompleted] = useState(true);

    const prevTrafficDataRef = useRef<TrafficData | undefined>(undefined);
    const prevParkDataRef = useRef<{ prk_stts: ParkNode[] } | undefined>(
        undefined
    );

    useEffect(() => {
        if (!mapContainer.current || !mapboxgl.accessToken) return;

        const mapInstance = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v11",
            center: initialCenter,
            zoom: initialZoom,
            interactive: false, // ✅ 초기 비활성화
        });

        const enableInteractions = () => {
            if (map.current) {
                map.current.scrollZoom.enable();
                map.current.dragPan.enable();
                map.current.doubleClickZoom.enable();
                map.current.boxZoom.enable();
                map.current.keyboard.enable();
                setIsMapActive(true); // ✅ blur 제거
            }
        };

        const disableInteractions = () => {
            if (map.current) {
                map.current.scrollZoom.disable();
                map.current.dragPan.disable();
                map.current.doubleClickZoom.disable();
                map.current.boxZoom.disable();
                map.current.keyboard.disable();
                setIsMapActive(false); // ✅ blur 추가
            }
        };

        // ✅ 지도 클릭 시 활성화
        const handleMapClick = () => {
            enableInteractions();
        };

        // ✅ 외부 클릭 시 비활성화
        const handleOutsideClick = (e: MouseEvent) => {
            const mapEl = mapContainer.current;
            if (!mapEl) return;

            if (!mapEl.contains(e.target as Node)) {
                disableInteractions();
            }
        };

        mapContainer.current.addEventListener("click", handleMapClick);
        document.addEventListener("click", handleOutsideClick);

        // 지도 설정 및 저장
        mapInstance.addControl(new NavigationControl(), "top-right");
        mapInstance.addControl(new MapboxLanguage({ defaultLanguage: "ko" }));
        mapInstance.on("load", () => setMapLoaded(true));
        mapInstance.on("moveend", () => setFlyCompleted(true));

        map.current = mapInstance;

        // ✅ 정리
        return () => {
            mapContainer.current?.removeEventListener("click", handleMapClick);
            document.removeEventListener("click", handleOutsideClick);
            mapInstance.remove();
            map.current = null;
        };
    }, []);

    useEffect(() => {
        if (!map.current || !mapLoaded) return;

        const trafficChanged = trafficData !== prevTrafficDataRef.current;
        const parkChanged = parkData !== prevParkDataRef.current;

        if ((trafficChanged || parkChanged) && flyCompleted) {
            setFlyCompleted(false);
            moveToSelectedArea();
            prevTrafficDataRef.current = trafficData;
            prevParkDataRef.current = parkData;
        }
    }, [trafficData, parkData, mapLoaded, flyCompleted]);

    const moveToSelectedArea = () => {
        if (!map.current) return;

        let centerLng = 126.978,
            centerLat = 37.5665;
        const zoom = 14;

        if (trafficData?.road_traffic_stts?.length) {
            const coords = trafficData.road_traffic_stts.flatMap((road) => [
                road.start_nd_xy.split("_").map(Number),
                road.end_nd_xy.split("_").map(Number),
            ]);
            const lngs = coords.map(([lng]) => lng);
            const lats = coords.map(([, lat]) => lat);
            centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
            centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        } else if (parkData?.prk_stts?.length) {
            const lngs = parkData.prk_stts.map((p) => p.lon);
            const lats = parkData.prk_stts.map((p) => p.lat);
            centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
            centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        }

        map.current.flyTo({
            center: [centerLng, centerLat],
            zoom,
            essential: true,
        });
    };

    useEffect(() => {
        if (!map.current || !mapLoaded) return;

        clearAllLayers();
        setTimeout(() => {
            if (!map.current) return;
            if (trafficData) drawRoads(map.current, trafficData);
            if (parkData?.prk_stts) drawParking(map.current, parkData.prk_stts);
        }, 100);
    }, [trafficData, parkData, mapLoaded]);

    const clearAllLayers = () => {
        const mapRef = map.current;
        if (!mapRef || !mapRef.isStyleLoaded()) return;

        mapRef.getStyle().layers?.forEach((layer) => {
            if (layer.id.startsWith("traffic-layer-"))
                mapRef.removeLayer(layer.id);
        });
        Object.keys(mapRef.getStyle().sources).forEach((sourceId) => {
            if (sourceId.startsWith("traffic-source-"))
                mapRef.removeSource(sourceId);
        });
        markerRefs.current.forEach((m) => m.remove());
        parkingMarkerRefs.current.forEach((m) => m.remove());
        markerRefs.current = [];
        parkingMarkerRefs.current = [];
    };

    const drawRoads = (map: mapboxgl.Map, traffic: TrafficData) => {
        traffic.road_traffic_stts.forEach((road, idx) => {
            const coords = road.xylist
                ? road.xylist.split("|").map((p) => p.split("_").map(Number))
                : [
                      road.start_nd_xy.split("_").map(Number),
                      road.end_nd_xy.split("_").map(Number),
                  ];

            const sourceId = `traffic-source-${road.link_id}-${idx}`;
            const layerId = `traffic-layer-${road.link_id}-${idx}`;

            map.addSource(sourceId, {
                type: "geojson",
                data: {
                    type: "Feature",
                    properties: {},
                    geometry: { type: "LineString", coordinates: coords },
                },
            });

            map.addLayer({
                id: layerId,
                type: "line",
                source: sourceId,
                layout: { "line-join": "round", "line-cap": "round" },
                paint: {
                    "line-color": getTrafficColor(road.idx),
                    "line-width": 4,
                    "line-opacity": 0.8,
                },
            });
        });
    };

    const drawParking = (map: mapboxgl.Map, parks: ParkNode[]) => {
        parks.forEach((park) => {
            const el = document.createElement("div");
            el.className = "parking-marker";
            el.style.width = "20px";
            el.style.height = "20px";
            el.style.borderRadius = "50%";

            // ✅ 비율에 따른 색상 설정
            const ratio = park.cpcty > 0 ? park.cur_prk_cnt / park.cpcty : 0;

            let color = "#4CAF50"; // 여유
            if (ratio < 0.2)
                color = "#F44336"; // 혼잡
            else if (ratio < 0.5) color = "#FFC107"; // 보통

            el.style.backgroundColor = color;
            el.style.border = "2px solid white";

            // 텍스트 표시 (P)
            const label = document.createElement("div");
            label.innerText = "P";
            label.style.color = "white";
            label.style.fontWeight = "bold";
            label.style.textAlign = "center";
            label.style.lineHeight = "20px";
            el.appendChild(label);

            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <strong>${park.prk_nm}</strong><br/>
            ${park.address || park.road_addr}<br/>
            ${park.cur_prk_cnt}/${park.cpcty} 대
        `);

            const marker = new mapboxgl.Marker(el)
                .setLngLat([park.lon, park.lat])
                .setPopup(popup)
                .addTo(map);

            parkingMarkerRefs.current.push(marker);
        });
    };

    const getTrafficColor = (status: string): string => {
        switch (status) {
            case "서행":
                return "#ff6900";
            case "정체":
                return "#fb2c36";
            case "원활":
                return "#00c951";
            default:
                return "#efb100";
        }
    };

    return (
        <div style={{ height, width, position: "relative" }}>
            <div
                ref={mapContainer}
                className={`absolute inset-0 transition-all duration-300 ${
                    isMapActive ? "" : "filter blur-sm brightness-90"
                }`}
                style={{
                    overflow: "hidden", // 👈 중요
                    borderRadius: "1rem", // 카드와 동일한 라운드 유지
                }}
            />

            {/* ✅ 비활성 상태일 때만 표시되는 오버레이 텍스트 */}
            {!isMapActive && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-black bg-opacity-60 text-white text-sm md:text-base px-6 py-3 rounded-xl shadow-lg">
                        교통혼잡도 및 주차장을 확인하려면 클릭해주세요
                    </div>
                </div>
            )}

            {mapLoaded && (
                <div className="absolute bottom-4 right-4 bg-white p-2 md:p-3 rounded-lg shadow-md z-10 text-black text-xs md:text-sm">
                    <h3 className="font-bold mb-1 md:mb-2 text-center">범례</h3>
                    <div className="flex flex-row">
                        {/* Left column - Traffic status */}
                        <div className="mr-3 md:mr-4">
                            <h4 className="font-semibold mb-1">교통 상태:</h4>
                            <div className="flex items-center mb-1">
                                <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 mr-1 md:mr-2"></div>
                                <span>원활</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <div className="w-3 h-3 md:w-4 md:h-4 bg-orange-500 mr-1 md:mr-2"></div>
                                <span>서행</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 mr-1 md:mr-2"></div>
                                <span>정체</span>
                            </div>
                        </div>

                        {/* Right column - Parking status */}
                        <div className="ml-1 md:ml-2 border-l border-gray-300 pl-3 md:pl-4">
                            <h4 className="font-semibold mb-1">주차장 상태:</h4>
                            <div className="flex items-center mb-1">
                                <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 mr-1 md:mr-2 flex items-center justify-center text-white font-bold text-xxs md:text-xs">
                                    P
                                </div>
                                <span>여유</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-500 mr-1 md:mr-2 flex items-center justify-center text-white font-bold text-xxs md:text-xs">
                                    P
                                </div>
                                <span>보통</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 mr-1 md:mr-2 flex items-center justify-center text-white font-bold text-xxs md:text-xs">
                                    P
                                </div>
                                <span>혼잡</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrafficMapDemo;
