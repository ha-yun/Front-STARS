// src/components/admin/cards/AccidentCard.tsx

import React from "react";
import { AccidentData } from "../../../data/adminData";

interface AccidentCardProps {
    datas: AccidentData;
    isMobile?: boolean; // 모바일 여부를 전달받는 새 속성
}

export default function AccidentCard({
    datas,
    isMobile = false,
}: AccidentCardProps) {
    // 사고 타입에 따른 아이콘 선택 로직
    const getAccidentIcon = (type: string) => {
        // 나중에 case 뭐가 있는지 조사하고 추가/수정
        switch (type.toLowerCase()) {
            case "교통사고":
                return "🚗";
            case "화재":
                return "🔥";
            case "의료":
                return "🏥";
            case "공사":
                return "🚧";
            default:
                return "⚠️";
        }
    };

    // 사고 타입에 따른 배경색 선택 로직
    const getAccidentBgColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "교통사고":
                return "bg-orange-100";
            case "화재":
                return "bg-red-100";
            case "의료":
                return "bg-blue-100";
            default:
                return "bg-yellow-100";
        }
    };

    return (
        <div
            className={`p-3 bg-white border rounded-lg text-black shadow-sm ${getAccidentBgColor(datas.acdnt_type)}`}
        >
            <h3 className="font-bold text-center mb-2">{datas.area_nm}</h3>

            <div className="flex justify-center mb-2">
                <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-lg">
                    {getAccidentIcon(datas.acdnt_type)}
                </div>
            </div>

            <div className="text-center font-semibold text-sm">
                {datas.acdnt_type}
            </div>

            {/* 모바일이 아닐 때만 상세 정보 표시 */}
            {!isMobile && (
                <div className="mt-2">
                    <div className="text-xs text-gray-600 text-center mt-1">
                        {datas.acdnt_occr_dt}
                    </div>
                    <div className="text-xs text-gray-600 text-center mt-1">
                        {datas.acdnt_info}
                    </div>
                    {/*{datas.status && (*/}
                    {/*    <div*/}
                    {/*        className={`text-xs text-center mt-2 p-1 rounded ${*/}
                    {/*            datas.status === "진행중"*/}
                    {/*                ? "bg-red-200 text-red-800"*/}
                    {/*                : "bg-green-200 text-green-800"*/}
                    {/*        }`}*/}
                    {/*    >*/}
                    {/*        {datas.status}*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
            )}

            {/* 모바일일 때는 간략 정보만 표시 */}
            {isMobile && (
                <div className="text-xs text-gray-600 text-center mt-1">
                    {datas.acdnt_occr_dt}
                </div>
            )}
        </div>
    );
}
