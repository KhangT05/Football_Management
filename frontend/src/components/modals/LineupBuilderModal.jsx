import { useMemo, useState, useRef } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Save, Loader2, Users, X, AlertCircle } from 'lucide-react';
import { useLineupQuery, useRegisterLineupMutation } from '../../queries/useLineup.queries';
import { useTeamRoster } from '../../queries/useTeamRoster';
import { useLineupForm } from '../../hooks/useLineupForm';
import { useLineupBuilderUiStore } from '../../store/lineupBuilderUiStore';
import { getSquadLimit, PITCH_LABEL_VI, POS_LABEL_VI } from '../../utils/position'; // getSquadLimit giờ nhận totalStarters live — xem comment ở utils/position.js
import { parseApiError } from '../../utils/errorHelper';
import useToastStore from '../../store/toastStore';
import PitchFormation from '../PitchFormation';
import { matchLineupApi } from '../../api/matchLineupApi';

export default function LineupBuilderModal({ match, teamId, seasonTeamId, onClose, onSave }) {
  const toast = useToastStore();
  const { jerseyColor, setJerseyColor } = useLineupBuilderUiStore();
  const [showSubsModal, setShowSubsModal] = useState(false);
  // Guard đồng bộ chống double-submit — KHÔNG dùng isSaving (isPending của
  // react-query) để chặn, vì state đó cập nhật qua subscription/re-render,
  // có độ trễ tính bằng tick. Double-click đủ nhanh (~100-200ms) có thể lọt
  // qua trước khi `disabled` được commit vào DOM, khiến handleSubmit chạy 2
  // lần → 2 mutateAsync song song → 1 trong 2 fail (race) → 2 toast lỗi
  // trùng nhau. useRef cập nhật ngay lập tức, không phụ thuộc render cycle,
  // nên chặn được chắc chắn ngay từ lần gọi đầu tiên.
  const submitLockRef = useRef(false);

  // Side chỉ dùng để chọn màu áo hiển thị — suy từ teamId truyền vào, KHÔNG
  // dùng để suy teamId (đó là bug cũ: modal tự đoán lại team qua activeTeamSide
  // trong khi parent đã biết chính xác team nào đang mở modal).
  const side = match?.home_team_id
    ? (teamId === match.home_team_id ? 'home' : 'away')
    : null;

  // FIX (stale pitch_type bug): trước đây pitchType/totalStartersNeeded được
  // suy từ `match` object (getPitchInfo(match)) — object này đến từ
  // match-list/match-detail query có thể đã cache trước khi season.pitch_type
  // bị admin đổi (VD san_5 -> san_11 sau khi match đã tồn tại). BE validate
  // LUÔN đọc season.pitch_type LIVE từ DB tại thời điểm register(), nên nếu
  // FE dùng giá trị cache cũ để tính totalStartersNeeded/hiện badge, sẽ xảy
  // ra lệch: badge hiện "SÂN 5" + cho phép chốt 5 cầu thủ, nhưng BE reject
  // với lỗi "Sân 11 cần đúng 11 cầu thủ" vì season thực tế đã là san_11.
  //
  // Fix: gọi thẳng GET /matches/:id/lineups/formation (wrap
  // MatchLineupService.getFormationForMatch — đọc pitch_type qua chính JOIN
  // match->phase->season mà register() dùng, không qua object nào khác) mỗi
  // lần mở modal. staleTime: 0 vì đây là input trực tiếp cho validate submit
  // (starters.length !== totalStartersNeeded chặn nút Lưu) — không được phép
  // cache dài, sai lệch ở đây gây block/pass sai ngay tại tầng business rule.
  //
  // PHẢI khai báo TRƯỚC squadLimit — squadLimit giờ nhận totalStartersNeeded
  // làm input (xem getSquadLimit trong utils/position.js), không còn tự suy
  // pitch_type từ `match` nữa. Trước đây 2 nơi (badge/cap ở modal này VÀ zod
  // schema qua squadLimit) đọc 2 nguồn khác nhau cho CÙNG 1 con số — sửa 1
  // chỗ mà bỏ sót chỗ kia thì bug vẫn còn (zod validate sai dù badge đã đúng).
  const {
    data: formation,
    isLoading: isFormationLoading,
    isError: isFormationError,
    error: formationError,
  } = useQuery({
    queryKey: ['match-formation', match?.id],
    queryFn: () => matchLineupApi.getFormation(match.id),
    enabled: !!match?.id,
    staleTime: 0,
    retry: false, // lỗi ở đây thường là 404 (route chưa đăng ký)/lỗi cấu hình — retry không giúp gì, chỉ trì hoãn hiển thị lỗi thật
  });

  const pitchType = formation?.pitchType ?? null;
  // Không fallback về squadLimit.max_players_per_team nữa (đó là 2 khái niệm
  // khác nhau — tổng đăng ký chính+dự bị vs. số đá chính theo luật sân, xem
  // comment ở match-lineup.service.ts). Trong lúc formation chưa load xong
  // hoặc lỗi, coi như CHƯA XÁC ĐỊNH (null) để UI/nút Lưu tự chặn thay vì lỡ
  // dùng con số sai của loại sân khác.
  const totalStartersNeeded = formation?.totalStarters ?? null;

  // FIX: truyền totalStartersNeeded (live) vào getSquadLimit thay vì để nó
  // tự suy qua match.phase.season.pitch_type — squadLimit đi thẳng vào
  // buildLineupFormSchema(squadLimit) ở useLineupForm, tức là zod validation.
  // Trong lúc formation đang loading, squadLimit.min/max_players_per_team =
  // null; UI vẫn đang show spinner (isLoading gộp isFormationLoading) nên
  // user chưa thể tương tác để trigger validate sai lúc này — khi formation
  // load xong, squadLimit tính lại đúng TRƯỚC khi roster/pitch render.
  const squadLimit = useMemo(
    () => getSquadLimit(match, totalStartersNeeded),
    [match, totalStartersNeeded]
  );

  // seasonTeamId lấy thẳng từ props (parent đã resolve qua activeSeasonTeam
  // state) — bỏ hẳn useSeasonTeamId + season_id derive từ match DTO, vì
  // match-list DTO không có field phase.season_id/season_id (chỉ có ở
  // match-detail DTO), đây chính là nguyên nhân lỗi "Match thiếu thông tin season".
  const {
    data: rawRoster = [],
    isLoading: isRosterLoading,
    isError: isRosterError,
    error: rosterError,
  } = useTeamRoster(seasonTeamId);

  const roster = useMemo(() => rawRoster.map(tp => ({
    player_id: tp.player_id ?? tp.player?.id,
    // FIX: tên cầu thủ nằm ở tp.player.user.name (nested qua account User),
    // KHÔNG phải tp.player.name hay tp.player.full_name — trước đây map sai
    // field khiến name luôn undefined, pill trên sân + list bên phải trống trơn.
    name: tp.player?.user?.name ?? tp.player?.name ?? tp.name,
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

  // Đưa đá chính lên đầu, rồi dự bị, rồi chưa chọn; cùng loại thì xếp theo số áo
  const sortedPlayers = useMemo(() => {
    const weight = (type) => (type === 'starter' ? 3 : type === 'substitute' ? 2 : 1);
    return [...players].sort((a, b) => {
      const w = weight(b.lineup_type) - weight(a.lineup_type);
      if (w !== 0) return w;
      return (parseInt(a.jersey_number) || 999) - (parseInt(b.jersey_number) || 999);
    });
  }, [players]);

  const findIndex = (playerId) => players.findIndex(p => String(p.player_id) === String(playerId));

  // FIX (6/5 bug, giờ dùng totalStartersNeeded từ formation query): chặn
  // thêm mới khi đã đủ số — isRemoving vẫn luôn được phép. Nếu
  // totalStartersNeeded chưa xác định (đang loading/lỗi), chặn luôn thao
  // tác thêm starter để tránh cho phép chốt sai số trước khi biết đúng luật
  // sân — an toàn hơn là fallback về một con số đoán.
  const toggleLineupType = (playerId, type) => {
    const idx = findIndex(playerId);
    if (idx < 0) return;
    const isRemoving = players[idx].lineup_type === type;
    if (!isRemoving && type === 'starter') {
      if (totalStartersNeeded == null) {
        toast.error('Chưa xác định được số cầu thủ đá chính cho sân này, vui lòng thử lại');
        return;
      }
      if (starters.length >= totalStartersNeeded) {
        toast.error(`Đã đủ ${totalStartersNeeded} cầu thủ đá chính cho sân này`);
        return;
      }
    }
    setValue(`players.${idx}.lineup_type`, isRemoving ? 'none' : type, { shouldValidate: true });
    if (isRemoving) setValue(`players.${idx}.is_captain`, false);
  };

  // FIX: kéo-thả chỉ check đúng vị trí, cùng cap totalStartersNeeded như trên.
  const handleDropOnPitch = (playerId, rowPosition) => {
    const idx = findIndex(playerId);
    if (idx < 0 || players[idx].position !== rowPosition) {
      toast.error(`${players[idx]?.name ?? ''} không chơi vị trí này`);
      return;
    }
    if (players[idx].lineup_type !== 'starter') {
      if (totalStartersNeeded == null) {
        toast.error('Chưa xác định được số cầu thủ đá chính cho sân này, vui lòng thử lại');
        return;
      }
      if (starters.length >= totalStartersNeeded) {
        toast.error(`Đã đủ ${totalStartersNeeded} cầu thủ đá chính cho sân này`);
        return;
      }
    }
    setValue(`players.${idx}.lineup_type`, 'starter', { shouldValidate: true });
  };

  const setCaptain = (playerId) => {
    const idx = findIndex(playerId);
    if (idx < 0 || players[idx].lineup_type === 'none') return;
    players.forEach((_, i) => setValue(`players.${i}.is_captain`, false));
    setValue(`players.${idx}.is_captain`, true, { shouldValidate: true });
  };

  // FIX (double-submit bug): guard bằng ref đồng bộ, không phụ thuộc
  // isSaving/disabled attribute — xem giải thích ở khai báo submitLockRef.
  const onSubmit = async (values) => {
    if (submitLockRef.current) return;
    submitLockRef.current = true;
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
    } finally {
      submitLockRef.current = false;
    }
  };

  // FIX (silent validation fail): handleSubmit(onSubmit) trước đây chỉ nhận
  // 1 arg — khi react-hook-form validate fail (vd thiếu đội trưởng), request
  // KHÔNG được gửi và cũng KHÔNG có phản hồi nào cho user ngoài dòng text nhỏ
  // dưới footer (dễ bị bỏ qua). Thêm invalid handler làm arg thứ 2 để bắn
  // toast tường minh ngay khi bấm Lưu mà form invalid.
  const onInvalid = (formErrors) => {
    toast.error(formErrors.players?.message ?? 'Vui lòng kiểm tra lại đội hình');
  };

  if (!match?.id) return null;

  // Guard 1: chưa xác định được season_team_id (vd user chưa đăng ký/chưa
  // chọn season_team nào ở SeasonTeamSwitcher, hoặc match chưa gán vào
  // season_team đúng — xem matchSeasonTeam ở MyTeam.jsx).
  if (!seasonTeamId) {
    return (
      <ModalShell onClose={onClose}>
        <ErrorBlock message="Chưa xác định được đăng ký mùa giải của đội — không thể tải danh sách cầu thủ." />
      </ModalShell>
    );
  }

  // Guard 2: match chưa gán team thật (chưa bốc thăm/chia bảng) — tránh mở
  // form xếp đội hình cho 1 trận chưa xác định đối thủ, vốn dễ gây hiểu nhầm
  // "0 cầu thủ" là do roster rỗng trong khi thực ra match chưa sẵn sàng.
  if (!match.home_team_id || !match.away_team_id) {
    return (
      <ModalShell onClose={onClose}>
        <ErrorBlock message="Trận đấu chưa được xếp lịch/bốc thăm — chưa thể xếp đội hình." />
      </ModalShell>
    );
  }

  // Guard 3: match chưa có scheduled_at — BE (getMatchContextOrFail) sẽ
  // reject với "Match {id} chưa có lịch thi đấu" ngay bước đầu transaction
  // register(). Chặn ngay tại đây, trước khi mở form.
  if (!match.scheduled_at) {
    return (
      <ModalShell onClose={onClose}>
        <ErrorBlock message="Trận đấu chưa được xếp lịch thi đấu — chưa thể xếp đội hình." />
      </ModalShell>
    );
  }

  // Guard 4 (NEW): formation query lỗi — không có gì để validate cap
  // starters, không nên cho mở form và lỡ cho user chốt sai số. Đây là lỗi
  // hạ tầng (API/route mới thêm), không phải lỗi nghiệp vụ như 3 guard trên,
  // nên message khác để phân biệt khi debug.
  if (isFormationError) {
    return (
      <ModalShell onClose={onClose}>
        <ErrorBlock message={`Không tải được thông tin sân thi đấu: ${parseApiError(formationError, 'Lỗi không xác định')}`} />
      </ModalShell>
    );
  }

  const isLoading = isRosterLoading || isLineupLoading || isFormationLoading;

  return (
    <FormProvider {...form}>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="relative bg-navy-dark/95 border border-navy-light rounded-[2.5rem] w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-navy-light bg-navy/40 shrink-0">
            <h3 className="text-2xl font-black text-white uppercase flex items-center gap-3 flex-wrap">
              <Users className="w-6 h-6 text-neon" /> Đội hình ra sân
              <span className="text-xs font-black bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-lg">
                {isFormationLoading ? '...' : (PITCH_LABEL_VI[pitchType] ?? pitchType ?? '—')}
              </span>
              <span className="text-xs font-black bg-navy-light text-gray-300 px-2.5 py-1 rounded-lg">
                {side === 'home' ? match.home_team?.name : side === 'away' ? match.away_team?.name : '—'}
              </span>
            </h3>
            <button type="button" onClick={onClose}>
              <X className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* FIX (scroll pitch): bỏ overflow-y-auto ở container cha — dùng
              min-h-0 để flex tính đúng chiều cao khả dụng, phần scroll (nếu
              cần) chỉ nằm ở roster panel bên phải — pitch luôn hiển thị đủ 4
              hàng trong viewport. */}
          <div className="flex-1 min-h-0 p-6 flex flex-col md:flex-row gap-6 bg-navy/20">
            {/* Sơ đồ sân — kéo cầu thủ từ danh sách bên phải vào đúng hàng vị trí.
                Đội tự chọn sơ đồ chiến thuật (DEF/MID/FW không bị ép tỷ lệ cố
                định), chỉ cần đủ tổng số theo luật sân + đúng 1 thủ môn.
                FIX (double-submit): khoá tương tác toàn cột (pointer-events-none)
                khi isSaving để không thể kéo-thả/bấm ★ đổi state trong lúc
                request register() đang bay. */}
            <div className={`w-full md:w-2/5 min-w-[320px] max-w-105 flex flex-col shrink-0 min-h-0 ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Sơ đồ đội hình</h4>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-navy border border-navy-light px-2 py-1 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Màu áo:</span>
                    <input
                      type="color"
                      value={jerseyColor[side ?? 'home']}
                      onChange={e => side && setJerseyColor(side, e.target.value)}
                      disabled={!side}
                      className="w-5 h-5 p-0 border-0 rounded cursor-pointer bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Chọn màu áo"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSubsModal(true)}
                    className="flex items-center gap-1.5 text-xs font-black bg-blue-500/20 text-blue-400 px-2.5 py-1.5 rounded-md hover:bg-blue-500/30 transition-all"
                  >
                    Dự bị <span className="bg-blue-500/30 px-1.5 rounded">{substitutes.length}</span>
                  </button>
                  {/* FIX: badge giờ so với totalStartersNeeded lấy LIVE từ BE
                      (formation query), không còn dùng lại getPitchInfo(match)
                      có thể cache stale — đây chính là nguồn gốc bug "5/5" hiện
                      trong khi BE đã validate theo san_11. */}
                  <span className={`text-xs font-black px-2 py-1.5 rounded-md ${totalStartersNeeded != null && starters.length === totalStartersNeeded ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {starters.length}/{totalStartersNeeded ?? '?'}
                  </span>
                </div>
              </div>
              {isLoading ? (
                <div className="flex-1 min-h-0 flex items-center justify-center bg-emerald-800/20 rounded-3xl border border-emerald-500/20">
                  <Loader2 className="w-8 h-8 text-neon animate-spin" />
                </div>
              ) : (
                <div className="flex-1 min-h-0">
                  <PitchFormation
                    starters={starters}
                    jerseyColor={jerseyColor[side ?? 'home']}
                    onRemove={pid => toggleLineupType(pid, 'starter')}
                    onSetCaptain={setCaptain}
                    onDropPlayer={handleDropOnPitch}
                  />
                </div>
              )}
            </div>

            {/* Roster — vừa là nguồn kéo-thả vừa toggle Chính/Dự bị bằng nút. */}
            <div className={`flex-1 min-h-0 bg-navy/50 border border-navy-light rounded-3xl p-5 overflow-y-auto custom-scrollbar ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}>
              <h4 className="text-sm font-black text-white mb-3 uppercase tracking-wider border-b border-navy-light pb-2">
                Danh sách đội bóng ({roster.length})
              </h4>
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 text-neon animate-spin" />
                </div>
              ) : isRosterError ? (
                <p className="text-sm text-red-400 text-center py-10">
                  Không tải được danh sách cầu thủ: {rosterError?.message ?? 'Lỗi không xác định'}
                </p>
              ) : roster.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10">Chưa có cầu thủ nào được duyệt cho mùa giải này.</p>
              ) : (
                <div className="space-y-2">
                  {sortedPlayers.map(player => {
                    const isStarter = player.lineup_type === 'starter';
                    const isSub = player.lineup_type === 'substitute';
                    return (
                      <div
                        key={player.player_id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('app/player-id', String(player.player_id));
                          e.dataTransfer.setData(`app/position-${player.position}`, '1');
                          e.dataTransfer.setData('text/plain', String(player.player_id)); // fallback cho Firefox
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${isStarter ? 'bg-emerald-500/10 border-emerald-500/30'
                          : isSub ? 'bg-blue-500/10 border-blue-500/30'
                            : 'bg-navy-light/30 border-transparent hover:bg-navy-light/60'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-navy border border-navy-light flex items-center justify-center overflow-hidden font-black text-gray-300 text-sm">
                            {player.avatar ? (
                              // FIX: <img> có draggable="true" mặc định của browser — nếu nhả
                              // chuột đúng lúc con trỏ nằm trên ảnh, browser sẽ dùng chính <img>
                              // làm drag source (kéo file ảnh) thay vì bubble lên onDragStart của
                              // div cha → setData không chạy → mất data ngay từ nguồn kéo.
                              <img src={player.avatar} alt="" draggable={false} className="w-full h-full object-cover" />
                            ) : player.jersey_number}
                          </div>
                          <div>
                            <p className={`font-bold text-sm ${isStarter ? 'text-emerald-400' : isSub ? 'text-blue-400' : 'text-white'}`}>
                              {player.name?.trim() || `Cầu thủ #${player.player_id}`}
                            </p>
                            <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">
                              Số {player.jersey_number || '?'} · {POS_LABEL_VI[player.position]}
                            </p>
                          </div>
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
              {/* FIX: điều kiện disable dùng totalStartersNeeded LIVE từ BE —
                  totalStartersNeeded == null (chưa load xong/lỗi) cũng disable
                  luôn, tránh cho phép submit khi chưa biết chắc số đúng.
                  disabled={isSaving} vẫn giữ làm UX guard (che nút khi đang
                  lưu), nhưng KHÔNG còn là guard duy nhất chống double-submit —
                  logic thật nằm ở submitLockRef trong onSubmit. */}
              <button
                type="submit"
                disabled={isSaving || isRosterError || totalStartersNeeded == null || starters.length !== totalStartersNeeded}
                className="px-8 py-3 font-black bg-neon text-black rounded-xl flex items-center gap-2 hover:bg-neon-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Lưu Đội Hình
              </button>
            </div>
          </div>
        </form>

        {showSubsModal && (
          <SubstitutesModal
            substitutes={substitutes}
            onRemove={pid => toggleLineupType(pid, 'substitute')}
            onClose={() => setShowSubsModal(false)}
          />
        )}
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

// Popup dự bị — tách khỏi cột pitch để pitch chiếm full chiều cao khả dụng.
// z-110 > z-100 của modal chính để nổi phía trên; backdrop riêng, click ngoài
// để đóng. Nằm ngoài <form> trong JSX tree nên các nút bên trong không có
// nguy cơ trigger submit dù không set type="button".
function SubstitutesModal({ substitutes, onRemove, onClose }) {
  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-navy-dark border border-navy-light rounded-3xl w-full max-w-sm max-h-[70vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-light shrink-0">
          <h4 className="text-sm font-black text-white uppercase tracking-wider">Dự bị ({substitutes.length})</h4>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {substitutes.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-6">Chưa chọn cầu thủ dự bị.</p>
          )}
          {substitutes.map(p => (
            <div key={p.player_id} className="flex items-center justify-between bg-navy-light/30 px-3 py-2 rounded-xl">
              <span className="text-sm font-bold text-gray-200">{p.jersey_number} · {p.name}</span>
              <button type="button" onClick={() => onRemove(p.player_id)} className="text-xs font-black text-red-400 hover:text-red-300">
                Bỏ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}