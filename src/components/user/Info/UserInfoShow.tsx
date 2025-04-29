// UserInfoShow.tsx
import React from "react";

const UserInfoShow = () => {
    // 하드코딩된 사용자 정보를 표시합니다
    return (
        <div className="p-4">
            <div className="p-4 mb-4">
                <p className="text-gray-800 mb-2">
                    <strong>아이디:</strong> lightning0145@naver.com
                </p>
                <p className="text-gray-800 mb-2">
                    <strong>닉네임:</strong> 김민석
                </p>
                <p className="text-gray-800 mb-2">
                    <strong>가입일:</strong> 2025.04.29
                </p>
                <p className="text-gray-800 mb-2">
                    <strong>생년월일:</strong> 2001.11.07
                </p>
                <p className="text-gray-800 mb-2">
                    <strong>MBTI:</strong> INTP
                </p>
                <p className="text-gray-800 mb-2">
                    <strong>성별:</strong> 남
                </p>
            </div>
        </div>
    );
};

export default UserInfoShow;
