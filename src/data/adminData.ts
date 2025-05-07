// src/data/adminData.ts

export interface TouristSpot {
    name: string;
    code: string;
    status: string;
}

export interface WeatherCard {
    date: string;
    hour: string;
    status: string;
    icon: string;
    temperature: string;
    dust: {
        fineDust: string;
        ultraFineDust: string;
    };
}

export interface TouristInfo {
    spotName: string; // 이름
    spotCode: string; // 코드
    timestamp: string; // 측정시간
    participantCount: string; // 4단계 예측
}

export interface PopulationData {
    area_nm: string; // 지역명
    area_cd: string; // 지역 코드
    area_congest_lvl: string; // 지역 혼잡도 수준
    area_congest_msg: string; // 지역 혼잡도 메시지
    area_ppltn_min: number; // 지역 최소 인구
    area_ppltn_max: number; // 지역 최대 인구
    male_ppltn_rate: number; // 남성 인구 비율
    female_ppltn_rate: number; // 여성 인구 비율
    resnt_ppltn_rate: number; // 거주 인구 비율
    non_resnt_ppltn_rate: number; // 비거주 인구 비율
    replace_yn: string; // 대체 여부
    ppltn_time: string; // 인구 데이터 시간
    fcst_yn: string; // 예측 여부
    fcst_ppltn_wrapper: ForecastPopulationWrapper; // 예측 인구 데이터 래퍼
    ppltn_rates: number[]; // 연령별 인구 분포
}

// 전체 데이터 구조 인터페이스
export interface PopulationResponse {
    data: PopulationData[]; // 인구 데이터
}

export interface ForecastPopulationWrapper {
    fcst_ppltn: ForecastPopulation[]; // 예측 인구 데이터 배열
}

export interface ForecastPopulation {
    fcst_time: string; // 예측 시간
    fcst_congest_lvl: string; // 예측 혼잡도 수준
    fcst_ppltn_min: number; // 예측 최소 인구
    fcst_ppltn_max: number; // 예측 최대 인구
}

export interface Data {
    name: string;
    value: number;
    fill: string;
}

// 유저 즐겨찾기, 관리자 즐겨찾기 틀
export type Favorite = {
    favorite_id: number;
    type: string;
    name: string;
    address: string;
    place_id: string;
    user_id: string;
};

// 관리자 페이지 즐겨찾기 모아보기용
export interface UserFavoriteList {
    userId: string;
    favoriteList: Favorite[];
}

// 혼잡도가 높은 지역만 조회
export const touristSpots: TouristSpot[] = [
    { name: "여의도 한강공원", code: "POI072", status: "약간 붐빔" },
    { name: "국회의사당", code: "POI073", status: "약간 붐빔" },
    { name: "63스퀘어", code: "POI074", status: "붐빔" },
    { name: "여의도 봄꽃축제거리", code: "POI075", status: "붐빔" },
    { name: "IFC몰", code: "POI076", status: "약간 붐빔" },

    // 강남 지역
    { name: "강남역", code: "POI001", status: "붐빔" },
    { name: "코엑스", code: "POI002", status: "약간 붐빔" },
    { name: "삼성역", code: "POI003", status: "약간 붐빔" },
    { name: "압구정 로데오거리", code: "POI004", status: "약간 붐빔" },
    { name: "청담동 명품거리", code: "POI005", status: "붐빔" },

    // 명동/종로 지역
    { name: "명동 쇼핑거리", code: "POI011", status: "붐빔" },
    { name: "경복궁", code: "POI012", status: "약간 붐빔" },
    { name: "창덕궁", code: "POI013", status: "약간 붐빔" },
    { name: "광화문 광장", code: "POI014", status: "약간 붐빔" },
    { name: "인사동", code: "POI015", status: "붐빔" },

    // 홍대/이태원 지역
    { name: "홍대 걷고싶은거리", code: "POI021", status: "붐빔" },
    { name: "연남동", code: "POI022", status: "약간 붐빔" },
    { name: "경의선 숲길", code: "POI023", status: "약간 붐빔" },
    { name: "이태원 거리", code: "POI024", status: "약간 붐빔" },
    { name: "한강진역", code: "POI025", status: "붐빔" },

    // 한강 주변
    { name: "반포 한강공원", code: "POI031", status: "약간 붐빔" },
    { name: "뚝섬 한강공원", code: "POI032", status: "붐빔" },
    { name: "망원 한강공원", code: "POI033", status: "약간 붐빔" },
    { name: "잠실 한강공원", code: "POI034", status: "붐빔" },
    { name: "난지 한강공원", code: "POI035", status: "약간 붐빔" },

    // 북한산/도봉산 지역
    { name: "북한산국립공원", code: "POI041", status: "붐빔" },
    { name: "도봉산국립공원", code: "POI042", status: "약간 붐빔" },
    { name: "북한산 둘레길", code: "POI043", status: "붐빔" },

    // 서울 숲/동대문 지역
    { name: "서울숲공원", code: "POI051", status: "약간 붐빔" },
    { name: "동대문디자인플라자", code: "POI052", status: "약간 붐빔" },
    { name: "창신동 봉제골목", code: "POI053", status: "붐빔" },
    { name: "청계천", code: "POI054", status: "약간 붐빔" },
    { name: "동대문 쇼핑타운", code: "POI055", status: "붐빔" },

    // 잠실/송파 지역
    { name: "롯데월드", code: "POI061", status: "붐빔" },
    { name: "석촌호수", code: "POI062", status: "약간 붐빔" },
    { name: "올림픽공원", code: "POI063", status: "붐빔" },
    { name: "방이동 먹자골목", code: "POI064", status: "약간 붐빔" },
    { name: "가락시장", code: "POI065", status: "붐빔" },

    // 기타 지역
    { name: "남산타워", code: "POI081", status: "붐빔" },
    { name: "서울로7017", code: "POI082", status: "약간 붐빔" },
    { name: "덕수궁", code: "POI083", status: "붐빔" },
    { name: "창경궁", code: "POI084", status: "약간 붐빔" },
    { name: "노을공원", code: "POI085", status: "붐빔" },
];

// 단순 5일치 날씨 조회
export const weatherData: WeatherCard[] = [
    {
        date: "04-22",
        hour: "오늘",
        status: "맑음",
        icon: "☀️",
        temperature: "21°C",
        dust: {
            fineDust: "매우나쁨",
            ultraFineDust: "나쁨",
        },
    },
    {
        date: "04-23",
        hour: "내일",
        status: "구름조금",
        icon: "🌤️",
        temperature: "19°C",
        dust: {
            fineDust: "보통",
            ultraFineDust: "좋음",
        },
    },
    {
        date: "04-24",
        hour: "2일후",
        status: "비",
        icon: "🌧️",
        temperature: "18°C",
        dust: {
            fineDust: "좋음",
            ultraFineDust: "좋음",
        },
    },
    {
        date: "04-25",
        hour: "3일후",
        status: "흐림",
        icon: "☁️",
        temperature: "20°C",
        dust: {
            fineDust: "나쁨",
            ultraFineDust: "보통",
        },
    },
    {
        date: "04-26",
        hour: "4일후",
        status: "맑음",
        icon: "☀️",
        temperature: "22°C",
        dust: {
            fineDust: "보통",
            ultraFineDust: "좋음",
        },
    },
];

// 관광지별 혼잡도 조회
export const touristInfo: TouristInfo[] = [
    {
        spotName: "광화문/덕수궁",
        spotCode: "POI012",
        timestamp: "2025-04-22 10:05",
        participantCount: "보통",
    },
    {
        spotName: "명동 쇼핑거리",
        spotCode: "POI011",
        timestamp: "2025-04-22 10:15",
        participantCount: "붐빔",
    },
    {
        spotName: "롯데월드",
        spotCode: "POI061",
        timestamp: "2025-04-22 10:30",
        participantCount: "붐빔",
    },
    {
        spotName: "인사동",
        spotCode: "POI015",
        timestamp: "2025-04-22 10:45",
        participantCount: "약간 붐빔",
    },
    {
        spotName: "코엑스",
        spotCode: "POI002",
        timestamp: "2025-04-22 11:00",
        participantCount: "보통",
    },
    {
        spotName: "홍대 걷고싶은거리",
        spotCode: "POI021",
        timestamp: "2025-04-22 11:15",
        participantCount: "붐빔",
    },
    {
        spotName: "여의도 한강공원",
        spotCode: "POI072",
        timestamp: "2025-04-22 11:30",
        participantCount: "약간 붐빔",
    },
    {
        spotName: "북한산국립공원",
        spotCode: "POI041",
        timestamp: "2025-04-22 11:45",
        participantCount: "원활",
    },
    {
        spotName: "반포 한강공원",
        spotCode: "POI031",
        timestamp: "2025-04-22 12:00",
        participantCount: "약간 붐빔",
    },
    {
        spotName: "청계천",
        spotCode: "POI054",
        timestamp: "2025-04-22 12:15",
        participantCount: "원활",
    },
    {
        spotName: "강남역",
        spotCode: "POI001",
        timestamp: "2025-04-22 12:30",
        participantCount: "붐빔",
    },
    {
        spotName: "동대문디자인플라자",
        spotCode: "POI052",
        timestamp: "2025-04-22 12:45",
        participantCount: "약간 붐빔",
    },
    {
        spotName: "남산타워",
        spotCode: "POI081",
        timestamp: "2025-04-22 13:00",
        participantCount: "약간 붐빔",
    },
    {
        spotName: "이태원 거리",
        spotCode: "POI024",
        timestamp: "2025-04-22 13:15",
        participantCount: "보통",
    },
    {
        spotName: "올림픽공원",
        spotCode: "POI063",
        timestamp: "2025-04-22 13:30",
        participantCount: "원활",
    },
    {
        spotName: "63스퀘어",
        spotCode: "POI074",
        timestamp: "2025-04-22 13:45",
        participantCount: "약간 붐빔",
    },
    {
        spotName: "경복궁",
        spotCode: "POI012",
        timestamp: "2025-04-22 14:00",
        participantCount: "붐빔",
    },
    {
        spotName: "석촌호수",
        spotCode: "POI062",
        timestamp: "2025-04-22 14:15",
        participantCount: "보통",
    },
    {
        spotName: "서울숲공원",
        spotCode: "POI051",
        timestamp: "2025-04-22 14:30",
        participantCount: "원활",
    },
    {
        spotName: "청담동 명품거리",
        spotCode: "POI005",
        timestamp: "2025-04-22 14:45",
        participantCount: "약간 붐빔",
    },
];

// 해당 지역 상세보기 정보
export const dummyData: PopulationResponse = {
    data: [
        {
            area_nm: "광화문·덕수궁",
            area_cd: "POI009",
            area_congest_lvl: "보통",
            area_congest_msg:
                "사람이 몰려있을 수 있지만 크게 붐비지는 않아요. 도보 이동에 큰 제약이 없어요.",
            area_ppltn_min: 40000,
            area_ppltn_max: 43000,
            male_ppltn_rate: 48.1,
            female_ppltn_rate: 51.9,
            ppltn_rates: [0.1, 2.5, 16.4, 24.1, 26.5, 18.8, 8.0, 3.6],
            resnt_ppltn_rate: 29.6,
            non_resnt_ppltn_rate: 70.4,
            replace_yn: "N",
            ppltn_time: "2025-04-18 16:05",
            fcst_yn: "Y",
            fcst_ppltn_wrapper: {
                fcst_ppltn: [
                    {
                        fcst_time: "2025-04-18 00:00",
                        fcst_congest_lvl: "원활",
                        fcst_ppltn_min: 18000,
                        fcst_ppltn_max: 20000,
                    },
                    {
                        fcst_time: "2025-04-18 01:00",
                        fcst_congest_lvl: "원활",
                        fcst_ppltn_min: 14000,
                        fcst_ppltn_max: 16000,
                    },
                    {
                        fcst_time: "2025-04-18 02:00",
                        fcst_congest_lvl: "원활",
                        fcst_ppltn_min: 10000,
                        fcst_ppltn_max: 12000,
                    },
                ],
            },
        },
        {
            area_nm: "강남역",
            area_cd: "POI001",
            area_congest_lvl: "붐빔",
            area_congest_msg:
                "사람이 많아 도보 이동이 제한적이에요. 활동과 이동 시 불편함이 있을 수 있어요.",
            area_ppltn_min: 58000,
            area_ppltn_max: 62000,
            male_ppltn_rate: 46.3,
            female_ppltn_rate: 53.7,
            ppltn_rates: [0.2, 3.1, 22.5, 30.2, 25.7, 12.5, 4.3, 1.5],
            resnt_ppltn_rate: 15.3,
            non_resnt_ppltn_rate: 84.7,
            replace_yn: "N",
            ppltn_time: "2025-04-18 15:55",
            fcst_yn: "Y",
            fcst_ppltn_wrapper: {
                fcst_ppltn: [
                    {
                        fcst_time: "2025-04-18 00:00",
                        fcst_congest_lvl: "원활",
                        fcst_ppltn_min: 22000,
                        fcst_ppltn_max: 25000,
                    },
                    {
                        fcst_time: "2025-04-18 12:00",
                        fcst_congest_lvl: "붐빔",
                        fcst_ppltn_min: 62000,
                        fcst_ppltn_max: 66000,
                    },
                ],
            },
        },
        {
            area_nm: "코엑스",
            area_cd: "POI002",
            area_congest_lvl: "약간 붐빔",
            area_congest_msg:
                "사람이 몰려 도보 이동이 다소 불편할 수 있어요. 활동에 주의가 필요해요.",
            area_ppltn_min: 48000,
            area_ppltn_max: 52000,
            male_ppltn_rate: 44.8,
            female_ppltn_rate: 55.2,
            ppltn_rates: [0.8, 4.2, 18.5, 32.1, 28.3, 12.1, 3.5, 0.5],
            resnt_ppltn_rate: 8.7,
            non_resnt_ppltn_rate: 91.3,
            replace_yn: "N",
            ppltn_time: "2025-04-18 16:10",
            fcst_yn: "Y",
            fcst_ppltn_wrapper: {
                fcst_ppltn: [
                    {
                        fcst_time: "2025-04-18 00:00",
                        fcst_congest_lvl: "원활",
                        fcst_ppltn_min: 15000,
                        fcst_ppltn_max: 18000,
                    },
                    {
                        fcst_time: "2025-04-18 12:00",
                        fcst_congest_lvl: "약간 붐빔",
                        fcst_ppltn_min: 48000,
                        fcst_ppltn_max: 52000,
                    },
                ],
            },
        },
        {
            area_nm: "명동 쇼핑거리",
            area_cd: "POI011",
            area_congest_lvl: "붐빔",
            area_congest_msg:
                "사람이 많아 도보 이동이 제한적이에요. 활동과 이동 시 불편함이 있을 수 있어요.",
            area_ppltn_min: 56000,
            area_ppltn_max: 60000,
            male_ppltn_rate: 38.2,
            female_ppltn_rate: 61.8,
            ppltn_rates: [1.2, 5.5, 22.8, 35.2, 22.1, 9.2, 3.1, 0.9],
            resnt_ppltn_rate: 5.2,
            non_resnt_ppltn_rate: 94.8,
            replace_yn: "N",
            ppltn_time: "2025-04-18 16:15",
            fcst_yn: "Y",
            fcst_ppltn_wrapper: {
                fcst_ppltn: [
                    {
                        fcst_time: "2025-04-18 00:00",
                        fcst_congest_lvl: "보통",
                        fcst_ppltn_min: 25000,
                        fcst_ppltn_max: 28000,
                    },
                    {
                        fcst_time: "2025-04-18 12:00",
                        fcst_congest_lvl: "붐빔",
                        fcst_ppltn_min: 60000,
                        fcst_ppltn_max: 65000,
                    },
                ],
            },
        },
        {
            area_nm: "홍대 걷고싶은거리",
            area_cd: "POI021",
            area_congest_lvl: "붐빔",
            area_congest_msg:
                "사람이 많아 도보 이동이 제한적이에요. 활동과 이동 시 불편함이 있을 수 있어요.",
            area_ppltn_min: 55000,
            area_ppltn_max: 59000,
            male_ppltn_rate: 43.5,
            female_ppltn_rate: 56.5,
            ppltn_rates: [0.5, 7.8, 35.2, 32.5, 15.8, 6.2, 1.5, 0.5],
            resnt_ppltn_rate: 12.8,
            non_resnt_ppltn_rate: 87.2,
            replace_yn: "N",
            ppltn_time: "2025-04-18 16:20",
            fcst_yn: "Y",
            fcst_ppltn_wrapper: {
                fcst_ppltn: [
                    {
                        fcst_time: "2025-04-18 00:00",
                        fcst_congest_lvl: "약간 붐빔",
                        fcst_ppltn_min: 32000,
                        fcst_ppltn_max: 36000,
                    },
                    {
                        fcst_time: "2025-04-18 12:00",
                        fcst_congest_lvl: "보통",
                        fcst_ppltn_min: 38000,
                        fcst_ppltn_max: 42000,
                    },
                ],
            },
        },
    ],
};

// 날씨 예보 데이터 타입 정의
interface WeatherForecast {
    fcst_dt: string;
    pre_temp: number;
    pre_precipitation: string;
    pre_precpt_type: string;
    pre_rain_chance: number;
    pre_sky_stts: string;
}

// 날씨 데이터 타입 정의
interface WeatherData {
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

// 전체 데이터 구조 정의
interface WeatherResponse {
    data: WeatherData[];
}

// 더미 데이터 생성
export const weatherDummyData: WeatherResponse = {
    data: [
        {
            temp: 18.1,
            precipitation: "-",
            precpt_type: "없음",
            pcp_msg: "비 또는 눈 소식이 없어요.",
            sensible_temp: 18.1,
            max_temp: 18.0,
            min_temp: 8.0,
            pm25: 22,
            pm10: 46,
            area_nm: "덕수궁길·정동길",
            weather_time: "2025-04-24 17:10",
            fcst24hours: [
                {
                    fcst_dt: "202504241500",
                    pre_temp: 20.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504241600",
                    pre_temp: 19.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504241700",
                    pre_temp: 17.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "구름많음",
                },
                {
                    fcst_dt: "202504241800",
                    pre_temp: 15.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504241900",
                    pre_temp: 15.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504242000",
                    pre_temp: 13.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504242100",
                    pre_temp: 12.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504242200",
                    pre_temp: 11.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504242300",
                    pre_temp: 10.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504250000",
                    pre_temp: 10.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504250100",
                    pre_temp: 9.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504250200",
                    pre_temp: 9.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504250300",
                    pre_temp: 8.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504250400",
                    pre_temp: 8.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504250500",
                    pre_temp: 8.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504250600",
                    pre_temp: 8.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504250700",
                    pre_temp: 8.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504250800",
                    pre_temp: 10.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504250900",
                    pre_temp: 12.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504251000",
                    pre_temp: 14.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504251100",
                    pre_temp: 16.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504251200",
                    pre_temp: 17.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504251300",
                    pre_temp: 17.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
                {
                    fcst_dt: "202504251400",
                    pre_temp: 17.0,
                    pre_precipitation: "NaN",
                    pre_precpt_type: "없음",
                    pre_rain_chance: 0.0,
                    pre_sky_stts: "맑음",
                },
            ],
        },
    ],
};

export const sampleFavorites: Favorite[] = [
    {
        favorite_id: 1,
        type: "attraction",
        name: "에버랜드",
        address: "경기도 용인시",
        place_id: "place_01",
        user_id: "user_01",
    },
    {
        favorite_id: 2,
        type: "restaurant",
        name: "맛있는 식당",
        address: "서울시 강남구",
        place_id: "place_02",
        user_id: "user_01",
    },
    {
        favorite_id: 3,
        type: "cafe",
        name: "스타벅스 강남점",
        address: "서울시 강남구",
        place_id: "place_03",
        user_id: "user_01",
    },
    {
        favorite_id: 4,
        type: "hotel",
        name: "그랜드 호텔",
        address: "제주도 서귀포시",
        place_id: "place_04",
        user_id: "user_01",
    },
    {
        favorite_id: 5,
        type: "attraction",
        name: "롯데월드",
        address: "서울시 송파구",
        place_id: "place_05",
        user_id: "user_01",
    },
    {
        favorite_id: 6,
        type: "restaurant",
        name: "한식당",
        address: "서울시 중구",
        place_id: "place_06",
        user_id: "user_01",
    },
    {
        favorite_id: 7,
        type: "cafe",
        name: "투썸플레이스",
        address: "서울시 종로구",
        place_id: "place_07",
        user_id: "user_01",
    },
    {
        favorite_id: 8,
        type: "hotel",
        name: "웨스틴 조선",
        address: "서울시 중구",
        place_id: "place_08",
        user_id: "user_01",
    },
];
