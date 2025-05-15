import React, { useEffect, useRef, useState } from "react";
import AdminHeader from "./AdminHeader";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAdminData } from "../../context/AdminContext";

const AdminTraffic = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [selectedArea, setSelectedArea] = useState<string | null>(null);

    const { trafficData } = useAdminData();

    console.log("Traffic에서 받아온 데이터: ", trafficData);
    // Initialize map
    useEffect(() => {
        if (!mapContainer.current) return;

        // Setup mapbox (replace with your actual access token)
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        // Initialize map
        const mapInstance = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [126.978, 37.5665], // Seoul
            zoom: 11,
        });

        map.current = mapInstance;

        // Clean up on unmount
        return () => {
            if (map.current) map.current.remove();
        };
    }, []);

    // Draw traffic data on map when available
    useEffect(() => {
        if (!map.current || !trafficData.length) return;

        // Remove existing layers if any
        if (map.current.getLayer("traffic-layer")) {
            map.current.removeLayer("traffic-layer");
        }
        if (map.current.getSource("traffic-source")) {
            map.current.removeSource("traffic-source");
        }

        // Process traffic data to draw on map
        trafficData.forEach((area) => {
            area.road_traffic_stts.forEach((road) => {
                // Parse the xylist to create a GeoJSON LineString
                const coordinates = road.xylist.split("|").map((coord) => {
                    const [lon, lat] = coord.split("_").map(Number);
                    return [lon, lat];
                });

                // Add the source
                map.current?.once("load", () => {
                    map.current?.addSource(`traffic-source-${road.link_id}`, {
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
                                coordinates,
                            },
                        },
                    });

                    // Add the layer to visualize the road
                    map.current?.addLayer({
                        id: `traffic-layer-${road.link_id}`,
                        type: "line",
                        source: `traffic-source-${road.link_id}`,
                        layout: {
                            "line-join": "round",
                            "line-cap": "round",
                        },
                        paint: {
                            "line-color": getTrafficColor(road.idx),
                            "line-width": 5,
                        },
                    });
                });
            });
        });
    }, [trafficData, map.current]);

    // Helper function to determine line color based on traffic status
    const getTrafficColor = (status: string): string => {
        switch (status.toLowerCase()) {
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
                    <h2 className="text-xl font-bold mb-4">교통 현황</h2>

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
                </div>
            </div>
        </div>
    );
};

export default AdminTraffic;
