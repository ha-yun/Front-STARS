import { motion } from "framer-motion";
import React from "react";

interface VisitorCountCardProps {
    refEl: React.RefObject<HTMLSpanElement | null>;
    style: { opacity: number; y: number; scale: number };
    cardRef: (el: HTMLDivElement | null) => void;
}

export default function VisitorCountCard({
    refEl,
    cardRef,
    style,
}: VisitorCountCardProps) {
    return (
        <motion.div
            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 bg-white rounded-3xl shadow-lg p-4 my-2"
            whileHover={{ y: -6 }}
            animate={
                style
                    ? { opacity: style.opacity, y: style.y, scale: style.scale }
                    : {}
            }
            style={style}
            ref={cardRef}
        >
            <p className="text-sm text-gray-500">현재 유동 인구수</p>
            <p className="text-4xl text-orange-500 font-bold mt-2">
                <span ref={refEl}></span>명
            </p>
            <p className="text-sm text-gray-500 mt-2">
                {new Date().toLocaleString()} 기준
            </p>
        </motion.div>
    );
}
