// UserInfo.ts - 사용자 데이터 타입

// 사용자 정보 인터페이스 정의
export interface UserInfo {
    member_id: string;
    created_at: string;
    user_id: string;
    nickname: string;
    password: string;
    chk_password: string;
    birth_year: number;
    mbti: string;
    gender: string;
}
