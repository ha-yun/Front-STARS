// components/RegisterForm.tsx
import { useState, FormEvent } from "react";

const mbtiOptions = [
    "INTJ",
    "INTP",
    "ENTJ",
    "ENTP",
    "INFJ",
    "INFP",
    "ENFJ",
    "ENFP",
    "ISTJ",
    "ISFJ",
    "ESTJ",
    "ESFJ",
    "ISTP",
    "ISFP",
    "ESTP",
    "ESFP",
];

interface RegisterFormProps {
    onRegisterSuccess: () => void;
}

export default function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
    const [form, setForm] = useState({
        username: "",
        nickname: "",
        password: "",
        confirmPassword: "",
        email: "",
        mbti: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 회원가입 완료 -> 부모에 알림
        onRegisterSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="text"
                name="username"
                placeholder="아이디"
                required
                className="w-full px-4 py-2 bg-black/30 text-white rounded-md focus:outline-none"
                value={form.username}
                onChange={handleChange}
            />
            <input
                type="text"
                name="nickname"
                placeholder="닉네임"
                required
                className="w-full px-4 py-2 bg-black/30 text-white rounded-md focus:outline-none"
                value={form.nickname}
                onChange={handleChange}
            />
            <input
                type="email"
                name="email"
                placeholder="이메일"
                required
                className="w-full px-4 py-2 bg-black/30 text-white rounded-md focus:outline-none"
                value={form.email}
                onChange={handleChange}
            />
            <input
                type="password"
                name="password"
                placeholder="비밀번호"
                required
                className="w-full px-4 py-2 bg-black/30 text-white rounded-md focus:outline-none"
                value={form.password}
                onChange={handleChange}
            />
            <input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호 확인"
                required
                className="w-full px-4 py-2 bg-black/30 text-white rounded-md focus:outline-none"
                value={form.confirmPassword}
                onChange={handleChange}
            />
            <select
                name="mbti"
                required
                value={form.mbti}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/30 text-white rounded-md focus:outline-none"
            >
                <option value="" disabled>
                    MBTI 선택
                </option>
                {mbtiOptions.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
            <button
                type="submit"
                className="mt-4 w-full py-2 px-4 bg-green-600/50 hover:bg-green-700/50 text-white font-semibold shadow-lg rounded-md focus:outline-none focus:ring-0"
            >
                회원가입
            </button>
        </form>
    );
}
