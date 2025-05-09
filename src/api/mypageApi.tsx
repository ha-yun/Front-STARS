import jwtAxios from "../utils/jwtUtil";
import API_SERVER_HOST from "./apiConfig";

const prefix = `${API_SERVER_HOST}/user/mypage`;

type UserProfile = {
    user_id: string;
    password: string;
    nickname: string;
    birth_year: number;
    mbti: string;
    gender: string;
};

type Favorite = {
    type: string;
    place_id: number;
};

export const getUserProfile = async () => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const res = await jwtAxios.get(`${prefix}/profile`, header);
    return res.data;
};

export const editUserProfile = async (user: UserProfile) => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const res = await jwtAxios.post(`${prefix}/profile`, user, header);
    return res.data;
};

export const getUserFavoriteList = async () => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const res = await jwtAxios.get(`${prefix}/favorite/list`, header);
    return res.data;
};

export const addFavorite = async (favorite: Favorite) => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const res = await jwtAxios.post(`${prefix}/favorite`, favorite, header);
    return res.data;
};

export const deleteFavorite = async (favorite: Favorite) => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const res = await jwtAxios.delete(
        `${prefix}/favorite/delete/${favorite.type}/${favorite.place_id}`,
        header
    );
    return res.data;
};
