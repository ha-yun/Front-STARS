import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name: string, value: string, days = 1): void => {
    const expires = new Date();
    expires.setUTCDate(expires.getUTCDate() + days);
    cookies.set(name, value, { path: "/", expires });
};

// 제네릭으로 타입 명시
export const getCookie = <T = unknown,>(name: string): T | undefined => {
    return cookies.get(name);
};

export const removeCookie = (name: string, path: string = "/"): void => {
    cookies.remove(name, { path });
};
