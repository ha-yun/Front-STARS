import axios from "axios";
import API_SERVER_HOST from "./apiConfig";

const prefix = `${API_SERVER_HOST}/place/search`;

export interface SearchResult {
    place_id: number;
    name: string;
    address: string;
    type: string;
    lat: number;
    lon: number;
    title?: string;
}

// 통합 이름 검색
export const searchByKeyword = async (
    keyword: string
): Promise<SearchResult[]> => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.get(
        `${prefix}/${encodeURIComponent(keyword)}`,
        header
    );
    return res.data;
};
// 통합 주소 검색
export const searchByAddress = async (
    address: string
): Promise<SearchResult[]> => {
    const header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.get(
        `${prefix}/address/${encodeURIComponent(address)}`,
        header
    );
    return res.data;
};
