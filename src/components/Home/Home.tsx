import { useState, FormEvent } from "react";

export default function Home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (username === "admin" && password === "password") {
            window.fullpage_api?.moveSlideRight();
        } else {
            alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
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

            {/* 로그인 카드 */}
            <div className="relative flex items-center justify-center h-full z-10">
                <div className="w-full max-w-md bg-white/20 rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">
                        Login
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-100 mb-1"
                            >
                                아이디
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                placeholder="ID"
                                className="w-full px-4 py-2 bg-black/30 rounded-md focus:outline-none shadow-lg"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-100 mb-1"
                            >
                                비밀번호
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                placeholder="Password"
                                className="w-full px-4 py-2 bg-black/30 rounded-md focus:outline-none shadow-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-4 w-full py-2 px-4 bg-indigo-600/50 hover:bg-indigo-700/50 text-white font-semibold shadow-lg rounded-md focus:ring-0 focus:outline-none"
                        >
                            로그인
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <button
                            onClick={() =>
                                window.fullpage_api?.moveSlideRight()
                            }
                            className="px-4 py-2 bg-green-600/50 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700/50 hover:text-white transition"
                        >
                            맵 둘러보기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
