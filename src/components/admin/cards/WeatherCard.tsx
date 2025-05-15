import React from "react";
import { WeatherData } from "../../../data/adminData";

interface WeatherCardProps {
    datas: WeatherData[];
}

const WeatherCard = ({ datas }: WeatherCardProps) => {
    console.log("받은 날씨 데이터: ", datas);
    return (
        <>
            <div className="bg-white p-2 shadow rounded-lg  flex flex-col h-full">
                <h3 className="font-semibold text-xl text-black">날씨 상황</h3>
                <p className="text-black text-3xl text-center font-bold my-auto"></p>
            </div>
        </>
    );
};
export default WeatherCard;
