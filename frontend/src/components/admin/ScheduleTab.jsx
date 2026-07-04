import { useState, useEffect, useMemo } from 'react';
import {
  CalendarDays, CalendarPlus, Zap, Edit3, X, Save,
  MapPin, Clock, Loader2, RefreshCw, Search
} from 'lucide-react';
import { createPortal } from 'react-dom';
import useScheduleStore from '../../store/scheduleStore';
import useVenueStore from '../../store/venueStore';
import useTeamStore from '../../store/teamStore';
import useToastStore from '../../store/toastStore';
import { groupApi } from '../../api';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';

// ─── Component: Reschedule Modal ──────────────────────────────────────────────
function RescheduleModal({ match, venues, teams, onClose, onSave }) {
  const [scheduledAt, setScheduledAt] = useState(() => {
    if (match?.scheduled_at) {
      const dateObj = new Date(match.scheduled_at);
      const tzOffset = dateObj.getTimezoneOffset() * 60000;
      return (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, 16);
    }
    return '';
  });
  const [venueId, setVenueId] = useState(match?.venue_id ? String(match.venue_id) : '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(match.id, {
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      venueId: venueId ? Number(venueId) : undefined,
    });
    setIsSaving(false);
  };

  if (!match) return null;
  const homeTeam = match.home_team || teams?.find(t => t.id === match.home_team_id);
  const awayTeam = match.away_team || teams?.find(t => t.id === match.away_team_id);

  const homeName = homeTeam?.name ?? `Đội ${match.home_team_id}`;
  const awayName = awayTeam?.name ?? `Đội ${match.away_team_id}`;
  const homeLogo = homeTeam?.logo;
  const awayLogo = awayTeam?.logo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-navy border border-navy-light rounded-3xl w-full max-w-md shadow-2xl animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-navy-dark border-b border-navy-light">
          <h3 className="font-black text-white uppercase tracking-wider">Chỉnh sửa Lịch Thi Đấu</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex items-center gap-2 justify-between mb-6">
            <div className="flex-1 text-center min-w-0">
              {homeLogo ? (
                <img src={homeLogo} alt={homeName} className="w-12 h-12 mx-auto rounded-xl object-contain bg-white mb-2 border border-emerald-500/30 shadow-md" />
              ) : (
                <div className="w-12 h-12 mx-auto rounded-xl bg-linear-to-br from-emerald-500/20 to-teal-900 flex items-center justify-center text-emerald-400 font-black mb-2 border border-emerald-500/30 shadow-md text-lg">
                  {homeName[0]}
                </div>
              )}
              <p className="text-emerald-400 font-black text-sm truncate" title={homeName}>{homeName}</p>
            </div>
            <span className="text-gray-500 font-black text-xs shrink-0 px-2">VS</span>
            <div className="flex-1 text-center min-w-0">
              {awayLogo ? (
                <img src={awayLogo} alt={awayName} className="w-12 h-12 mx-auto rounded-xl object-contain bg-white mb-2 border border-blue-500/30 shadow-md" />
              ) : (
                <div className="w-12 h-12 mx-auto rounded-xl bg-linear-to-br from-blue-500/20 to-indigo-900 flex items-center justify-center text-blue-400 font-black mb-2 border border-blue-500/30 shadow-md text-lg">
                  {awayName[0]}
                </div>
              )}
              <p className="text-blue-400 font-black text-sm truncate" title={awayName}>{awayName}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Thời gian
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              className="w-full px-4 py-3 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:outline-none focus:border-neon transition-colors scheme-dark"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" /> Sân thi đấu
            </label>
            <select
              value={venueId}
              onChange={e => setVenueId(e.target.value)}
              className="w-full px-4 py-3 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:outline-none focus:border-neon transition-colors appearance-none"
            >
              <option value="">— Chọn sân thi đấu —</option>
              {venues.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-navy-light text-gray-400 hover:text-white font-bold text-sm transition-colors">Hủy</button>
            <button type="submit" disabled={isSaving} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center gap-2 transition-all disabled:opacity-50">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Component: Generate Schedule Modal ───────────────────────────────────────
// Modal này giờ có 2 chế độ, tự động phát hiện dựa trên GroupService:
//  - Season CHƯA có bảng nào (hasDrawnGroups=false): hiện form cũ (tự tạo
//    bảng + tự chia đội), gọi POST /schedules/seasons/{id}/generate.
//  - Season ĐÃ có bảng + đã bốc thăm (hasDrawnGroups=true): ẩn phần
//    "số bảng / kích thước bảng" (không còn ý nghĩa gì), chỉ hỏi sân/giờ/
//    nghỉ tối thiểu, gọi POST /schedules/seasons/{id}/generate-from-groups.
function GenerateScheduleModal({ seasonId, venues, onClose, onGenerate, onGenerateFromGroups }) {
  const [checkingGroups, setCheckingGroups] = useState(true);
  const [hasDrawnGroups, setHasDrawnGroups] = useState(false);
  const [groupCheckError, setGroupCheckError] = useState(false);

  const [formData, setFormData] = useState({
    desiredGroupCount: 1,
    minGroupSize: 4,
    maxGroupSize: 4,
    minRestDaysPerTeam: 2,
    matchTimes: "08:00, 15:00",
  });

  const [selectedVenues, setSelectedVenues] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Kiểm tra season đã có bảng + đã bốc thăm (>= 2 đội/bảng) hay chưa —
  // dùng chính API groupApi.listBySeason (GroupService.findAllBySeason),
  // đảm bảo cùng nguồn sự thật với GroupDrawUI.
  useEffect(() => {
    if (!seasonId) return;
    let cancelled = false;
    (async () => {
      setCheckingGroups(true);
      setGroupCheckError(false);
      try {
        const res = await groupApi.listBySeason(seasonId);
        const payload = typeof res?.status === 'boolean' ? res.data : res;
        const groups = Array.isArray(payload?.groups) ? payload.groups : [];
        const anyGroupHasEnoughTeams = groups.some(g => (g.season_teams?.length || 0) >= 2);
        if (!cancelled) setHasDrawnGroups(anyGroupHasEnoughTeams);
      } catch (err) {
        console.error('[GenerateScheduleModal] check groups failed:', err);
        if (!cancelled) {
          setHasDrawnGroups(false);
          setGroupCheckError(true);
        }
      } finally {
        if (!cancelled) setCheckingGroups(false);
      }
    })();
    return () => { cancelled = true; };
  }, [seasonId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVenueToggle = (vid) => {
    setSelectedVenues(prev =>
      prev.includes(vid) ? prev.filter(id => id !== vid) : [...prev, vid]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedVenues.length === 0) {
      alert("Vui lòng chọn ít nhất một sân thi đấu.");
      return;
    }

    setIsGenerating(true);
    const timesArray = formData.matchTimes.split(',').map(t => t.trim()).filter(Boolean);

    const basePayload = {
      minRestDaysPerTeam: Number(formData.minRestDaysPerTeam),
      venueIds: selectedVenues.map(Number),
      matchTimes: timesArray,
    };

    if (hasDrawnGroups) {
      // Bảng đã tồn tại + đã bốc thăm — chỉ sinh match + xếp lịch
      await onGenerateFromGroups(seasonId, { ...basePayload, doubleRound: false });
    } else {
      // Chưa có bảng — luồng cũ: tự tạo bảng + tự chia đội + sinh lịch
      await onGenerate(seasonId, {
        ...basePayload,
        desiredGroupCount: Number(formData.desiredGroupCount),
        minGroupSize: Number(formData.minGroupSize),
        maxGroupSize: Number(formData.maxGroupSize),
        doubleRound: false,
      });
    }

    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-navy border border-navy-light rounded-3xl w-full max-w-2xl shadow-2xl animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-navy-dark border-b border-navy-light shrink-0">
          <h3 className="font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-5 h-5 text-neon" /> Tạo Lịch Thi Đấu
          </h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {checkingGroups ? (
          <div className="p-10 flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 className="w-6 h-6 text-neon animate-spin" />
            <p className="text-xs font-bold">Đang kiểm tra bảng đấu hiện có...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
            {groupCheckError && (
              <p className="text-sm text-amber-400 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
                Không kiểm tra được bảng đấu hiện có — mặc định coi như chưa có bảng. Nếu season đã bốc thăm
                bảng, hãy tải lại trang trước khi tạo lịch để tránh tạo trùng bảng.
              </p>
            )}

            {hasDrawnGroups ? (
              <div className="text-sm text-emerald-300 bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20">
                Season đã có bảng đấu và đã bốc thăm. Hệ thống sẽ sinh trận đấu vòng tròn cho các bảng
                hiện có rồi xếp giờ/sân — không tạo lại bảng hay chia lại đội.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số bảng đấu (Groups)</label>
                  <input
                    type="number" min="1" required
                    name="desiredGroupCount" value={formData.desiredGroupCount} onChange={handleChange}
                    className="w-full px-4 py-2 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:border-neon outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kích thước bảng tối thiểu</label>
                  <input
                    type="number" min="2" required
                    name="minGroupSize" value={formData.minGroupSize} onChange={handleChange}
                    className="w-full px-4 py-2 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:border-neon outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kích thước bảng tối đa</label>
                  <input
                    type="number" min="2" required
                    name="maxGroupSize" value={formData.maxGroupSize} onChange={handleChange}
                    className="w-full px-4 py-2 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:border-neon outline-none"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số ngày nghỉ tối thiểu / đội</label>
                <input
                  type="number" min="0"
                  name="minRestDaysPerTeam" value={formData.minRestDaysPerTeam} onChange={handleChange}
                  className="w-full px-4 py-2 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:border-neon outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Khung giờ đá (cách nhau dấu phẩy)</label>
                <input
                  type="text" required
                  placeholder="VD: 08:00, 15:00, 18:30"
                  name="matchTimes" value={formData.matchTimes} onChange={handleChange}
                  className="w-full px-4 py-2 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:border-neon outline-none"
                />
              </div>
            </div>

            <p className="text-[11px] text-gray-500 -mt-2">
              Khoảng thời gian xếp lịch (ngày bắt đầu/kết thúc) lấy từ <code>start_date</code>/<code>end_date</code>
              của mùa giải — chỉnh ở phần cài đặt mùa giải nếu cần đổi.
            </p>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chọn Sân Tổ Chức</label>
              {venues.length === 0 ? (
                <p className="text-sm text-amber-400 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">Bạn cần thêm sân thi đấu trước (trong phần cài đặt sân) để có thể tạo lịch!</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-2 bg-navy-dark rounded-xl border border-navy-light custom-scrollbar">
                  {venues.map(v => (
                    <label key={v.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${selectedVenues.includes(String(v.id)) ? 'bg-neon/10 border-neon text-neon' : 'bg-navy border-navy-light text-gray-300 hover:border-gray-500'}`}>
                      <input
                        type="checkbox"
                        checked={selectedVenues.includes(String(v.id))}
                        onChange={() => handleVenueToggle(String(v.id))}
                        className="accent-neon w-4 h-4"
                      />
                      <span className="font-bold text-sm truncate">{v.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-navy-light">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-navy-light text-gray-400 hover:text-white font-bold text-sm transition-colors">Đóng</button>
              <button type="submit" disabled={isGenerating || venues.length === 0} className="px-6 py-2.5 rounded-xl bg-neon hover:bg-neon-dark text-black font-black text-sm flex items-center gap-2 transition-all disabled:opacity-50">
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Bắt đầu tạo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


// ─── Main Component: ScheduleTab ─────────────────────────────────────────────────
export default function ScheduleTab({ selectedSeasonId, onGoToLiveControl }) {
  const toast = useToastStore();
  const {
    getMatchesFromCache, isSeasonLoading, fetchBySeason,
    generateSchedule, generateFromGroups, rescheduleMatch,
  } = useScheduleStore();
  const { venues, fetchAll: fetchVenues } = useVenueStore();
  const { teams, fetchAll: fetchTeams } = useTeamStore();

  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [rescheduleMatchData, setRescheduleMatchData] = useState(null); // stores match object if open

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVenues();
    fetchTeams({ per_page: 500 });
  }, [fetchVenues, fetchTeams]);

  useEffect(() => {
    if (selectedSeasonId) {
      fetchBySeason(Number(selectedSeasonId), { force: true });
    }
  }, [selectedSeasonId, fetchBySeason]);

  const effectiveSeasonId = selectedSeasonId;
  const matches = useMemo(() => {
    if (!effectiveSeasonId) return [];
    let list = getMatchesFromCache(Number(effectiveSeasonId));
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(m => {
        const hName = m.home_team?.name || teams.find(t => t.id === m.home_team_id)?.name || '';
        const aName = m.away_team?.name || teams.find(t => t.id === m.away_team_id)?.name || '';
        return hName.toLowerCase().includes(lower) || aName.toLowerCase().includes(lower);
      });
    }
    return list;
  }, [effectiveSeasonId, getMatchesFromCache, searchTerm, teams]);

  const isLoading = effectiveSeasonId
    ? isSeasonLoading(Number(effectiveSeasonId))
    : false;

  const totalPages = Math.ceil(matches.length / itemsPerPage);
  const displayedMatches = matches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRefresh = () => {
    if (effectiveSeasonId) {
      fetchBySeason(Number(effectiveSeasonId), { force: true });
    }
  };

  const handleGenerateSchedule = async (seasonId, payload) => {
    try {
      await generateSchedule(seasonId, payload);
      toast.success('Đã tạo lịch thi đấu & bốc thăm thành công!');
      setGenerateModalOpen(false);
      handleRefresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo lịch.');
    }
  };

  // NEW: sinh lịch cho season đã có bảng + đã bốc thăm sẵn (qua GroupDrawUI).
  const handleGenerateFromGroups = async (seasonId, payload) => {
    try {
      await generateFromGroups(seasonId, payload);
      toast.success('Đã sinh lịch thi đấu từ bảng đã bốc thăm!');
      setGenerateModalOpen(false);
      handleRefresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo lịch.');
    }
  };

  const handleReschedule = async (matchId, payload) => {
    try {
      await rescheduleMatch(matchId, payload, Number(effectiveSeasonId));
      toast.success('Cập nhật lịch thành công!');
      setRescheduleMatchData(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Lỗi khi cập nhật trận đấu.');
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Filters & Actions */}
        <div className="bg-navy border border-navy-light rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm trận đấu (theo tên đội)..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-3 bg-navy-dark border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-colors text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-3 rounded-xl bg-navy-dark border border-navy-light text-gray-400 hover:text-white transition-all disabled:opacity-50"
              title="Tải lại lịch"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setGenerateModalOpen(true)}
              disabled={!effectiveSeasonId}
              className="px-5 py-3 rounded-xl bg-neon hover:bg-neon-dark text-black font-black transition-all shadow-lg shadow-neon/20 disabled:opacity-50 flex items-center gap-2"
            >
              <Zap className="w-5 h-5" /> Tạo lịch thi đấu
            </button>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-neon animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-navy-light rounded-3xl bg-navy/30">
            <CalendarPlus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-black text-white mb-2">Chưa có lịch thi đấu</h3>
            <p className="text-gray-400 mb-6">Không có trận đấu nào được tìm thấy.</p>
            {effectiveSeasonId && (
              <button
                onClick={() => setGenerateModalOpen(true)}
                className="px-6 py-3 rounded-full bg-neon text-black font-black inline-flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Zap className="w-5 h-5" /> Tạo lịch tự động ngay
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedMatches.map(m => {
                const homeTeam = m.home_team || teams.find(t => t.id === m.home_team_id);
                const awayTeam = m.away_team || teams.find(t => t.id === m.away_team_id);

                const homeName = homeTeam?.name ?? `Đội ${m.home_team_id}`;
                const awayName = awayTeam?.name ?? `Đội ${m.away_team_id}`;

                const homeLogo = homeTeam?.logo;
                const awayLogo = awayTeam?.logo;
                return (
                  <div key={m.id} className="bg-navy border border-navy-light rounded-2xl p-4 hover:border-gray-500 transition-colors group relative">
                    <div className="flex justify-between items-start mb-3">
                      <StatusBadge status={m.status} />
                      <button
                        onClick={() => setRescheduleMatchData(m)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 bg-navy-dark hover:bg-navy-light border border-navy-light rounded-lg text-emerald-400 transition-all absolute top-3 right-3"
                        title="Đổi lịch / Sân"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 justify-between mb-4 mt-2">
                      <div className="flex-1 text-center min-w-0">
                        {homeLogo ? (
                          <img src={homeLogo} alt={homeName} className="w-10 h-10 mx-auto rounded-xl object-contain bg-white mb-1 border border-emerald-500/30" />
                        ) : (
                          <div className="w-10 h-10 mx-auto rounded-xl bg-linear-to-br from-emerald-500/20 to-teal-900 flex items-center justify-center text-emerald-400 font-black mb-1 border border-emerald-500/30">
                            {homeName[0]}
                          </div>
                        )}
                        <p className="text-white font-bold text-sm truncate" title={homeName}>{homeName}</p>
                      </div>
                      <span className="text-gray-600 font-black text-xs shrink-0">VS</span>
                      <div className="flex-1 text-center min-w-0">
                        {awayLogo ? (
                          <img src={awayLogo} alt={awayName} className="w-10 h-10 mx-auto rounded-xl object-contain bg-white mb-1 border border-blue-500/30" />
                        ) : (
                          <div className="w-10 h-10 mx-auto rounded-xl bg-linear-to-br from-blue-500/20 to-indigo-900 flex items-center justify-center text-blue-400 font-black mb-1 border border-blue-500/30">
                            {awayName[0]}
                          </div>
                        )}
                        <p className="text-white font-bold text-sm truncate" title={awayName}>{awayName}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-navy-light/50 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        {m.scheduled_at ? new Date(m.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'Chưa xếp lịch'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium truncate mb-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="truncate">{m.venue?.name ?? 'Chưa xếp sân'}</span>
                      </div>
                      <button
                        onClick={() => onGoToLiveControl(m.id)}
                        className="w-full py-2 bg-navy-dark hover:bg-navy-light border border-navy-light rounded-xl text-emerald-400 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" /> Cập nhật kết quả
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {generateModalOpen && createPortal(
        <GenerateScheduleModal
          seasonId={Number(selectedSeasonId)}
          venues={venues}
          onClose={() => setGenerateModalOpen(false)}
          onGenerate={handleGenerateSchedule}
          onGenerateFromGroups={handleGenerateFromGroups}
        />,
        document.body
      )}

      {rescheduleMatchData && createPortal(
        <RescheduleModal
          match={rescheduleMatchData}
          venues={venues}
          teams={teams}
          onClose={() => setRescheduleMatchData(null)}
          onSave={handleReschedule}
        />,
        document.body
      )}
    </>
  );
}