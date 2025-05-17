// UserInfoShow.tsx
import React from "react";
import { UserInfo } from "../../../data/UserInfoData";
import { formatKoreanDate } from "../../../utils/dateUtil";

// Props 인터페이스 정의
interface UserInfoShowProps {
    userInfo: UserInfo;
}

const UserInfoShow: React.FC<UserInfoShowProps> = ({ userInfo }) => {
    return (
        <div className="bg-white rounded-lg p-6">
            <div className="flex flex-col space-y-2">
                <InfoItem label="아이디" value={userInfo.user_id} />
                <InfoItem label="닉네임" value={userInfo.nickname} />
                <InfoItem
                    label="가입일"
                    value={formatKoreanDate(userInfo.created_at)}
                />
                <InfoItem
                    label="출생년도"
                    value={userInfo.birth_year.toString()}
                />
                <InfoItem label="MBTI" value={userInfo.mbti} />
                <InfoItem
                    label="성별"
                    value={
                        userInfo.gender === "male"
                            ? "남성"
                            : userInfo.gender === "female"
                              ? "여성"
                              : "미지정"
                    }
                />
            </div>
        </div>
    );
};

// 정보 항목을 위한 재사용 가능한 컴포넌트
interface InfoItemProps {
    label: string;
    value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
    return (
        <div className="flex items-center py-2 border-b border-gray-100 last:border-0">
            <div className="w-24 font-semibold text-gray-700">{label}</div>
            <div className="text-gray-800 ml-4">{value}</div>
        </div>
    );
};

export default UserInfoShow;
