import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { signupUser } from "../../api/authApi";

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
        user_id: "",
        nickname: "",
        password: "",
        confirmPassword: "",
        mbti: "",
        birth_year: "",
        gender: "",
    });
    const [isRegistered, setIsRegistered] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!form.user_id || !form.nickname || !form.password) {
            alert("아이디, 닉네임, 비밀번호는 필수 입력 사항입니다.");
            return;
        }

        const signupParam = { ...form };
        delete signupParam.confirmPassword;

        try {
            await signupUser(signupParam);
            setIsRegistered(true);
            setTimeout(() => {
                onRegisterSuccess();
            }, 1500);
        } catch (err: unknown) {
            if (
                typeof err === "object" &&
                err !== null &&
                "response" in err &&
                (err as any).response.data?.error
            ) {
                alert((err as any).response.data.error);
            } else {
                alert("회원가입 실패: " + err);
            }
        }
    };

    if (isRegistered) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center text-center text-white"
            >
                <h2 className="text-3xl font-bold mb-4">
                    가입을 축하합니다! 🎉
                </h2>
                <p className="text-sm opacity-80">
                    로그인 화면으로 이동합니다...
                </p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="text"
                name="user_id"
                placeholder="아이디"
                required
                className="w-full px-4 py-2 bg-black/30 text-white rounded-md focus:outline-none"
                value={form.user_id}
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
            <input
                type="number"
                name="birth_year"
                placeholder="출생년도 (예: 2000)"
                required
                className="w-full px-4 py-2 bg-black/30 text-white rounded-md focus:outline-none"
                value={form.birth_year}
                onChange={handleChange}
            />
            <select
                name="gender"
                required
                value={form.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/30 text-white rounded-md focus:outline-none"
            >
                <option value="" disabled>
                    성별 선택
                </option>
                <option value="male">남성</option>
                <option value="female">여성</option>
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
