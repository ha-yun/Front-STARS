// export const SpotCard = ({
//                              name,
//                              status,
//                              code,
//                          }: {
//     name: string;
//     status: string;
//     code: string;
// }) => (
//     <div className="bg-white p-4 rounded-lg shadow-sm relative spot-card border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
//         <div className="flex justify-between">
//             <div className="text-lg font-bold text-black">{name}</div>
//             <div>{status}</div>
//         </div>
//         <div className="text-gray-500 text-sm">{code}</div>
//     </div>
// );

import CongestionTag from "./CongestionTag";

export const SpotCard = ({
    area_nm,
    area_cd,
    area_congest_lvl,
}: {
    area_nm: string;
    area_cd: string;
    area_congest_lvl: string;
}) => (
    <div className="bg-white p-4 rounded-lg shadow-sm relative spot-card border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-center">
            <div className="text-lg font-bold text-black">{area_nm}</div>
            <CongestionTag level={area_congest_lvl} size="md" />
        </div>
        <div className="text-gray-500 text-sm">{area_cd}</div>
    </div>
);
