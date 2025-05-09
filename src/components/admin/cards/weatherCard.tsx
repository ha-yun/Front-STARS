// Alternative solution: Modify weatherCard.tsx to accept the new format

import { getDustColor } from "./dustColor";
import { WeatherForecast } from "../../../data/adminData";

// This is the new format used in AdminComponent
export interface WeatherCardType {
    date: string;
    hour: string;
    icon: string;
    status: string;
    temperature: string;
    maxTemp?: string;
    minTemp?: string;
    sensibleTemp?: string;
    precipitation?: string;
    precipitationType?: string;
    precipitationMessage?: string;
    areaName?: string;
    dust: {
        fineDust: string;
        ultraFineDust: string;
    };
    forecast?: WeatherForecast[];
}

export const WeatherCard = (props: WeatherCardType) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
            {/* Date, time and location header */}
            <div className="p-2 text-center text-base font-medium bg-blue-100 border-b border-blue-200 text-black">
                {props.date}
                <div className="text-sm text-blue-700">{props.hour}</div>
                <div className="text-xs text-blue-500 mt-1">
                    {props.areaName}
                </div>
            </div>

            {/* Weather icon and temperature */}
            <div className="p-3 text-center">
                <div className="text-4xl mb-2">{props.icon}</div>
                <div className="text-sm mb-1 text-black">{props.status}</div>
                <div className="font-bold text-2xl text-blue-800">
                    {props.temperature}
                </div>

                {/* Temperature details */}
                <div className="flex justify-center text-xs mt-1 space-x-2">
                    <span className="text-blue-600">최저: {props.minTemp}</span>
                    <span className="text-red-600">최고: {props.maxTemp}</span>
                </div>
                <div className="text-xs mt-1 text-gray-600">
                    체감: {props.sensibleTemp}
                </div>

                {/* Precipitation info */}
                <div className="mt-2 text-xs text-gray-700 bg-gray-50 p-1 rounded">
                    {props.precipitationMessage}
                </div>
            </div>

            {/* Fine dust information */}
            <div className="border-t border-gray-200 p-2 bg-gray-50">
                <div className="flex justify-between items-center mb-1 text-sm">
                    <div className="font-medium text-black">미세먼지:</div>
                    <div
                        className={`font-medium ${getDustColor(props.dust.fineDust)}`}
                    >
                        {props.dust.fineDust}
                    </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="font-medium text-black">초미세먼지:</div>
                    <div
                        className={`font-medium ${getDustColor(props.dust.ultraFineDust)}`}
                    >
                        {props.dust.ultraFineDust}
                    </div>
                </div>
            </div>
        </div>
    );
};
