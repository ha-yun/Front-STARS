// components/LoginForm.tsx
import { useState, FormEvent } from "react";

export default function LoginForm() {
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="text"
                name="username"
                placeholder="아이디"
                required
                className="w-full px-4 py-2 bg-black/30 text-white rounded-md focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                name="password"
                placeholder="비밀번호"
                required
                className="w-full px-4 py-2 bg-black/30 text-white rounded-md focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                type="submit"
                className="mt-4 w-full py-2 px-4 bg-indigo-600/50 hover:bg-indigo-700/50 text-white font-semibold shadow-lg rounded-md focus:outline-none focus:ring-0"
            >
                로그인
            </button>
        </form>
    );
}
