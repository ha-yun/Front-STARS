import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function Home() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorVisible, setErrorVisible] = useState(false);

    const handleFormSwitch = () => {
        setErrorMessage("");
        setErrorVisible(false);
        setIsRegistering((prev) => !prev);
    };

    const handleRegisterSuccess = () => {
        setIsRegistering(false);
        triggerError("회원가입이 완료되었습니다! 로그인 해주세요.");
    };

    const handleError = (message: string) => {
        triggerError(message);
    };

    const triggerError = (message: string) => {
        setErrorMessage(message);
        setErrorVisible(true);

        // 1.5초 후 fade-out 시작
        setTimeout(() => {
            setErrorVisible(false);
        }, 1500);

        // fade-out 끝나고 에러 메시지 비우기
        setTimeout(() => {
            setErrorMessage("");
        }, 2000);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* 배경 비디오 */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute w-full h-full object-cover"
            >
                <source src="../public/home-bg-video.mp4" type="video/mp4" />
            </video>

            {/* 블러 오버레이 */}
            <div className="absolute w-full h-full bg-black/20 backdrop-blur-sm" />

            {/* 폼 카드 */}
            <div className="relative flex items-center justify-center h-full z-10">
                <div className="w-full max-w-md bg-white/20 rounded-lg shadow-lg p-8">
                    {/* 제목 */}
                    <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">
                        {isRegistering ? "회원가입" : "Login"}
                    </h2>

                    {/* 에러메시지 공간 항상 확보 */}
                    <div className="min-h-[24px] mb-4 text-center">
                        <AnimatePresence>
                            {errorMessage && (
                                <motion.div
                                    key={errorMessage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: errorVisible ? 1 : 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-red-300 text-sm"
                                >
                                    {errorMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 폼 부분 */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isRegistering ? "register" : "login"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isRegistering ? (
                                <RegisterForm
                                    onRegisterSuccess={handleRegisterSuccess}
                                />
                            ) : (
                                <LoginForm onError={handleError} />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* 로그인/회원가입 전환 버튼 */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleFormSwitch}
                            className="text-xs bg-slate-600/50 hover:bg-slate-700/50 text-white font-semibold shadow-lg rounded-md focus:outline-none focus:ring-0"
                        >
                            {isRegistering
                                ? "이미 계정이 있으신가요? 로그인"
                                : "계정이 없으신가요? 회원가입"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
