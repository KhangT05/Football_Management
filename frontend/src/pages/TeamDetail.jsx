import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Users, Trophy, Target, Shield, Activity,
  WifiOff, Crown, UserCheck, UserX, Hash
} from 'lucide-react';
import { teamApi } from '../api';

// ── Helpers ───────────────────────────────────────────────────
const AVATAR_COLORS = [
  'from-blue-500 to-cyan-600', 'from-purple-500 to-violet-600',
  'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600', 'from-red-500 to-rose-700',
];
const getInitials = (name) =>
  name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?';

const POSITION_LABELS = { GK: 'Thủ môn', DEF: 'Hậu vệ', MID: 'Tiền vệ', FW: 'Tiền đạo' };
const POSITION_COLORS = {
  GK:  'bg-amber-400/10 text-amber-400 border-amber-400/30',
  DEF: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  MID: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
  FW:  'bg-red-400/10 text-red-400 border-red-400/30',
};

// ── Skeletons ─────────────────────────────────────────────────
function HeaderSkeleton() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
      <div className="skeleton w-32 h-32 md:w-48 md:h-48 rounded-full shrink-0" />
      <div className="space-y-4 w-full max-w-lg">
        <div className="skeleton h-6 w-24 rounded-full" />
        <div className="skeleton h-12 w-64 rounded" />
        <div className="skeleton h-4 w-full max-w-md rounded" />
      </div>
    </div>
  );
}

function PlayerCardSkeleton() {
  return (
    <div className="bg-navy border border-navy-light rounded-xl p-4 shadow-lg shadow-black/20">
      <div className="flex items-center gap-3">
        <div className="skeleton w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-28 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
        <div className="skeleton h-6 w-8 rounded" />
      </div>
    </div>
  );
}

// ── StatBox ───────────────────────────────────────────────────
function StatBox({ label, value, icon: Icon, colorClass = 'text-neon' }) {
  return (
    <div className="bg-navy border border-navy-light rounded-xl p-4 text-center shadow-lg shadow-black/20">
      {Icon && <Icon className={`w-5 h-5 ${colorClass} mx-auto mb-2`} />}
      <div className={`text-3xl font-black ${colorClass} mb-1`}>{value ?? '—'}</div>
      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}

// ── Player Card ───────────────────────────────────────────────
function PlayerCard({ tp, idx }) {
  const player = tp.player ?? tp;
  const name = player.name ?? `#${tp.player_id}`;
  const initial = getInitials(name);
  const colorIdx = (tp.player_id ?? idx) % AVATAR_COLORS.length;
  const pos = tp.position ?? player.position;
  const jerseyNum = tp.jersey_number ?? '?';
  const isCaptain = tp.role === 'captain';
  const isVice = tp.role === 'vice_captain';

  return (
    <div
      className="bg-navy border border-navy-light rounded-xl p-4 shadow-lg shadow-black/20 hover:border-blue-500/40 hover:shadow-blue-900/10 transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full bg-linear-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center font-black text-white text-sm shadow-md shrink-0 relative`}>
          {initial}
          {isCaptain && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow">
              <Crown className="w-2.5 h-2.5 text-yellow-900" />
            </span>
          )}
          {isVice && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center shadow">
              <Shield className="w-2.5 h-2.5 text-blue-900" />
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-sm truncate">{name}</div>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {pos && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${POSITION_COLORS[pos] ?? 'bg-gray-400/10 text-gray-400 border-gray-400/30'}`}>
                {POSITION_LABELS[pos] ?? pos}
              </span>
            )}
            {isCaptain && <span className="text-xs text-yellow-400 font-bold">Đội trưởng</span>}
          </div>
        </div>

        {/* Jersey Number */}
        <div className="shrink-0 text-right">
          <div className="text-lg font-black text-neon leading-none">#{jerseyNum}</div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function TeamDetail() {
  const { id } = useParams();
  const teamId = parseInt(id) || null;

  // Khởi tạo state từ teamId để tránh setState synchronous trong effect
  const [isLoading, setIsLoading] = useState(!!teamId);
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [hasError, setHasError] = useState(!teamId);

  useEffect(() => {
    if (!teamId) return; // Không có teamId → hasError đã = true từ useState initial
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);

    const parsePage = (res) => {
      const payload = (typeof res?.status === 'boolean') ? res.data : res;
      return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    };

    Promise.allSettled([
      teamApi.getTeamById(teamId),
      teamApi.getPlayers(teamId, { approval_status: 'approved', per_page: 50 }),
    ]).then(([teamRes, playersRes]) => {
      if (cancelled) return;
      if (teamRes.status === 'fulfilled') {
        const raw = teamRes.value;
        const payload = (typeof raw?.status === 'boolean') ? raw.data : raw;
        setTeam(payload);
      } else {
        setHasError(true);
      }
      if (playersRes.status === 'fulfilled') setPlayers(parsePage(playersRes.value));
    }).finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [teamId]);

  // Group players by position
  const byPosition = players.reduce((acc, tp) => {
    const pos = tp.position ?? 'OTHER';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(tp);
    return acc;
  }, {});
  const positionOrder = ['GK', 'DEF', 'MID', 'FW', 'OTHER'];

  const homeName = team?.name ?? '—';
  const initial = getInitials(homeName);
  const colorIdx = (teamId ?? 0) % AVATAR_COLORS.length;

  return (
    <div className="pb-20 bg-navy-dark min-h-screen">

      {/* Back */}
      <div className="container mx-auto px-4 lg:px-8 pt-6 animate-fade-in">
        <Link
          to="/bang-xep-hang"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-neon transition-colors text-sm font-bold uppercase tracking-wider group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </Link>
      </div>

      {/* Hero Header */}
      <section className="relative mt-6 mb-12 bg-navy border-b border-navy-light shadow-lg shadow-black/20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-900/10 via-transparent to-cyan-900/5 pointer-events-none" />
        <div className="container relative z-10 mx-auto px-4 lg:px-8 py-12 md:py-20 animate-slide-up">
          {isLoading ? (
            <HeaderSkeleton />
          ) : hasError ? (
            <div className="flex flex-col items-center gap-4 text-gray-400 py-8">
              <WifiOff className="w-12 h-12 text-gray-600" />
              <p className="font-bold">Không thể tải thông tin đội bóng.</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Avatar */}
              <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full bg-linear-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center font-black text-5xl md:text-7xl text-white shadow-2xl shadow-blue-900/30 shrink-0 border-4 border-white/10 animate-fade-in`}>
                {initial}
              </div>

              <div className="text-center md:text-left space-y-4 max-w-3xl">
                {team?.is_active !== undefined && (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${team.is_active ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30' : 'bg-gray-400/10 text-gray-400 border border-gray-400/30'}`}>
                    {team.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                    {team.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
                  </div>
                )}
                <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase italic tracking-tight">
                  {team?.name}
                </h1>
                {team?.description && (
                  <p className="text-gray-400 text-lg md:text-xl font-medium">{team.description}</p>
                )}
                {team?.coach_name && (
                  <p className="text-gray-400">
                    Huấn luyện viên: <span className="text-white font-bold">{team.coach_name}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 space-y-12 max-w-6xl">

        {/* Stats */}
        {!isLoading && !hasError && (
          <section className="animate-slide-up">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
              <Target className="w-6 h-6 text-neon" /> Thống kê đội bóng
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox label="Cầu thủ" value={players.length} icon={Users} colorClass="text-blue-400" />
              <StatBox label="Thủ môn" value={byPosition['GK']?.length ?? 0} icon={Shield} colorClass="text-amber-400" />
              <StatBox label="Hậu vệ" value={byPosition['DEF']?.length ?? 0} icon={Shield} colorClass="text-blue-400" />
              <StatBox label="Tiền đạo" value={byPosition['FW']?.length ?? 0} icon={Target} colorClass="text-red-400" />
            </div>
          </section>
        )}

        {/* Player Roster */}
        <section>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-navy-light animate-slide-up flex-wrap gap-3">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <Users className="w-6 h-6 text-neon" /> Danh Sách Cầu Thủ
            </h2>
            {!isLoading && players.length > 0 && (
              <span className="text-neon font-bold bg-neon/10 border border-neon/20 px-4 py-1.5 rounded-lg text-sm">
                Sĩ số: {players.length}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => <PlayerCardSkeleton key={i} />)}
            </div>
          ) : players.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
              <Users className="w-12 h-12 text-gray-600" />
              <p className="font-semibold">Đội bóng chưa có cầu thủ nào.</p>
            </div>
          ) : (
            positionOrder.filter(pos => byPosition[pos]?.length).map(pos => (
              <div key={pos} className="mb-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5" />
                  {POSITION_LABELS[pos] ?? 'Khác'} ({byPosition[pos].length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {byPosition[pos].map((tp, idx) => (
                    <PlayerCard key={tp.id} tp={tp} idx={idx} />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

      </div>
    </div>
  );
}
