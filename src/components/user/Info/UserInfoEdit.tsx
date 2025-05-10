// UserInfoEdit.tsx
import React, { useState, useEffect, useRef } from "react";
import { UserInfo } from "../../../data/UserInfoData";
import { editUserProfile, UserProfile } from "../../../api/mypageApi";

// props 인터페이스 정의
interface UserInfoEditProps {
    userInfo: UserInfo;
    onPasswordValidationChange?: (isValid: boolean) => void;
    onUserInfoSubmit?: (userInfo: UserInfo) => void;
}

// 확장된 사용자 정보 타입 (내부 상태 관리용)
interface EditableUserInfo extends UserInfo {
    new_password: string;
    _hasBeenEdited: boolean;
}

const UserInfoEdit: React.FC<UserInfoEditProps> = ({
    userInfo,
    onPasswordValidationChange,
    onUserInfoSubmit,
}) => {
    // useRef를 사용하여 초기 마운트 여부 체크
    const isInitialMount = useRef(true);

    // 전달받은 사용자 정보로 초기화
    const [editableUserInfo, setEditableUserInfo] = useState<EditableUserInfo>(
        () => ({
            ...userInfo,
            current_password: "", // 기존 암호
            new_password: "", // 새 암호
            chk_password: "", // 새 암호 검증
            _hasBeenEdited: false,
        })
    );

    // 비밀번호 변경을 원하는지 여부
    const [wantToChangePassword, setWantToChangePassword] =
        useState<boolean>(false);

    // 비밀번호 유효성 상태
    const [passwordValidation, setPasswordValidation] = useState({
        match: true,
        isEmpty: true,
        isValid: true,
        errorMessage: "",
    });

    // 제출 중 상태
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // 최초 마운트 시에만 초기 데이터를 부모 컴포넌트에 전달
    useEffect(() => {
        if (isInitialMount.current && onUserInfoSubmit) {
            isInitialMount.current = false;
        }
    }, [userInfo, onUserInfoSubmit]);

    // 비밀번호 유효성 검사 함수
    const validatePassword = (password: string, chkPassword: string) => {
        // 비밀번호 변경을 원하지 않는 경우 항상 유효함
        if (!wantToChangePassword) {
            return {
                match: true,
                isEmpty: true,
                isValid: true,
                errorMessage: "",
            };
        }

        const validation = {
            match: password === chkPassword,
            isEmpty: password.length === 0 && chkPassword.length === 0,
            isValid: false,
            errorMessage: "",
        };

        // 비밀번호가 비어있는 경우 (비밀번호 변경 원할 때만 오류)
        if (validation.isEmpty) {
            validation.isValid = false;
            validation.errorMessage = "새 비밀번호를 입력해주세요.";
            return validation;
        }

        // 비밀번호 형식 검사 (최소 8자, 영문/숫자/특수문자 조합)
        const passwordRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        validation.isValid = passwordRegex.test(password);

        if (!validation.isValid) {
            validation.errorMessage =
                "비밀번호는 8자 이상, 영문, 숫자, 특수문자를 모두 포함해야 합니다.";
        } else if (!validation.match) {
            validation.errorMessage = "비밀번호가 일치하지 않습니다.";
        }

        return validation;
    };

    // 비밀번호 변경 시 유효성 검사
    useEffect(() => {
        if (wantToChangePassword) {
            const validation = validatePassword(
                editableUserInfo.new_password,
                editableUserInfo.chk_password
            );
            setPasswordValidation(validation);

            // 비밀번호 유효성 조건:
            // 1. 비밀번호가 유효하고 일치해야 함
            const isValidForSubmit = validation.isValid && validation.match;

            // 부모 컴포넌트에 유효성 상태 전달
            if (onPasswordValidationChange) {
                onPasswordValidationChange(isValidForSubmit);
            }
        } else {
            // 비밀번호 변경을 원하지 않는 경우 항상 유효함
            if (onPasswordValidationChange) {
                onPasswordValidationChange(true);
            }
        }
    }, [
        wantToChangePassword,
        editableUserInfo.new_password,
        editableUserInfo.chk_password,
        onPasswordValidationChange,
    ]);

    // 입력 변경 핸들러
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const updatedUserInfo = {
            ...editableUserInfo,
            [name]: value,
            _hasBeenEdited: true, // 사용자가 입력을 수정했음을 표시
        };

        setEditableUserInfo(updatedUserInfo);
    };

    // 비밀번호 변경 체크박스 핸들러
    const handlePasswordChangeToggle = () => {
        setWantToChangePassword(!wantToChangePassword);

        // 체크박스를 해제할 때 비밀번호 입력값 초기화
        if (wantToChangePassword) {
            setEditableUserInfo((prev) => ({
                ...prev,
                current_password: "",
                new_password: "",
                chk_password: "",
            }));
            // 비밀번호 유효성 상태 초기화
            setPasswordValidation({
                match: true,
                isEmpty: true,
                isValid: true,
                errorMessage: "",
            });
        }
    };

    // 제출 핸들러
    const handleSubmit = async () => {
        // 비밀번호 변경을 원하는 경우에만 유효성 검사
        if (
            wantToChangePassword &&
            (!passwordValidation.isValid || !passwordValidation.match)
        ) {
            alert("비밀번호가 유효하지 않거나 일치하지 않습니다.");
            return;
        }

        // 비밀번호 변경을 원하는데 현재 비밀번호가 비어있을 경우
        if (wantToChangePassword && editableUserInfo.current_password === "") {
            alert("현재 비밀번호를 입력해주세요.");
            return;
        }

        try {
            setIsSubmitting(true);

            // API 요구사항에 맞게 필요한 데이터만 추출
            const userDataToSubmit: UserProfile = {
                user_id: editableUserInfo.user_id,
                nickname: editableUserInfo.nickname,
                birth_year: editableUserInfo.birth_year,
                mbti: editableUserInfo.mbti,
                gender: editableUserInfo.gender,
            };

            // 비밀번호 변경을 원하는 경우에만 비밀번호 필드 추가
            if (wantToChangePassword) {
                userDataToSubmit.current_password =
                    editableUserInfo.current_password;
                userDataToSubmit.new_password = editableUserInfo.new_password;
            }

            console.log("전송 데이터:", userDataToSubmit); // 디버깅용

            // API 호출하여 사용자 정보 업데이트
            const response = await editUserProfile(userDataToSubmit);

            if (response) {
                console.log(response);
                alert(
                    response.message || "회원 정보가 성공적으로 수정되었습니다."
                );

                // 성공 시 부모 컴포넌트에 알림
                if (onUserInfoSubmit) {
                    onUserInfoSubmit(userInfo);
                }
            } else {
                throw new Error(
                    response?.message || "회원 정보 수정에 실패했습니다."
                );
            }
        } catch (error) {
            console.error("API 오류:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "회원 정보 수정 중 오류가 발생했습니다."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // 비밀번호 입력 필드 스타일 계산
    const getPasswordFieldStyle = () => {
        if (!wantToChangePassword) return "border-gray-300"; // 비밀번호 변경을 원하지 않는 경우 기본 스타일
        if (editableUserInfo.new_password.length === 0)
            return "border-gray-300"; // 비어있으면 기본 스타일
        return !passwordValidation.isValid
            ? "border-red-500"
            : "border-green-500";
    };

    // 비밀번호 확인 필드 스타일 계산
    const getPasswordConfirmFieldStyle = () => {
        if (!wantToChangePassword) return "border-gray-300"; // 비밀번호 변경을 원하지 않는 경우 기본 스타일
        if (editableUserInfo.chk_password.length === 0)
            return "border-gray-300"; // 비어있으면 기본 스타일
        return !passwordValidation.match
            ? "border-red-500"
            : "border-green-500";
    };

    // 전체 폼 유효성 상태
    const isFormValid = wantToChangePassword
        ? passwordValidation.isValid &&
          passwordValidation.match &&
          editableUserInfo.current_password !== ""
        : true;

    return (
        <div className="p-2 md:p-4">
            <div className="p-2 md:p-4 mb-2 md:mb-4">
                <div className="mb-3 md:mb-4">
                    <label
                        className="block text-gray-700 text-xs md:text-sm font-bold mb-1 md:mb-2"
                        htmlFor="user_id"
                    >
                        아이디(수정불가)
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-1 md:py-2 px-2 md:px-3 bg-gray-300 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                        id="user_id"
                        name="user_id"
                        type="text"
                        value={editableUserInfo.user_id}
                        onChange={handleChange}
                        readOnly // 아이디는 수정 불가능하게 설정
                    />
                </div>

                <div className="mb-3 md:mb-4">
                    <label
                        className="block text-gray-700 text-xs md:text-sm font-bold mb-1 md:mb-2"
                        htmlFor="nickname"
                    >
                        닉네임
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-1 md:py-2 px-2 md:px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                        id="nickname"
                        name="nickname"
                        type="text"
                        value={editableUserInfo.nickname}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3 md:mb-4">
                    <label
                        className="block text-gray-700 text-xs md:text-sm font-bold mb-1 md:mb-2"
                        htmlFor="birth_year"
                    >
                        생년월일
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-1 md:py-2 px-2 md:px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                        id="birth_year"
                        name="birth_year"
                        type="number"
                        value={editableUserInfo.birth_year}
                        onChange={handleChange}
                    />
                </div>

                {/* 비밀번호 변경 여부 체크박스 */}
                <div className="mb-3 md:mb-4">
                    <label className="flex items-center text-gray-700 text-xs md:text-sm font-bold">
                        <input
                            type="checkbox"
                            className="mr-2 h-4 w-4"
                            checked={wantToChangePassword}
                            onChange={handlePasswordChangeToggle}
                        />
                        비밀번호 변경하기
                    </label>
                </div>

                {/* 비밀번호 변경을 원할 때만 표시 */}
                {wantToChangePassword && (
                    <>
                        <div className="mb-3 md:mb-4">
                            <label
                                className="block text-gray-700 text-xs md:text-sm font-bold mb-1 md:mb-2"
                                htmlFor="current_password"
                            >
                                현재 비밀번호{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-1 md:py-2 px-2 md:px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                id="current_password"
                                name="current_password"
                                type="password"
                                value={editableUserInfo.current_password}
                                onChange={handleChange}
                                placeholder="현재 비밀번호를 입력해주세요"
                                required={wantToChangePassword}
                            />
                        </div>

                        <div className="mb-3 md:mb-4">
                            <label
                                className="block text-gray-700 text-xs md:text-sm font-bold mb-1 md:mb-2"
                                htmlFor="new_password"
                            >
                                새 비밀번호{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                className={`shadow appearance-none border ${getPasswordFieldStyle()} rounded w-full py-1 md:py-2 px-2 md:px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm`}
                                id="new_password"
                                name="new_password"
                                type="password"
                                value={editableUserInfo.new_password}
                                onChange={handleChange}
                                placeholder="새 비밀번호를 입력해주세요"
                                required={wantToChangePassword}
                            />
                            {!passwordValidation.isValid &&
                                editableUserInfo.new_password.length > 0 && (
                                    <p className="text-red-500 text-xs italic mt-1">
                                        {passwordValidation.errorMessage}
                                    </p>
                                )}
                            <p className="text-gray-500 text-xs mt-1">
                                비밀번호는 8자 이상, 영문, 숫자, 특수문자를 모두
                                포함해야 합니다.
                            </p>
                        </div>

                        <div className="mb-3 md:mb-4">
                            <label
                                className="block text-gray-700 text-xs md:text-sm font-bold mb-1 md:mb-2"
                                htmlFor="chk_password"
                            >
                                새 비밀번호 재입력{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                className={`shadow appearance-none border ${getPasswordConfirmFieldStyle()} rounded w-full py-1 md:py-2 px-2 md:px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm`}
                                id="chk_password"
                                name="chk_password"
                                type="password"
                                value={editableUserInfo.chk_password}
                                onChange={handleChange}
                                placeholder="새 비밀번호를 다시 입력하세요"
                                required={wantToChangePassword}
                            />
                            {!passwordValidation.match &&
                                editableUserInfo.chk_password.length > 0 && (
                                    <p className="text-red-500 text-xs italic mt-1">
                                        비밀번호가 일치하지 않습니다.
                                    </p>
                                )}
                        </div>
                    </>
                )}

                <div className="mb-3 md:mb-4">
                    <label
                        className="block text-gray-700 text-xs md:text-sm font-bold mb-1 md:mb-2"
                        htmlFor="mbti"
                    >
                        MBTI
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-1 md:py-2 px-2 md:px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                        id="mbti"
                        name="mbti"
                        value={editableUserInfo.mbti}
                        onChange={handleChange}
                    >
                        <option value="ISTJ">ISTJ</option>
                        <option value="ISFJ">ISFJ</option>
                        <option value="INFJ">INFJ</option>
                        <option value="INTJ">INTJ</option>
                        <option value="ISTP">ISTP</option>
                        <option value="ISFP">ISFP</option>
                        <option value="INFP">INFP</option>
                        <option value="INTP">INTP</option>
                        <option value="ESTP">ESTP</option>
                        <option value="ESFP">ESFP</option>
                        <option value="ENFP">ENFP</option>
                        <option value="ENTP">ENTP</option>
                        <option value="ESTJ">ESTJ</option>
                        <option value="ESFJ">ESFJ</option>
                        <option value="ENFJ">ENFJ</option>
                        <option value="ENTJ">ENTJ</option>
                    </select>
                </div>

                <div className="mb-3 md:mb-4">
                    <label className="block text-gray-700 text-xs md:text-sm font-bold mb-1 md:mb-2">
                        성별
                    </label>
                    <div className="flex items-center">
                        <label className="mr-4 text-black text-sm">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={editableUserInfo.gender === "male"}
                                onChange={handleChange}
                                className="mr-1 md:mr-2"
                            />
                            남성
                        </label>
                        <label className="mr-4 text-black text-sm">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={editableUserInfo.gender === "female"}
                                onChange={handleChange}
                                className="mr-1 md:mr-2"
                            />
                            여성
                        </label>
                    </div>
                </div>

                {/* 비밀번호 상태 요약 메시지 (비밀번호 변경을 원할 때만 표시) */}
                {wantToChangePassword && (
                    <div
                        className={`p-2 md:p-3 rounded mb-4 ${
                            !isFormValid
                                ? "bg-red-50 text-red-800 border border-red-200"
                                : "bg-green-50 text-green-800 border border-green-200"
                        }`}
                    >
                        <p className="text-xs md:text-sm">
                            {isFormValid
                                ? "✅ 비밀번호가 유효하며 일치합니다."
                                : editableUserInfo.current_password === ""
                                  ? "❌ 현재 비밀번호를 입력해주세요."
                                  : "❌ " + passwordValidation.errorMessage}
                        </p>
                    </div>
                )}

                {/* 필수 입력 필드 안내 */}
                <div className="mb-4 text-xs text-gray-500">
                    <span className="text-red-500">*</span> 표시는 필수 입력
                    항목입니다.
                </div>

                {/* 확인 버튼 */}
                <div className="flex justify-center mt-6">
                    <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                            !isFormValid || isSubmitting
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                처리 중...
                            </span>
                        ) : (
                            "정보 수정 완료"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserInfoEdit;
