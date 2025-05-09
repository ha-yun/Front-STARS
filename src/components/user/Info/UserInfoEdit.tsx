// UserInfoEdit.tsx
import React, { useState, useEffect } from "react";
import { initialUserData } from "../../../data/UserInfoData";
import { getUserProfile } from "../../../api/mypageApi";

// props 인터페이스 정의
interface UserInfoEditProps {
    onPasswordValidationChange?: (isValid: boolean) => void;
    onUserInfoSubmit?: (userInfo: typeof initialUserData) => void;
}

const UserInfoEdit: React.FC<UserInfoEditProps> = ({
    onPasswordValidationChange,
    onUserInfoSubmit,
}) => {
    // 기본 사용자 정보로 초기화된 상태
    const [userInfo, setUserInfo] = useState({
        ...initialUserData,
        password: "",
        chk_password: "",
        _hasBeenEdited: false, // 편집 여부를 추적하는 플래그 추가
    });

    // 로딩 상태
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // 에러 상태
    const [error, setError] = useState<string | null>(null);

    // 비밀번호 유효성 상태
    const [passwordValidation, setPasswordValidation] = useState({
        match: true,
        isEmpty: true,
        isValid: true,
        errorMessage: "",
    });

    // 다시 시도 버튼용 사용자 정보 로드 함수
    const loadUserInfo = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getUserProfile();

            if (response) {
                // API 응답에서 사용자 정보를 설정
                setUserInfo({
                    ...response, // 전체 응답 데이터 사용
                    password: "",
                    chk_password: "",
                    _hasBeenEdited: false,
                });

                // 초기 데이터를 부모 컴포넌트에 전달
                if (onUserInfoSubmit) {
                    onUserInfoSubmit(response);
                }
            } else {
                setError("사용자 정보를 불러오는데 실패했습니다.");

                // 초기 데이터를 부모 컴포넌트에 전달
                if (onUserInfoSubmit) {
                    onUserInfoSubmit(initialUserData);
                }
            }
        } catch (err) {
            setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");

            // 초기 데이터를 부모 컴포넌트에 전달
            if (onUserInfoSubmit) {
                onUserInfoSubmit(initialUserData);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시에만 실행되도록 의존성 배열을 비워둠
    useEffect(() => {
        // 비동기 함수 정의
        const loadUserInfoOnMount = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await getUserProfile();

                if (response) {
                    // API 응답에서 사용자 정보를 설정
                    setUserInfo({
                        ...response, // 전체 응답 데이터 사용
                        password: "",
                        chk_password: "",
                        _hasBeenEdited: false,
                    });

                    // 초기 데이터를 부모 컴포넌트에 전달
                    if (onUserInfoSubmit) {
                        onUserInfoSubmit(response);
                    }
                } else {
                    setError("사용자 정보를 불러오는데 실패했습니다.");

                    // 초기 데이터를 부모 컴포넌트에 전달
                    if (onUserInfoSubmit) {
                        onUserInfoSubmit(initialUserData);
                    }
                }
            } catch (err) {
                setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");

                // 초기 데이터를 부모 컴포넌트에 전달
                if (onUserInfoSubmit) {
                    onUserInfoSubmit(initialUserData);
                }
            } finally {
                setIsLoading(false);
            }
        };

        // 함수 호출
        loadUserInfoOnMount();
        // 의존성 배열이 비어있어 컴포넌트 마운트 시에만 실행됨
    }, []);

    // 비밀번호 유효성 검사 함수
    const validatePassword = (password: string, chkPassword: string) => {
        const validation = {
            match: password === chkPassword,
            isEmpty: password.length === 0 && chkPassword.length === 0,
            isValid: true,
            errorMessage: "",
        };

        // 비밀번호가 비어있는 경우 유효하지 않은 것으로 처리
        if (validation.isEmpty) {
            validation.isValid = false;
            validation.errorMessage = "비밀번호를 입력해주세요.";
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
        const validation = validatePassword(
            userInfo.password,
            userInfo.chk_password
        );
        setPasswordValidation(validation);

        // 비밀번호 유효성 조건:
        // 1. 비밀번호와 확인이 모두 비어있지 않아야 함 (isEmpty가 false)
        // 2. 비밀번호가 정규식 조건을 만족해야 함 (isValid가 true)
        // 3. 비밀번호와 확인이 일치해야 함 (match가 true)
        const isValidForSubmit =
            !validation.isEmpty && validation.isValid && validation.match;

        // 부모 컴포넌트에 유효성 상태 전달
        if (onPasswordValidationChange) {
            onPasswordValidationChange(isValidForSubmit);
        }
    }, [userInfo.password, userInfo.chk_password, onPasswordValidationChange]);

    // 입력 변경 핸들러
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const updatedUserInfo = {
            ...userInfo,
            [name]: value,
            _hasBeenEdited: true, // 사용자가 입력을 수정했음을 표시
        };

        setUserInfo(updatedUserInfo);

        // 사용자 정보가 변경될 때마다 부모 컴포넌트에 전달
        if (onUserInfoSubmit) {
            // _hasBeenEdited 필드를 제외한 나머지 정보만 전달
            const { _hasBeenEdited, ...userInfoToSubmit } = updatedUserInfo;
            onUserInfoSubmit(userInfoToSubmit);
        }
    };

    // 비밀번호 입력 필드 스타일 계산
    const getPasswordFieldStyle = () => {
        if (passwordValidation.isEmpty) return "";
        return !passwordValidation.isValid
            ? "border-red-500"
            : "border-green-500";
    };

    // 비밀번호 확인 필드 스타일 계산
    const getPasswordConfirmFieldStyle = () => {
        if (passwordValidation.isEmpty) return "";
        return !passwordValidation.match
            ? "border-red-500"
            : "border-green-500";
    };

    // 로딩 중 표시
    if (isLoading) {
        return (
            <div className="p-2 md:p-4 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center">
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
            </div>
        );
    }

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
                        value={userInfo.user_id}
                        // value="user1"
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
                        value={userInfo.nickname}
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
                        value={userInfo.birth_year}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3 md:mb-4">
                    <label
                        className="block text-gray-700 text-xs md:text-sm font-bold mb-1 md:mb-2"
                        htmlFor="password-input"
                    >
                        비밀번호
                    </label>
                    <input
                        className={`shadow appearance-none border ${getPasswordFieldStyle()} rounded w-full py-1 md:py-2 px-2 md:px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm`}
                        id="password-input"
                        name="password"
                        type="password"
                        value={userInfo.password}
                        onChange={handleChange}
                        placeholder="변경을 원하시면 새 비밀번호를 입력하세요"
                    />
                    {!passwordValidation.isEmpty &&
                        !passwordValidation.isValid && (
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
                        htmlFor="chk_password-input"
                    >
                        비밀번호 재입력
                    </label>
                    <input
                        className={`shadow appearance-none border ${getPasswordConfirmFieldStyle()} rounded w-full py-1 md:py-2 px-2 md:px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm`}
                        id="chk_password-input"
                        name="chk_password"
                        type="password"
                        value={userInfo.chk_password}
                        onChange={handleChange}
                        placeholder="새 비밀번호를 다시 입력하세요"
                    />
                    {!passwordValidation.isEmpty &&
                        !passwordValidation.match && (
                            <p className="text-red-500 text-xs italic mt-1">
                                비밀번호가 일치하지 않습니다.
                            </p>
                        )}
                </div>

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
                        value={userInfo.mbti}
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
                                checked={userInfo.gender === "male"}
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
                                checked={userInfo.gender === "female"}
                                onChange={handleChange}
                                className="mr-1 md:mr-2"
                            />
                            여성
                        </label>
                    </div>
                </div>

                {/* 비밀번호 상태 요약 메시지 */}
                <div
                    className={`p-2 md:p-3 rounded mb-2 md:mb-4 ${
                        !passwordValidation.isEmpty &&
                        passwordValidation.isValid &&
                        passwordValidation.match
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                    <p className="text-xs md:text-sm">
                        {!passwordValidation.isEmpty &&
                        passwordValidation.isValid &&
                        passwordValidation.match
                            ? "✅ 비밀번호가 유효하며 일치합니다."
                            : "❌ " +
                              (passwordValidation.isEmpty
                                  ? "비밀번호를 입력해주세요."
                                  : passwordValidation.errorMessage ||
                                    "비밀번호가 유효하지 않습니다.")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserInfoEdit;
