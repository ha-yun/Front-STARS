// src/types/EventTypes.ts
export interface EventData {
    category: string;
    gu: string;
    title: string;
    place: string;
    organization: string;
    target: string;
    fee: string;
    website: string;
    image: string;
    start_date: string;
    end_date: string;
    place_longitude: number;
    place_latitude: number;
    is_free: string;
    homepage: string;
}

// src/data/eventData.ts
export const events: EventData[] = [
    {
        category: "전시/미술",
        gu: "강남구",
        title: "K-핸드메이드페어 2025",
        place: "서울 삼성동 코엑스 1층 B홀",
        organization: "기타",
        target: "누구나",
        fee: "사전 예매가: 8,000원, 현장 구매가: 10,000원",
        website: "https://k-handmade.com/",
        image: "https://culture.seoul.go.kr/cmmn/file/getImage.do?atchFileId=42afe00583eb4b0983dba37a04a41222&thumb=Y",
        start_date: "2025-12-18 00:00:00.0",
        end_date: "2025-12-21 00:00:00.0",
        place_longitude: 37.5118239121138,
        place_latitude: 127.059159043842,
        is_free: "유료",
        homepage:
            "https://culture.seoul.go.kr/culture/culture/cultureEvent/view.do?cultcode=152033&menuNo=200009",
    },
    {
        category: "공연/연극",
        gu: "종로구",
        title: "2025 세종문화회관 신년음악회",
        place: "세종문화회관 대극장",
        organization: "세종문화회관",
        target: "8세 이상",
        fee: "R석 70,000원, S석 50,000원, A석 30,000원",
        website: "https://www.sejongpac.or.kr/",
        image: "https://culture.seoul.go.kr/cmmn/file/getImage.do?atchFileId=89bfe127cfe94b3b9f2c6d8e4c62b1a3&thumb=Y",
        start_date: "2025-01-03 00:00:00.0",
        end_date: "2025-01-05 00:00:00.0",
        place_longitude: 37.5721747,
        place_latitude: 126.9760916,
        is_free: "유료",
        homepage:
            "https://culture.seoul.go.kr/culture/culture/cultureEvent/view.do?cultcode=153042&menuNo=200008",
    },
    {
        category: "축제",
        gu: "중구",
        title: "서울라이트 2025",
        place: "동대문디자인플라자(DDP)",
        organization: "서울디자인재단",
        target: "누구나",
        fee: "무료",
        website: "https://www.seoullight.kr/",
        image: "https://culture.seoul.go.kr/cmmn/file/getImage.do?atchFileId=67afc124e5c14f9c89db42e81a5f2c11&thumb=Y",
        start_date: "2025-12-20 00:00:00.0",
        end_date: "2026-01-05 00:00:00.0",
        place_longitude: 37.5670998,
        place_latitude: 127.0090185,
        is_free: "무료",
        homepage:
            "https://culture.seoul.go.kr/culture/culture/cultureEvent/view.do?cultcode=154022&menuNo=200011",
    },
    {
        category: "교육/체험",
        gu: "서초구",
        title: "2025 국립국악원 설맞이 큰 잔치",
        place: "국립국악원 예악당",
        organization: "국립국악원",
        target: "6세 이상",
        fee: "전석 20,000원",
        website: "https://www.gugak.go.kr/",
        image: "https://culture.seoul.go.kr/cmmn/file/getImage.do?atchFileId=34cfd12a8bcf4f7e90ef5a7b32c44d22&thumb=Y",
        start_date: "2025-02-01 00:00:00.0",
        end_date: "2025-02-05 00:00:00.0",
        place_longitude: 37.4766457,
        place_latitude: 127.0046926,
        is_free: "유료",
        homepage:
            "https://culture.seoul.go.kr/culture/culture/cultureEvent/view.do?cultcode=155031&menuNo=200012",
    },
    {
        category: "전시/미술",
        gu: "용산구",
        title: "위대한 예술가들: 르네상스부터 현대까지",
        place: "국립중앙박물관 특별전시실",
        organization: "국립중앙박물관",
        target: "전체관람가",
        fee: "성인 15,000원, 청소년 10,000원, 어린이 5,000원",
        website: "https://www.museum.go.kr/",
        image: "https://culture.seoul.go.kr/cmmn/file/getImage.do?atchFileId=54bfa23c7dfd4e1b88ef3b7e12c55d33&thumb=Y",
        start_date: "2025-05-10 00:00:00.0",
        end_date: "2025-08-31 00:00:00.0",
        place_longitude: 37.5240683,
        place_latitude: 126.9803819,
        is_free: "유료",
        homepage:
            "https://culture.seoul.go.kr/culture/culture/cultureEvent/view.do?cultcode=156014&menuNo=200009",
    },
    {
        category: "공연/콘서트",
        gu: "송파구",
        title: "2025 서울 썸머 재즈 페스티벌",
        place: "올림픽공원 88잔디마당",
        organization: "문화체육관광부",
        target: "누구나",
        fee: "1일권 88,000원, 2일권 150,000원",
        website: "https://seouljazzfestival.kr/",
        image: "https://culture.seoul.go.kr/cmmn/file/getImage.do?atchFileId=76aed13b9ca24d7a91ef4c6e22d55f44&thumb=Y",
        start_date: "2025-07-25 00:00:00.0",
        end_date: "2025-07-27 00:00:00.0",
        place_longitude: 37.5202973,
        place_latitude: 127.1214941,
        is_free: "유료",
        homepage:
            "https://culture.seoul.go.kr/culture/culture/cultureEvent/view.do?cultcode=157025&menuNo=200008",
    },
    {
        category: "축제",
        gu: "영등포구",
        title: "여의도 봄꽃축제",
        place: "여의도 윤중로",
        organization: "영등포구청",
        target: "누구나",
        fee: "무료",
        website: "https://www.ydp.go.kr/",
        image: "https://culture.seoul.go.kr/cmmn/file/getImage.do?atchFileId=82abc23d6fea4c1b93ef5a7e32d55e55&thumb=Y",
        start_date: "2025-04-05 00:00:00.0",
        end_date: "2025-04-13 00:00:00.0",
        place_longitude: 37.525641,
        place_latitude: 126.9337368,
        is_free: "무료",
        homepage:
            "https://culture.seoul.go.kr/culture/culture/cultureEvent/view.do?cultcode=158016&menuNo=200011",
    },
    {
        category: "교육/체험",
        gu: "마포구",
        title: "서울 미래기술 페어 2025",
        place: "상암 누리꿈스퀘어",
        organization: "서울디지털재단",
        target: "누구나",
        fee: "성인 12,000원, 학생 8,000원",
        website: "https://www.seoultechfair.kr/",
        image: "https://culture.seoul.go.kr/cmmn/file/getImage.do?atchFileId=98dfe33c8eef5f2c99ef6b8f42d66e44&thumb=Y",
        start_date: "2025-09-15 00:00:00.0",
        end_date: "2025-09-20 00:00:00.0",
        place_longitude: 37.579595,
        place_latitude: 126.8868057,
        is_free: "유료",
        homepage:
            "https://culture.seoul.go.kr/culture/culture/cultureEvent/view.do?cultcode=159037&menuNo=200012",
    },
    {
        category: "전시/미술",
        gu: "종로구",
        title: "한국 전통 공예의 미",
        place: "국립민속박물관",
        organization: "문화재청",
        target: "전체관람가",
        fee: "무료",
        website: "https://www.nfm.go.kr/",
        image: "https://culture.seoul.go.kr/cmmn/file/getImage.do?atchFileId=65efa24d8bcf5e7f90ef6a8c32d66f55&thumb=Y",
        start_date: "2025-03-01 00:00:00.0",
        end_date: "2025-05-31 00:00:00.0",
        place_longitude: 37.5815354,
        place_latitude: 126.978917,
        is_free: "무료",
        homepage:
            "https://culture.seoul.go.kr/culture/culture/cultureEvent/view.do?cultcode=160048&menuNo=200009",
    },
    {
        category: "공연/연극",
        gu: "중구",
        title: "명동 거리 뮤지컬 페스티벌",
        place: "명동 일대",
        organization: "서울시",
        target: "누구나",
        fee: "무료",
        website: "https://www.myeongdongfestival.kr/",
        image: "https://culture.seoul.go.kr/cmmn/file/getImage.do?atchFileId=45cfd23e9cdf6f8f91ef7b9f42e77f66&thumb=Y",
        start_date: "2025-06-10 00:00:00.0",
        end_date: "2025-06-15 00:00:00.0",
        place_longitude: 37.5635087,
        place_latitude: 126.9829792,
        is_free: "무료",
        homepage:
            "https://culture.seoul.go.kr/culture/culture/cultureEvent/view.do?cultcode=161059&menuNo=200008",
    },
];
