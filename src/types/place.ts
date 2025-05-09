// src/types/place.ts

export interface WeeklyStat {
    day: string; // 요일
    population: number; // 인구 수
}

export interface Place {
    name: string; // 장소 이름
    address: string; // 주소
    image: string; // 이미지 URL
    todayVisitors: number; // 오늘 방문자 수
    weeklyStats: WeeklyStat[]; // 주간 통계
    events: string[]; // 행사 리스트
    tags: string[]; // 키워드 태그
}
