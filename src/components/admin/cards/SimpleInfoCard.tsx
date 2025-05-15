import React from "react";

interface InfoProps {
    info: {
        area_name: string;
        area_code: string;
        area_congest_lvl: string;
    };
}

const SimpleInfoCard = ({ info }: InfoProps) => {
    return (
        // 카드 하나에서 둘로 나눔
        <div className="xl:col-span-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                <div className="bg-white p-2 rounded-lg shadow flex flex-col h-full">
                    <h3 className="font-semibold text-xl text-black">지역명</h3>
                    <p className="text-black text-center font-bold text-3xl my-auto">
                        {info.area_name}
                    </p>
                    <p className="text-gray-600 text-center text-sm">
                        {info.area_code}
                    </p>
                </div>
                <div
                    className={`${info.area_congest_lvl === "여유" ? "bg-green-500" : info.area_congest_lvl === "보통" ? "bg-yellow-400" : info.area_congest_lvl === "약간 붐빔" ? "bg-orange-500" : "bg-red-500"} p-2 rounded-lg shadow flex flex-col h-full`}
                >
                    <h3 className="font-semibold text-xl text-black">
                        혼잡정도
                    </h3>
                    <p className="text-white text-center text-5xl font-bold my-auto">
                        {info.area_congest_lvl}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SimpleInfoCard;
