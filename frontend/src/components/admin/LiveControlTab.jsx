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

// FIX (trần phút cứng 130 cho mọi loại trận): trước đây MAX_MINUTE=130 áp
// dụng chung — sai cả 2 chiều. Round-robin không có hiệp phụ, trần thật chỉ
// 90+bù giờ; knockout có thể vào ET, trần thật 120+bù giờ. Đồng bộ với BE
// (types/match.type.ts#MINUTE_BOUNDS/MAX_ADDED_MINUTE) — FE không import
// trực tiếp từ BE nên hardcode ở đây, NOTE: nếu BE đổi MAX_ADDED_MINUTE,
// phải sửa tay STOPPAGE_TIME_CAP dưới đây theo, có rủi ro drift.
const STOPPAGE_TIME_CAP = 15;   // BE: MAX_ADDED_MINUTE
const REGULAR_TIME_END = 90;    // BE: MINUTE_BOUNDS.second_half[1]
const EXTRA_TIME_END = 120;     // BE: MINUTE_BOUNDS.extra_time_second[1]

function getMinuteBounds(match) {
  const isKnockout = match?.phase?.format === 'knockout';
  const normalMax = REGULAR_TIME_END + STOPPAGE_TIME_CAP; // 105 — trần round-robin
  const hardMax = isKnockout ? EXTRA_TIME_END + STOPPAGE_TIME_CAP : normalMax; // 135 (knockout) hoặc 105
  return { normalMax, hardMax, isKnockout };
}

// Message do BE ném ra khi knockout hoà, xuất phát từ
// MatchResultService._guardConfirm (matchresult.service.ts), được
// adminRecordResult gọi qua confirmResultInTx. Message gốc dạng:
//   "Match {id}: knockout draw ở {resultType} — cần extra_time hoặc penalty"
// resultType được nhúng thẳng vào message ('full_time' hoặc 'extra_time'),
// dùng chuỗi đó để phân biệt 2 bước (mở modal hiệp phụ hay mở thẳng modal pen).
//
// LƯU Ý QUAN TRỌNG: matchlifecycle.service.ts có export
// KNOCKOUT_DRAW_MARKER ('KNOCKOUT_DRAW_NEEDS_EXTRA_TIME_OR_PENALTY') và
// KNOCKOUT_ET_DRAW_MARKER ('KNOCKOUT_ET_DRAW_NEEDS_PENALTY'), nhưng 2 marker
// đó CHỈ được throw ở finalizeMatch()/submitManualScore() (luồng
// recordEvent trực tiếp) — KHÔNG áp dụng cho adminRecordResult(), vì hàm
// này đi qua _guardConfirm ở matchresult.service.ts, hàm không dùng 2
// marker trên (và KNOCKOUT_ET_DRAW_MARKER hiện không được throw ở bất kỳ
// đâu cả). Dùng nhầm 2 marker đó ở màn hình này sẽ khiến check luôn fail —
// modal hiệp phụ/pen sẽ không tự mở, chỉ hiện toast lỗi chung chung.
const KNOCKOUT_DRAW_MESSAGE_MARKER = 'knockout draw ở';

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

function ExtraTimeModal({ isOpen, onClose, homeName, awayName, homeGoalCount, awayGoalCount, draft, setDraft, onConfirm, onSkip, isSubmitting }) {
  if (!isOpen) return null;

  const setField = (side, value) => {
    const digits = String(value).replace(/\D/g, '');
    setDraft(prev => ({ ...prev, [side]: digits }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-navy border border-navy-light rounded-2xl shadow-2xl max-w-sm w-full p-5">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="font-black text-white text-sm uppercase tracking-wide">Hiệp phụ</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          {homeName} {homeGoalCount} – {awayGoalCount} {awayName} sau 90 phút. Nhập tổng tỉ số sau hiệp phụ,
          hoặc bỏ qua nếu giải không đá hiệp phụ.
        </p>

        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs font-bold text-gray-400 truncate max-w-[100px]">{homeName}</span>
            <input
              type="text"
              inputMode="numeric"
              value={draft.home}
              onChange={e => setField('home', e.target.value)}
              className="w-16 text-center text-xl font-black bg-navy-dark border border-navy-light rounded-lg py-1.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <span className="text-gray-600 font-black text-lg mt-4">–</span>
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs font-bold text-gray-400 truncate max-w-[100px]">{awayName}</span>
            <input
              type="text"
              inputMode="numeric"
              value={draft.away}
              onChange={e => setField('away', e.target.value)}
              className="w-16 text-center text-xl font-black bg-navy-dark border border-navy-light rounded-lg py-1.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-1.5 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white rounded-lg text-xs font-black transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            Xác nhận kết quả hiệp phụ
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2 bg-navy-dark hover:bg-navy-light border border-navy-light text-gray-400 hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-40"
            >
              Huỷ
            </button>
            <button
              onClick={onSkip}
              disabled={isSubmitting}
              className="flex-1 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 rounded-lg text-xs font-bold transition-colors disabled:opacity-40"
            >
              Không đá HP, vào Pen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ConfirmExtraTimeMinuteModal ──────────────────────────────────────────────
// NEW: xác nhận rõ ràng khi admin gõ phút vượt 90' cho trận knockout (có thể
// hợp lệ — hiệp phụ) — tránh im lặng clamp hoặc im lặng chấp nhận số gõ nhầm
// (VD gõ "100" thay vì "10"). Round-robin thì chặn hẳn, không cần modal này
// (xem updateEvent bên dưới) vì round-robin không có khái niệm hiệp phụ.
function ConfirmExtraTimeMinuteModal({ pending, onConfirm, onCancel }) {
  if (!pending) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-navy border border-navy-light rounded-2xl shadow-2xl max-w-xs w-full p-5">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="font-black text-white text-sm uppercase tracking-wide">Xác nhận phút hiệp phụ</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Phút <span className="text-white font-bold">{pending.value}</span> nằm ngoài 90 phút chính thức —
          xác nhận đây là sự kiện diễn ra trong hiệp phụ?
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-navy-dark hover:bg-navy-light border border-navy-light text-gray-400 hover:text-white rounded-lg text-xs font-bold transition-colors"
          >
            Huỷ, sửa lại
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-black transition-colors"
          >
            Đúng, xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

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

function unwrapListResponse(res, label) {
  const candidates = [
    res?.data?.data,
    res?.data,
    res,
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

        if (homeRes.status === 'fulfilled' && parsedHome.length === 0) {
          console.warn(`[LiveControlTab] home_team_id=${selectedMatch.home_team_id} trả về 0 cầu thủ. Kiểm tra DB/API trực tiếp cho team này.`);
        }
        if (awayRes.status === 'fulfilled' && parsedAway.length === 0) {
          console.warn(`[LiveControlTab] away_team_id=${selectedMatch.away_team_id} trả về 0 cầu thủ. Kiểm tra DB/API trực tiếp cho team này.`);
        }

        setHomePlayers(parsedHome);
        setAwayPlayers(parsedAway);

        const allLineups = lineupRes.status === 'fulfilled' ? unwrapListResponse(lineupRes.value, 'lineups') : [];

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
  const [homeEvents, setHomeEvents] = useState([]);
  const [awayEvents, setAwayEvents] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  // NEW: modal xác nhận khi gõ phút thuộc vùng hiệp phụ (chỉ dùng cho knockout —
  // round-robin bị chặn cứng ngay trong updateEvent, không cần confirm).
  const [pendingMinuteConfirm, setPendingMinuteConfirm] = useState(null); // { side, id, value }

  const homeGoalCount = useMemo(() => homeEvents.filter(e => e.type === 'goal').length, [homeEvents]);
  const awayGoalCount = useMemo(() => awayEvents.filter(e => e.type === 'goal').length, [awayEvents]);

  const [matchStatus, setMatchStatus] = useState('');

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const [activeModal, setActiveModal] = useState(null); // 'forfeit', 'abandon', 'appeal', 'protest', 'resolve'

  // ── Knockout draw → extra time → penalty flow ────────────────────────────
  // 3 bước: full_time draw -> mở ExtraTimeModal (nhập tổng bàn sau ET, hoặc
  // bỏ qua ET) -> nếu vẫn hoà -> PenaltyModal.
  // penaltyBaseScore = tỉ số nền hiển thị & gửi lên BE làm homeScore/
  // awayScore cho bước pen — là tỉ số 90' nếu bỏ qua ET, hoặc tổng sau ET
  // nếu đã qua bước hiệp phụ.
  const isKnockout = selectedMatch?.phase?.format === 'knockout';
  const isDrawNow = homeGoalCount === awayGoalCount;

  const [etModalOpen, setEtModalOpen] = useState(false);
  const [etDraft, setEtDraft] = useState({ home: '', away: '' });
  const [isSubmittingEt, setIsSubmittingEt] = useState(false);

  const [penaltyModalOpen, setPenaltyModalOpen] = useState(false);
  const [penaltyDraft, setPenaltyDraft] = useState({ home: '', away: '' });
  const [isSubmittingPenalty, setIsSubmittingPenalty] = useState(false);
  const [penaltyBaseScore, setPenaltyBaseScore] = useState({ home: 0, away: 0 });

  // FIX (ET score không được forward lên BE): trước đây handleConfirmExtraTime
  // /handleConfirmPenalty không gửi homeExtraTimeScore/awayExtraTimeScore lên
  // adminRecordResult -> MatchResult.home_extra_time_score/away_extra_time_score
  // luôn null dù trận có đá hiệp phụ thật (winner/final score vẫn đúng nhờ BE
  // fallback qua homeScore, nhưng report/UI hiệp phụ sẽ trống). etWasPlayed
  // phân biệt "đã đá ET thật" (gửi kèm ET score ở bước pen) vs "pen thẳng từ
  // 90', bỏ qua ET" (không gửi, giữ đúng ý nghĩa null = không có ET).
  const [etWasPlayed, setEtWasPlayed] = useState(false);

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

  useEffect(() => {
    if (etModalOpen) {
      setEtDraft({ home: String(homeGoalCount), away: String(awayGoalCount) });
    }
  }, [etModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setEtModalOpen(false); setEtDraft({ home: '', away: '' });
    setPenaltyModalOpen(false); setPenaltyDraft({ home: '', away: '' });
    setPenaltyBaseScore({ home: 0, away: 0 });
    setEtWasPlayed(false); // NEW — reset khi đổi trận
    setPendingMinuteConfirm(null); // NEW
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

  // FIX (trần phút cứng 130 cho mọi loại trận): tách riêng nhánh 'minute' —
  // round-robin chặn hẳn khi vượt 90'+bù giờ (không có khái niệm hiệp phụ, gõ
  // vượt gần như chắc chắn nhầm số); knockout cho phép nhưng bắt xác nhận rõ
  // ràng qua ConfirmExtraTimeMinuteModal (tránh tự động chấp nhận số gõ nhầm,
  // VD "100" thay vì "10"), thay vì âm thầm clamp như bản cũ.
  const updateEvent = (side, id, field, value) => {
    if (field === 'minute') {
      const digits = String(value).replace(/\D/g, '');
      if (digits === '') {
        const updater = evts => evts.map(e => e.id === id ? { ...e, minute: '' } : e);
        if (side === 'home') setHomeEvents(updater); else setAwayEvents(updater);
        setIsDirty(true);
        return;
      }
      const { normalMax, hardMax, isKnockout: knockoutBound } = getMinuteBounds(selectedMatch);
      const num = Math.min(hardMax, Math.max(0, Number(digits)));

      if (num > normalMax) {
        if (!knockoutBound) {
          toast.error(`Vòng bảng không có hiệp phụ — phút tối đa hợp lệ là ${normalMax} (90' + bù giờ).`);
          return;
        }
        setPendingMinuteConfirm({ side, id, value: String(num) });
        return;
      }

      const updater = evts => evts.map(e => e.id === id ? { ...e, minute: String(num) } : e);
      if (side === 'home') setHomeEvents(updater); else setAwayEvents(updater);
      setIsDirty(true);
      return;
    }

    const updater = evts => evts.map(e => e.id === id ? { ...e, [field]: value } : e);
    if (side === 'home') setHomeEvents(updater); else setAwayEvents(updater);
    setIsDirty(true);
  };

  // NEW: admin bấm "Đúng, xác nhận" trong ConfirmExtraTimeMinuteModal.
  const confirmPendingMinute = () => {
    if (!pendingMinuteConfirm) return;
    const { side, id, value } = pendingMinuteConfirm;
    const updater = evts => evts.map(e => e.id === id ? { ...e, minute: value } : e);
    if (side === 'home') setHomeEvents(updater); else setAwayEvents(updater);
    setIsDirty(true);
    setPendingMinuteConfirm(null);
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

  // FIX: thêm check trần phút theo dynamic bound (phòng data cũ/edge-case
  // không đi qua updateEvent, VD nếu sau này có import event hàng loạt).
  const validate = () => {
    if (homeEvents.some(e => !e.minute) || awayEvents.some(e => !e.minute))
      return 'Vui lòng điền phút cho tất cả sự kiện.';

    const { normalMax, hardMax, isKnockout: knockoutBound } = getMinuteBounds(selectedMatch);
    const allEventsFlat = [...homeEvents, ...awayEvents];

    const overHardLimit = allEventsFlat.some(e => Number(e.minute) > hardMax);
    if (overHardLimit)
      return `Có sự kiện vượt quá phút tối đa hợp lệ (${hardMax}').`;

    if (!knockoutBound) {
      const overNormal = allEventsFlat.some(e => Number(e.minute) > normalMax);
      if (overNormal)
        return `Vòng bảng không có hiệp phụ — phút tối đa hợp lệ là ${normalMax}'.`;
    }

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

  // Kiểm tra chuỗi lỗi trả về từ BE (message string) xem có phải case
  // "knockout hoà ở full_time, cần nhập ET/pen" hay không — xem giải thích
  // đầy đủ ở KNOCKOUT_DRAW_MESSAGE_MARKER phía trên file.
  const isKnockoutDrawError = (err) => {
    const msg = err?.response?.data?.message || err?.message || '';
    return typeof msg === 'string'
      && msg.includes(KNOCKOUT_DRAW_MESSAGE_MARKER)
      && msg.includes('full_time');
  };

  // Case "vẫn hoà sau khi đã nhập extra_time" — cùng message format với
  // trên nhưng resultType nhúng trong message là 'extra_time'.
  const isKnockoutEtDrawError = (err) => {
    const msg = err?.response?.data?.message || err?.message || '';
    return typeof msg === 'string'
      && msg.includes(KNOCKOUT_DRAW_MESSAGE_MARKER)
      && msg.includes('extra_time');
  };

  const submitAdminResult = async (extra = {}) => {
    return matchApi.adminRecordResult(selectedMatch.id, {
      homeScore: homeGoalCount, awayScore: awayGoalCount,
      resultType: 'full_time',
      ...extra,
    });
  };

  const handleFinishMatch = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setIsFinishing(true);
    try {
      if (matchStatus === 'scheduled' || matchStatus === 'postponed') {
        await matchApi.startMatch(selectedMatch.id);
      }

      await syncUnsavedEvents();

      // Knockout hoà ở 90' — không gọi API (chắc chắn fail), mở thẳng modal
      // hiệp phụ. Events đã sync ở trên, chỉ còn thiếu quyết định ET/pen.
      if (isKnockout && isDrawNow) {
        setEtModalOpen(true);
        return;
      }

      await submitAdminResult();

      setMatchStatus('finished');
      toast.success('Xác nhận kết quả thành công! Standings và bracket đã được cập nhật. 🎉', 5000);
      setIsDirty(false);
      handleRefresh();
    } catch (err) {
      if (isKnockoutDrawError(err)) {
        setEtModalOpen(true);
        return;
      }
      toast.error('Lỗi khi xác nhận kết quả: ' + (err?.response?.data?.message || err.message));
    } finally { setIsFinishing(false); }
  };

  // Bước ET: admin nhập TỔNG bàn thắng sau hiệp phụ (không phải riêng bàn
  // ghi trong ET) — khớp với semantics homeScore=tổng cuối cùng ở BE
  // (adminRecordResult forward thẳng homeScore làm homeFinal khi không có
  // homeExtraTimeScore riêng — xem _resolveWinner case extra_time).
  //
  // FIX: gửi kèm homeExtraTimeScore/awayExtraTimeScore = tổng sau ET (chính
  // là h/a) — trước đây thiếu 2 field này khiến MatchResult.home_extra_time_
  // score luôn null dù trận có đá hiệp phụ thật.
  const handleConfirmExtraTime = async () => {
    const h = Number(etDraft.home);
    const a = Number(etDraft.away);
    if (!Number.isInteger(h) || !Number.isInteger(a) || h < 0 || a < 0) {
      toast.error('Tỉ số sau hiệp phụ phải là số nguyên không âm.');
      return;
    }
    if (h < homeGoalCount || a < awayGoalCount) {
      toast.error('Tỉ số sau hiệp phụ không thể thấp hơn tỉ số 90 phút hiện tại.');
      return;
    }
    setIsSubmittingEt(true);
    try {
      await matchApi.adminRecordResult(selectedMatch.id, {
        homeScore: h, awayScore: a,
        resultType: 'extra_time',
        homeExtraTimeScore: h,   // FIX — forward đúng ET score
        awayExtraTimeScore: a,   // FIX
      });
      setMatchStatus('finished');
      setEtModalOpen(false);
      toast.success('Xác nhận kết quả (kèm hiệp phụ) thành công! 🎉', 5000);
      setIsDirty(false);
      handleRefresh();
    } catch (err) {
      if (isKnockoutEtDrawError(err)) {
        // Vẫn hoà sau ET — chuyển sang pen, giữ nguyên tổng sau ET làm nền.
        setPenaltyBaseScore({ home: h, away: a });
        setEtWasPlayed(true); // FIX — đánh dấu đã đá ET thật, forward tiếp ở bước pen
        setEtModalOpen(false);
        setPenaltyModalOpen(true);
        return;
      }
      toast.error('Lỗi khi xác nhận kết quả hiệp phụ: ' + (err?.response?.data?.message || err.message));
    } finally { setIsSubmittingEt(false); }
  };

  // Bỏ qua hiệp phụ — vào thẳng loạt sút luân lưu với tỉ số 90'.
  const handleSkipExtraTime = () => {
    setPenaltyBaseScore({ home: homeGoalCount, away: awayGoalCount });
    setEtWasPlayed(false); // FIX — không đá ET, không forward ET score ở bước pen
    setEtModalOpen(false);
    setPenaltyModalOpen(true);
  };

  const handleConfirmPenalty = async () => {
    const h = Number(penaltyDraft.home);
    const a = Number(penaltyDraft.away);
    if (!Number.isInteger(h) || !Number.isInteger(a) || h < 0 || a < 0) {
      toast.error('Điểm loạt sút luân lưu phải là số nguyên không âm.');
      return;
    }
    if (h === a) {
      toast.error('Loạt sút luân lưu không thể hoà.');
      return;
    }
    setIsSubmittingPenalty(true);
    try {
      await matchApi.adminRecordResult(selectedMatch.id, {
        homeScore: penaltyBaseScore.home, awayScore: penaltyBaseScore.away,
        resultType: 'penalty',
        // FIX: chỉ gửi ET score nếu ET thực sự được đá — phân biệt với case
        // pen thẳng từ 90' (giữ home_extra_time_score=null đúng ý nghĩa,
        // không giả vờ có hiệp phụ khi thực tế bỏ qua).
        ...(etWasPlayed && {
          homeExtraTimeScore: penaltyBaseScore.home,
          awayExtraTimeScore: penaltyBaseScore.away,
        }),
        homePenaltyScore: h,
        awayPenaltyScore: a,
      });
      setMatchStatus('finished');
      setPenaltyModalOpen(false);
      toast.success('Xác nhận kết quả (kèm loạt sút luân lưu) thành công! 🎉', 5000);
      setIsDirty(false);
      handleRefresh();
    } catch (err) {
      toast.error('Lỗi khi xác nhận kết quả pen: ' + (err?.response?.data?.message || err.message));
    } finally { setIsSubmittingPenalty(false); }
  };

  const handleReset = () => {
    setHomeEvents([]); setAwayEvents([]);
    setIsDirty(false);
    toast.info('Đã đặt lại form.');
  };

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

  // NEW: trần phút hiện tại cho trận đang chọn — dùng để hiển thị hint và
  // forward xuống EventCard (input's `max` attribute).
  const currentMinuteBounds = getMinuteBounds(selectedMatch);

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
                  {isKnockout && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="text-purple-400 font-semibold">Knockout</span>
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

                {/* NEW: hint trần phút — cho admin biết rõ giới hạn thay vì
                    chỉ phát hiện khi bị chặn/hỏi xác nhận. */}
                <p className="mt-1.5 text-center text-[10px] text-gray-500">
                  Phút hợp lệ: 0–{currentMinuteBounds.normalMax}'
                  {currentMinuteBounds.isKnockout && ` (có thể vào hiệp phụ tới ${currentMinuteBounds.hardMax}')`}
                </p>

                {isEditable && isKnockout && isDrawNow && (
                  <p className="mt-2 text-center text-xs text-amber-400/90 font-semibold">
                    Đang hoà ở knockout — bấm "Xác nhận" sẽ mở form nhập hiệp phụ / loạt sút luân lưu.
                  </p>
                )}

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
                maxMinute={currentMinuteBounds.hardMax}
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
                maxMinute={currentMinuteBounds.hardMax}
                onAdd={type => addEvent('away', type)}
                onUpdate={(id, f, v) => updateEvent('away', id, f, v)}
                onRemove={id => removeEvent('away', id)}
              />
            </div>

          </div>
        )}

        {/* ── Empty state ── */}
        {!selectedMatch && effectiveSeasonId && !isLoadingMatches && matches.length > 0 && (
          <div className="text-center py-16 border border-dashed border-navy-light rounded-3xl">
            <div className="text-5xl mb-4">👆</div>
            <p className="text-gray-500 font-medium">Chọn một trận đấu ở trên để bắt đầu quản lý</p>
          </div>
        )}

      </div>

      {/* ── Sticky Bottom Action Bar ── */}
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

      <ExtraTimeModal
        isOpen={etModalOpen}
        onClose={() => { if (!isSubmittingEt) setEtModalOpen(false); }}
        homeName={getHomeName()}
        awayName={getAwayName()}
        homeGoalCount={homeGoalCount}
        awayGoalCount={awayGoalCount}
        draft={etDraft}
        setDraft={setEtDraft}
        onConfirm={handleConfirmExtraTime}
        onSkip={handleSkipExtraTime}
        isSubmitting={isSubmittingEt}
      />
      <PenaltyShootoutModal
        isOpen={penaltyModalOpen}
        onClose={() => { if (!isSubmittingPenalty) setPenaltyModalOpen(false); }}
        homeName={getHomeName()}
        awayName={getAwayName()}
        homeGoalCount={penaltyBaseScore.home}
        awayGoalCount={penaltyBaseScore.away}
        draft={penaltyDraft}
        setDraft={setPenaltyDraft}
        onConfirm={handleConfirmPenalty}
        isSubmitting={isSubmittingPenalty}
      />

      {/* NEW */}
      <ConfirmExtraTimeMinuteModal
        pending={pendingMinuteConfirm}
        onConfirm={confirmPendingMinute}
        onCancel={() => setPendingMinuteConfirm(null)}
      />
    </>
  );
}

// ─── PenaltyShootoutModal ─────────────────────────────────────────────────────
// Modal riêng cho bước nhập loạt sút luân lưu khi knockout hoà ở full_time.
// Không dùng chung với AdvancedMatchControlModals vì use-case khác hẳn (chỉ
// 2 input số, không cần fetch dữ liệu ngoài).

function PenaltyShootoutModal({ isOpen, onClose, homeName, awayName, homeGoalCount, awayGoalCount, draft, setDraft, onConfirm, isSubmitting }) {
  if (!isOpen) return null;

  const setField = (side, value) => {
    const digits = String(value).replace(/\D/g, '');
    setDraft(prev => ({ ...prev, [side]: digits }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-navy border border-navy-light rounded-2xl shadow-2xl max-w-sm w-full p-5">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-5 h-5 text-purple-400" />
          <h3 className="font-black text-white text-sm uppercase tracking-wide">Loạt sút luân lưu</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          {homeName} {homeGoalCount} – {awayGoalCount} {awayName} sau 90 phút. Nhập kết quả pen để xác định đội thắng.
        </p>

        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs font-bold text-gray-400 truncate max-w-[100px]">{homeName}</span>
            <input
              type="text"
              inputMode="numeric"
              value={draft.home}
              onChange={e => setField('home', e.target.value)}
              className="w-16 text-center text-xl font-black bg-navy-dark border border-navy-light rounded-lg py-1.5 text-white focus:outline-none focus:border-purple-500"
              placeholder="0"
            />
          </div>
          <span className="text-gray-600 font-black text-lg mt-4">–</span>
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs font-bold text-gray-400 truncate max-w-[100px]">{awayName}</span>
            <input
              type="text"
              inputMode="numeric"
              value={draft.away}
              onChange={e => setField('away', e.target.value)}
              className="w-16 text-center text-xl font-black bg-navy-dark border border-navy-light rounded-lg py-1.5 text-white focus:outline-none focus:border-purple-500"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2 bg-navy-dark hover:bg-navy-light border border-navy-light text-gray-400 hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-40"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white rounded-lg text-xs font-black transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Flag className="w-3.5 h-3.5" />}
            Xác nhận kết quả
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EventColumn ──────────────────────────────────────────────────────────────

function EventColumn({ title, teamColor, events, players, lineup, loadingPlayers, maxMinute, onAdd, onUpdate, onRemove }) {
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
              maxMinute={maxMinute}
              onUpdate={(id, f, v) => onUpdate(id, f, v)}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </div>
  );
}