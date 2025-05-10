// UserInfoShow.tsx
import React from "react";
import { UserInfo } from "../../../data/UserInfoData";

// Props 인터페이스 정의
interface UserInfoShowProps {
    userInfo: UserInfo;
}

const UserInfoShow: React.FC<UserInfoShowProps> = ({ userInfo }) => {
    return (
        <div className="p-2 md:p-4">
            <div className="p-2 md:p-4 mb-2 md:mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>아이디:</strong> {userInfo.user_id}
                    </p>
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>닉네임:</strong> {userInfo.nickname}
                    </p>
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>가입일:</strong> {userInfo.created_at}
                    </p>
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>생년월일:</strong> {userInfo.birth_year}
                    </p>
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>MBTI:</strong> {userInfo.mbti}
                    </p>
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>성별:</strong>{" "}
                        {userInfo.gender === "male"
                            ? "남성"
                            : userInfo.gender === "female"
                              ? "여성"
                              : ""}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserInfoShow;
