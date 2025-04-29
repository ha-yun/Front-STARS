// UserInfo.tsx
import React, { useState } from "react";
import UserInfoShow from "./UserInfoShow";
import UserInfoEdit from "./UserInfoEdit";

const UserInfo = () => {
    const [edited, setEdited] = useState<boolean>(false);
    // 초기 상태에서는 비밀번호가 유효하지 않은 것으로 설정
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

    const handleEditToggle = () => {
        setEdited(!edited);
        // 수정 모드로 전환할 때 비밀번호 유효성 상태 초기화
        // 기본적으로 비밀번호 변경이 필요한 상태로 설정 (false)
        setIsPasswordValid(false);
    };

    // 비밀번호 유효성 상태 변경 핸들러
    const handlePasswordValidationChange = (isValid: boolean) => {
        setIsPasswordValid(isValid);
        console.log("비밀번호 유효성 상태 변경:", isValid); // 디버깅용 로그 추가
    };

    const handleComplete = () => {
        // 비밀번호가 유효하지 않으면 저장을 막음
        if (!isPasswordValid) {
            alert("비밀번호를 올바르게 입력해주세요.");
            return;
        }

        // 수정이 완료되면 알림을 표시하고 보기 모드로 전환
        setTimeout(() => {
            alert("회원 정보가 성공적으로 수정되었습니다.");
            setEdited(false);
        }, 300);
    };

    // 계정 삭제 핸들러
    const handleDeleteAccount = () => {
        if (
            window.confirm(
                "정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            )
        ) {
            alert("계정이 삭제되었습니다.");
            // 실제 구현에서는 여기에 API 호출 등이 들어갈 수 있습니다.
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                내 프로필 정보
            </h2>

            {!edited ? (
                <UserInfoShow />
            ) : (
                <UserInfoEdit
                    onPasswordValidationChange={handlePasswordValidationChange}
                />
            )}

            <div className="flex items-center justify-between mt-6">
                {edited ? (
                    <>
                        <button
                            className={`py-2 px-4 rounded transition-colors ${
                                isPasswordValid
                                    ? "bg-green-500 hover:bg-green-600 text-white"
                                    : "bg-green-300 text-white cursor-not-allowed"
                            }`}
                            onClick={handleComplete}
                            disabled={!isPasswordValid}
                        >
                            완료
                        </button>
                        <button
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                            onClick={handleEditToggle}
                        >
                            취소
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors"
                            onClick={handleEditToggle}
                        >
                            수정하기
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                            onClick={handleDeleteAccount}
                        >
                            계정 삭제
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserInfo;
