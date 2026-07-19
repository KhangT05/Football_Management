import { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Save, Plus, Loader2, RefreshCw, RotateCcw,
  Flag, Zap, Target, Shield, MousePointerClick, ArrowRightLeft,
} from 'lucide-react';
import { IoFootball } from 'react-icons/io5';

import useScheduleStore from '../../store/scheduleStore';
import useSeasonStore from '../../store/seasonStore';
import useTeamStore from '../../store/teamStore';
import useToastStore from '../../store/toastStore';
import { useLiveMatchUiStore } from '../../store/livematchuistore';

import {
  useTeamPlayers,
  useMatchLineups,
  useStartMatch,
  useTransitionPeriod,
  useRecordEvent,
  useAdminRecordResult,
  usePlayerSuspensionStats,
} from '../../queries/uselivematch.queries';

import {
  PERIOD_LABELS,
  PERIOD_ORDER,
  buildLiveMatchFormSchema,
  extraTimeScoreSchema,
  penaltyScoreSchema,
  computeSuspensionWarnings,
} from '../../schemas/livematch.schema';

import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import MatchSelectorPanel from '../../components/admin/MatchSelectorPanel';
import EventCard from '../../components/admin/EventCard';
import {
  ForfeitMatchModal,
  AbandonMatchModal,
  DisputeModal,
  ResolveAppealModal,
} from '../../components/admin/AdvancedMatchControlModals';

// ─── Constants ────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  { key: 'goal', label: 'Bàn thắng', icon: <IoFootball className="w-4 h-4" />, cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20 hover:border-emerald-500/40' },
  { key: 'yellow', label: 'Thẻ Vàng', icon: <div className="w-3 h-4 bg-yellow-400 rounded-sm shadow-[0_0_5px_rgba(250,204,21,0.5)]" />, cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/40 hover:bg-yellow-500/20 hover:border-yellow-400' },
  { key: 'red', label: 'Thẻ Đỏ', icon: <div className="w-3 h-4 bg-red-500 rounded-sm shadow-[0_0_5px_rgba(239,68,68,0.5)]" />, cls: 'bg-red-500/10 text-red-400 border-red-500/40 hover:bg-red-500/20 hover:border-red-400' },
  { key: 'substitution', label: 'Thay người', icon: <ArrowRightLeft className="w-4 h-4" />, cls: 'bg-blue-500/10 text-blue-400 border-blue-500/40 hover:bg-blue-500/20 hover:border-blue-400' },
];

function unwrapListResponse(res, label) {
  const candidates = [res?.data?.data, res?.data, res];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  console.warn(`[LiveControlTab] Không parse được response cho ${label}. Shape thực tế:`, res);
  return [];
}

function extractWarnings(res) {
  return res?.data?.postCommitWarnings ?? res?.postCommitWarnings ?? null;
}

function showResultToast(toast, warnings, successMsg) {
  if (warnings?.length) {
    toast.error(
      `Kết quả đã lưu nhưng standings/thống kê CHƯA cập nhật: ${warnings.join('; ')} — vào lại trận này và bấm "Tính lại BXH" để thử lại.`,
      8000,
    );
  } else {
    toast.success(successMsg, 5000);
  }
}

const KNOCKOUT_DRAW_MESSAGE_MARKER = 'knockout draw ở';

function isKnockoutDrawError(err) {
  const msg = err?.response?.data?.message || err?.message || '';
  return typeof msg === 'string' && msg.includes(KNOCKOUT_DRAW_MESSAGE_MARKER) && msg.includes('full_time');
}
function isKnockoutEtDrawError(err) {
  const msg = err?.response?.data?.message || err?.message || '';
  return typeof msg === 'string' && msg.includes(KNOCKOUT_DRAW_MESSAGE_MARKER) && msg.includes('extra_time');
}

function buildEventPayload(evt, teamId, effectiveType) {
  // Giây (evt.second) là UI-only, BE không có cột lưu — không forward.
  const base = { teamId, minute: Number(evt.minute) || 1, period: evt.period };
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

// effective type cho thẻ vàng (2 vàng cùng trận -> second_yellow) — thứ tự
// theo id (Date.now() lúc tạo dòng), KHÔNG theo minute (admin gõ tay).
function getEffectiveYellowType(evt, sideEvents) {
  if (evt.type !== 'yellow' || !evt.player) return 'yellow';
  const earlierSamePlayer = sideEvents.some(
    e => e.type === 'yellow' && e.player === evt.player && String(e.id).localeCompare(String(evt.id)) < 0,
  );
  return earlierSamePlayer ? 'second_yellow' : 'yellow';
}

function countEvents(events) {
  return {
    goals: events.filter(e => e.type === 'goal').length,
    yellow: events.filter(e => e.type === 'yellow').length,
    red: events.filter(e => e.type === 'red').length,
    subs: events.filter(e => e.type === 'substitution').length,
  };
}

function makeEmptyEvent(type, period) {
  const base = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, period, minute: '', second: 0 };
  if (type === 'substitution') return { ...base, playerIn: '', playerOut: '' };
  return { ...base, player: '' };
}

// ─── ExtraTimeModal / PenaltyShootoutModal ────────────────────────────────

function ExtraTimeModal({ isOpen, onClose, homeName, awayName, homeGoalCount, awayGoalCount, onConfirm, onSkip, isSubmitting }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(extraTimeScoreSchema),
    values: { home: homeGoalCount, away: awayGoalCount, baseHome: homeGoalCount, baseAway: awayGoalCount },
  });

  if (!isOpen) return null;

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

        <div className="flex items-center justify-center gap-4 mb-1">
          <ScoreField control={control} name="home" label={homeName} errors={errors} />
          <span className="text-gray-600 font-black text-lg mt-4">–</span>
          <ScoreField control={control} name="away" label={awayName} errors={errors} />
        </div>

        <div className="flex flex-col gap-2 mt-3">
          <button
            onClick={handleSubmit(onConfirm)}
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

function PenaltyShootoutModal({ isOpen, onClose, homeName, awayName, homeGoalCount, awayGoalCount, onConfirm, isSubmitting }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(penaltyScoreSchema),
    values: { home: '', away: '' },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-navy border border-navy-light rounded-2xl shadow-2xl max-w-sm w-full p-5">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-5 h-5 text-purple-400" />
          <h3 className="font-black text-white text-sm uppercase tracking-wide">Loạt sút luân lưu</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          {homeName} {homeGoalCount} – {awayGoalCount} {awayName}. Nhập kết quả pen để xác định đội thắng.
        </p>

        <div className="flex items-center justify-center gap-4 mb-1">
          <ScoreField control={control} name="home" label={homeName} errors={errors} placeholder="0" />
          <span className="text-gray-600 font-black text-lg mt-4">–</span>
          <ScoreField control={control} name="away" label={awayName} errors={errors} placeholder="0" />
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2 bg-navy-dark hover:bg-navy-light border border-navy-light text-gray-400 hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-40"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit(onConfirm)}
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

function ScoreField({ control, name, label, errors, placeholder }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xs font-bold text-gray-400 truncate max-w-[100px]">{label}</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder={placeholder}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-16 text-center text-xl font-black bg-navy-dark border border-navy-light rounded-lg py-1.5 text-white focus:outline-none focus:border-amber-500"
          />
          {errors?.[name] && <span className="text-[10px] text-red-400">{errors[name].message}</span>}
        </div>
      )}
    />
  );
}

// ─── Main Component ─────────────────────────────────────────────────────

export default function LiveControlTab({ selectedSeasonId, selectedMatchId, setSelectedMatchId, onGoToSchedule }) {
  const toast = useToastStore();
  const { seasons } = useSeasonStore();
  const { getMatchesFromCache, isSeasonLoading, fetchBySeason, scheduleCache } = useScheduleStore();
  const { teams, fetchAll: fetchTeams } = useTeamStore();

  useEffect(() => { fetchTeams({ per_page: 500, force: true }); }, [fetchTeams]);

  const effectiveSeasonId = selectedSeasonId;

  const allSeasonMatches = useMemo(
    () => (effectiveSeasonId ? getMatchesFromCache(Number(effectiveSeasonId)) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effectiveSeasonId, scheduleCache, getMatchesFromCache],
  );
  const isLoadingMatches = effectiveSeasonId ? isSeasonLoading(Number(effectiveSeasonId)) : false;

  const [searchTerm, setSearchTerm] = useState('');
  const statusFilteredMatches = useMemo(
    () => allSeasonMatches.filter(m => m.status === 'scheduled' || m.status === 'ongoing'),
    [allSeasonMatches],
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

  useEffect(() => {
    if (!effectiveSeasonId) return;
    fetchBySeason(Number(effectiveSeasonId), { force: true });
  }, [effectiveSeasonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fmtMatchDate = (m) => (m?.scheduled_at
    ? new Date(m.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
    : 'TBD');

  const handleMatchSelect = (matchId) => setSelectedMatchId(matchId);

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

        {selectedMatch ? (
          // key={selectedMatch.id} -> remount hoàn toàn khi đổi trận, đảm bảo
          // useForm/zustand knockout-flow không leak state giữa các trận.
          <MatchWorkspace key={selectedMatch.id} match={selectedMatch} teams={teams} onRefresh={() => fetchBySeason(Number(effectiveSeasonId), { force: true })} />
        ) : (
          effectiveSeasonId && !isLoadingMatches && matches.length > 0 && (
            <div className="text-center py-16 border border-dashed border-navy-light rounded-3xl">
              <MousePointerClick className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-500 font-medium">Chọn một trận đấu ở trên để bắt đầu quản lý</p>
            </div>
          )
        )}
      </div>
    </>
  );
}

// ─── MatchWorkspace: toàn bộ logic form của 1 trận, remount mỗi khi đổi trận ──

function MatchWorkspace({ match, teams, onRefresh }) {
  const toast = useToastStore();
  const ui = useLiveMatchUiStore();

  const isKnockout = match?.phase?.format === 'knockout';
  const schema = useMemo(() => buildLiveMatchFormSchema(isKnockout), [isKnockout]);

  const { control, handleSubmit, getValues, reset, formState: { isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { homeEvents: [], awayEvents: [] },
  });

  const homeFieldArray = useFieldArray({ control, name: 'homeEvents', keyName: '_rhfKey' });
  const awayFieldArray = useFieldArray({ control, name: 'awayEvents', keyName: '_rhfKey' });

  useEffect(() => {
    ui.setMatchStatus(match.status);
    ui.setCurrentPeriod(match.current_period ?? 'first_half');
    ui.resetKnockoutFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.id]);

  const homePlayersQuery = useTeamPlayers(match.home_team_id);
  const awayPlayersQuery = useTeamPlayers(match.away_team_id);
  const lineupsQuery = useMatchLineups(match.id, match.home_team_id, match.away_team_id);

  const homePlayers = homePlayersQuery.data ?? [];
  const awayPlayers = awayPlayersQuery.data ?? [];
  const loadingPlayers = homePlayersQuery.isLoading || awayPlayersQuery.isLoading || lineupsQuery.isLoading;

  useEffect(() => {
    if (homePlayersQuery.isError) {
      toast.error(`Không tải được danh sách cầu thủ đội nhà (team_id=${match.home_team_id}).`);
    }
    if (awayPlayersQuery.isError) {
      toast.error(`Không tải được danh sách cầu thủ đội khách (team_id=${match.away_team_id}).`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homePlayersQuery.isError, awayPlayersQuery.isError]);

  const startMatchMutation = useStartMatch(match.id);
  const transitionPeriodMutation = useTransitionPeriod(match.id);
  const recordEventMutation = useRecordEvent(match.id);
  const adminRecordResultMutation = useAdminRecordResult(match.id);

  const allPlayerIds = useMemo(
    () => [...homePlayers, ...awayPlayers].map(p => String(p.id ?? p.player_id)),
    [homePlayers, awayPlayers],
  );
  const suspensionStatsQuery = usePlayerSuspensionStats(match.season_id ?? match.phase?.season_id, allPlayerIds);
  const yellowCardsSuspension = match?.phase?.season?.tournamentRule?.yellow_cards_suspension ?? 3;

  // useFieldArray().fields chỉ re-render khi CẤU TRÚC mảng đổi (append/remove),
  // KHÔNG khi 1 field con đổi giá trị (vd admin chọn player ở dòng đã có sẵn)
  // — đây là gotcha đã biết của RHF. Mọi tính toán phụ thuộc giá trị hiện tại
  // (goal count, ai bị đuổi, cảnh báo treo thẻ) PHẢI đọc qua useWatch, không
  // được đọc qua `fields` — nếu không, scoreboard/cảnh báo sẽ đứng yên sau khi
  // admin gõ dữ liệu vào dòng event có sẵn.
  const homeEventsWatch = useWatch({ control, name: 'homeEvents' }) ?? [];
  const awayEventsWatch = useWatch({ control, name: 'awayEvents' }) ?? [];

  const homeGoalCount = homeEventsWatch.filter(e => e.type === 'goal').length;
  const awayGoalCount = awayEventsWatch.filter(e => e.type === 'goal').length;

  // Cảnh báo treo trận sau (non-blocking) — theo TournamentRule, KHÔNG phải
  // rule "2 vàng = đuổi trận này" (rule đó đã enforce cứng trong zod schema).
  const suspensionWarnings = useMemo(() => {
    if (!suspensionStatsQuery.data) return [];
    return [
      ...computeSuspensionWarnings(homeEventsWatch, suspensionStatsQuery.data, yellowCardsSuspension),
      ...computeSuspensionWarnings(awayEventsWatch, suspensionStatsQuery.data, yellowCardsSuspension),
    ];
  }, [homeEventsWatch, awayEventsWatch, suspensionStatsQuery.data, yellowCardsSuspension]);

  const matchStatus = ui.matchStatus;
  const isFinished = matchStatus === 'finished';
  const isProtested = matchStatus === 'protested';
  const isEditable = !isFinished && !isProtested;
  const isDrawNow = homeGoalCount === awayGoalCount;

  const getHomeName = () => match?.home_team?.name ?? teams.find(t => Number(t.id) === Number(match?.home_team_id))?.name ?? `Đội ${match?.home_team_id ?? ''}`;
  const getAwayName = () => match?.away_team?.name ?? teams.find(t => Number(t.id) === Number(match?.away_team_id))?.name ?? `Đội ${match?.away_team_id ?? ''}`;

  // ── Add / remove event ──
  const addEvent = (side, type) => {
    const fieldArray = side === 'home' ? homeFieldArray : awayFieldArray;
    fieldArray.append(makeEmptyEvent(type, ui.currentPeriod));
  };

  // ── Chuyển hiệp ──
  const handleTransitionPeriod = async (nextPeriod) => {
    try {
      await transitionPeriodMutation.mutateAsync(nextPeriod);
      ui.setCurrentPeriod(nextPeriod);
      toast.info(`Đã chuyển sang ${PERIOD_LABELS[nextPeriod]}.`);
    } catch (err) {
      toast.error('Lỗi chuyển hiệp: ' + (err?.response?.data?.message || err.message));
    }
  };

  const allowedPeriods = isKnockout ? PERIOD_ORDER : PERIOD_ORDER.slice(0, 2);
  const currentPeriodIdx = allowedPeriods.indexOf(ui.currentPeriod);
  const nextPeriod = allowedPeriods[currentPeriodIdx + 1];

  // ── Sync events chưa lưu lên BE (live recordEvent) ──
  const syncUnsavedEvents = async (values) => {
    const pushSide = async (events, teamId) => {
      for (const evt of events) {
        if (evt.isSaved) continue;
        const effectiveType = evt.type === 'yellow' ? getEffectiveYellowType(evt, events) : evt.type;
        const payloads = buildEventPayload(evt, teamId, effectiveType);
        for (const payload of payloads) {
          try {
            await recordEventMutation.mutateAsync(payload);
          } catch (err) {
            console.warn('[syncEvents] recordEvent failed:', payload, err);
            throw err;
          }
        }
      }
    };
    await pushSide(values.homeEvents, match.home_team_id);
    await pushSide(values.awayEvents, match.away_team_id);
  };

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const handleSaveDraft = handleSubmit(async (values) => {
    setIsSavingDraft(true);
    try {
      if (matchStatus === 'scheduled' || matchStatus === 'postponed') {
        await startMatchMutation.mutateAsync();
        ui.setMatchStatus('ongoing');
      }
      await syncUnsavedEvents(values);
      toast.info('Đã đồng bộ sự kiện (chưa xác nhận kết quả).');
      reset(values, { keepValues: true, keepDirty: false });
    } catch (err) {
      toast.error('Lỗi khi đồng bộ sự kiện: ' + (err?.response?.data?.message || err.message));
    } finally {
      setIsSavingDraft(false);
    }
  });

  const submitAdminResult = async (extra = {}) => {
    return adminRecordResultMutation.mutateAsync({
      homeScore: homeGoalCount,
      awayScore: awayGoalCount,
      resultType: 'full_time',
      ...extra,
    });
  };

  const handleFinishMatch = handleSubmit(async (values) => {
    setIsFinishing(true);
    try {
      if (matchStatus === 'scheduled' || matchStatus === 'postponed') {
        await startMatchMutation.mutateAsync();
        ui.setMatchStatus('ongoing');
      }
      await syncUnsavedEvents(values);

      if (isKnockout && isDrawNow) {
        ui.openExtraTimeModal();
        return;
      }

      const res = await submitAdminResult();
      ui.setMatchStatus('finished');
      showResultToast(toast, extractWarnings(res), 'Xác nhận kết quả thành công! Standings và bracket đã được cập nhật.');
      onRefresh();
    } catch (err) {
      if (isKnockoutDrawError(err)) {
        ui.openExtraTimeModal();
        return;
      }
      toast.error('Lỗi khi xác nhận kết quả: ' + (err?.response?.data?.message || err.message));
    } finally {
      setIsFinishing(false);
    }
  });

  const [isSubmittingEt, setIsSubmittingEt] = useState(false);
  const [isSubmittingPenalty, setIsSubmittingPenalty] = useState(false);

  const handleConfirmExtraTime = async ({ home: h, away: a }) => {
    setIsSubmittingEt(true);
    try {
      const res = await adminRecordResultMutation.mutateAsync({
        homeScore: h, awayScore: a,
        resultType: 'extra_time',
        homeExtraTimeScore: h,
        awayExtraTimeScore: a,
      });
      ui.setMatchStatus('finished');
      ui.closeExtraTimeModal();
      showResultToast(toast, extractWarnings(res), 'Xác nhận kết quả (kèm hiệp phụ) thành công!');
      onRefresh();
    } catch (err) {
      if (isKnockoutEtDrawError(err)) {
        ui.goToPenaltyAfterExtraTime(h, a);
        return;
      }
      toast.error('Lỗi khi xác nhận kết quả hiệp phụ: ' + (err?.response?.data?.message || err.message));
    } finally {
      setIsSubmittingEt(false);
    }
  };

  const handleSkipExtraTime = () => ui.skipExtraTimeToPenalty(homeGoalCount, awayGoalCount);

  const handleConfirmPenalty = async ({ home: h, away: a }) => {
    setIsSubmittingPenalty(true);
    try {
      const res = await adminRecordResultMutation.mutateAsync({
        homeScore: ui.penaltyBaseScore.home,
        awayScore: ui.penaltyBaseScore.away,
        resultType: 'penalty',
        ...(ui.etWasPlayed && {
          homeExtraTimeScore: ui.penaltyBaseScore.home,
          awayExtraTimeScore: ui.penaltyBaseScore.away,
        }),
        homePenaltyScore: h,
        awayPenaltyScore: a,
      });
      ui.setMatchStatus('finished');
      ui.closePenaltyModal();
      showResultToast(toast, extractWarnings(res), 'Xác nhận kết quả (kèm loạt sút luân lưu) thành công!');
      onRefresh();
    } catch (err) {
      toast.error('Lỗi khi xác nhận kết quả pen: ' + (err?.response?.data?.message || err.message));
    } finally {
      setIsSubmittingPenalty(false);
    }
  };

  const handleReset = () => {
    reset({ homeEvents: [], awayEvents: [] });
    toast.info('Đã đặt lại form.');
  };

  const handleModalSuccess = (msg) => {
    toast.success(msg);
    ui.setActiveModal(null);
    onRefresh();
  };

  return (
    <>
      <div className="space-y-4">
        {/* ── Scoreboard ── */}
        <div className="relative bg-navy border border-navy-light rounded-2xl overflow-hidden shadow-lg shadow-black/30">
          <div className={`h-1 w-full ${matchStatus === 'ongoing' ? 'bg-linear-to-r from-red-600 via-orange-500 to-red-600 animate-gradient' : 'bg-linear-to-r from-blue-600 via-indigo-500 to-blue-600'}`} />

          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-center gap-2 mb-2.5 text-xs flex-wrap">
              <StatusBadge status={matchStatus || match.status} />
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">{new Date(match.scheduled_at ?? Date.now()).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</span>
              {match.venue?.name && (<><span className="text-gray-600">•</span><span className="text-gray-500 hidden sm:inline">{match.venue.name}</span></>)}
              {isKnockout && (<><span className="text-gray-600">•</span><span className="text-purple-400 font-semibold">Knockout</span></>)}
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                <span className="font-black text-white text-sm truncate">{getHomeName()}</span>
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-cyan-700 flex items-center justify-center text-white font-black text-sm shrink-0">{getHomeName()[0]}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-2xl sm:text-3xl font-black text-white w-7 text-center">{homeGoalCount}</span>
                <span className="text-lg font-black text-gray-700">–</span>
                <span className="text-2xl sm:text-3xl font-black text-white w-7 text-center">{awayGoalCount}</span>
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-600 to-amber-700 flex items-center justify-center text-white font-black text-sm shrink-0">{getAwayName()[0]}</div>
                <span className="font-black text-white text-sm truncate">{getAwayName()}</span>
              </div>
            </div>

            {/* Period control */}
            {isEditable && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-xs text-gray-500">Đang ở: <span className="text-white font-bold">{PERIOD_LABELS[ui.currentPeriod]}</span></span>
                {nextPeriod && (
                  <button
                    onClick={() => handleTransitionPeriod(nextPeriod)}
                    disabled={transitionPeriodMutation.isPending}
                    className="flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-[11px] font-bold transition-colors disabled:opacity-40"
                  >
                    {transitionPeriodMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    Chuyển sang {PERIOD_LABELS[nextPeriod]}
                  </button>
                )}
              </div>
            )}

            {isEditable && isKnockout && isDrawNow && (
              <p className="mt-2 text-center text-xs text-amber-400/90 font-semibold">
                Đang hoà ở knockout — bấm "Xác nhận" sẽ mở form nhập hiệp phụ / loạt sút luân lưu.
              </p>
            )}

            {suspensionWarnings.length > 0 && (
              <p className="mt-2 text-center text-[11px] text-orange-400/90">
                {suspensionWarnings.length} cầu thủ sẽ chạm ngưỡng treo thi đấu trận sau (≥{yellowCardsSuspension} thẻ vàng tích luỹ, theo quy định giải).
              </p>
            )}

            {isEditable && (
              <div className="mt-3 pt-3 border-t border-navy-light flex flex-wrap gap-2 justify-center">
                <button onClick={handleReset} className="flex items-center gap-1 py-1.5 px-3 bg-navy-dark hover:bg-navy-light text-gray-500 hover:text-gray-300 border border-navy-light rounded-lg text-xs font-bold transition-colors">
                  <RotateCcw className="w-3 h-3" /> Đặt lại
                </button>
                <button onClick={() => ui.setActiveModal('forfeit')} className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold border border-red-500/20 transition-colors">Xử Thua</button>
                <button onClick={() => ui.setActiveModal('abandon')} className="px-3 py-1.5 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 rounded-lg text-xs font-bold border border-orange-500/20 transition-colors">Hủy Trận</button>
              </div>
            )}
            {(isFinished || isProtested) && (
              <div className="mt-3 pt-3 border-t border-navy-light flex flex-wrap gap-2 justify-center">
                <button onClick={() => ui.setActiveModal('appeal')} className="px-3 py-1.5 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg text-xs font-bold border border-purple-500/20 transition-colors">Kháng cáo</button>
                <button onClick={() => ui.setActiveModal('protest')} className="px-3 py-1.5 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 rounded-lg text-xs font-bold border border-pink-500/20 transition-colors">Khiếu nại</button>
                {isProtested && (
                  <button onClick={() => ui.setActiveModal('resolve')} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-bold border border-emerald-500/20 transition-colors">Giải quyết Khiếu nại</button>
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
            control={control}
            side="home"
            fields={homeFieldArray.fields}
            remove={homeFieldArray.remove}
            players={homePlayers}
            lineup={lineupsQuery.data?.home ?? []}
            watchedEvents={homeEventsWatch}
            scheduledAt={match.scheduled_at}
            loadingPlayers={loadingPlayers}
            disabled={!isEditable}
            onAdd={type => addEvent('home', type)}
          />
          <EventColumn
            title={getAwayName()}
            teamColor="orange"
            control={control}
            side="away"
            fields={awayFieldArray.fields}
            remove={awayFieldArray.remove}
            players={awayPlayers}
            lineup={lineupsQuery.data?.away ?? []}
            watchedEvents={awayEventsWatch}
            scheduledAt={match.scheduled_at}
            loadingPlayers={loadingPlayers}
            disabled={!isEditable}
            onAdd={type => addEvent('away', type)}
          />
        </div>
      </div>

      {/* ── Sticky action bar ── */}
      {!isFinished && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-navy-light bg-navy/90 backdrop-blur-xl px-3 py-2 sm:px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><IoFootball className="w-3.5 h-3.5" /> {homeGoalCount + awayGoalCount}</span>
              <span className="text-gray-700">·</span>
              <span className="flex items-center gap-1"><ArrowRightLeft className="w-3.5 h-3.5" /> {homeEventsWatch.filter(e => e.type === 'substitution').length + awayEventsWatch.filter(e => e.type === 'substitution').length}</span>
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

      <ForfeitMatchModal isOpen={ui.activeModal === 'forfeit'} onClose={() => ui.setActiveModal(null)} match={match} onSuccess={handleModalSuccess} />
      <AbandonMatchModal isOpen={ui.activeModal === 'abandon'} onClose={() => ui.setActiveModal(null)} match={match} onSuccess={handleModalSuccess} />
      <DisputeModal isOpen={ui.activeModal === 'appeal' || ui.activeModal === 'protest'} onClose={() => ui.setActiveModal(null)} match={match} type={ui.activeModal} onSuccess={handleModalSuccess} />
      <ResolveAppealModal isOpen={ui.activeModal === 'resolve'} onClose={() => ui.setActiveModal(null)} match={match} onSuccess={handleModalSuccess} />

      <ExtraTimeModal
        isOpen={ui.etModalOpen}
        onClose={() => { if (!isSubmittingEt) ui.closeExtraTimeModal(); }}
        homeName={getHomeName()}
        awayName={getAwayName()}
        homeGoalCount={homeGoalCount}
        awayGoalCount={awayGoalCount}
        onConfirm={handleConfirmExtraTime}
        onSkip={handleSkipExtraTime}
        isSubmitting={isSubmittingEt}
      />
      <PenaltyShootoutModal
        isOpen={ui.penaltyModalOpen}
        onClose={() => { if (!isSubmittingPenalty) ui.closePenaltyModal(); }}
        homeName={getHomeName()}
        awayName={getAwayName()}
        homeGoalCount={ui.penaltyBaseScore.home}
        awayGoalCount={ui.penaltyBaseScore.away}
        onConfirm={handleConfirmPenalty}
        isSubmitting={isSubmittingPenalty}
      />
    </>
  );
}

// ─── EventColumn ──────────────────────────────────────────────────────────

function EventColumn({ title, teamColor, control, side, fields, remove, players, lineup, watchedEvents, scheduledAt, loadingPlayers, disabled, onAdd }) {
  const c = countEvents(fields);
  const headerGradient = teamColor === 'blue' ? 'from-blue-600/20 to-navy border-blue-500/20' : 'from-orange-600/20 to-navy border-orange-500/20';
  const avatarGradient = teamColor === 'blue' ? 'from-blue-600 to-cyan-700' : 'from-orange-600 to-amber-700';

  return (
    <div className="bg-navy border border-navy-light rounded-2xl overflow-hidden shadow-lg flex flex-col">
      <div className={`bg-linear-to-r ${headerGradient} border-b px-4 py-3`}>
        <div className="flex items-center gap-3 mb-2.5">
          <div className={`w-8 h-8 rounded-xl bg-linear-to-br ${avatarGradient} flex items-center justify-center text-white font-black text-sm shadow-md shrink-0`}>{title[0]}</div>
          <h3 className="font-black text-white text-sm uppercase tracking-wide line-clamp-1">{title}</h3>
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

      {!disabled && (
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
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[380px] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-navy-light [&::-webkit-scrollbar-thumb]:rounded-full">
        {loadingPlayers ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
            <p className="text-xs text-gray-600">Đang tải cầu thủ...</p>
          </div>
        ) : fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Shield className="w-8 h-8 text-gray-700" />
            <p className="text-xs text-gray-600 text-center">Chưa có sự kiện nào.<br />Nhấn nút bên trên để thêm.</p>
          </div>
        ) : (
          fields.map((item, index) => (
            <EventCard
              key={item._rhfKey}
              control={control}
              basePath={`${side}Events.${index}`}
              evt={watchedEvents[index] ?? item}
              allEvents={watchedEvents}
              players={players}
              lineup={lineup}
              scheduledAt={scheduledAt}
              disabled={disabled}
              onRemove={() => remove(index)}
            />
          ))
        )}
      </div>
    </div>
  );
}