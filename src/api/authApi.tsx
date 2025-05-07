import axios from "axios";
import jwtAxios from "../utils/jwtUtil";
import API_SERVER_HOST from "./apiConfig";

const prefix = `${API_SERVER_HOST}/auth`;

type SignupUser = {
    user_id: string;
    password: string;
    nickname: string;
    birth_year: string;
    mbti: string;
    gender: string;
};

export const loginPost = async (loginParam: {
    user_id: string | Blob;
    password: string | Blob;
}) => {
    const header = {
        headers: {
            "Content-Type": "x-www-form-urlencoded",
        },
    };

    const form = new FormData();
    form.append("user_id", loginParam.user_id);
    form.append("password", loginParam.password);

    const res = await axios.post(`${prefix}/login`, form, header);

    return res.data;
};

export const logoutPost = async () => {
    const header = {
        headers: {
            "Content-Type": "x-www-form-urlencoded",
        },
    };

    const res = await jwtAxios.post(`${prefix}/logout`, header);

    return res.data;
};

export const signupUser = async (user: SignupUser) => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const res = await axios.post(`${prefix}/`, user, header);
    return res.data;
};

export const signoutUser = async () => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const res = await jwtAxios.delete(`${prefix}/signout/`, header);

    return res.data;
};
