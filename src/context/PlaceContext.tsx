// src/context/PlaceContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { subscribeCongestionUpdate } from "../api/starsApi";

// 🔷 혼잡도 데이터 타입 정의
interface ForecastPopulation {
    fcst_time: string;
    fcst_congest_lvl: string;
    fcst_ppltn_min: number;
    fcst_ppltn_max: number;
}

interface CongestionData {
    area_id: number;
    area_nm: string;
    area_congest_lvl: string;
    area_congest_msg: string;
    area_ppltn_min: number;
    area_ppltn_max: number;
    ppltn_time: string;
    fcst_ppltn?: ForecastPopulation[]; // ✅ 추가
}

interface PlaceContextType {
    selectedPlace: string;
    setSelectedPlace: (placeId: string) => void;
    triggerCountUp: boolean;
    setTriggerCountUp: (value: boolean) => void;

    selectedAreaId: number | null; // ✅ number로 변경
    setSelectedAreaId: (areaId: number | null) => void; // ✅ 타입 일치

    congestionInfo: CongestionData | null;
}

const PlaceContext = createContext<PlaceContextType | undefined>(undefined);

export function PlaceProvider({ children }: { children: React.ReactNode }) {
    const [selectedPlace, setSelectedPlace] = useState<string>("");
    const [triggerCountUp, setTriggerCountUp] = useState<boolean>(false);

    const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null); // ✅ 수정

    const [allCongestions, setAllCongestions] = useState<CongestionData[]>([]);
    const [congestionInfo, setCongestionInfo] = useState<CongestionData | null>(
        null
    );

    // ✅ SSE 연결
    useEffect(() => {
        const eventSource = subscribeCongestionUpdate((data) => {
            if (Array.isArray(data)) {
                setAllCongestions(data as CongestionData[]);
            }
        });

        return () => eventSource.close();
    }, []);

    // ✅ selectedAreaId에 맞는 혼잡도 추출
    useEffect(() => {
        if (!selectedAreaId || allCongestions.length === 0) {
            setCongestionInfo(null);
            return;
        }

        const matched = allCongestions.find(
            (c) => c.area_id === selectedAreaId
        );
        setCongestionInfo(matched ?? null);
    }, [selectedAreaId, allCongestions]);

    return (
        <PlaceContext.Provider
            value={{
                selectedPlace,
                setSelectedPlace,
                triggerCountUp,
                setTriggerCountUp,
                selectedAreaId,
                setSelectedAreaId,
                congestionInfo,
            }}
        >
            {children}
        </PlaceContext.Provider>
    );
}

export function usePlace() {
    const context = useContext(PlaceContext);
    if (!context) {
        throw new Error("usePlace must be used within a PlaceProvider");
    }
    return context;
}
