import { getInitials, AVATAR_COLORS } from '../utils/constants';

export default function StandingPlayerRow({ rank, playerStat, activeStatTab }) {
  const {
    player_id, player_name, team_id, team_name,
    value, reason, status,
  } = playerStat;

  const playerName = player_name || 'Cầu thủ không xác định';
  const teamName = team_name || 'Đội bóng không xác định';

  const initial = getInitials(playerName);
  const colorIdx = (player_id ?? rank) % AVATAR_COLORS.length;

  return (
    <tr className="hover:bg-white/5 transition-colors group border-b border-navy-light/50 last:border-0">
      {/* Hạng */}
      <td className="px-6 py-4 w-20">
        <div className="flex items-center justify-center">
          <span className={`text-lg font-black ${rank === 1 ? 'text-yellow-400' :
            rank === 2 ? 'text-gray-300' :
              rank === 3 ? 'text-amber-600' :
                'text-gray-500'
            }`}>
            {rank}
          </span>
        </div>
      </td>

      {/* Thông tin Cầu thủ */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full bg-linear-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center font-black text-lg text-white shadow-md border-2 border-navy-light shrink-0 group-hover:border-blue-500/50 transition-colors relative overflow-hidden`}>
              <span className="absolute inset-0 flex items-center justify-center select-none">
                {initial}
              </span>
            </div>
          </div>
          <div>
            <div className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
              {playerName}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-3.5 h-3.5 rounded-full bg-navy border border-navy-light flex items-center justify-center text-[8px] font-bold text-gray-400">
                {getInitials(teamName).substring(0, 1)}
              </div>
              <span className="text-xs text-gray-500 font-medium">{teamName}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Chỉ số chính */}
      <td className="px-6 py-4 text-right">
        {activeStatTab === 'suspended' ? (
          <span className="text-sm font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
            {reason || status || 'Bị treo giò'}
          </span>
        ) : (
          <span className="text-lg font-bold text-white">
            {activeStatTab === 'best' ? (Number(value ?? 0)).toFixed(1) : (value ?? 0)}
          </span>
        )}
      </td>
    </tr>
  );
}