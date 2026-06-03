import { Trophy, UserCircle2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { leaderboardData, teamsData } from '../data/data';

export default function LeaderboardTeams() {
  return (
    <div className="py-8 lg:py-12 bg-navy-dark min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section: Leaderboard */}
        <section className="mb-12 lg:mb-20 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-navy-light flex items-center justify-center border border-navy-light shadow-lg shadow-black/20">
              <Trophy className="w-6 h-6 text-neon" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase italic tracking-tight">
                Bảng <span className="text-neon">Xếp Hạng</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">Cập nhật vị trí các đội bóng sau mỗi vòng đấu.</p>
            </div>
          </div>

          <div className="bg-navy border border-navy-light rounded-2xl overflow-hidden shadow-lg shadow-black/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap min-w-[700px]">
                <thead className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6 text-center w-16">Hạng</th>
                    <th className="py-4 px-6">Đội Bóng</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Số trận đã đấu">P</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Thắng">W</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Hòa">D</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Thua">L</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Bàn thắng">GF</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Bàn thua">GA</th>
                    <th className="py-4 px-4 text-center cursor-help" title="Hiệu số">GD</th>
                    <th className="py-4 px-6 text-center">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboardData.map((row) => (
                    <tr key={row.rank} className="bg-navy hover:bg-navy-dark transition-colors duration-300">
                      <td className="py-4 px-6 text-center font-bold text-white">
                        {row.rank}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-navy-light flex items-center justify-center font-bold text-xs border border-navy-light text-gray-200">
                            {row.logo}
                          </div>
                          <span className="font-bold text-white">{row.team}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.p}</td>
                      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.w}</td>
                      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.d}</td>
                      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.l}</td>
                      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.gf}</td>
                      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.ga}</td>
                      <td className="py-4 px-4 text-center font-medium text-gray-400">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                      <td className="py-4 px-6 text-center font-black text-xl text-red-500">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Guide strip */}
            <div className="bg-navy-dark px-6 py-4 border-t border-navy-light text-xs text-gray-400 font-medium flex items-center gap-6 overflow-x-auto whitespace-nowrap">
               <span><strong className="text-white">P:</strong> Played</span>
               <span><strong className="text-white">W:</strong> Won</span>
               <span><strong className="text-white">D:</strong> Drawn</span>
               <span><strong className="text-white">L:</strong> Lost</span>
               <span><strong className="text-white">GF:</strong> Goals For</span>
               <span><strong className="text-white">GA:</strong> Goals Against</span>
               <span><strong className="text-white">GD:</strong> Goal Difference</span>
               <span><strong className="text-red-500">PTS:</strong> Points</span>
            </div>
          </div>
        </section>

        {/* Section: Teams */}
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase italic tracking-tight flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-navy-light flex items-center justify-center border border-navy-light">
                <Users className="w-5 h-5 text-neon" />
              </span>
              Danh Sách Đội Bóng
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamsData.map((team) => (
              <div key={team.id} className="bg-navy border border-navy-light border-t-4 border-t-blue-600 rounded-xl p-6 shadow-lg shadow-black/20 hover:shadow-md transition-all duration-300 flex flex-col h-full group">
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-navy-dark flex items-center justify-center font-black text-2xl text-gray-400 border border-navy-light shadow-lg shadow-black/20 group-hover:border-blue-300 transition-colors">
                    {team.logo}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                      {team.name}
                    </h3>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-bold uppercase tracking-wider text-neon">
                        {team.short}
                      </span>
                      <span className="text-sm text-gray-400 font-medium">HLV: {team.coach}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-5 flex flex-col items-center justify-between gap-4">
                  <div className="w-full text-sm font-medium text-gray-400 bg-navy-dark py-2 px-3 rounded-lg flex items-center justify-between">
                     <span>Số lượng cầu thủ:</span>
                     <strong className="text-white text-base">{team.players}</strong>
                  </div>
                  <Link to={`/doi-bong/${team.id}`} className="w-full text-center px-4 py-2.5 border-2 border-blue-600 text-neon font-bold rounded-lg hover:bg-blue-50 transition-colors duration-300 uppercase tracking-widest text-sm">
                    Xem Danh Sách
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
