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
    spotName: string;
    spotCode: string;
    timestamp: string;
    participantCount: string;
}

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
