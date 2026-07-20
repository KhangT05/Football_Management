import React from 'react';
import PosBadge from './myteam/PosBadge';
import { Edit, Trash2, Star } from 'lucide-react';

export default function PlayerRosterTable({ 
  players, 
  onEditPlayer, 
  onDeletePlayer, 
  showActions = true, 
  theme = 'dark' // 'dark' | 'light'
}) {
  const isLight = theme === 'light';

  return (
    <div className={`border rounded-xl overflow-hidden ${isLight ? 'bg-white border-gray-200' : 'bg-navy border-navy-light'}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap min-w-225">
          <thead>
            <tr className={`${isLight ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-navy-dark text-gray-400 border-navy-light'} text-xs font-bold uppercase tracking-wider border-b`}>
              <th className="py-3 px-4 w-16 text-center">Số</th>
              <th className="py-3 px-4">Cầu thủ</th>
              <th className="py-3 px-4 text-center">Ngày sinh</th>
              <th className="py-3 px-4 text-center">Chiều cao / Cân nặng</th>
              <th className="py-3 px-4 text-center">Quốc tịch</th>
              <th className="py-3 px-4 text-center">Vị trí</th>
              <th className="py-3 px-4 text-center">Vai trò</th>
              {showActions && <th className="py-3 px-4 text-right">Thao tác</th>}
            </tr>
          </thead>
          <tbody className={`divide-y ${isLight ? 'divide-gray-100' : 'divide-navy-light'}`}>
            {players.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 8 : 7} className="py-8 text-center text-gray-500">
                  Chưa có cầu thủ nào.
                </td>
              </tr>
            ) : (
              players.map(player => (
                <tr key={player.id} className={`${isLight ? 'hover:bg-gray-50' : 'hover:bg-navy-dark/50'} transition-colors group`}>
                  <td className={`py-3 px-4 text-center font-black ${isLight ? 'text-gray-900' : 'text-gray-300'}`}>
                    {player.jersey_number ?? player.number ?? '—'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${isLight ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-navy-dark border-navy-light text-gray-300'}`}>
                        {(player.player?.name ?? player.name ?? '?')[0]?.toUpperCase()}
                      </div>
                      <div>
                        <span className={`font-semibold block ${isLight ? 'text-gray-900' : 'text-white'}`}>
                          {player.player?.name ?? player.name ?? '—'}
                        </span>
                        {player.player?.user?.email && (
                          <span className="text-xs text-gray-500">{player.player.user.email}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={`py-3 px-4 text-center ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                    {player.player?.date_of_birth
                      ? new Date(player.player.date_of_birth).toLocaleDateString('vi-VN')
                      : '—'}
                  </td>
                  <td className={`py-3 px-4 text-center text-xs ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                    {player.player?.height || player.player?.weight ? (
                      <>
                        {player.player?.height ? `${player.player.height}cm` : '—'}
                        {' / '}
                        {player.player?.weight ? `${player.player.weight}kg` : '—'}
                      </>
                    ) : '—'}
                  </td>
                  <td className={`py-3 px-4 text-center ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                    {player.player?.nationality || '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <PosBadge pos={player.position} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded border inline-block ${
                      player.role === 'captain'
                        ? 'bg-amber-400/10 text-amber-500 border-amber-400/30'
                        : isLight 
                          ? 'bg-gray-100 text-gray-500 border-gray-200' 
                          : 'bg-navy-dark text-gray-400 border-navy-light'
                    }`}>
                      {player.role === 'captain' ? <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Đội trưởng</span>
                        : player.role === 'vice_captain' ? 'Phó'
                        : 'Thành viên'}
                    </span>
                  </td>
                  {showActions && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditPlayer?.(player)}
                          className="p-1.5 rounded text-blue-500 hover:bg-blue-50 transition-colors"
                          title="Sửa thông tin"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeletePlayer?.(player)}
                          className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-colors"
                          title="Xóa cầu thủ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
