import MatchCard from "./MatchCard";
import { ChevronRight, BarChart, Trophy } from 'lucide-react';
import { Link } from "react-router-dom";

export default function ContentSection() {
    return(
        <section className="py-24 bg-navy-dark relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-navy-light to-transparent"></div>
            <div className="absolute -top-40 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
            
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                    
                    {/* Main Content: Latest Results Widget */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-end justify-between border-b border-navy-light pb-4">
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Kết quả & Lịch thi đấu</h2>
                                <p className="text-gray-400 text-sm mt-1">Cập nhật nhanh diễn biến mới nhất của giải đấu</p>
                            </div>
                            <Link to="/lich-thi-dau" className="hidden sm:flex items-center gap-2 text-blue-400 text-sm font-bold hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-xl">
                                Xem tất cả <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2.5 uppercase tracking-wider bg-navy-dark border border-navy-light px-4 py-2 rounded-xl shadow-sm w-fit">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div> Trực tiếp / Sắp tới
                                </h3>
                                <div className="flex flex-col gap-4">
                                    <MatchCard status="LIVE" time="Hôm nay, 18:00" teamA="HTTT K22" teamB="KHDL K21" scoreA={1} scoreB={0} isUpcoming={false} />
                                    <MatchCard status="UPCOMING" time="Ngày mai, 17:30" teamA="MMT K23" teamB="ATTT K22" isUpcoming={true} />
                                </div>
                            </div>
                            
                            <div className="space-y-5">
                                <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2.5 uppercase tracking-wider bg-navy-dark border border-navy-light px-4 py-2 rounded-xl shadow-sm w-fit">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-500"></div> Đã kết thúc
                                </h3>
                                <div className="flex flex-col gap-4 opacity-80 hover:opacity-100 transition-opacity">
                                    <MatchCard status="FT" time="Hôm qua, 17:30" teamA="KTPM K21" teamB="MMT K22" scoreA={3} scoreB={1} isUpcoming={false} />
                                    <MatchCard status="FT" time="Hôm qua, 15:30" teamA="ATTT K21" teamB="KTPM K23" scoreA={2} scoreB={2} isUpcoming={false} />
                                </div>
                            </div>
                        </div>

                        <Link to="/lich-thi-dau" className="sm:hidden w-full flex items-center justify-center gap-2 text-blue-400 text-sm font-bold bg-navy border border-navy-light py-3 rounded-xl mt-4">
                            Xem toàn bộ lịch thi đấu <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Sidebar: Mini Leaderboard */}
                    <div className="lg:col-span-1">
                        <div className="bg-navy/80 backdrop-blur-xl border border-navy-light rounded-3xl p-6 lg:p-8 shadow-2xl shadow-black/40 relative overflow-hidden h-full flex flex-col group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-colors duration-500"></div>
                            
                            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
                                <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                                    <BarChart className="w-5 h-5 text-blue-400" />
                                </div>
                                Bảng xếp hạng
                            </h3>
                            
                            <div className="flex-1">
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead>
                                        <tr className="border-b border-navy-light text-xs font-bold uppercase tracking-wider text-gray-500">
                                            <th className="pb-3 px-2 font-medium">Hạng</th>
                                            <th className="pb-3 px-2 font-medium">Đội bóng</th>
                                            <th className="pb-3 px-2 text-center font-medium">P</th>
                                            <th className="pb-3 px-2 text-right font-medium">Điểm</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-navy-light/50">
                                        {[
                                            { rank: 1, team: 'KTPM K21', p: 3, pts: 9, isTop: true },
                                            { rank: 2, team: 'ATTT K21', p: 3, pts: 7, isTop: true },
                                            { rank: 3, team: 'MMT K22', p: 3, pts: 4, isTop: true },
                                            { rank: 4, team: 'KHDL K21', p: 3, pts: 3, isTop: false },
                                        ].map((row, i) => (
                                            <tr key={i} className="group/row hover:bg-navy-light/20 transition-colors">
                                                <td className="py-4 px-2">
                                                    {row.rank === 1 ? (
                                                        <div className="w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                                                            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                                                        </div>
                                                    ) : row.rank === 2 ? (
                                                        <div className="w-7 h-7 rounded-full bg-gray-300/20 border border-gray-300/50 flex items-center justify-center">
                                                            <Trophy className="w-3.5 h-3.5 text-gray-300" />
                                                        </div>
                                                    ) : row.rank === 3 ? (
                                                        <div className="w-7 h-7 rounded-full bg-amber-600/20 border border-amber-600/50 flex items-center justify-center">
                                                            <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-full bg-navy-dark flex items-center justify-center font-bold text-gray-500 text-xs">
                                                            {row.rank}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className={`py-4 px-2 font-bold ${row.isTop ? 'text-white' : 'text-gray-300'}`}>{row.team}</td>
                                                <td className="py-4 px-2 text-center text-gray-500">{row.p}</td>
                                                <td className="py-4 px-2 text-right">
                                                    <span className={`px-2 py-1 rounded-md font-bold text-sm ${row.isTop ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400'}`}>
                                                        {row.pts}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <Link to="/bang-xep-hang" className="w-full mt-6 py-3.5 rounded-2xl bg-linear-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 text-blue-400 text-sm font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn relative z-10">
                                Xem bảng xếp hạng đầy đủ <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    )
}