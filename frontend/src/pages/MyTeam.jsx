import { Users, UserPlus, Trophy, Info, Settings, Trash2, Edit } from 'lucide-react';
import { initialPlayers } from '../data/data';

export default function MyTeam() {
  return (
    <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-navy border-2 border-neon rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(57,255,20,0.2)]">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold text-white uppercase italic tracking-wider">KTPM K21</h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase">Đã Duyệt</span>
              </div>
              <p className="text-gray-400 font-medium">Khoa Công nghệ thông tin - Mùa giải 2026</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="bg-navy-light text-white font-bold px-4 py-2 rounded-lg hover:bg-navy transition-colors flex items-center gap-2 border border-navy-light">
              <Settings className="w-4 h-4" />
              Cài đặt đội
            </button>
            <button className="bg-neon text-navy font-bold px-4 py-2 rounded-lg hover:bg-neon-hover transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.2)]">
              <UserPlus className="w-4 h-4" />
              Thêm cầu thủ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Players List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-navy border border-navy-light rounded-2xl shadow-lg shadow-black/20 overflow-hidden">
              <div className="p-6 border-b border-navy-light flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-neon" />
                  Danh Sách Cầu Thủ
                </h2>
                <span className="text-sm font-bold text-gray-400 bg-navy-dark px-3 py-1 rounded-lg border border-navy-light">
                  {initialPlayers.length} / 20
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-navy-dark text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-navy-light">
                      <th className="py-4 px-6 w-16 text-center">Số</th>
                      <th className="py-4 px-6">Cầu thủ</th>
                      <th className="py-4 px-6">Vị trí</th>
                      <th className="py-4 px-6 text-center">Bàn thắng</th>
                      <th className="py-4 px-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-light">
                    {initialPlayers.map((player) => (
                      <tr key={player.id} className="hover:bg-navy-light/50 transition-colors">
                        <td className="py-4 px-6 text-center">
                          <span className="font-black text-lg text-white">{player.number}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full bg-navy-dark border border-navy-light" />
                            <div>
                              <p className="font-bold text-white">{player.name}</p>
                              <p className="text-xs text-gray-400">MSSV: 0306{player.id}2026</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-navy-dark text-gray-300 rounded-lg text-xs font-bold border border-navy-light">
                            {player.position}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-neon">
                          {player.goals}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="w-8 h-8 rounded-lg bg-navy-dark border border-navy-light flex items-center justify-center text-blue-400 hover:bg-blue-500/10 hover:border-blue-500 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-navy-dark border border-navy-light flex items-center justify-center text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar - Team Stats & Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-navy border border-navy-light rounded-2xl shadow-lg shadow-black/20 p-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 border-b border-navy-light pb-4">
                <Info className="w-5 h-5 text-neon" />
                Thông tin chung
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm font-medium">Đội trưởng</span>
                  <span className="text-white font-bold text-sm">Nguyễn Văn A</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm font-medium">SĐT liên hệ</span>
                  <span className="text-white font-bold text-sm">0123 456 789</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm font-medium">Màu áo chính</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-600 border border-white"></div>
                    <span className="text-white font-bold text-sm">Đỏ đen</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm font-medium">Ngày đăng ký</span>
                  <span className="text-white font-bold text-sm">12/03/2026</span>
                </div>
              </div>
            </div>

            <div className="bg-navy border border-navy-light rounded-2xl shadow-lg shadow-black/20 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Trophy className="w-24 h-24 text-neon" />
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 relative z-10 border-b border-navy-light pb-4">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Thống kê giải đấu
              </h3>
              
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-navy-dark p-4 rounded-xl border border-navy-light text-center">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Trận đấu</p>
                  <p className="text-2xl font-black text-white">5</p>
                </div>
                <div className="bg-navy-dark p-4 rounded-xl border border-navy-light text-center">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Bàn thắng</p>
                  <p className="text-2xl font-black text-neon">12</p>
                </div>
                <div className="bg-navy-dark p-4 rounded-xl border border-navy-light text-center">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Thắng</p>
                  <p className="text-2xl font-black text-blue-400">4</p>
                </div>
                <div className="bg-navy-dark p-4 rounded-xl border border-navy-light text-center">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Xếp hạng</p>
                  <p className="text-2xl font-black text-yellow-400">#1</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
