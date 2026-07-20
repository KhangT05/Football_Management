import { useMemo } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { Save, Loader2, Users, X, AlertCircle } from 'lucide-react';
import { useLineupQuery, useRegisterLineupMutation } from '../../queries/useLineup.queries';
import { useTeamRoster } from '../../queries/useTeamRoster';
import { useLineupForm } from '../../hooks/useLineupForm';
import { useLineupBuilderUiStore } from '../../store/lineupBuilderUiStore';
import { getSquadLimit, getPitchInfo, PITCH_LABEL_VI, POS_LABEL_VI } from '../../utils/position';
import { parseApiError } from '../../utils/errorHelper';
import useToastStore from '../../store/toastStore';
import PitchFormation from '../PitchFormation';

export default function LineupBuilderModal({ match, teamId, seasonTeamId, onClose, onSave }) {
  const toast = useToastStore();
  const { jerseyColor, setJerseyColor } = useLineupBuilderUiStore();

  // Side chỉ dùng để chọn màu áo hiển thị — suy từ teamId truyền vào, KHÔNG
  // dùng để suy teamId (đó là bug cũ: modal tự đoán lại team qua activeTeamSide
  // trong khi parent đã biết chính xác team nào đang mở modal).
  const side = teamId === match?.home_team_id ? 'home' : 'away';

  const squadLimit = useMemo(() => getSquadLimit(match), [match]);
  const { pitchType } = useMemo(() => getPitchInfo(match), [match]);

  // seasonTeamId lấy thẳng từ props (parent đã resolve qua activeSeasonTeam
  // state) — bỏ hẳn useSeasonTeamId + season_id derive từ match DTO, vì
  // match-list DTO không có field phase.season_id/season_id (chỉ có ở
  // match-detail DTO), đây chính là nguyên nhân lỗi "Match thiếu thông tin season".
  const { data: rawRoster = [], isLoading: isRosterLoading } = useTeamRoster(seasonTeamId);

  const roster = useMemo(() => rawRoster.map(tp => ({
    player_id: tp.player_id ?? tp.player?.id,
    name: tp.player?.name ?? tp.name,
    jersey_number: tp.jersey_number ?? tp.number,
    position: tp.position,
    avatar: tp.player?.avatar,
  })), [rawRoster]);

  const { data: lineupData, isLoading: isLineupLoading } = useLineupQuery(match?.id, teamId);
  const { mutateAsync, isPending: isSaving } = useRegisterLineupMutation(match?.id, teamId);

  const { form } = useLineupForm({ roster, squadLimit, lineupData });
  const { control, handleSubmit, setValue, formState: { errors } } = form;

  const players = useWatch({ control, name: 'players' }) ?? [];
  const starters = players.filter(p => p.lineup_type === 'starter');
  const substitutes = players.filter(p => p.lineup_type === 'substitute');

  const findIndex = (playerId) => players.findIndex(p => String(p.player_id) === String(playerId));

  const toggleLineupType = (playerId, type) => {
    const idx = findIndex(playerId);
    if (idx < 0) return;
    const isRemoving = players[idx].lineup_type === type;
    setValue(`players.${idx}.lineup_type`, isRemoving ? 'none' : type, { shouldValidate: true });
    if (isRemoving) setValue(`players.${idx}.is_captain`, false);
  };

  const handleDropOnPitch = (playerId, rowPosition) => {
    const idx = findIndex(playerId);
    if (idx < 0 || players[idx].position !== rowPosition) {
      toast.error(`${players[idx]?.name ?? ''} không chơi vị trí này`);
      return;
    }
    setValue(`players.${idx}.lineup_type`, 'starter', { shouldValidate: true });
  };

  const setCaptain = (playerId) => {
    const idx = findIndex(playerId);
    if (idx < 0 || players[idx].lineup_type === 'none') return;
    players.forEach((_, i) => setValue(`players.${i}.is_captain`, false));
    setValue(`players.${idx}.is_captain`, true, { shouldValidate: true });
  };

  const onSubmit = async (values) => {
    try {
      await mutateAsync({
        team_id: Number(teamId), // matchLineupApi dùng Team.id — đúng schema MatchLineup
        players: values.players
          .filter(p => p.lineup_type !== 'none')
          .map(({ player_id, jersey_number, position, lineup_type, is_captain }) =>
            ({ player_id, jersey_number, position, lineup_type, is_captain })),
      });
      toast.success('Lưu đội hình thành công!');
      onSave?.();
      onClose();
    } catch (err) {
      toast.error(parseApiError(err, 'Lỗi khi lưu đội hình'));
    }
  };

  if (!match?.id) return null;

  // Guard duy nhất còn lại: chưa xác định được season_team_id (vd user chưa
  // đăng ký/chưa chọn season_team nào ở SeasonTeamSwitcher). Không còn
  // isResolvingTeam/resolveError vì không còn gọi useSeasonTeamId nữa.
  if (!seasonTeamId) {
    return (
      <ModalShell onClose={onClose}>
        <ErrorBlock message="Chưa xác định được đăng ký mùa giải của đội — không thể tải danh sách cầu thủ." />
      </ModalShell>
    );
  }

  const isLoading = isRosterLoading || isLineupLoading;

  return (
    <FormProvider {...form}>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <form onSubmit={handleSubmit(onSubmit)} className="relative bg-navy-dark/95 border border-navy-light rounded-[2.5rem] w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-navy-light bg-navy/40 shrink-0">
            <h3 className="text-2xl font-black text-white uppercase flex items-center gap-3 flex-wrap">
              <Users className="w-6 h-6 text-neon" /> Đội hình ra sân
              <span className="text-xs font-black bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-lg">
                {PITCH_LABEL_VI[pitchType] ?? pitchType}
              </span>
              <span className="text-xs font-black bg-navy-light text-gray-300 px-2.5 py-1 rounded-lg">
                {side === 'home' ? match.home_team?.name : match.away_team?.name}
              </span>
            </h3>
            <button type="button" onClick={onClose}>
              <X className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6 bg-navy/20">
            <div className="w-full md:w-2/5 min-w-[320px] max-w-[420px] flex flex-col shrink-0">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="color"
                  value={jerseyColor[side]}
                  onChange={e => setJerseyColor(side, e.target.value)}
                />
                <span className={`text-xs font-black px-2 py-1.5 rounded-md ${starters.length === squadLimit.max_players_per_team ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {starters.length}/{squadLimit.max_players_per_team}
                </span>
              </div>
              {isLoading ? (
                <div className="aspect-3/4 flex items-center justify-center bg-emerald-800/20 rounded-3xl border border-emerald-500/20">
                  <Loader2 className="w-8 h-8 text-neon animate-spin" />
                </div>
              ) : (
                <PitchFormation
                  starters={starters}
                  jerseyColor={jerseyColor[side]}
                  onRemove={pid => toggleLineupType(pid, 'starter')}
                  onSetCaptain={setCaptain}
                  onDropPlayer={handleDropOnPitch}
                />
              )}
              <div className="mt-4 bg-navy/50 border border-blue-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-blue-400 uppercase">Dự bị</span>
                  <span className="text-xs font-black bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md">{substitutes.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {substitutes.length === 0 && <span className="text-xs text-gray-500">Chưa chọn</span>}
                  {substitutes.map(p => (
                    <span key={p.player_id} className="text-xs font-bold text-gray-300 bg-navy-light/50 px-2 py-1 rounded-lg">
                      {p.jersey_number} · {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-navy/50 border border-navy-light rounded-3xl p-5 overflow-y-auto max-h-[600px] custom-scrollbar">
              <h4 className="text-sm font-black text-white mb-3 uppercase tracking-wider border-b border-navy-light pb-2">
                Danh sách đội bóng ({roster.length})
              </h4>
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 text-neon animate-spin" />
                </div>
              ) : roster.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10">Chưa có cầu thủ nào được duyệt cho mùa giải này.</p>
              ) : (
                <div className="space-y-2">
                  {players.map(player => {
                    const isStarter = player.lineup_type === 'starter';
                    const isSub = player.lineup_type === 'substitute';
                    return (
                      <div
                        key={player.player_id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('app/player-id', String(player.player_id));
                          e.dataTransfer.setData(`app/position-${player.position}`, '1');
                          e.dataTransfer.setData('text/plain', String(player.player_id));
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${isStarter ? 'bg-emerald-500/10 border-emerald-500/30'
                          : isSub ? 'bg-blue-500/10 border-blue-500/30'
                            : 'bg-navy-light/30 border-transparent hover:bg-navy-light/60'
                          }`}
                      >
                        <div>
                          <p className={`font-bold text-sm ${isStarter ? 'text-emerald-400' : isSub ? 'text-blue-400' : 'text-white'}`}>{player.name}</p>
                          <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">
                            Số {player.jersey_number || '?'} · {POS_LABEL_VI[player.position]}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button type="button" onClick={() => toggleLineupType(player.player_id, 'starter')}
                            className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${isStarter ? 'bg-emerald-500 text-white' : 'bg-navy-light text-gray-400 hover:text-emerald-400'}`}>
                            Chính
                          </button>
                          <button type="button" onClick={() => toggleLineupType(player.player_id, 'substitute')}
                            className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${isSub ? 'bg-blue-500 text-white' : 'bg-navy-light text-gray-400 hover:text-blue-400'}`}>
                            Dự bị
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="px-4 py-3.5 border-t border-navy-light bg-navy/40 shrink-0 flex justify-between items-center">
            <div className="flex items-center gap-2 text-yellow-500/80 text-xs font-medium">
              <AlertCircle className="w-4 h-4" /> {errors.players?.message ?? 'Kéo cầu thủ vào sân hoặc dùng nút Chính/Dự bị. Bấm ★ trên sân để chọn đội trưởng.'}
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-gray-400 hover:text-white hover:bg-navy-light rounded-xl transition-all">
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSaving || starters.length !== squadLimit.max_players_per_team}
                className="px-8 py-3 font-black bg-neon text-black rounded-xl flex items-center gap-2 hover:bg-neon-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Lưu Đội Hình
              </button>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}

function ModalShell({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy-dark/95 border border-navy-light rounded-[2.5rem] shadow-2xl w-full max-w-md p-8">
        {children}
      </div>
    </div>
  );
}

function ErrorBlock({ message }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <AlertCircle className="w-10 h-10 text-red-400" />
      <p className="text-sm text-gray-300 font-medium">{message}</p>
    </div>
  );
}