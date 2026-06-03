import MatchCard from "./MatchCard";
import { ChevronRight, BarChart } from 'lucide-react';

export default function ContentSection() {
    return(
        <section className="py-20 bg-navy-dark">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Content: Latest Results Widget */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Kết quả mới nhất</h2>
                            <button className="text-neon text-sm font-bold hover:text-neon-hover transition-colors flex items-center gap-1">
                                Xem tất cả <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2 uppercase tracking-wider">
                                    <div className="w-2 h-2 rounded-full bg-gray-500"></div> Đã kết thúc
                                </h3>
                                <MatchCard status="FT" time="Hôm qua, 17:30" teamA="KTPM K21" teamB="MMT K22" scoreA={3} scoreB={1} isUpcoming={false} />
                                <MatchCard status="FT" time="Hôm qua, 15:30" teamA="ATTT K21" teamB="KTPM K23" scoreA={2} scoreB={2} isUpcoming={false} />
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2 uppercase tracking-wider">
                                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div> Trực tiếp / đang diễn ra
                                </h3>
                                <MatchCard status="LIVE" time="Hôm nay, 18:00" teamA="HTTT K22" teamB="KHDL K21" scoreA={1} scoreB={0} isUpcoming={false} />
                                <MatchCard status="UPCOMING" time="Ngày mai, 17:30" teamA="MMT K23" teamB="ATTT K22" isUpcoming={true} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Mini Leaderboard */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-navy border border-navy-light rounded-2xl p-6 shadow-lg shadow-black/20 relative overflow-hidden">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <BarChart className="w-5 h-5 text-neon" />
                                Bảng xếp hạng
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-navy-dark text-white text-xs font-bold uppercase tracking-wider">
                                            <th className="py-3 px-4 rounded-tl-lg">Đội bóng</th>
                                            <th className="py-3 px-4 text-center">P</th>
                                            <th className="py-3 px-4 text-center rounded-tr-lg">Điểm</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-navy-light">
                                        <tr className="hover:bg-navy-dark transition-colors">
                                            <td className="py-3 px-4 font-bold text-white">KTPM K21</td>
                                            <td className="py-3 px-4 text-center text-gray-400">3</td>
                                            <td className="py-3 px-4 text-center font-bold text-neon">9</td>
                                        </tr>
                                        <tr className="hover:bg-navy-dark transition-colors">
                                            <td className="py-3 px-4 font-bold text-white">ATTT K21</td>
                                            <td className="py-3 px-4 text-center text-gray-400">3</td>
                                            <td className="py-3 px-4 text-center font-bold text-neon">7</td>
                                        </tr>
                                        <tr className="hover:bg-navy-dark transition-colors">
                                            <td className="py-3 px-4 font-bold text-white">MMT K22</td>
                                            <td className="py-3 px-4 text-center text-gray-400">3</td>
                                            <td className="py-3 px-4 text-center font-bold text-neon">4</td>
                                        </tr>
                                        <tr className="hover:bg-navy-dark transition-colors">
                                            <td className="py-3 px-4 font-bold text-white">KHDL K21</td>
                                            <td className="py-3 px-4 text-center text-gray-400">3</td>
                                            <td className="py-3 px-4 text-center font-bold text-neon">3</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button className="w-full mt-4 py-3 rounded-xl border border-navy-light text-neon text-sm font-bold hover:bg-navy-dark transition-all flex items-center justify-center gap-2">
                                Bảng xếp hạng đầy đủ <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    )
}