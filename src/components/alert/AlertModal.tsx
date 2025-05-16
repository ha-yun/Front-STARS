import React, { useState } from "react";

export type AlertType = "danger" | "warning" | "info" | "success";

export interface CongestionAlert {
    id: number;
    area_nm: string;
    area_id: number;
    area_congest_lvl: string;
    area_congest_msg: string;
    ppltn_time: string;
    type: AlertType;
}

interface AlertModalProps {
    alerts: CongestionAlert[];
    onDismiss: (id: number) => void;
    onViewArea?: (areaId: number) => void;
}

const baseAlertClass = "p-3 border rounded-lg cursor-pointer";
const alertClass = {
    info: `${baseAlertClass} text-blue-800 border-blue-300 bg-blue-50 hover:bg-blue-100`,
    danger: `${baseAlertClass} text-red-800 border-red-300 bg-red-50 hover:bg-red-100`,
    success: `${baseAlertClass} text-green-800 border-green-300 bg-green-50 hover:bg-green-100`,
    warning: `${baseAlertClass} text-yellow-800 border-yellow-300 bg-yellow-50 hover:bg-yellow-100`,
};

const getBadgeClass = (level: string) => {
    if (level.includes("약간 붐빔")) return "bg-yellow-100 text-yellow-800";
    if (level.includes("붐빔")) return "bg-red-100 text-red-800";
    if (level.includes("보통")) return "bg-green-100 text-green-800";
    if (level.includes("여유")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
};

export default function AlertModal({
    alerts,
    onDismiss,
    onViewArea,
}: AlertModalProps) {
    const [expanded, setExpanded] = useState<number[]>([]);
    console.log(alerts);

    const toggleExpand = (id: number) => {
        setExpanded((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="absolute md:top-4 top-24 right-4 z-10 flex flex-col gap-1">
            {alerts.map((alert) => {
                const isExpanded = expanded.includes(alert.id);
                return (
                    <div
                        key={alert.id}
                        className={`${alertClass[alert.type]} transition-all shadow-md max-w-xs`}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleExpand(alert.id)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleExpand(alert.id);
                            }
                        }}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="shrink-0 w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                </svg>
                                <h3 className="text-sm font-medium">
                                    {alert.area_nm}
                                </h3>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getBadgeClass(
                                        alert.area_congest_lvl
                                    )}`}
                                >
                                    {alert.area_congest_lvl}
                                </span>
                            </div>
                            <button
                                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:text-gray-900 transition-colors duration-150 cursor-pointer bg-transparent"
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent toggle
                                    onDismiss(alert.id);
                                }}
                                aria-label="닫기"
                            >
                                ×
                            </button>
                        </div>
                        <div
                            className={`transition-all duration-300 overflow-hidden text-sm ${
                                isExpanded ? "mt-2 max-h-40" : "max-h-0"
                            }`}
                        >
                            {alert.area_congest_msg}
                            <div
                                className="underline text-gray-600 text-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewArea?.(alert.area_id);
                                }}
                            >
                                보러가기
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
