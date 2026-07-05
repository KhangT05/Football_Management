import { Edit, Trash2, UserPlus, Users } from 'lucide-react';

/**
 * TeamRosterPanel
 * ─────────────────────────────────────────────────────
 * Hiển thị bảng danh sách cầu thủ (roster) của một đội bóng.
 * Tách từ ManageTeams.jsx để giảm kích thước component cha.
 *
 * @prop {Object}   team            — object đội bóng
 * @prop {Array}    players         — danh sách cầu thủ từ cache
 * @prop {boolean}  isLoading       — trạng thái đang tải cầu thủ
 * @prop {Function} onAddPlayer     — (teamId) => void
 * @prop {Function} onEditPlayer    — (teamId, player) => void
 * @prop {Function} onDeletePlayer  — (player, teamId) => void
 */
export default function TeamRosterPanel({ team, players, isLoading, onAddPlayer, onEditPlayer, onDeletePlayer }) {
  return (
    <div className="bg-navy-dark/60 border-l-4 border-blue-600 px-6 py-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-neon" />
          Danh sách cầu thủ – {team.name}
          <span className="ml-2 bg-navy-light px-2 py-0.5 rounded text-xs text-gray-400 font-normal">
            {isLoading ? '...' : `${players.length} TV`}
          </span>
        </h4>
        <button
          onClick={() => onAddPlayer(team.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold hover:bg-emerald-600/30 transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" /> Thêm cầu thủ
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-10 rounded-lg" />)}
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          Chưa có cầu thủ nào. Nhấn &quot;Thêm cầu thủ&quot; để bắt đầu.
        </div>
      ) : (
        <div className="bg-navy border border-navy-light rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap min-w-[900px]">
              <thead>
                <tr className="bg-navy-dark text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-navy-light">
                  <th className="py-3 px-4 w-16 text-center">Số</th>
                  <th className="py-3 px-4">Cầu thủ</th>
                  <th className="py-3 px-4 text-center">Ngày sinh</th>
                  <th className="py-3 px-4 text-center">Chiều cao / Cân nặng</th>
                  <th className="py-3 px-4 text-center">Quốc tịch</th>
                  <th className="py-3 px-4 text-center">Vị trí</th>
                  <th className="py-3 px-4 text-center">Vai trò</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-light">
                {players.map(player => (
                  <tr key={player.id} className="hover:bg-navy-dark/50 transition-colors group">
                    <td className="py-3 px-4 text-center font-black text-gray-300">
                      {player.jersey_number ?? player.number ?? '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-navy-dark border border-navy-light flex items-center justify-center text-xs font-bold text-gray-300">
                          {(player.player?.name ?? player.name ?? '?')[0]?.toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">
                            {player.player?.name ?? player.name ?? '—'}
                          </span>
                          {player.player?.user?.email && (
                            <span className="text-xs text-gray-500">{player.player.user.email}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-300">
                      {player.player?.date_of_birth
                        ? new Date(player.player.date_of_birth).toLocaleDateString('vi-VN')
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-300 text-xs">
                      {player.player?.height || player.player?.weight ? (
                        <>
                          {player.player?.height ? `${player.player.height}cm` : '—'}
                          {' / '}
                          {player.player?.weight ? `${player.player.weight}kg` : '—'}
                        </>
                      ) : '—'}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-300">
                      {player.player?.nationality || '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-navy-dark text-gray-300 border border-navy-light">
                        {player.position === 'goalkeeper' ? 'Thủ môn'
                          : player.position === 'defender' ? 'Hậu vệ'
                          : player.position === 'midfielder' ? 'Tiền vệ'
                          : player.position === 'forward' ? 'Tiền đạo'
                          : player.position ?? '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded border inline-block ${
                        player.role === 'captain'
                          ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                          : 'bg-navy-dark text-gray-400 border-navy-light'
                      }`}>
                        {player.role === 'captain' ? '⭐ Đội trưởng'
                          : player.role === 'vice_captain' ? 'Phó'
                          : 'Thành viên'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditPlayer(team.id, player)}
                          className="p-1.5 rounded text-blue-400 hover:bg-blue-500/10 transition-colors"
                          title="Sửa thông tin"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeletePlayer(player, team.id)}
                          className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Xóa cầu thủ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
