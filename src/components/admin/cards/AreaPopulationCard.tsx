import React from "react";

interface PopulationProps {
    population: {
        area_ppltn_min: number;
        area_ppltn_max: number;
    };
}

const AreaPopulationCard = ({ population }: PopulationProps) => {
    return (
        <div className="bg-white p-2 shadow rounded-lg flex flex-col h-full">
            <h3 className="font-semibold text-xl text-black">현재 인구 추이</h3>
            <p className="text-black text-xl lg:text-4xl text-center font-bold my-auto">
                {population.area_ppltn_min}명 ~ {population.area_ppltn_max}명
            </p>
        </div>
    );
};
export default AreaPopulationCard;
