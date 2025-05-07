// UserInfo.ts - 사용자 데이터 타입

// 사용자 정보 인터페이스 정의
export interface UserInfo {
    user_id: string;
    nickname: string;
    password: string;
    chk_password: string;
    birth_year: number;
    mbti: string;
    gender: string;
    join_date: string;
}

// 초기 더미 데이터
export const initialUserData: UserInfo = {
    user_id: "lightning0145@naver.com",
    nickname: "김민석",
    password: "",
    chk_password: "",
    birth_year: 2001,
    mbti: "INTP",
    gender: "남",
    join_date: "2025.04.29",
};
