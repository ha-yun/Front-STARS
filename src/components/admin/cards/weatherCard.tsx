import { getDustColor } from "./dustColor";
import { WeatherForecast } from "../../../data/adminData";

interface WeatherCardProps {
    temp: number;
    precipitation: string;
    precpt_type: string;
    pcp_msg: string;
    sensible_temp: number;
    max_temp: number;
    min_temp: number;
    pm25: number;
    pm10: number;
    area_nm: string;
    weather_time: string;
    fcst24hours: WeatherForecast[];
}

export const WeatherCard = ({
    temp,
    precipitation,
    precpt_type,
    pcp_msg,
    sensible_temp,
    max_temp,
    min_temp,
    pm25,
    pm10,
    area_nm,
    weather_time,
    fcst24hours,
}: WeatherCardProps) => {
    // Format date and time from weather_time
    const dateTime = new Date(weather_time);
    const formattedDate = `${String(dateTime.getMonth() + 1).padStart(2, "0")}-${String(dateTime.getDate()).padStart(2, "0")}`;
    const formattedHour = `${String(dateTime.getHours()).padStart(2, "0")}:${String(dateTime.getMinutes()).padStart(2, "0")}`;

    // Determine weather icon and status based on fcst24hours
    let weatherIcon = "☀️"; // Default: Sunny
    let weatherStatus = "맑음";

    if (fcst24hours && fcst24hours.length > 0) {
        weatherStatus = fcst24hours[0]?.pre_sky_stts || "맑음";

        if (weatherStatus.includes("맑음")) {
            weatherIcon = "☀️";
        } else if (weatherStatus.includes("구름")) {
            weatherIcon = weatherStatus.includes("많음") ? "☁️" : "🌤️";
        } else if (weatherStatus.includes("비")) {
            weatherIcon = "🌧️";
        } else if (weatherStatus.includes("눈")) {
            weatherIcon = "❄️";
        }
    }

    // Determine dust levels
    const getDustLevelText = (value: number): string => {
        if (value <= 15) return "좋음";
        if (value <= 35) return "보통";
        if (value <= 75) return "나쁨";
        return "매우나쁨";
    };

    const fineDustLevel = getDustLevelText(pm10);
    const ultraFineDustLevel = getDustLevelText(pm25);

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
            {/* Date, time and location header */}
            <div className="p-2 text-center text-base font-medium bg-blue-100 border-b border-blue-200 text-black">
                {formattedDate}
                <div className="text-sm text-blue-700">{formattedHour}</div>
                <div className="text-xs text-blue-500 mt-1">{area_nm}</div>
            </div>

            {/* Weather icon and temperature */}
            <div className="p-3 text-center">
                <div className="text-4xl mb-2">{weatherIcon}</div>
                <div className="text-sm mb-1 text-black">{weatherStatus}</div>
                <div className="font-bold text-2xl text-blue-800">{temp}°C</div>

                {/* Temperature details */}
                <div className="flex justify-center text-xs mt-1 space-x-2">
                    <span className="text-blue-600">최저: {min_temp}°C</span>
                    <span className="text-red-600">최고: {max_temp}°C</span>
                </div>
                <div className="text-xs mt-1 text-gray-600">
                    체감: {sensible_temp}°C
                </div>

                {/* Precipitation info */}
                <div className="mt-2 text-xs text-gray-700 bg-gray-50 p-1 rounded">
                    {pcp_msg}
                </div>
            </div>

            {/* Fine dust information */}
            <div className="border-t border-gray-200 p-2 bg-gray-50">
                <div className="flex justify-between items-center mb-1 text-sm">
                    <div className="font-medium text-black">미세먼지:</div>
                    <div
                        className={`font-medium ${getDustColor(fineDustLevel)}`}
                    >
                        {fineDustLevel}
                    </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="font-medium text-black">초미세먼지:</div>
                    <div
                        className={`font-medium ${getDustColor(ultraFineDustLevel)}`}
                    >
                        {ultraFineDustLevel}
                    </div>
                </div>
            </div>
        </div>
    );
};
