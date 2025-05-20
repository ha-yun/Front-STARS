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
        });

        mapInstance.addControl(new NavigationControl(), "top-right");
        mapInstance.addControl(new MapboxLanguage({ defaultLanguage: "ko" }));

        mapInstance.on("load", () => setMapLoaded(true));
        mapInstance.on("moveend", () => setFlyCompleted(true));

        map.current = mapInstance;

        return () => {
            markerRefs.current.forEach((m) => m.remove());
            parkingMarkerRefs.current.forEach((m) => m.remove());
            map.current?.remove();
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
            el.style.cssText =
                "width:20px;height:20px;border-radius:50%;background:#4CAF50;border:2px solid white";
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

    return <div ref={mapContainer} style={{ height, width }} />;
};

export default TrafficMapDemo;
