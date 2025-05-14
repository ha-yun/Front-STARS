// src/data/adminData.ts

export interface TouristSpot {
    area_nm: string;
    area_cd: string;
    area_congest_lvl: string;
}

export interface WeatherCardType {
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
    fcst_ppltn: ForecastPopulation[]; // 예측 인구 데이터 래퍼
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
    user_id: string;
    content: Favorite[];
}

export interface ParkInfo {
    area_nm: string;
    get_time: string;
    pk_time: string;
    prk_stts: ParkPlaceInfo[];
}

type ParkPlaceInfo = {
    add_rates: number;
    add_time_rates: number;
    address: string;
    cpcty: number;
    cur_prk_cnt: number;
    cur_prk_yn: string;
    cur_prk_time: string;
    lat: number;
    lon: number;
    pay_yn: string;
    prk_cd: string;
    prk_name: string;
    prk_type: string;
    rates: number;
    road_addr: string;
    time_rates: number;
};

// 혼잡도가 높은 지역만 조회
export const touristSpots: TouristSpot[] = [
    {
        area_nm: "여의도 한강공원",
        area_cd: "POI072",
        area_congest_lvl: "약간 붐빔",
    },
    { area_nm: "국회의사당", area_cd: "POI073", area_congest_lvl: "약간 붐빔" },
    { area_nm: "63스퀘어", area_cd: "POI074", area_congest_lvl: "붐빔" },
    {
        area_nm: "여의도 봄꽃축제거리",
        area_cd: "POI075",
        area_congest_lvl: "붐빔",
    },
    { area_nm: "IFC몰", area_cd: "POI076", area_congest_lvl: "약간 붐빔" },

    // 강남 지역
    { area_nm: "강남역", area_cd: "POI001", area_congest_lvl: "붐빔" },
    { area_nm: "코엑스", area_cd: "POI002", area_congest_lvl: "약간 붐빔" },
    { area_nm: "삼성역", area_cd: "POI003", area_congest_lvl: "약간 붐빔" },
    {
        area_nm: "압구정 로데오거리",
        area_cd: "POI004",
        area_congest_lvl: "약간 붐빔",
    },
    { area_nm: "청담동 명품거리", area_cd: "POI005", area_congest_lvl: "붐빔" },

    // 명동/종로 지역
    { area_nm: "명동 쇼핑거리", area_cd: "POI011", area_congest_lvl: "붐빔" },
    { area_nm: "경복궁", area_cd: "POI012", area_congest_lvl: "약간 붐빔" },
    { area_nm: "창덕궁", area_cd: "POI013", area_congest_lvl: "약간 붐빔" },
    {
        area_nm: "광화문 광장",
        area_cd: "POI014",
        area_congest_lvl: "약간 붐빔",
    },
    { area_nm: "인사동", area_cd: "POI015", area_congest_lvl: "붐빔" },

    // 홍대/이태원 지역
    {
        area_nm: "홍대 걷고싶은거리",
        area_cd: "POI021",
        area_congest_lvl: "붐빔",
    },
    { area_nm: "연남동", area_cd: "POI022", area_congest_lvl: "약간 붐빔" },
    {
        area_nm: "경의선 숲길",
        area_cd: "POI023",
        area_congest_lvl: "약간 붐빔",
    },
    {
        area_nm: "이태원 거리",
        area_cd: "POI024",
        area_congest_lvl: "약간 붐빔",
    },
    { area_nm: "한강진역", area_cd: "POI025", area_congest_lvl: "붐빔" },

    // 한강 주변
    {
        area_nm: "반포 한강공원",
        area_cd: "POI031",
        area_congest_lvl: "약간 붐빔",
    },
    { area_nm: "뚝섬 한강공원", area_cd: "POI032", area_congest_lvl: "붐빔" },
    {
        area_nm: "망원 한강공원",
        area_cd: "POI033",
        area_congest_lvl: "약간 붐빔",
    },
    { area_nm: "잠실 한강공원", area_cd: "POI034", area_congest_lvl: "붐빔" },
    {
        area_nm: "난지 한강공원",
        area_cd: "POI035",
        area_congest_lvl: "약간 붐빔",
    },

    // 북한산/도봉산 지역
    { area_nm: "북한산국립공원", area_cd: "POI041", area_congest_lvl: "붐빔" },
    {
        area_nm: "도봉산국립공원",
        area_cd: "POI042",
        area_congest_lvl: "약간 붐빔",
    },
    { area_nm: "북한산 둘레길", area_cd: "POI043", area_congest_lvl: "붐빔" },

    // 서울 숲/동대문 지역
    { area_nm: "서울숲공원", area_cd: "POI051", area_congest_lvl: "약간 붐빔" },
    {
        area_nm: "동대문디자인플라자",
        area_cd: "POI052",
        area_congest_lvl: "약간 붐빔",
    },
    { area_nm: "창신동 봉제골목", area_cd: "POI053", area_congest_lvl: "붐빔" },
    { area_nm: "청계천", area_cd: "POI054", area_congest_lvl: "약간 붐빔" },
    { area_nm: "동대문 쇼핑타운", area_cd: "POI055", area_congest_lvl: "붐빔" },

    // 잠실/송파 지역
    { area_nm: "롯데월드", area_cd: "POI061", area_congest_lvl: "붐빔" },
    { area_nm: "석촌호수", area_cd: "POI062", area_congest_lvl: "약간 붐빔" },
    { area_nm: "올림픽공원", area_cd: "POI063", area_congest_lvl: "붐빔" },
    {
        area_nm: "방이동 먹자골목",
        area_cd: "POI064",
        area_congest_lvl: "약간 붐빔",
    },
    { area_nm: "가락시장", area_cd: "POI065", area_congest_lvl: "붐빔" },

    // 기타 지역
    { area_nm: "남산타워", area_cd: "POI081", area_congest_lvl: "붐빔" },
    { area_nm: "서울로7017", area_cd: "POI082", area_congest_lvl: "약간 붐빔" },
    { area_nm: "덕수궁", area_cd: "POI083", area_congest_lvl: "붐빔" },
    { area_nm: "창경궁", area_cd: "POI084", area_congest_lvl: "약간 붐빔" },
    { area_nm: "노을공원", area_cd: "POI085", area_congest_lvl: "붐빔" },
];

// 단순 5일치 날씨 조회
export const weatherData: WeatherCardType[] = [
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

// 날씨 예보 데이터 타입 정의
export interface WeatherForecast {
    fcst_dt: string;
    pre_temp: number;
    pre_precipitation: string;
    pre_precpt_type: string;
    pre_rain_chance: number;
    pre_sky_stts: string;
}

// 날씨 데이터 타입 정의
export interface WeatherData {
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
export interface WeatherResponse {
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
