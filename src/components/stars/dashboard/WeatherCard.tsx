import { motion } from "framer-motion";
import React from "react";

interface WeatherCardProps {
    style: { opacity: number; y: number; scale: number };
    cardRef: (el: HTMLDivElement | null) => void;
}

export default function WeatherCard({ style, cardRef }: WeatherCardProps) {
    return (
        <motion.div
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-6 bg-red-500 rounded-3xl shadow-lg p-4 my-2"
            whileHover={{ y: -6 }}
            animate={
                style
                    ? { opacity: style.opacity, y: style.y, scale: style.scale }
                    : {}
            }
            style={style}
            ref={cardRef}
        >
            <p className="text-md text-gray-200">현재 날씨</p>
            <p className="text-4xl text-white font-bold">23℃</p>
            <p className="text-sm text-gray-200 mt-1">
                PM10 : 45㎣/㎤ · 강수확률 : 10%
            </p>
            <div className="flex justify-between text-gray-200 mt-4 text-sm">
                {["12시", "04시", "08시", "12시", "16시", "20시"].map(
                    (t, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span>{t}</span>
                            <span>☀️</span>
                        </div>
                    )
                )}
            </div>
        </motion.div>
    );
}
