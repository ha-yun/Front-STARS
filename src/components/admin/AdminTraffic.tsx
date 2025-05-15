import React, { useEffect, useRef, useState } from "react";
import AdminHeader from "./AdminHeader";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAdminData } from "../../context/AdminContext";
import { TrafficData } from "../../data/adminData";

const AdminTraffic = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [selectedArea, setSelectedArea] = useState<string | null>(null);
    const markerRefs = useRef<mapboxgl.Marker[]>([]);
    const initialMapCenter: LngLatLike = [126.978, 37.5665]; // Seoul
    const initialMapZoom = 11;

    const { trafficData } = useAdminData();

    console.log("Traffic에서 받아온 데이터: ", trafficData);

    // 지도 초기화
    useEffect(() => {
        if (!mapContainer.current) return;

        // mapbox token 설정
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        // 지도 초기화
        const mapInstance = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: initialMapCenter,
            zoom: initialMapZoom,
            interactive: false,
        });

        // 지도 로드 완료 이벤트
        mapInstance.on("load", () => {
            console.log("Map loaded");
            setMapLoaded(true);
        });

        map.current = mapInstance;

        // Clean up on unmount
        return () => {
            if (map.current) map.current.remove();
            // 마커 제거
            markerRefs.current.forEach((marker) => marker.remove());
            markerRefs.current = [];
        };
    }, []);

    // 초기 지도 화면으로 리셋하는 함수
    const resetMapView = () => {
        if (!map.current) return;

        // 선택된 지역 상태 초기화
        setSelectedArea(null);

        // 모든 레이어 및 마커 제거
        clearAllTrafficLayers();

        // 초기 위치 및 확대 수준으로 이동
        map.current.flyTo({
            center: initialMapCenter as [number, number],
            zoom: initialMapZoom,
            essential: true,
        });
    };

    // 선택된 지역으로 이동하는 함수
    const moveToSelectedArea = (area: TrafficData) => {
        if (!map.current || !area.road_traffic_stts.length) return;

        // 첫 번째 도로 세그먼트의 중간점으로 이동
        const firstRoad = area.road_traffic_stts[0];

        // Parse start and end coordinates
        const startCoords = firstRoad.start_nd_xy.split("_").map(Number);
        const endCoords = firstRoad.end_nd_xy.split("_").map(Number);

        // Calculate center point between start and end
        const centerLng = (startCoords[0] + endCoords[0]) / 2;
        const centerLat = (startCoords[1] + endCoords[1]) / 2;

        // Fly to the center of the selected area
        map.current.flyTo({
            center: [centerLng, centerLat],
            zoom: 14,
            essential: true,
        });

        // Highlight this area's roads
        highlightAreaRoads(area);
    };

    // 특정 지역의 도로만 하이라이트
    const highlightAreaRoads = (selectedAreaData: TrafficData) => {
        if (!map.current || !mapLoaded) return;

        console.log("Highlighting roads for area:", selectedAreaData.area_nm);

        // Clear all existing layers and sources
        clearAllTrafficLayers();

        // Draw the roads for the selected area
        drawRoadsForArea(selectedAreaData);
    };

    // 모든 트래픽 레이어 제거
    const clearAllTrafficLayers = () => {
        if (!map.current) return;

        // Get all layers
        const existingLayers = map.current.getStyle().layers || [];

        // Remove traffic layers
        existingLayers.forEach((layer) => {
            if (layer.id.startsWith("traffic-layer-")) {
                if (map.current?.getLayer(layer.id)) {
                    map.current?.removeLayer(layer.id);
                }
            }
        });

        // Remove traffic sources
        const sources = Object.keys(map.current.getStyle().sources || {});
        sources.forEach((source) => {
            if (source.startsWith("traffic-source-")) {
                if (map.current?.getSource(source)) {
                    map.current?.removeSource(source);
                }
            }
        });

        // Remove existing markers
        markerRefs.current.forEach((marker) => marker.remove());
        markerRefs.current = [];
    };

    // 특정 지역의 도로 그리기
    const drawRoadsForArea = (area: TrafficData) => {
        if (!map.current || !mapLoaded) {
            console.log("Map not ready yet");
            return;
        }

        console.log("Drawing roads for area:", area.area_nm);
        console.log("Number of roads:", area.road_traffic_stts.length);

        area.road_traffic_stts.forEach((road, index) => {
            // 시작점과 끝점 좌표
            const startCoords = road.start_nd_xy.split("_").map(Number);
            const endCoords = road.end_nd_xy.split("_").map(Number);

            console.log(`Road ${index}:`, road.road_nm);
            console.log("Start:", startCoords);
            console.log("End:", endCoords);

            // 시작점과 끝점만 사용하여 직선 좌표 생성
            const pathCoordinates = [
                [startCoords[0], startCoords[1]],
                [endCoords[0], endCoords[1]],
            ];

            // 소스 ID 생성
            const sourceId = `traffic-source-${road.link_id}-${index}`;
            const layerId = `traffic-layer-${road.link_id}-${index}`;

            try {
                // 소스 추가
                map.current!.addSource(sourceId, {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        properties: {
                            name: road.road_nm,
                            speed: road.spd,
                            status: road.idx,
                        },
                        geometry: {
                            type: "LineString",
                            coordinates: pathCoordinates,
                        },
                    },
                });

                console.log(`Added source: ${sourceId}`);

                // 레이어 추가
                map.current!.addLayer({
                    id: layerId,
                    type: "line",
                    source: sourceId,
                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                    },
                    paint: {
                        "line-color": getTrafficColor(road.idx),
                        "line-width": 8,
                        "line-opacity": 0.8,
                    },
                });

                console.log(`Added layer: ${layerId}`);

                // 시작점과 끝점 마커 추가
                const startMarker = addPointMarker(
                    startCoords,
                    road.start_nd_nm,
                    "#1e88e5"
                );
                const endMarker = addPointMarker(
                    endCoords,
                    road.end_nd_nm,
                    "#d81b60"
                );

                // 마커 참조 저장
                if (startMarker) markerRefs.current.push(startMarker);
                if (endMarker) markerRefs.current.push(endMarker);
            } catch (error) {
                console.error("Error adding source or layer:", error);
            }
        });
    };

    // 포인트 마커 추가 함수
    const addPointMarker = (
        coords: number[],
        name: string,
        color: string
    ): mapboxgl.Marker | null => {
        if (!map.current) return null;

        // Create a popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<strong>${name}</strong>`
        );

        // Create a DOM element for the marker
        const el = document.createElement("div");
        el.style.backgroundColor = color;
        el.style.width = "12px";
        el.style.height = "12px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";

        // Add the marker to the map
        const marker = new mapboxgl.Marker(el)
            .setLngLat([coords[0], coords[1]])
            .setPopup(popup)
            .addTo(map.current);

        return marker;
    };

    // 선택된 지역이 변경될 때 지도 이동 및 도로 강조 표시
    useEffect(() => {
        if (!mapLoaded) return;

        if (selectedArea && trafficData.length) {
            console.log("Selected area changed to:", selectedArea);
            const area = trafficData.find(
                (area) => area.area_nm === selectedArea
            );
            if (area) {
                moveToSelectedArea(area);
            }
        } else if (selectedArea === null) {
            // 선택된 지역이 null이 되면 모든 레이어 제거
            clearAllTrafficLayers();
        }
    }, [selectedArea, trafficData, mapLoaded]);

    // 지도가 로드된 후 초기 데이터 표시
    useEffect(() => {
        if (!mapLoaded || !trafficData.length) return;

        console.log(
            "Map loaded and traffic data available, setting initial area"
        );
        // 초기 지역 선택 (첫 번째 지역)
        // setSelectedArea(trafficData[0].area_nm);
    }, [mapLoaded, trafficData]);

    // Helper function to determine line color based on traffic status
    const getTrafficColor = (status: string): string => {
        switch (status) {
            case "서행":
                return "#FFA500"; // Orange
            case "정체":
                return "#FF0000"; // Red
            case "원활":
                return "#00FF00"; // Green
            default:
                return "#FFFF00"; // Yellow
        }
    };

    return (
        <div className="bg-gray-100 flex flex-col w-full h-screen">
            {/* Header */}
            <AdminHeader path={"/manage"} />
            {/* End of Header */}

            {/* Main content */}
            <div className="flex-1 flex">
                {/* Left panel */}
                <div className="w-1/4 bg-white p-4 overflow-y-auto border-r text-black">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">교통 현황</h2>

                        {/* 초기화 버튼 */}
                        <button
                            onClick={resetMapView}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center shadow-md transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            초기 화면
                        </button>
                    </div>

                    {trafficData.map((area, idx) => (
                        <div
                            key={idx}
                            className={`p-3 border rounded-lg mb-3 cursor-pointer ${selectedArea === area.area_nm ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"}`}
                            onClick={() => setSelectedArea(area.area_nm)}
                        >
                            <h3 className="font-bold">{area.area_nm}</h3>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-sm">
                                    상태: {area.road_traffic_idx}
                                </span>
                                <span className="text-sm">
                                    속도: {area.road_traffic_spd}km/h
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                {area.road_msg}
                            </p>
                        </div>
                    ))}

                    {trafficData.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                            교통 데이터가 없습니다.
                        </div>
                    )}
                </div>

                {/* Map */}
                <div className="flex-1 relative">
                    <div ref={mapContainer} className="absolute inset-0" />

                    {/* Legend */}
                    <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md z-10 text-black">
                        <h3 className="font-bold mb-2">교통 상태</h3>
                        <div className="flex items-center mb-1">
                            <div className="w-4 h-4 bg-green-500 mr-2"></div>
                            <span>원활</span>
                        </div>
                        <div className="flex items-center mb-1">
                            <div className="w-4 h-4 bg-orange-500 mr-2"></div>
                            <span>서행</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-500 mr-2"></div>
                            <span>정체</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTraffic;
