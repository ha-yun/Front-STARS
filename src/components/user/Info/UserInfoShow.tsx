// UserInfoShow.tsx
import React from "react";

const UserInfoShow = () => {
    // 하드코딩된 사용자 정보
    // 나중에 API 호출로 사용자 정보 받아오기
    return (
        <div className="p-2 md:p-4">
            <div className="p-2 md:p-4 mb-2 md:mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>아이디:</strong> lightning0145@naver.com
                    </p>
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>닉네임:</strong> 김민석
                    </p>
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>가입일:</strong> 2025.04.29
                    </p>
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>생년월일:</strong> 2001.11.07
                    </p>
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>MBTI:</strong> INTP
                    </p>
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>성별:</strong> 남
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserInfoShow;
