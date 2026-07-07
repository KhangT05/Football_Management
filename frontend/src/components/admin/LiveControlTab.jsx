import { useState, useEffect, useMemo } from 'react';
import {
  Save, Plus, Trash2, Activity,
  Loader2, RefreshCw,
  RotateCcw,
  Flag, Zap, Target, Shield, Search
} from 'lucide-react';
import { teamApi, matchApi, matchLineupApi } from '../../api';
import useScheduleStore from '../../store/scheduleStore';
import useSeasonStore from '../../store/seasonStore';
import useTeamStore from '../../store/teamStore';
import useToastStore from '../../store/toastStore';

import EventCard from '../../components/admin/EventCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import MatchSelectorPanel from '../../components/admin/MatchSelectorPanel';

import {
  ForfeitMatchModal,
  AbandonMatchModal,
  DisputeModal,
  ResolveAppealModal
} from '../../components/admin/AdvancedMatchControlModals';

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  { key: 'goal', label: 'Bàn thắng', icon: '⚽', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20 hover:border-emerald-500/40' },
  { key: 'yellow', label: 'Thẻ Vàng', icon: '🟨', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/40 hover:bg-yellow-500/20 hover:border-yellow-400' },
  { key: 'red', label: 'Thẻ Đỏ', icon: '🟥', cls: 'bg-red-500/10 text-red-400 border-red-500/40 hover:bg-red-500/20 hover:border-red-400' },
  { key: 'substitution', label: 'Thay người', icon: '🔄', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/40 hover:bg-blue-500/20 hover:border-blue-400' },
];

// Ngưỡng phút hợp lệ — chỉ là UX guard, KHÔNG thay thế validation ở BE.
// BE (matchlifecycle.service.ts: recordEvent/addEvent/editEvent) hiện không
// bound-check `minute` theo `period`. Cần vá riêng ở BE — đây chỉ chặn input
// bất thường trên UI, client vẫn có thể bypass qua raw API call.
const MAX_MINUTE = 130;

// ─── Second-yellow detection ────────────────────────────────────────────────
// Local model giữ evt.type === 'yellow' cho MỌI thẻ vàng (kể cả thẻ thứ 2) để
// UI đơn giản — effective type (yellow_card vs second_yellow) chỉ resolve tại
// thời điểm build payload gửi BE, dựa theo thứ tự tạo event (id = Date.now()).
function getEffectiveYellowType(evt, sideEvents) {
  if (evt.type !== 'yellow' || !evt.player) return 'yellow';
  const earlierYellowSamePlayer = sideEvents.some(
    e => e.type === 'yellow' && e.player === evt.player && e.id < evt.id
  );
  return earlierYellowSamePlayer ? 'second_yellow' : 'yellow';
}

function countYellowsByPlayer(sideEvents) {
  const map = new Map();
  for (const e of sideEvents) {
    if (e.type !== 'yellow' || !e.player) continue;
    map.set(e.player, (map.get(e.player) || 0) + 1);
  }
  return map;
}

// ─── Payload builders ─────────────────────────────────────────────────────────
// NHẬN effectiveType riêng thay vì đọc evt.type trực tiếp — bắt buộc để
// second-yellow thật sự đi thành type='second_yellow' lên BE, khớp với badge
// cảnh báo đã hiển thị trong EventCard.jsx.
function buildEventPayload(evt, teamId, effectiveType) {
  const base = { teamId, minute: Number(evt.minute) || 1 };
  switch (effectiveType) {
    case 'goal': return [{ ...base, type: 'goal', playerId: evt.player || undefined }];
    case 'yellow': return [{ ...base, type: 'yellow_card', playerId: evt.player || undefined }];
    case 'second_yellow': return [{ ...base, type: 'second_yellow', playerId: evt.player || undefined }];
    case 'red': return [{ ...base, type: 'red_card', playerId: evt.player || undefined }];
    case 'substitution': return [
      { ...base, type: 'substitution_in', playerId: evt.playerIn || undefined },
      { ...base, type: 'substitution_out', playerId: evt.playerOut || undefined },
    ];
    default: return [];
  }
}

function countEvents(events) {
  return {
    goals: events.filter(e => e.type === 'goal').length,
    yellow: events.filter(e => e.type === 'yellow').length,
    red: events.filter(e => e.type === 'red').length,
    subs: events.filter(e => e.type === 'substitution').length,
  };
}

// ─── Robust API response unwrapping ────────────────────────────────────────
// PREV BUG: `typeof res?.status === 'boolean'` giả định custom wrapper.
// axios thật trả res.status = number (200) → luôn rơi vào else, payload =
// toàn bộ response object → parse ra [] mọi lúc.
// Fix: thử tuần tự các shape phổ biến, không đoán qua typeof status.
function unwrapListResponse(res, label) {
  const candidates = [
    res?.data?.data,   // axios response, paginated envelope
    res?.data,         // axios response, raw array HOẶC đã-unwrap paginated
    res,               // đã-unwrap raw array
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  console.warn(`[LiveControlTab] Không parse được response cho ${label}. Shape thực tế:`, res);
  return [];
}

// ─── Main Component: LiveControlTab ──────────────────────────────────────────

export default function LiveControlTab({ selectedSeasonId, selectedMatchId, setSelectedMatchId, onGoToSchedule }) {
  const toast = useToastStore();
  const { seasons } = useSeasonStore();
  const { getMatchesFromCache, isSeasonLoading, fetchBySeason, scheduleCache } = useScheduleStore();
  const { teams, fetchAll: fetchTeams } = useTeamStore();

  useEffect(() => {
    fetchTeams({ per_page: 500, force: true });
  }, [fetchTeams]);

  const effectiveSeasonId = selectedSeasonId;

  const allSeasonMatches = useMemo(
    () => effectiveSeasonId
      ? getMatchesFromCache(Number(effectiveSeasonId))
      : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effectiveSeasonId, scheduleCache, getMatchesFromCache]
  );

  const isLoadingMatches = effectiveSeasonId
    ? isSeasonLoading(Number(effectiveSeasonId))
    : false;

  const [searchTerm, setSearchTerm] = useState('');

  // Danh sách trận "khả dụng cho live control": chỉ scheduled/ongoing.
  // Tách riêng thành statusFilteredMatches (chưa áp search) để phân biệt
  // "season không có trận nào" vs "search filter loại hết" ở MatchSelectorPanel.
  const statusFilteredMatches = useMemo(
    () => allSeasonMatches.filter(m => m.status === 'scheduled' || m.status === 'ongoing'),
    [allSeasonMatches]
  );

  const matches = useMemo(() => {
    if (!searchTerm) return statusFilteredMatches;
    const lower = searchTerm.toLowerCase();
    return statusFilteredMatches.filter(m => {
      const hName = m.home_team?.name ?? teams.find(t => Number(t.id) === Number(m.home_team_id))?.name;
      const aName = m.away_team?.name ?? teams.find(t => Number(t.id) === Number(m.away_team_id))?.name;
      // teams store chưa load xong (race với fetchTeams ở trên) → không loại
      // kết quả, tránh false-negative khi search chạy trước khi tên resolve.
      if (hName == null && aName == null) return true;
      return (hName ?? '').toLowerCase().includes(lower) || (aName ?? '').toLowerCase().includes(lower);
    });
  }, [statusFilteredMatches, searchTerm, teams]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(matches.length / itemsPerPage);
  const displayedMatches = matches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedMatch = useMemo(
    () => matches.find(m => String(m.id) === String(selectedMatchId)) ?? null,
    [matches, selectedMatchId],
  );

  // ── Players & Lineups ─────────────────────────────────────────────────────
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [lineups, setLineups] = useState({ home: [], away: [] });

  useEffect(() => {
    if (!selectedMatch) return;
    let cancelled = false;

    const load = async () => {
      setLoadingPlayers(true);
      try {
        const [homeRes, awayRes, lineupRes] = await Promise.allSettled([
          selectedMatch.home_team_id ? teamApi.getPlayers(selectedMatch.home_team_id, { per_page: 50 }) : Promise.resolve([]),
          selectedMatch.away_team_id ? teamApi.getPlayers(selectedMatch.away_team_id, { per_page: 50 }) : Promise.resolve([]),
          matchLineupApi.getMatchLineups(selectedMatch.id)
        ]);
        if (cancelled) return;

        // Surface fetch failure ra toast — trước đây chỉ log console, UI im
        // lặng → nhìn giống "dropdown rỗng do bug logic" trong khi thực tế là
        // request fail. Phân biệt rõ data issue vs UI bug.
        if (homeRes.status === 'rejected') {
          console.error(`[LiveControlTab] getPlayers(home_team_id=${selectedMatch.home_team_id}) failed:`, homeRes.reason);
          toast.error(`Không tải được danh sách cầu thủ đội nhà (team_id=${selectedMatch.home_team_id}).`);
        }
        if (awayRes.status === 'rejected') {
          console.error(`[LiveControlTab] getPlayers(away_team_id=${selectedMatch.away_team_id}) failed:`, awayRes.reason);
          toast.error(`Không tải được danh sách cầu thủ đội khách (team_id=${selectedMatch.away_team_id}).`);
        }

        const parsedHome = homeRes.status === 'fulfilled' ? unwrapListResponse(homeRes.value, 'homePlayers') : [];
        const parsedAway = awayRes.status === 'fulfilled' ? unwrapListResponse(awayRes.value, 'awayPlayers') : [];

        // Fetch fulfilled nhưng trả 0 phần tử = data issue (team chưa có
        // player trong DB), không phải parse lỗi — log riêng để không tốn
        // thời gian debug lại unwrapListResponse.
        if (homeRes.status === 'fulfilled' && parsedHome.length === 0) {
          console.warn(`[LiveControlTab] home_team_id=${selectedMatch.home_team_id} trả về 0 cầu thủ. Kiểm tra DB/API trực tiếp cho team này.`);
        }
        if (awayRes.status === 'fulfilled' && parsedAway.length === 0) {
          console.warn(`[LiveControlTab] away_team_id=${selectedMatch.away_team_id} trả về 0 cầu thủ. Kiểm tra DB/API trực tiếp cho team này.`);
        }

        setHomePlayers(parsedHome);
        setAwayPlayers(parsedAway);

        const allLineups = lineupRes.status === 'fulfilled' ? unwrapListResponse(lineupRes.value, 'lineups') : [];

        // Coerce cả 2 vế về Number — tránh lệch string/number giữa
        // lineup.team_id và match.home_team_id/away_team_id.
        const homeTeamId = Number(selectedMatch.home_team_id);
        const awayTeamId = Number(selectedMatch.away_team_id);
        setLineups({
          home: allLineups.filter(l => Number(l.team_id) === homeTeamId),
          away: allLineups.filter(l => Number(l.team_id) === awayTeamId)
        });
      } finally {
        if (!cancelled) setLoadingPlayers(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedMatch?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Events ──────────────────────────────────────────────────────────────────
  // Score KHÔNG phải state riêng — derive từ homeEvents/awayEvents (type='goal')
  // để KHÔNG THỂ desync với BE. BE luôn tính lại score từ matchEvent table qua
  // _computeScoreFromEvents, không có chỗ nhận raw score override khi match
  // đang ongoing/event-driven.
  const [homeEvents, setHomeEvents] = useState([]);
  const [awayEvents, setAwayEvents] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  const homeGoalCount = useMemo(() => homeEvents.filter(e => e.type === 'goal').length, [homeEvents]);
  const awayGoalCount = useMemo(() => awayEvents.filter(e => e.type === 'goal').length, [awayEvents]);

  const [matchStatus, setMatchStatus] = useState('');

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const [activeModal, setActiveModal] = useState(null); // 'forfeit', 'abandon', 'appeal', 'protest', 'resolve'

  useEffect(() => {
    if (!effectiveSeasonId) return;
    fetchBySeason(Number(effectiveSeasonId), { force: true });
  }, [effectiveSeasonId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedMatch) {
      setMatchStatus(selectedMatch.status);
    } else {
      setMatchStatus('');
    }
  }, [selectedMatch]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const _resetForm = () => {
    setSelectedMatchId('');
    setHomeEvents([]); setAwayEvents([]);
    setIsDirty(false);
    setMatchStatus('');
  };

  const handleMatchSelect = (matchId) => {
    setSelectedMatchId(matchId);
    setHomeEvents([]); setAwayEvents([]);
    setIsDirty(false);
  };

  const addEvent = (side, type) => {
    const base = { id: Date.now(), type, minute: '', player: '' };
    const newEvt = type === 'substitution' ? { ...base, playerIn: '', playerOut: '' } : base;
    if (side === 'home') setHomeEvents(prev => [...prev, newEvt]);
    else setAwayEvents(prev => [...prev, newEvt]);
    setIsDirty(true);
  };

  const removeEvent = (side, id) => {
    if (side === 'home') setHomeEvents(prev => prev.filter(e => e.id !== id));
    else setAwayEvents(prev => prev.filter(e => e.id !== id));
    setIsDirty(true);
  };

  const updateEvent = (side, id, field, value) => {
    // Guard phút: strip non-digit + clamp 0..MAX_MINUTE ngay tại input.
    // Chỉ là UX guard — BE hiện KHÔNG validate minute theo period, client
    // luôn có thể bypass qua raw API call, cần vá riêng ở BE.
    let v = value;
    if (field === 'minute') {
      const digits = String(value).replace(/\D/g, '');
      v = digits === '' ? '' : String(Math.min(MAX_MINUTE, Math.max(0, Number(digits))));
    }
    const updater = evts => evts.map(e => e.id === id ? { ...e, [field]: v } : e);
    if (side === 'home') setHomeEvents(updater); else setAwayEvents(updater);
    setIsDirty(true);
  };

  const getHomeName = () => selectedMatch?.home_team?.name ?? teams.find(t => Number(t.id) === Number(selectedMatch?.home_team_id))?.name ?? `Đội ${selectedMatch?.home_team_id ?? ''}`;
  const getAwayName = () => selectedMatch?.away_team?.name ?? teams.find(t => Number(t.id) === Number(selectedMatch?.away_team_id))?.name ?? `Đội ${selectedMatch?.away_team_id ?? ''}`;

  const handleRefresh = () => {
    if (effectiveSeasonId) {
      fetchBySeason(Number(effectiveSeasonId), { force: true });
    } else {
      seasons.forEach(s => fetchBySeason(s.id, { force: true }));
    }
  };

  const validate = () => {
    if (homeEvents.some(e => !e.minute) || awayEvents.some(e => !e.minute))
      return 'Vui lòng điền phút cho tất cả sự kiện.';

    // Chặn thẻ vàng thứ 3+ cho cùng 1 cầu thủ trong cùng trận — sau thẻ vàng
    // thứ 2 (=second_yellow=đỏ), cầu thủ đã bị truất quyền thi đấu. BE
    // (recordEvent) chỉ chặn được lần đầu-vs-lần-hai (findFirst theo
    // type='yellow_card'), không biết gì về "thẻ thứ 3" vì theo model BE,
    // thẻ thứ 2 đã là type khác (second_yellow) — guard này phải nằm ở FE
    // trước khi build payload.
    for (const [label, events] of [['Đội nhà', homeEvents], ['Đội khách', awayEvents]]) {
      const yellowCounts = countYellowsByPlayer(events);
      for (const [, count] of yellowCounts) {
        if (count > 2) {
          return `${label}: một cầu thủ đã có ${count} thẻ vàng — cầu thủ bị truất quyền sau thẻ vàng thứ 2, không thể nhận thêm thẻ.`;
        }
      }
    }
    return '';
  };

  const syncUnsavedEvents = async () => {
    const pushSide = async (events, teamId) => {
      for (const evt of events) {
        if (evt.isSaved) continue;
        const effectiveType = evt.type === 'yellow' ? getEffectiveYellowType(evt, events) : evt.type;
        const payloads = buildEventPayload(evt, teamId, effectiveType);
        for (const payload of payloads) {
          try { await matchApi.recordEvent(selectedMatch.id, payload); }
          catch (err) { console.warn('[syncEvents] recordEvent failed:', payload, err); }
        }
        evt.isSaved = true;
      }
    };
    await pushSide(homeEvents, selectedMatch.home_team_id);
    await pushSide(awayEvents, selectedMatch.away_team_id);
  };

  const handleSaveDraft = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setIsSavingDraft(true);
    try {
      // Match còn 'scheduled' → chuyển ongoing trước khi BE chấp nhận event
      // (giả định BE gate recordEvent theo status !== 'scheduled'; nếu BE
      // không gate, gọi startMatch dư vẫn no-op an toàn — verify lại BE).
      if (matchStatus === 'scheduled' || matchStatus === 'postponed') {
        await matchApi.startMatch(selectedMatch.id);
        setMatchStatus('ongoing');
      }
      await syncUnsavedEvents();
      toast.info('Đã đồng bộ sự kiện (chưa xác nhận kết quả).');
      setIsDirty(false);
    } catch {
      toast.error('Lỗi khi đồng bộ sự kiện.');
    } finally { setIsSavingDraft(false); }
  };

  const handleFinishMatch = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setIsFinishing(true);
    try {
      // Gộp start+finish thành 1 action duy nhất — bỏ bước "Bắt đầu" tách
      // riêng theo yêu cầu. Nếu match vẫn 'scheduled', chuyển ongoing trước
      // khi sync event + finalize, để không phá gate status ở BE.
      if (matchStatus === 'scheduled' || matchStatus === 'postponed') {
        await matchApi.startMatch(selectedMatch.id);
      }

      // 1. Sync toàn bộ sự kiện chưa lưu (goal, thẻ, thay người).
      await syncUnsavedEvents();

      // 2. Finalize kết quả — score lấy từ goal count vừa sync, không phải
      // input tay, nên luôn khớp với event list vừa gửi lên.
      await matchApi.adminRecordResult(selectedMatch.id, {
        homeScore: homeGoalCount, awayScore: awayGoalCount,
        resultType: 'full_time',
      });

      setMatchStatus('finished');
      toast.success('Xác nhận kết quả thành công! Standings và bracket đã được cập nhật. 🎉', 5000);
      setIsDirty(false);
      handleRefresh();
    } catch (err) {
      toast.error('Lỗi khi xác nhận kết quả: ' + (err?.response?.data?.message || err.message));
    } finally { setIsFinishing(false); }
  };

  const handleReset = () => {
    setHomeEvents([]); setAwayEvents([]);
    setIsDirty(false);
    toast.info('Đã đặt lại form.');
  };

  // isEditable thay cho isOngoing/isScheduled riêng lẻ — không còn nút Bắt
  // đầu tách biệt nên mọi status "chưa xong" (scheduled/postponed/ongoing/
  // pending_official/needs_review) đều cho phép thao tác event như nhau.
  const isFinished = matchStatus === 'finished';
  const isProtested = matchStatus === 'protested';
  const isEditable = !isFinished && !isProtested;

  const handleModalSuccess = (msg) => {
    toast.success(msg);
    setActiveModal(null);
    handleRefresh();
  };

  const fmtMatchDate = (m) => m?.scheduled_at
    ? new Date(m.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
    : 'TBD';

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-4 animate-fade-in">
        <MatchSelectorPanel
          matches={matches}
          allSeasonMatchesCount={statusFilteredMatches.length}
          teams={teams}
          isLoading={isLoadingMatches}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          displayedMatches={displayedMatches}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          selectedMatchId={selectedMatchId}
          onMatchSelect={handleMatchSelect}
          onRefresh={() => fetchBySeason(Number(effectiveSeasonId), { force: true })}
          isRefreshing={isLoadingMatches}
          onGoToSchedule={onGoToSchedule}
        />

        {/* ── Main Workspace ── */}
        {selectedMatch && (
          <div className="space-y-4">

            {/* ── Compact Scoreboard ── */}
            <div className="relative bg-navy border border-navy-light rounded-2xl overflow-hidden shadow-lg shadow-black/30">
              <div className={`h-1 w-full ${matchStatus === 'ongoing' ? 'bg-linear-to-r from-red-600 via-orange-500 to-red-600 animate-gradient' : 'bg-linear-to-r from-blue-600 via-indigo-500 to-blue-600'}`} />

              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-center gap-2 mb-2.5 text-xs">
                  <StatusBadge status={matchStatus || selectedMatch.status} />
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-500">{fmtMatchDate(selectedMatch)}</span>
                  {selectedMatch.venue?.name && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-500 hidden sm:inline">{selectedMatch.venue.name}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                    <span className="font-black text-white text-sm truncate">{getHomeName()}</span>
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-cyan-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                      {getHomeName()[0]}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-2xl sm:text-3xl font-black text-white w-7 text-center">{homeGoalCount}</span>
                    <span className="text-lg font-black text-gray-700">–</span>
                    <span className="text-2xl sm:text-3xl font-black text-white w-7 text-center">{awayGoalCount}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-600 to-amber-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                      {getAwayName()[0]}
                    </div>
                    <span className="font-black text-white text-sm truncate">{getAwayName()}</span>
                  </div>
                </div>

                {isEditable && (
                  <div className="mt-3 pt-3 border-t border-navy-light flex flex-wrap gap-2 justify-center">
                    <button onClick={handleReset} className="flex items-center gap-1 py-1.5 px-3 bg-navy-dark hover:bg-navy-light text-gray-500 hover:text-gray-300 border border-navy-light rounded-lg text-xs font-bold transition-colors">
                      <RotateCcw className="w-3 h-3" /> Đặt lại
                    </button>
                    <button onClick={() => setActiveModal('forfeit')} className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold border border-red-500/20 transition-colors">Xử Thua</button>
                    <button onClick={() => setActiveModal('abandon')} className="px-3 py-1.5 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 rounded-lg text-xs font-bold border border-orange-500/20 transition-colors">Hủy Trận</button>
                  </div>
                )}
                {(isFinished || isProtested) && (
                  <div className="mt-3 pt-3 border-t border-navy-light flex flex-wrap gap-2 justify-center">
                    <button onClick={() => setActiveModal('appeal')} className="px-3 py-1.5 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg text-xs font-bold border border-purple-500/20 transition-colors">Kháng cáo</button>
                    <button onClick={() => setActiveModal('protest')} className="px-3 py-1.5 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 rounded-lg text-xs font-bold border border-pink-500/20 transition-colors">Khiếu nại</button>
                    {isProtested && (
                      <button onClick={() => setActiveModal('resolve')} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-bold border border-emerald-500/20 transition-colors">Giải quyết Khiếu nại</button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Event Columns ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <EventColumn
                title={getHomeName()}
                teamColor="blue"
                events={homeEvents}
                players={homePlayers}
                lineup={lineups.home}
                loadingPlayers={loadingPlayers}
                onAdd={type => addEvent('home', type)}
                onUpdate={(id, f, v) => updateEvent('home', id, f, v)}
                onRemove={id => removeEvent('home', id)}
              />
              <EventColumn
                title={getAwayName()}
                teamColor="orange"
                events={awayEvents}
                players={awayPlayers}
                lineup={lineups.away}
                loadingPlayers={loadingPlayers}
                onAdd={type => addEvent('away', type)}
                onUpdate={(id, f, v) => updateEvent('away', id, f, v)}
                onRemove={id => removeEvent('away', id)}
              />
            </div>

          </div>
        )}

        {/* ── Empty state (đã có match được chọn xong, không có match nào chọn) ── */}
        {!selectedMatch && effectiveSeasonId && !isLoadingMatches && matches.length > 0 && (
          <div className="text-center py-16 border border-dashed border-navy-light rounded-3xl">
            <div className="text-5xl mb-4">👆</div>
            <p className="text-gray-500 font-medium">Chọn một trận đấu ở trên để bắt đầu quản lý</p>
          </div>
        )}

      </div>

      {/* ── Sticky Bottom Action Bar ──
          Compact: bỏ block score/goal/sub lặp lại (đã có ở scoreboard phía
          trên) — chỉ giữ 1 dòng mini-stat (ẩn mobile) + trạng thái dirty +
          action buttons. Padding/icon giảm để bar thấp hơn (~40px thay vì
          ~64px), tránh che nội dung bên dưới không cần thiết. */}
      {selectedMatch && !isFinished && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-navy-light bg-navy/90 backdrop-blur-xl px-3 py-2 sm:px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <span>⚽ {homeGoalCount + awayGoalCount}</span>
              <span className="text-gray-700">·</span>
              <span>🔄 {homeEvents.filter(e => e.type === 'substitution').length + awayEvents.filter(e => e.type === 'substitution').length}</span>
              {isDirty && <span className="ml-1 text-amber-400/80 font-semibold">• chưa lưu</span>}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {isDirty && isEditable && (
                <button
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-navy-dark hover:bg-navy-light border border-navy-light hover:border-gray-500 text-gray-300 hover:text-white font-bold rounded-lg transition-all disabled:opacity-40 text-xs"
                >
                  {isSavingDraft ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Lưu nháp
                </button>
              )}

              {isEditable && (
                <button
                  onClick={handleFinishMatch}
                  disabled={isFinishing}
                  className="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-black rounded-lg transition-all shadow-md shadow-blue-900/30 text-xs"
                >
                  {isFinishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Flag className="w-3.5 h-3.5" />}
                  Xác nhận
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <ForfeitMatchModal isOpen={activeModal === 'forfeit'} onClose={() => setActiveModal(null)} match={selectedMatch} onSuccess={handleModalSuccess} />
      <AbandonMatchModal isOpen={activeModal === 'abandon'} onClose={() => setActiveModal(null)} match={selectedMatch} onSuccess={handleModalSuccess} />
      <DisputeModal isOpen={activeModal === 'appeal' || activeModal === 'protest'} onClose={() => setActiveModal(null)} match={selectedMatch} type={activeModal} onSuccess={handleModalSuccess} />
      <ResolveAppealModal isOpen={activeModal === 'resolve'} onClose={() => setActiveModal(null)} match={selectedMatch} onSuccess={handleModalSuccess} />
    </>
  );
}

// ─── EventColumn ──────────────────────────────────────────────────────────────

function EventColumn({ title, teamColor, events, players, lineup, loadingPlayers, onAdd, onUpdate, onRemove }) {
  const c = countEvents(events);

  const headerGradient = teamColor === 'blue'
    ? 'from-blue-600/20 to-navy border-blue-500/20'
    : 'from-orange-600/20 to-navy border-orange-500/20';

  const avatarGradient = teamColor === 'blue'
    ? 'from-blue-600 to-cyan-700'
    : 'from-orange-600 to-amber-700';

  return (
    <div className="bg-navy border border-navy-light rounded-2xl overflow-hidden shadow-lg flex flex-col">
      <div className={`bg-linear-to-r ${headerGradient} border-b px-4 py-3`}>
        <div className="flex items-center gap-3 mb-2.5">
          <div className={`w-8 h-8 rounded-xl bg-linear-to-br ${avatarGradient} flex items-center justify-center text-white font-black text-sm shadow-md shrink-0`}>
            {title[0]}
          </div>
          <h3 className="font-black text-white text-sm uppercase tracking-wide line-clamp-1">
            {title}
          </h3>
        </div>

        {/* Bỏ ô đếm Vàng — chỉ giữ Bàn / Đỏ / Thay. Thẻ vàng vẫn track ngầm
            trong `events` cho logic thẻ-vàng-thứ-2 + validate, chỉ ẩn khỏi UI. */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { icon: '⚽', val: c.goals, label: 'Bàn', color: 'emerald' },
            { icon: '🟥', val: c.red, label: 'Đỏ', color: 'red' },
            { icon: '🔄', val: c.subs, label: 'Thay', color: 'blue' },
          ].map(({ icon, val, label, color }) => (
            <div key={label} className={`flex flex-col items-center py-1.5 rounded-lg bg-${color}-500/10 border border-${color}-500/20`}>
              <span className="text-sm">{icon}</span>
              <span className={`text-sm font-black text-${color}-400`}>{val}</span>
              <span className={`text-[10px] text-${color}-500/70`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-3 pt-3 pb-2.5 border-b border-navy-light">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {EVENT_TYPES.map(et => (
            <button
              key={et.key}
              onClick={() => onAdd(et.key)}
              className={`py-2 border rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${et.cls}`}
            >
              <span className="text-sm">{et.icon}</span>
              <span className="hidden sm:inline">{et.label}</span>
              <Plus className="w-3 h-3 sm:hidden" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[380px] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-navy-light [&::-webkit-scrollbar-thumb]:rounded-full">
        {loadingPlayers ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
            <p className="text-xs text-gray-600">Đang tải cầu thủ...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Shield className="w-8 h-8 text-gray-700" />
            <p className="text-xs text-gray-600 text-center">Chưa có sự kiện nào.<br />Nhấn nút bên trên để thêm.</p>
          </div>
        ) : (
          events.map(evt => (
            <EventCard
              key={evt.id}
              evt={evt}
              players={players}
              lineup={lineup}
              allEvents={events}
              onUpdate={(id, f, v) => onUpdate(id, f, v)}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </div>
  );
}