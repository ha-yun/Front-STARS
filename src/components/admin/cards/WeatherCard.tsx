import React from "react";
import { WeatherData } from "../../../data/adminData";

interface WeatherCardProps {
    datas: WeatherData | undefined;
}

// Helper function to get background color based on temperature
const getTempColor = (temp: number): string => {
    if (temp >= 30) return "from-red-500 to-orange-400";
    if (temp >= 25) return "from-orange-400 to-yellow-300";
    if (temp >= 20) return "from-yellow-300 to-yellow-200";
    if (temp >= 15) return "from-blue-300 to-blue-200";
    if (temp >= 10) return "from-blue-400 to-blue-300";
    return "from-blue-600 to-blue-400";
};

// Helper function to get weather icon based on sky status
const getWeatherIcon = (skyStatus: string): string => {
    switch (skyStatus) {
        case "맑음":
            return "☀️";
        case "구름조금":
            return "🌤️";
        case "구름많음":
            return "⛅";
        case "흐림":
            return "☁️";
        case "비":
            return "🌧️";
        case "눈":
            return "❄️";
        default:
            return "☁️";
    }
};

// Helper function to get PM10 (fine dust) status
const getPM10Status = (pm10: number): { text: string; color: string } => {
    if (pm10 <= 30) return { text: "좋음", color: "text-green-500" };
    if (pm10 <= 80) return { text: "보통", color: "text-blue-500" };
    if (pm10 <= 150) return { text: "나쁨", color: "text-orange-500" };
    return { text: "매우나쁨", color: "text-red-500" };
};

// Helper function to get PM2.5 (ultra fine dust) status
const getPM25Status = (pm25: number): { text: string; color: string } => {
    if (pm25 <= 15) return { text: "좋음", color: "text-green-500" };
    if (pm25 <= 35) return { text: "보통", color: "text-blue-500" };
    if (pm25 <= 75) return { text: "나쁨", color: "text-orange-500" };
    return { text: "매우나쁨", color: "text-red-500" };
};

// Format time from "202505141700" to "17:00"
const formatForecastTime = (timeString: string): string => {
    return `${timeString.slice(8, 10)}:${timeString.slice(10, 12)}`;
};

// WeatherCard component
const WeatherCard = ({ datas }: WeatherCardProps) => {
    // If no data, show "No data" message
    // console.log("WeatherCard", datas);

    if (!datas) {
        return (
            <div className="bg-white p-2 shadow rounded-lg flex flex-col h-full">
                <h3 className="font-semibold text-xl text-black">날씨 상황</h3>
                <p className="text-black text-3xl text-center font-bold my-auto">
                    데이터가 없습니다.
                </p>
            </div>
        );
    }

    // Use the first weather data (we can enhance to show multiple locations if needed)
    const weatherData = datas;
    console.log("정제된 데이터: ", weatherData);

    // Add safety checks for all data access
    const hasForecast =
        weatherData &&
        weatherData.fcst24hours &&
        Array.isArray(weatherData.fcst24hours);

    // Get forecast data for next 24 hours (sliced to first 6 entries for display)
    const forecastItems = hasForecast
        ? weatherData.fcst24hours.slice(0, 6)
        : [];

    // Get PM10 and PM2.5 status with default values if missing
    const pm10 =
        weatherData && typeof weatherData.pm10 === "number"
            ? weatherData.pm10
            : 0;
    const pm25 =
        weatherData && typeof weatherData.pm25 === "number"
            ? weatherData.pm25
            : 0;
    const pm10Status = getPM10Status(pm10);
    const pm25Status = getPM25Status(pm25);

    return (
        <div
            className={`bg-gradient-to-br ${getTempColor(weatherData?.temp || 20)} p-2 shadow rounded-lg flex flex-col h-full text-black`}
        >
            {/* Header: Title and location */}
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-black">날씨 상황</h3>
                <span className="text-sm font-medium">
                    {weatherData?.area_nm || "위치 정보 없음"}
                </span>
            </div>

            {/* Current temperature and conditions */}
            <div className="flex items-center justify-between mt-2">
                <div>
                    <p className="text-4xl font-bold">
                        {weatherData?.temp || "?"}°C
                    </p>
                    <p className="text-sm">
                        체감 {weatherData?.sensible_temp || "?"}°C
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-4xl mb-1">
                        {hasForecast && forecastItems.length > 0
                            ? getWeatherIcon(
                                  forecastItems[0]?.pre_sky_stts || "흐림"
                              )
                            : "☁️"}
                    </div>
                    <p className="text-sm">
                        {hasForecast && forecastItems.length > 0
                            ? forecastItems[0]?.pre_sky_stts || "정보 없음"
                            : "정보 없음"}
                    </p>
                </div>
            </div>

            {/* Min/Max temperature */}
            <div className="flex justify-between text-sm mt-2">
                <span>최저 {weatherData?.min_temp || "?"}°C</span>
                <span>최고 {weatherData?.max_temp || "?"}°C</span>
            </div>

            {/* Air quality */}
            <div className="mt-2 bg-white/20 rounded-md p-1.5 text-xs">
                <div className="flex justify-between">
                    <span>미세먼지</span>
                    <span className={pm10Status.color}>
                        {pm10Status.text} ({pm10})
                    </span>
                </div>
                <div className="flex justify-between mt-1">
                    <span>초미세먼지</span>
                    <span className={pm25Status.color}>
                        {pm25Status.text} ({pm25})
                    </span>
                </div>
            </div>

            {/* Precipitation message */}
            <div className="text-xs mt-2 bg-white/20 rounded-md p-1.5">
                <p>{weatherData?.pcp_msg || "강수 정보 없음"}</p>
            </div>

            {/* Forecast */}
            {hasForecast && forecastItems.length > 0 ? (
                <div className="mt-2 overflow-x-auto">
                    <div className="flex justify-between text-center">
                        {forecastItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center mx-1"
                            >
                                <span className="text-xs whitespace-nowrap">
                                    {formatForecastTime(item.fcst_dt)}
                                </span>
                                <span className="my-1">
                                    {getWeatherIcon(item.pre_sky_stts)}
                                </span>
                                <span className="text-xs">
                                    {item.pre_temp}°
                                </span>
                                {item.pre_rain_chance > 0 && (
                                    <span className="text-xs mt-0.5 text-blue-200">
                                        {item.pre_rain_chance}%
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-2 text-center text-xs bg-white/20 rounded-md p-1.5">
                    <p>예보 정보가 없습니다</p>
                </div>
            )}

            {/* Update time */}
            <div className="mt-auto pt-1 text-xs text-right opacity-80">
                {weatherData?.weather_time || "시간 정보 없음"} 기준
            </div>
        </div>
    );
};

export default WeatherCard;
