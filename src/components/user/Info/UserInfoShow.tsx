// UserInfoShow.tsx
import React, { useState, useEffect } from "react";
import { initialUserData } from "../../../data/UserInfoData";

const UserInfoShow = () => {
    // 사용자 정보 상태
    const [userInfo, setUserInfo] = useState(initialUserData);
    // 로딩 상태
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // 에러 상태
    const [error, setError] = useState<string | null>(null);

    // 모의 API 함수: 사용자 정보 가져오기
    const fetchUserInfo = (): Promise<{
        success: boolean;
        data?: typeof initialUserData;
        message?: string;
    }> => {
        return new Promise((resolve) => {
            // 800ms 지연 후 응답
            setTimeout(() => {
                // 70% 확률로 성공
                if (Math.random() < 2) {
                    resolve({
                        success: true,
                        data: initialUserData,
                        message: "사용자 정보를 성공적으로 불러왔습니다.",
                    });
                } else {
                    resolve({
                        success: false,
                        message:
                            "사용자 정보를 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요.",
                    });
                }
            }, 800);
        });
    };

    // 사용자 정보 불러오는 함수
    const loadUserInfo = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetchUserInfo();

            if (response.success && response.data) {
                setUserInfo(response.data);
            } else {
                setError(
                    response.message || "사용자 정보를 불러오는데 실패했습니다."
                );
                // 에러 발생 시에도 기본 데이터로 초기화
                setUserInfo(initialUserData);
            }
        } catch (err) {
            setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
            // 예외 발생 시에도 기본 데이터로 초기화
            setUserInfo(initialUserData);
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시 사용자 정보 불러오기
    useEffect(() => {
        loadUserInfo();
    }, []);

    // 로딩 중 표시
    if (isLoading) {
        return (
            <div className="p-2 md:p-4 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center w-full">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="text-gray-500 text-sm">
                        사용자 정보를 불러오는 중...
                    </div>
                </div>
            </div>
        );
    }

    // 에러 표시
    if (error) {
        return (
            <div className="p-2 md:p-4">
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                    role="alert"
                >
                    <strong className="font-bold">오류 발생! </strong>
                    <span className="block sm:inline">{error}</span>
                    <button
                        className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                        onClick={loadUserInfo}
                    >
                        다시 시도
                    </button>
                </div>

                <div className="p-2 md:p-4 mb-2 md:mb-4 opacity-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p className="text-gray-400 mb-2 text-sm md:text-base">
                            <strong>아이디:</strong> {userInfo.user_id}
                        </p>
                        <p className="text-gray-400 mb-2 text-sm md:text-base">
                            <strong>닉네임:</strong> {userInfo.nickname}
                        </p>
                        <p className="text-gray-400 mb-2 text-sm md:text-base">
                            <strong>가입일:</strong> {userInfo.join_date}
                        </p>
                        <p className="text-gray-400 mb-2 text-sm md:text-base">
                            <strong>생년월일:</strong> {userInfo.birth_year}
                        </p>
                        <p className="text-gray-400 mb-2 text-sm md:text-base">
                            <strong>MBTI:</strong> {userInfo.mbti}
                        </p>
                        <p className="text-gray-400 mb-2 text-sm md:text-base">
                            <strong>성별:</strong> {userInfo.gender}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

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
                        <strong>가입일:</strong> {userInfo.join_date}
                    </p>
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>생년월일:</strong> {userInfo.birth_year}
                    </p>
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>MBTI:</strong> {userInfo.mbti}
                    </p>
                    <p className="text-gray-800 mb-2 text-sm md:text-base">
                        <strong>성별:</strong> {userInfo.gender}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserInfoShow;
