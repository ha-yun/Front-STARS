import { motion } from "framer-motion";
import React from "react";

interface ParkingInfoCardProps {
    style: { opacity: number; y: number; scale: number };
    cardRef: (el: HTMLDivElement | null) => void;
}

export default function ParkingInfoCard({
    style,
    cardRef,
}: ParkingInfoCardProps) {
    return (
        <motion.div
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 bg-blue-500 rounded-xl shadow-lg p-4 my-2"
            whileHover={{ y: -6 }}
            animate={
                style
                    ? { opacity: style.opacity, y: style.y, scale: style.scale }
                    : {}
            }
            style={style}
            ref={cardRef}
        >
            <p className="text-lg text-white font-black">주차 정보</p>
            <div className="bg-blue-400 rounded-xl shadow-lg p-4 my-2">
                <p className="text-md text-white">여의도 공영주차장</p>
                <p className="text-xs text-blue-100">기본 요금 : 1,000원</p>
                <p className="text-xs text-blue-100">기본 단위시간 : 30분</p>
                <p className="text-xs text-blue-100">추가 요금 : 500원</p>
                <p className="text-xs text-blue-100">추가 단위시간 : 30분</p>
                <p className="text-xs text-gray-200 text-center mt-1">
                    <br />
                    주차 중인 면수 120/300
                </p>
            </div>
            <div className="bg-blue-400 rounded-xl shadow-lg p-4 my-2">
                <p className="text-md text-white">광화문 공영주차장</p>
                <p className="text-xs text-blue-100">기본 요금 : 1,000원</p>
                <p className="text-xs text-blue-100">기본 단위시간 : 40분</p>
                <p className="text-xs text-blue-100">추가 요금 : 800원</p>
                <p className="text-xs text-blue-100">추가 단위시간 : 60분</p>
                <p className="text-xs text-gray-200 text-center mt-1">
                    <br />
                    주차 중인 면수 144/180
                </p>
            </div>
            <p className="text-xs text-gray-200 text-center mt-1">
                <br />
                {new Date().toLocaleString()} 기준
            </p>
        </motion.div>
    );
}
