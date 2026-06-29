import { useState, useEffect } from 'react';
import { X, FileText, Edit, Save, Plus, Minus, Loader2 } from 'lucide-react';
import { matchApi } from '../../api';
import useToastStore from '../../store/toastStore';

// ─── Enums: mirror từ Prisma schema (generated/prisma/client) ────────────────
// Không import trực tiếp từ Prisma client (server-only).
// Khi backend thêm/đổi enum value → cập nhật cả hai chỗ.

export const MatchStatus = /** @type {const} */ ({
  scheduled: 'scheduled',
  ongoing: 'ongoing',
  finished: 'finished',
  cancelled: 'cancelled',
  forfeited: 'forfeited',
  postponed: 'postponed',
  bye: 'bye',
  abandoned: 'abandoned',
  pending_official: 'pending_official',
  needs_review: 'needs_review',
});

export const MatchEventType = /** @type {const} */ ({
  goal: 'goal',
  own_goal: 'own_goal',
  yellow_card: 'yellow_card',
  red_card: 'red_card',
  second_yellow: 'second_yellow',
  substitution_in: 'substitution_in',
  substitution_out: 'substitution_out',
  penalty_scored: 'penalty_scored',
  penalty_missed: 'penalty_missed',
  card_rescinded: 'card_rescinded',
  goal_disallowed: 'goal_disallowed',
});

export const MatchResultType = /** @type {const} */ ({
  full_time: 'full_time',
  extra_time: 'extra_time',
  penalty: 'penalty',
  forfeit: 'forfeit',
  walkover: 'walkover',
});

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = ['Tỷ số', 'Thẻ vàng', 'Thẻ đỏ', 'Thay người'];

const STATUS_META = {
  [MatchStatus.scheduled]: { label: 'Sắp diễn ra', cls: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  [MatchStatus.ongoing]: { label: 'Đang diễn ra', cls: 'text-red-400 bg-red-400/10 border-red-400/20' },
  [MatchStatus.finished]: { label: 'Đã kết thúc', cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  [MatchStatus.pending_official]: { label: 'Chờ xác nhận', cls: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  [MatchStatus.needs_review]: { label: 'Cần xem lại', cls: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  [MatchStatus.cancelled]: { label: 'Đã hủy', cls: 'text-gray-400 bg-gray-400/10 border-gray-400/20' },
  [MatchStatus.forfeited]: { label: 'Xử thua', cls: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  [MatchStatus.abandoned]: { label: 'Bỏ dở', cls: 'text-gray-400 bg-gray-400/10 border-gray-400/20' },
  [MatchStatus.postponed]: { label: 'Hoãn', cls: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  [MatchStatus.bye]: { label: 'Bye', cls: 'text-gray-400 bg-gray-400/10 border-gray-400/20' },
};

const EDITABLE = new Set([
  MatchStatus.scheduled,
  MatchStatus.postponed,
  MatchStatus.bye,
  MatchStatus.ongoing,
  MatchStatus.finished,
  MatchStatus.pending_official,
  MatchStatus.needs_review,
]);

// Statuses đi qua adminRecordResult (tạo MatchResult mới)
const ADMIN_RECORD_STATUSES = new Set([
  MatchStatus.scheduled,
  MatchStatus.postponed,
  MatchStatus.bye,
  MatchStatus.ongoing,
  MatchStatus.pending_official,
  MatchStatus.needs_review,
]);

// ─── Payload builders ─────────────────────────────────────────────────────────

function buildScorerPayload(scorers, match) {
  return scorers.map(s => ({
    teamId: s.teamSide === 'home' ? match.home_team_id : match.away_team_id,
    type: s.isOwnGoal ? MatchEventType.own_goal : MatchEventType.goal,
    minute: Number(s.minute) || 1,
    playerName: s.playerName || undefined,
    // period: không set — backend nhận null, tránh gán sai khi extra_time/penalty
  }));
}

function buildCardEventPayloads(cards, match, eventType) {
  return cards.map(c => ({
    teamId: c.teamSide === 'home' ? match.home_team_id : match.away_team_id,
    type: eventType,
    minute: Number(c.minute) || 1,
    note: c.playerName || undefined,
  }));
}

function buildSubEventPayloads(subs, match) {
  return subs.flatMap(s => {
    const teamId = s.teamSide === 'home' ? match.home_team_id : match.away_team_id;
    const minute = Number(s.minute) || 1;
    return [
      { teamId, type: MatchEventType.substitution_in, minute, note: s.playerIn || undefined },
      { teamId, type: MatchEventType.substitution_out, minute, note: s.playerOut || undefined },
    ];
  });
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────

function Stepper({ value, onChange, min = 0, max = 99 }) {
  return (
    <div className="flex items-center gap-0">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-9 h-10 flex items-center justify-center rounded-l-lg bg-navy-dark border border-navy-light text-gray-400 hover:text-white hover:bg-navy-light transition-all active:scale-95"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <input
        type="number" value={value} min={min} max={max}
        onChange={e => { const v = Number(e.target.value); if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v))); }}
        className="w-14 h-10 bg-navy-dark border-y border-navy-light text-white font-black text-xl text-center focus:outline-none focus:border-neon tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-9 h-10 flex items-center justify-center rounded-r-lg bg-navy-dark border border-navy-light text-gray-400 hover:text-white hover:bg-navy-light transition-all active:scale-95"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function TeamToggle({ side, onChange, homeLabel, awayLabel }) {
  return (
    <button
      onClick={onChange}
      className={`shrink-0 flex items-center justify-center px-2.5 py-2 rounded-lg border text-xs font-black transition-all min-w-[72px] ${side === 'home'
        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
        : 'bg-blue-500/20 border-blue-500/40 text-blue-400'
        }`}
    >
      {side === 'home' ? (homeLabel?.slice(0, 6) ?? 'Nhà') : (awayLabel?.slice(0, 6) ?? 'Khách')}
    </button>
  );
}

function MinuteInput({ value, onChange }) {
  return (
    <input
      type="number" value={value} min={0} max={120} placeholder="TĐ"
      onChange={e => onChange(String(Math.max(0, Math.min(120, Number(e.target.value)))))}
      className="w-14 px-2 py-2 bg-navy-dark border border-navy-light rounded-lg text-xs text-white text-center focus:outline-none focus:border-neon [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
    />
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button onClick={onClick} className="shrink-0 p-1 text-gray-600 hover:text-red-400 transition-colors">
      <X className="w-3.5 h-3.5" />
    </button>
  );
}

function EventList({ items, onAdd, onRemove, header, count, countCls = 'text-gray-600', empty, children }) {
  return (
    <div className="border border-navy-light rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-navy-dark border-b border-navy-light flex items-center justify-between">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{header}</span>
        <span className={`text-[10px] font-black ${countCls}`}>{count}</span>
      </div>
      <div className="p-3 space-y-2 bg-navy/60 min-h-[80px]">
        {items.length === 0
          ? <p className="text-center text-gray-600 text-xs py-3">{empty}</p>
          : children}
      </div>
      <div className="px-4 py-2.5 bg-navy-dark border-t border-navy-light flex items-center justify-center gap-6">
        <button
          onClick={onRemove} disabled={items.length === 0}
          className="w-8 h-8 rounded-full border border-navy-light text-gray-400 hover:text-white hover:border-gray-400 flex items-center justify-center transition-all disabled:opacity-30 active:scale-90"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={onAdd}
          className="w-8 h-8 rounded-full border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 flex items-center justify-center transition-all active:scale-90"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Row components ───────────────────────────────────────────────────────────

function ScorerRow({ scorer, homeTeamName, awayTeamName, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-2">
      <TeamToggle
        side={scorer.teamSide}
        onChange={() => onChange({ ...scorer, teamSide: scorer.teamSide === 'home' ? 'away' : 'home' })}
        homeLabel={homeTeamName} awayLabel={awayTeamName}
      />
      <input
        type="text" value={scorer.playerName} placeholder="Tên cầu thủ"
        onChange={e => onChange({ ...scorer, playerName: e.target.value })}
        className="flex-1 px-3 py-2 bg-navy-dark border border-navy-light rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon"
      />
      <MinuteInput value={scorer.minute} onChange={v => onChange({ ...scorer, minute: v })} />
      <button
        onClick={() => onChange({ ...scorer, isOwnGoal: !scorer.isOwnGoal })}
        className={`shrink-0 px-1.5 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${scorer.isOwnGoal
          ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
          : 'bg-navy-dark border-navy-light text-gray-600 hover:text-gray-400'
          }`}
        title="Phản lưới nhà"
      >OG</button>
      <RemoveBtn onClick={onRemove} />
    </div>
  );
}

function CardRow({ card, homeTeamName, awayTeamName, onChange, onRemove, color }) {
  const badgeCls = color === 'yellow'
    ? 'bg-yellow-400/20 border-yellow-400/40'
    : 'bg-red-500/20 border-red-500/40';
  return (
    <div className="flex items-center gap-2">
      <TeamToggle
        side={card.teamSide}
        onChange={() => onChange({ ...card, teamSide: card.teamSide === 'home' ? 'away' : 'home' })}
        homeLabel={homeTeamName} awayLabel={awayTeamName}
      />
      <input
        type="text" value={card.playerName} placeholder="Tên cầu thủ"
        onChange={e => onChange({ ...card, playerName: e.target.value })}
        className="flex-1 px-3 py-2 bg-navy-dark border border-navy-light rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon"
      />
      <MinuteInput value={card.minute} onChange={v => onChange({ ...card, minute: v })} />
      <div className={`shrink-0 w-5 h-7 rounded-sm border ${badgeCls}`} />
      <RemoveBtn onClick={onRemove} />
    </div>
  );
}

function SubRow({ sub, homeTeamName, awayTeamName, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-2">
      <TeamToggle
        side={sub.teamSide}
        onChange={() => onChange({ ...sub, teamSide: sub.teamSide === 'home' ? 'away' : 'home' })}
        homeLabel={homeTeamName} awayLabel={awayTeamName}
      />
      <input
        type="text" value={sub.playerIn} placeholder="Vào sân"
        onChange={e => onChange({ ...sub, playerIn: e.target.value })}
        className="flex-1 px-3 py-2 bg-navy-dark border border-navy-light rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon"
      />
      <span className="text-gray-600 text-xs font-black shrink-0">↔</span>
      <input
        type="text" value={sub.playerOut} placeholder="Ra sân"
        onChange={e => onChange({ ...sub, playerOut: e.target.value })}
        className="flex-1 px-3 py-2 bg-navy-dark border border-navy-light rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon"
      />
      <MinuteInput value={sub.minute} onChange={v => onChange({ ...sub, minute: v })} />
      <RemoveBtn onClick={onRemove} />
    </div>
  );
}

// ─── Tab contents ─────────────────────────────────────────────────────────────

function ScoreTabContent({ homeScore, awayScore, onHomeScore, onAwayScore, scorers, onScorers, homeTeamName, awayTeamName }) {
  const update = (i, val) => { const n = [...scorers]; n[i] = val; onScorers(n); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4 py-3">
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2 truncate max-w-[100px]">{homeTeamName}</p>
          <Stepper value={homeScore} onChange={onHomeScore} />
        </div>
        <span className="text-2xl font-black text-gray-600 pb-1">:</span>
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2 truncate max-w-[100px]">{awayTeamName}</p>
          <Stepper value={awayScore} onChange={onAwayScore} />
        </div>
      </div>
      <EventList
        items={scorers}
        onAdd={() => onScorers([...scorers, { id: Date.now(), teamSide: 'home', playerName: '', minute: '', isOwnGoal: false }])}
        onRemove={() => onScorers(scorers.slice(0, -1))}
        header="Danh sách ghi bàn" count={`${scorers.length} bàn`}
        empty="Chưa có bàn thắng nào"
      >
        {scorers.map((s, i) => (
          <ScorerRow key={s.id} scorer={s} homeTeamName={homeTeamName} awayTeamName={awayTeamName}
            onChange={v => update(i, v)} onRemove={() => onScorers(scorers.filter((_, j) => j !== i))} />
        ))}
      </EventList>
    </div>
  );
}

function CardTabContent({ cards, onCards, homeTeamName, awayTeamName, color }) {
  const label = color === 'yellow' ? 'Thẻ vàng' : 'Thẻ đỏ';
  const update = (i, val) => { const n = [...cards]; n[i] = val; onCards(n); };

  return (
    <EventList
      items={cards}
      onAdd={() => onCards([...cards, { id: Date.now(), teamSide: 'home', playerName: '', minute: '' }])}
      onRemove={() => onCards(cards.slice(0, -1))}
      header={label} count={`${cards.length} thẻ`}
      countCls={color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}
      empty={`Chưa có ${label.toLowerCase()} nào`}
    >
      {cards.map((c, i) => (
        <CardRow key={c.id} card={c} color={color} homeTeamName={homeTeamName} awayTeamName={awayTeamName}
          onChange={v => update(i, v)} onRemove={() => onCards(cards.filter((_, j) => j !== i))} />
      ))}
    </EventList>
  );
}

function SubTabContent({ subs, onSubs, homeTeamName, awayTeamName }) {
  const update = (i, val) => { const n = [...subs]; n[i] = val; onSubs(n); };

  return (
    <EventList
      items={subs}
      onAdd={() => onSubs([...subs, { id: Date.now(), teamSide: 'home', playerIn: '', playerOut: '', minute: '' }])}
      onRemove={() => onSubs(subs.slice(0, -1))}
      header="Thay người" count={`${subs.length} lượt`}
      empty="Chưa có lượt thay người nào"
    >
      {subs.map((s, i) => (
        <SubRow key={s.id} sub={s} homeTeamName={homeTeamName} awayTeamName={awayTeamName}
          onChange={v => update(i, v)} onRemove={() => onSubs(subs.filter((_, j) => j !== i))} />
      ))}
    </EventList>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function MatchDetailModal({ match, homeTeamName, awayTeamName, onClose, onUpdated }) {
  const toast = useToastStore();
  const [mode, setMode] = useState('view');
  const [activeTab, setActiveTab] = useState('Tỷ số');
  const [isSaving, setIsSaving] = useState(false);

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [scorers, setScorers] = useState([]);
  const [yellowCards, setYellowCards] = useState([]);
  const [redCards, setRedCards] = useState([]);
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    if (mode === 'edit' && match) {
      setHomeScore(match.home_score ?? 0);
      setAwayScore(match.away_score ?? 0);
      setScorers([]);
      setYellowCards([]);
      setRedCards([]);
      setSubs([]);
      // TODO: GET /matches/{id}/events → parse → populate drafts
    }
  }, [mode, match?.id]);

  if (!match) return null;

  const statusMeta = STATUS_META[match.status] ?? { label: match.status, cls: 'text-gray-400 bg-gray-400/10 border-gray-400/20' };
  const hasResult = match.home_score != null && match.away_score != null;
  const canEdit = EDITABLE.has(match.status);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (match.status === MatchStatus.finished) {
        // Correction window (15p sau finished, manual path only).
        // Backend reject nếu match có events — để backend trả error rõ ràng.
        await matchApi.editScore(match.id, { homeScore, awayScore });
      } else if (ADMIN_RECORD_STATUSES.has(match.status)) {
        await matchApi.adminRecordResult(match.id, {
          homeScore,
          awayScore,
          scorers: buildScorerPayload(scorers, match),
          resultType: MatchResultType.full_time,
        });

        // Card/sub: audit trail, fire-and-forget
        // Match đã finished sau adminRecordResult → recordEvent backend guard reject — expected
        const auditEvents = [
          ...buildCardEventPayloads(yellowCards, match, MatchEventType.yellow_card),
          ...buildCardEventPayloads(redCards, match, MatchEventType.red_card),
          ...buildSubEventPayloads(subs, match),
        ];
        for (const ev of auditEvents) {
          matchApi.recordEvent(match.id, ev).catch(() => { });
        }
      }

      toast.success('Đã lưu kết quả trận đấu!');
      setMode('view');
      onUpdated?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể lưu kết quả.');
    } finally {
      setIsSaving(false);
    }
  };

  const exitEdit = () => {
    setMode('view');
    setActiveTab('Tỷ số');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-navy border border-navy-light rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[92vh] animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-light bg-navy-dark rounded-t-3xl shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-black text-white uppercase tracking-tight">Tóm Tắt Trận Đấu</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wide ${statusMeta.cls}`}>
              {statusMeta.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.info?.('Tính năng xuất biên bản đang phát triển.')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 text-xs font-bold transition-all"
            >
              <FileText className="w-3.5 h-3.5" /> Biên bản
            </button>
            {mode === 'view' && canEdit && (
              <button
                onClick={() => setMode('edit')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all"
              >
                <Edit className="w-3.5 h-3.5" /> Cập nhật
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Team banner */}
        <div className="px-6 py-5 bg-gradient-to-b from-[#0f1e2e] to-navy shrink-0">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center flex-1">
              <div className="w-14 h-14 rounded-full bg-navy-light border-2 border-navy-light flex items-center justify-center mx-auto mb-2 shadow-lg">
                <span className="text-lg font-black text-emerald-400">{homeTeamName?.charAt(0) ?? 'H'}</span>
              </div>
              <p className="text-white font-black text-sm truncate">{homeTeamName}</p>
            </div>
            <div className="text-center shrink-0">
              {mode === 'view' && hasResult
                ? <p className="text-4xl font-black text-white tabular-nums">{match.home_score}<span className="text-gray-600 mx-1">:</span>{match.away_score}</p>
                : mode === 'view'
                  ? <p className="text-3xl font-black text-gray-600">– : –</p>
                  : <p className="text-4xl font-black text-white tabular-nums">{homeScore}<span className="text-gray-600 mx-1">:</span>{awayScore}</p>
              }
            </div>
            <div className="text-center flex-1">
              <div className="w-14 h-14 rounded-full bg-navy-light border-2 border-navy-light flex items-center justify-center mx-auto mb-2 shadow-lg">
                <span className="text-lg font-black text-blue-400">{awayTeamName?.charAt(0) ?? 'A'}</span>
              </div>
              <p className="text-white font-black text-sm truncate">{awayTeamName}</p>
            </div>
          </div>
        </div>

        {/* View body */}
        {mode === 'view' && (
          <div className="flex-1 overflow-y-auto p-5">
            {hasResult
              ? <div className="text-center py-6 text-gray-500 text-sm">Bấm <span className="text-white font-bold">Cập nhật</span> để chỉnh sửa kết quả.</div>
              : <div className="text-center py-8 text-gray-600 text-sm">
                Trận đấu chưa có kết quả.
                {canEdit && <p className="mt-1 text-xs">Bấm <span className="text-white font-bold">Cập nhật</span> để nhập.</p>}
              </div>
            }
          </div>
        )}

        {/* Edit: tabs */}
        {mode === 'edit' && (
          <>
            <div className="flex border-b border-navy-light shrink-0 bg-navy">
              {TABS.map(tab => (
                <button
                  key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider relative transition-colors ${activeTab === tab ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                  {tab}
                  {activeTab === tab && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-400 rounded-full" />}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {activeTab === 'Tỷ số' && (
                <ScoreTabContent
                  homeScore={homeScore} awayScore={awayScore}
                  onHomeScore={setHomeScore} onAwayScore={setAwayScore}
                  scorers={scorers} onScorers={setScorers}
                  homeTeamName={homeTeamName} awayTeamName={awayTeamName}
                />
              )}
              {activeTab === 'Thẻ vàng' && (
                <CardTabContent cards={yellowCards} onCards={setYellowCards}
                  homeTeamName={homeTeamName} awayTeamName={awayTeamName} color="yellow" />
              )}
              {activeTab === 'Thẻ đỏ' && (
                <CardTabContent cards={redCards} onCards={setRedCards}
                  homeTeamName={homeTeamName} awayTeamName={awayTeamName} color="red" />
              )}
              {activeTab === 'Thay người' && (
                <SubTabContent subs={subs} onSubs={setSubs}
                  homeTeamName={homeTeamName} awayTeamName={awayTeamName} />
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="px-5 py-4 border-t border-navy-light bg-navy-dark rounded-b-3xl shrink-0">
          {mode === 'view' ? (
            <div className="flex justify-end">
              <button onClick={onClose} className="px-5 py-2 rounded-xl border border-navy-light text-gray-300 hover:text-white hover:bg-navy-light font-bold text-sm transition-all">
                Đóng
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={exitEdit} className="px-4 py-2 rounded-xl border border-navy-light text-gray-300 hover:text-white hover:bg-navy-light font-bold text-sm transition-all">
                Thoát
              </button>

              {/* Hủy KQ — disabled, schema không có void status, backend chưa implement */}
              {hasResult && (
                <button
                  onClick={() => toast.info?.('Tính năng hủy kết quả đang phát triển.')}
                  className="px-4 py-2 rounded-xl bg-red-500/30 text-white/40 font-bold text-sm cursor-not-allowed"
                  title="Chưa hỗ trợ"
                >
                  Hủy KQ
                </button>
              )}

              <div className="flex-1" />

              <button
                onClick={() => toast.info?.('Nhập tỷ số, danh sách ghi bàn và thẻ phạt, sau đó bấm Lưu.')}
                className="px-4 py-2 rounded-xl bg-yellow-400/90 hover:bg-yellow-400 text-black font-bold text-sm transition-all active:scale-[.97]"
              >
                Hướng dẫn
              </button>

              <button
                onClick={handleSave} disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all disabled:opacity-70 shadow-lg shadow-emerald-500/20 active:scale-[.97]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Lưu
              </button>
            </div >
          )
          }
        </div >
      </div >
    </div >
  );
}