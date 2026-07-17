import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ScheduleTab from '../../components/admin/ScheduleTab';
import LiveControlTab from '../../components/admin/LiveControlTab';
import useSeasonStore from '../../store/seasonStore';
import { tournamentApi } from '../../api';
import { CalendarDays, ChevronDown, Activity, Calendar, Trophy } from 'lucide-react';

const SEASON_STATUS_LABEL = {
  registration_open: 'Mở đăng ký',
  ongoing: 'Đang diễn ra',
  finished: 'Kết thúc',
  upcoming: 'Sắp diễn ra',
  cancelled: 'Đã hủy',
};

export default function ManageMatches() {
  const { seasons, isLoading: seasonsLoading, fetchAll: fetchSeasons } = useSeasonStore();

  const [tournaments, setTournaments] = useState([]);
  const [tournamentsLoading, setTournamentsLoading] = useState(true);
  const [selectedTournamentId, setSelectedTournamentId] = useState('');

  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedMatchId, setSelectedMatchId] = useState('');

  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setTournamentsLoading(true);
      try {
        const res = await tournamentApi.getAll({ per_page: 200 });
        const payload = typeof res?.status === 'boolean' ? res.data : res;
        if (!cancelled) setTournaments(Array.isArray(payload?.data) ? payload.data : []);
      } catch (err) {
        console.error('[ManageMatches] fetch tournaments failed:', err);
        if (!cancelled) setTournaments([]);
      } finally {
        if (!cancelled) setTournamentsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Season list filter theo tournament đang chọn. Season không có tournament_id
  // trực tiếp trên object list-view thì fallback qua season.tournament?.id.
  const filteredSeasons = useMemo(() => {
    if (!selectedTournamentId) return seasons;
    return seasons.filter(
      s => String(s.tournament_id ?? s.tournament?.id) === String(selectedTournamentId)
    );
  }, [seasons, selectedTournamentId]);

  // Auto-select lần đầu khi data về: ưu tiên tournament có season đang
  // ongoing/registration_open, rồi auto-pick season active trong tournament đó.
  // Chỉ chạy khi CHƯA có gì được chọn — không override lựa chọn thủ công của admin.
  useEffect(() => {
    if (selectedTournamentId || selectedSeasonId) return;
    if (seasons.length === 0) return;

    const preferredSeason = seasons.find(
      s => s.status === 'ongoing' || s.status === 'registration_open'
    ) || seasons[0];

    const tid = preferredSeason.tournament_id ?? preferredSeason.tournament?.id ?? '';
    setSelectedTournamentId(String(tid));
    setSelectedSeasonId(String(preferredSeason.id));
  }, [selectedTournamentId, selectedSeasonId, seasons]);

  // Đổi tournament -> reset season đang chọn nếu season đó không thuộc
  // tournament mới (tránh giữ season "ma" của tournament cũ hiển thị mismatch).
  const handleTournamentChange = (val) => {
    setSelectedTournamentId(val);
    const stillValid = seasons.some(
      s => String(s.id) === String(selectedSeasonId) &&
        String(s.tournament_id ?? s.tournament?.id) === String(val)
    );
    if (!stillValid) setSelectedSeasonId('');
  };

  const handleGoToLiveControl = (matchId) => {
    setSelectedMatchId(String(matchId));
    setActiveTab('live');
  };

  return (
    <AdminLayout>
      <div className="w-full space-y-6 pb-20 animate-fade-in">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-light pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-neon to-emerald-600 flex items-center justify-center shadow-lg shadow-neon/20">
              {activeTab === 'schedule' ? <CalendarDays className="w-6 h-6 text-black" /> : <Activity className="w-6 h-6 text-black" />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {activeTab === 'schedule' ? 'Lịch Thi Đấu & Bốc Thăm' : 'Trực tiếp & Kết quả'}
              </h2>
              <p className="text-gray-400 text-sm">
                {activeTab === 'schedule' ? 'Quản lý lịch, phân lịch tự động và chỉnh sửa thời gian' : 'Cập nhật tỷ số, sự kiện & xác nhận kết quả theo thời gian thực'}
              </p>
            </div>
          </div>
          <div className="flex items-center bg-navy-dark p-1.5 rounded-xl border border-navy-light">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-all ${activeTab === 'schedule' ? 'bg-navy border border-navy-light shadow-sm text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Calendar className="w-4 h-4" /> Lịch thi đấu
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-all ${activeTab === 'live' ? 'bg-navy border border-navy-light shadow-sm text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Activity className="w-4 h-4" /> Live Control
            </button>
          </div>
        </div>

        {/* Global Tournament + Season Selector */}
        <div className="bg-navy border border-navy-light rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Chọn Giải Đấu
            </label>
            <div className="relative">
              <select
                value={selectedTournamentId}
                onChange={e => handleTournamentChange(e.target.value)}
                disabled={tournamentsLoading}
                className="w-full pl-4 pr-10 py-3 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:outline-none focus:border-neon appearance-none transition-colors disabled:opacity-50"
              >
                <option value="">— Tất cả giải đấu —</option>
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-emerald-400" /> Chọn Mùa Giải Để Quản Lý
            </label>
            <div className="relative">
              <select
                value={selectedSeasonId}
                onChange={e => setSelectedSeasonId(e.target.value)}
                disabled={seasonsLoading}
                className="w-full pl-4 pr-10 py-3 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:outline-none focus:border-neon appearance-none transition-colors disabled:opacity-50"
              >
                <option value="">— Đang chọn Mùa giải —</option>
                {filteredSeasons.length === 0 && selectedTournamentId ? (
                  <option value="" disabled>Giải đấu này chưa có mùa giải nào</option>
                ) : (
                  filteredSeasons.map(s => {
                    const lbl = SEASON_STATUS_LABEL[s.status] ?? s.status;
                    return <option key={s.id} value={s.id}>{s.name} — {lbl}</option>;
                  })
                )}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'schedule' ? (
          <ScheduleTab
            selectedSeasonId={selectedSeasonId}
            onGoToLiveControl={handleGoToLiveControl}
          />
        ) : (
          <LiveControlTab
            selectedSeasonId={selectedSeasonId}
            selectedMatchId={selectedMatchId}
            setSelectedMatchId={setSelectedMatchId}
          />
        )}
      </div>
    </AdminLayout>
  );
}