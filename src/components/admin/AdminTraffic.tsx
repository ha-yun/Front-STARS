import React, { useEffect, useRef, useState } from "react";
import AdminHeader from "./AdminHeader";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAdminData } from "../../context/AdminContext";
import { MapData, ParkNode, TrafficData } from "../../data/adminData";

const AdminTraffic = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [selectedArea, setSelectedArea] = useState<string | null>(null);
    const markerRefs = useRef<mapboxgl.Marker[]>([]);
    const parkingMarkerRefs = useRef<mapboxgl.Marker[]>([]);
    const initialMapCenter: LngLatLike = [126.978, 37.5665]; // Seoul
    const initialMapZoom = 11;

    const { mapData } = useAdminData();

    // 지도 초기화
    useEffect(() => {
        console.log("교통 주차 통합 데이터: ", mapData);
        if (!mapContainer.current) return;

        // mapbox token 설정
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        // 지도 초기화
        const mapInstance = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: initialMapCenter,
            zoom: initialMapZoom,
            interactive: true,
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
            parkingMarkerRefs.current.forEach((marker) => marker.remove());
            parkingMarkerRefs.current = [];
        };
    }, []);

    // 초기 지도 화면으로 리셋하는 함수
    const resetMapView = () => {
        if (!map.current) return;

        // 선택된 지역 상태 초기화
        setSelectedArea(null);

        // 모든 레이어 및 마커 제거
        clearAllLayers();

        // 초기 위치 및 확대 수준으로 이동
        map.current.flyTo({
            center: initialMapCenter as [number, number],
            zoom: initialMapZoom,
            essential: true,
        });
    };

    // 선택된 지역으로 이동하는 함수
    const moveToSelectedArea = (areaData: MapData) => {
        if (!map.current) return;

        const trafficData = areaData.trafficData;
        const parkData = areaData.parkData;

        let centerLng, centerLat;
        let zoomLevel = 14;

        // 교통 데이터가 있으면 첫 번째 도로 세그먼트의 중간점으로 이동
        if (trafficData && trafficData.road_traffic_stts.length > 0) {
            const firstRoad = trafficData.road_traffic_stts[0];

            // Parse start and end coordinates
            const startCoords = firstRoad.start_nd_xy.split("_").map(Number);
            const endCoords = firstRoad.end_nd_xy.split("_").map(Number);

            // Calculate center point between start and end
            centerLng = (startCoords[0] + endCoords[0]) / 2;
            centerLat = (startCoords[1] + endCoords[1]) / 2;
        }
        // 주차장 데이터가 있고 교통 데이터가 없으면 첫 번째 주차장 위치로 이동
        else if (parkData && parkData.prk_stts.length > 0) {
            const firstPark = parkData.prk_stts[0];
            centerLng = firstPark.lon;
            centerLat = firstPark.lat;
        }
        // 데이터가 없으면 기본 위치로 이동
        else {
            centerLng = initialMapCenter[0];
            centerLat = initialMapCenter[1];
            zoomLevel = initialMapZoom;
        }

        // Fly to the center of the selected area
        map.current.flyTo({
            center: [centerLng, centerLat],
            zoom: zoomLevel,
            essential: true,
        });

        // 선택된 지역의 도로 및 주차장 표시
        highlightAreaData(areaData);
    };

    // 특정 지역의 도로와 주차장 하이라이트
    const highlightAreaData = (areaData: MapData) => {
        if (!map.current || !mapLoaded) return;

        console.log("Highlighting data for area:", areaData.area_nm);

        // Clear all existing layers and sources
        clearAllLayers();

        // 교통 데이터가 있으면 도로 그리기
        if (areaData.trafficData) {
            drawRoadsForArea(areaData.trafficData);
        }

        // 주차장 데이터가 있으면 주차장 마커 그리기
        if (areaData.parkData) {
            drawParkingMarkersForArea(areaData.parkData.prk_stts);
        }
    };

    // 모든 레이어 및 마커 제거
    const clearAllLayers = () => {
        if (!map.current) return;

        // 교통 레이어 제거
        clearAllTrafficLayers();

        // 주차장 마커 제거
        parkingMarkerRefs.current.forEach((marker) => marker.remove());
        parkingMarkerRefs.current = [];
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
    const drawRoadsForArea = (trafficData: TrafficData) => {
        if (!map.current || !mapLoaded) {
            console.log("Map not ready yet");
            return;
        }

        // console.log("Drawing roads for area:", trafficData.area_nm);
        // console.log("Number of roads:", trafficData.road_traffic_stts.length);

        trafficData.road_traffic_stts.forEach((road, index) => {
            // 시작점과 끝점 좌표
            const startCoords = road.start_nd_xy.split("_").map(Number);
            const endCoords = road.end_nd_xy.split("_").map(Number);

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

                // 시작점과 끝점 마커 추가
                // const startMarker = addPointMarker(
                //     startCoords,
                //     road.start_nd_nm,
                //     "#1e88e5"
                // );
                // const endMarker = addPointMarker(
                //     endCoords,
                //     road.end_nd_nm,
                //     "#d81b60"
                // );
                //
                // // 마커 참조 저장
                // if (startMarker) markerRefs.current.push(startMarker);
                // if (endMarker) markerRefs.current.push(endMarker);
            } catch (error) {
                console.error("Error adding source or layer:", error);
            }
        });
    };

    // 주차장 마커 그리기
    const drawParkingMarkersForArea = (parkingList: ParkNode[]) => {
        if (!map.current || !mapLoaded) {
            console.log("Map not ready yet");
            return;
        }

        console.log("Drawing parking markers, count:", parkingList.length);

        parkingList.forEach((park) => {
            if (!park.lat || !park.lon) return;

            const marker = createParkingMarker(park);
            if (marker) {
                parkingMarkerRefs.current.push(marker);
            }
        });
    };

    // 주차장 마커 생성 함수
    const createParkingMarker = (park: ParkNode): mapboxgl.Marker | null => {
        if (!map.current) return null;

        // Create popup content
        const popupContent = `
            <div class="parking-popup">
                <h3 class="font-bold text-md">${park.prk_name}</h3>
                <p class="text-sm">주소: ${park.address || park.road_addr || "정보 없음"}</p>
                <p class="text-sm">
                    <span class="font-semibold">현황:</span> 
                    ${park.cur_prk_cnt !== undefined ? `${park.cur_prk_cnt}/${park.cpcty || "?"}대` : "정보 없음"}
                </p>
                <p class="text-sm">
                    <span class="font-semibold">요금:</span> 
                    ${park.pay_yn === "Y" ? "유료" : park.pay_yn === "N" ? "무료" : "정보 없음"}
                    ${park.rates !== undefined ? ` (기본 ${park.rates}원/${park.time_rates || "?"}분)` : ""}
                </p>
                <p class="text-sm text-gray-500">업데이트: ${park.cur_prk_time || "정보 없음"}</p>
            </div>
        `;

        // 주차 가능 비율 계산
        let availabilityRatio = 1;
        if (
            park.cur_prk_cnt !== undefined &&
            park.cpcty !== undefined &&
            park.cpcty > 0
        ) {
            availabilityRatio = 1 - park.cur_prk_cnt / park.cpcty;
        }

        // 색상 결정 - 용량에 따라 색상 변경 (녹색: 여유, 노란색: 중간, 빨간색: 혼잡)
        let color = "#4CAF50"; // 기본 녹색
        if (availabilityRatio < 0.2) {
            color = "#F44336"; // 빨간색 (20% 미만 남음)
        } else if (availabilityRatio < 0.5) {
            color = "#FFC107"; // 노란색 (50% 미만 남음)
        }

        // Create a popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

        // Create a DOM element for the marker
        const el = document.createElement("div");
        el.className = "parking-marker";
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = color;
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

        // Add a P inside the marker to indicate it's a parking
        const text = document.createElement("div");
        text.textContent = "P";
        text.style.color = "white";
        text.style.fontWeight = "bold";
        text.style.fontSize = "12px";
        text.style.display = "flex";
        text.style.alignItems = "center";
        text.style.justifyContent = "center";
        text.style.width = "100%";
        text.style.height = "100%";
        el.appendChild(text);

        // Add the marker to the map
        const marker = new mapboxgl.Marker(el)
            .setLngLat([park.lon, park.lat])
            .setPopup(popup)
            .addTo(map.current);

        return marker;
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

    // 선택된 지역이 변경될 때 지도 이동 및 데이터 표시
    useEffect(() => {
        if (!mapLoaded) return;

        if (selectedArea && mapData.length) {
            console.log("Selected area changed to:", selectedArea);
            const area = mapData.find((area) => area.area_nm === selectedArea);
            if (area) {
                moveToSelectedArea(area);
            }
        } else if (selectedArea === null) {
            // 선택된 지역이 null이 되면 모든 레이어 제거
            clearAllLayers();
        }
    }, [selectedArea, mapData, mapLoaded]);

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

    // 각 지역별 주차장 대수 계산
    const getParkingCount = (area: MapData | undefined): number => {
        if (!area || !area.parkData || !area.parkData.prk_stts) return 0;
        return area.parkData.prk_stts.length;
    };

    // 각 지역별 교통 상태 텍스트 반환
    const getTrafficStatusText = (area: MapData): string => {
        if (!area.trafficData) return "정보 없음";
        return `${area.trafficData.road_traffic_idx} (${area.trafficData.road_traffic_spd}km/h)`;
    };

    return (
        <div className="bg-gray-100 flex flex-col w-full h-screen">
            {/* Header */}
            <AdminHeader path={"/manage"} />
            {/* End of Header */}

            {/* Main content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left panel - Enhanced Scrollable Menu */}
                <div className="w-1/4 bg-white border-r flex flex-col text-black">
                    {/* Fixed Header Section */}
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                교통 & 주차 현황
                            </h2>

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
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {mapData.length > 0 ? (
                            mapData.map((area, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 border rounded-lg mb-3 cursor-pointer transition-all duration-200 ${
                                        selectedArea === area.area_nm
                                            ? "bg-blue-50 border-blue-300 shadow-md"
                                            : "hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                        setSelectedArea(area.area_nm)
                                    }
                                >
                                    <h3 className="font-bold">
                                        {area.area_nm}
                                    </h3>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-sm">
                                            교통 상태:{" "}
                                            {getTrafficStatusText(area)}
                                        </span>
                                        <span className="text-sm">
                                            주차장: {getParkingCount(area)}개소
                                        </span>
                                    </div>
                                    {area.trafficData && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {area.trafficData.road_msg}
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                데이터가 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                {/* Map */}
                <div className="flex-1 relative">
                    <div ref={mapContainer} className="absolute inset-0" />

                    {/* Legend */}
                    <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md z-10 text-black">
                        <h3 className="font-bold mb-2">범례</h3>
                        <div className="mb-2">
                            <h4 className="font-semibold text-sm">
                                교통 상태:
                            </h4>
                            <div className="flex items-center mb-1">
                                <div className="w-4 h-4 bg-green-500 mr-2"></div>
                                <span className="text-sm">원활</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <div className="w-4 h-4 bg-orange-500 mr-2"></div>
                                <span className="text-sm">서행</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-red-500 mr-2"></div>
                                <span className="text-sm">정체</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">
                                주차장 상태:
                            </h4>
                            <div className="flex items-center mb-1">
                                <div className="w-4 h-4 bg-green-500 mr-2 flex items-center justify-center text-white font-bold text-xs">
                                    P
                                </div>
                                <span className="text-sm">여유</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <div className="w-4 h-4 bg-yellow-500 mr-2 flex items-center justify-center text-white font-bold text-xs">
                                    P
                                </div>
                                <span className="text-sm">보통</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-red-500 mr-2 flex items-center justify-center text-white font-bold text-xs">
                                    P
                                </div>
                                <span className="text-sm">혼잡</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add custom scrollbar styles */}
            {/*<style jsx>{`*/}
            {/*    .custom-scrollbar::-webkit-scrollbar {*/}
            {/*        width: 6px;*/}
            {/*    }*/}

            {/*    .custom-scrollbar::-webkit-scrollbar-track {*/}
            {/*        background: #f1f1f1;*/}
            {/*        border-radius: 10px;*/}
            {/*    }*/}

            {/*    .custom-scrollbar::-webkit-scrollbar-thumb {*/}
            {/*        background: #ccc;*/}
            {/*        border-radius: 10px;*/}
            {/*    }*/}

            {/*    .custom-scrollbar::-webkit-scrollbar-thumb:hover {*/}
            {/*        background: #999;*/}
            {/*    }*/}
            {/*`}</style>*/}
        </div>
    );
};

export default AdminTraffic;
