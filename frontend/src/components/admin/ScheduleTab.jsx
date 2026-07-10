import { useState, useEffect, useMemo } from 'react';
import {
  CalendarPlus, Zap, Edit3, X, Save,
  MapPin, Clock, Loader2, RefreshCw, Search, Calendar, Plus,
  FileText, ShieldCheck, AlertTriangle, Users, PenLine,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import useScheduleStore from '../../store/scheduleStore';
import useVenueStore from '../../store/venueStore';
import useTeamStore from '../../store/teamStore';
import useToastStore from '../../store/toastStore';
import { groupApi, matchApi } from '../../api';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import {
  vnInputToUtcDate, utcToVnInput, getDatesInRangeUtc, formatDateChipUtc,
} from '../../utils/vn-time';

// ─── Helpers: date range ───────────────────────────────────────────────────
// FIX: dùng getDatesInRangeUtc/formatDateChipUtc — bản cũ dùng
// `new Date(\`${d}T00:00:00\`)` (local-TZ parse) rồi `.toISOString()` (UTC
// output), round-trip qua 2 TZ khác nhau gây off-by-one-day trên máy có TZ
// dương so với UTC (VN = UTC+7): local midnight -> UTC 17:00 hôm trước ->
// slice(0,10) ra sai ngày lùi 1. Bản mới build thuần UTC-calendar-day, không
// có local-TZ nào can thiệp vào giữa chừng.
const getDatesInRange = getDatesInRangeUtc;
const formatDateChip = formatDateChipUtc;

const extractFilename = (contentDisposition, fallback) => {
  if (!contentDisposition) return fallback;
  const m = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^;"]+)"?/i);
  return m ? decodeURIComponent(m[1]) : fallback;
};

// ─── Component: giờ input HH:mm không phụ thuộc OS locale ─────────────────
// native <input type="time"> render theo locale hệ điều hành của CLIENT
// (Chrome/Edge lấy Intl locale máy, không theo `lang` attr set trên input),
// nên máy admin locale en-US sẽ hiện AM/PM 12h — gõ "20" bị coi invalid,
// đúng pattern "không nhập được time" bạn báo. Thay bằng 2 input số tự
// control, cố định 24h, không phụ thuộc locale/OS.
function TimeField({ value, onChange }) {
  const [h, m] = value ? value.split(':') : ['', ''];

  // Trong lúc gõ: không pad, không clamp — chỉ giữ digit thô để user
  // còn cơ hội gõ ký tự thứ 2 hoặc backspace sửa lại.
  const emit = (hh, mm) => {
    if (hh === '' && mm === '') { onChange(''); return; }
    onChange(`${hh}:${mm}`);
  };

  const handleHour = (raw) => emit(raw.replace(/\D/g, '').slice(0, 2), m);
  const handleMinute = (raw) => emit(h, raw.replace(/\D/g, '').slice(0, 2));

  // Chỉ clamp + pad khi rời field — lúc này mới "chốt" giá trị hợp lệ.
  const blurHour = () => {
    if (h === '') return;
    emit(String(Math.min(23, Math.max(0, Number(h)))).padStart(2, '0'), m);
  };
  const blurMinute = () => {
    if (m === '') return;
    emit(h, String(Math.min(59, Math.max(0, Number(m)))).padStart(2, '0'));
  };

  return (
    <div className="flex items-center gap-1">
      <input
        type="text" inputMode="numeric" maxLength={2} placeholder="HH"
        value={h}
        onChange={e => handleHour(e.target.value)}
        onBlur={blurHour}
        className="w-14 px-2 py-2.5 bg-navy-dark border border-navy-light rounded-xl text-white font-bold text-center focus:border-neon outline-none"
      />
      <span className="text-gray-500 font-black">:</span>
      <input
        type="text" inputMode="numeric" maxLength={2} placeholder="MM"
        value={m}
        onChange={e => handleMinute(e.target.value)}
        onBlur={blurMinute}
        className="w-14 px-2 py-2.5 bg-navy-dark border border-navy-light rounded-xl text-white font-bold text-center focus:border-neon outline-none"
      />
    </div>
  );
}

// ─── Component: Reschedule Modal ──────────────────────────────────────────────
function RescheduleModal({ match, venues, teams, onClose, onSave }) {
  // FIX: thay round-trip qua getTimezoneOffset() (phụ thuộc TZ của OS máy
  // admin — sai nếu admin remote vào server/VPS TZ khác VN) bằng conversion
  // tường minh theo Asia/Ho_Chi_Minh (+7 cố định, không DST).
  const [scheduledAt, setScheduledAt] = useState(() => utcToVnInput(match?.scheduled_at));
  const [venueId, setVenueId] = useState(match?.venue_id ? String(match.venue_id) : '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(match.id, {
      scheduledAt: scheduledAt ? vnInputToUtcDate(scheduledAt) : undefined,
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
              <Clock className="w-4 h-4 text-emerald-400" /> Thời gian (giờ VN)
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
function GenerateScheduleModal({ seasonId, venues, onClose, onGenerate, onGenerateFromGroups }) {
  const [checkingGroups, setCheckingGroups] = useState(true);
  const [hasDrawnGroups, setHasDrawnGroups] = useState(false);
  const [groupCheckError, setGroupCheckError] = useState(false);

  const [formData, setFormData] = useState({
    desiredGroupCount: 1,
    minGroupSize: 4,
    maxGroupSize: 4,
    minRestDaysPerTeam: 2,
  });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [excludedDates, setExcludedDates] = useState([]);

  const [timeSlots, setTimeSlots] = useState(['08:00', '15:00']);
  const [newTime, setNewTime] = useState('');

  const [selectedVenues, setSelectedVenues] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const allDatesInRange = useMemo(() => getDatesInRange(startDate, endDate), [startDate, endDate]);
  const playableDates = useMemo(
    () => allDatesInRange.filter(d => !excludedDates.includes(d)),
    [allDatesInRange, excludedDates],
  );

  useEffect(() => {
    setExcludedDates(prev => prev.filter(d => allDatesInRange.includes(d)));
  }, [allDatesInRange]);

  const toggleDate = (date) => {
    setExcludedDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const addTimeSlot = () => {
    if (!newTime || newTime.length < 5) return;
    setTimeSlots(prev => (prev.includes(newTime) ? prev : [...prev, newTime].sort()));
    setNewTime('');
  };

  const removeTimeSlot = (t) => {
    setTimeSlots(prev => prev.filter(x => x !== t));
  };

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
    if (!startDate || !endDate) {
      alert("Vui lòng chọn khoảng ngày thi đấu.");
      return;
    }
    if (playableDates.length === 0) {
      alert("Không có ngày nào có thể đá trong khoảng đã chọn.");
      return;
    }
    if (timeSlots.length === 0) {
      alert("Vui lòng chọn ít nhất một khung giờ đá.");
      return;
    }

    setIsGenerating(true);

    const basePayload = {
      minRestDaysPerTeam: Number(formData.minRestDaysPerTeam),
      venueIds: selectedVenues.map(Number),
      matchTimes: timeSlots,
      startDate,
      endDate,
      playableDates,
    };

    if (hasDrawnGroups) {
      await onGenerateFromGroups(seasonId, { ...basePayload, doubleRound: false });
    } else {
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
              <p className="text-sm text-amber-200 bg-amber-950/60 p-3 rounded-lg border border-amber-500/40">
                Không kiểm tra được bảng đấu hiện có — mặc định coi như chưa có bảng. Nếu season đã bốc thăm
                bảng, hãy tải lại trang trước khi tạo lịch để tránh tạo trùng bảng.
              </p>
            )}

            {hasDrawnGroups ? (
              <div className="text-sm text-emerald-200 bg-emerald-950/60 p-3 rounded-lg border border-emerald-500/40">
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

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số ngày nghỉ tối thiểu / đội</label>
              <input
                type="number" min="0"
                name="minRestDaysPerTeam" value={formData.minRestDaysPerTeam} onChange={handleChange}
                className="w-full sm:w-64 px-4 py-2 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:border-neon outline-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> Khoảng ngày thi đấu
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] text-gray-500 font-bold uppercase">Bắt đầu</span>
                  <input
                    type="date" required
                    value={startDate}
                    max={endDate || undefined}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:border-neon outline-none scheme-dark"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-gray-500 font-bold uppercase">Kết thúc</span>
                  <input
                    type="date" required
                    value={endDate}
                    min={startDate || undefined}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:border-neon outline-none scheme-dark"
                  />
                </div>
              </div>

              {allDatesInRange.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-bold uppercase">
                      Bỏ chọn ngày không thể đá ({playableDates.length}/{allDatesInRange.length} ngày được chọn)
                    </span>
                    <button
                      type="button"
                      onClick={() => setExcludedDates(excludedDates.length === allDatesInRange.length ? [] : allDatesInRange)}
                      className="text-[11px] font-bold text-blue-400 hover:text-blue-300"
                    >
                      {excludedDates.length === allDatesInRange.length ? 'Chọn tất cả' : 'Bỏ chọn tất cả'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-navy-dark rounded-xl border border-navy-light custom-scrollbar">
                    {allDatesInRange.map(date => {
                      const isPlayable = !excludedDates.includes(date);
                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => toggleDate(date)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-black border transition-all ${isPlayable
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                            : 'bg-navy border-navy-light text-gray-600 line-through'
                            }`}
                        >
                          {formatDateChip(date)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Khung giờ đá — TimeField custom, không phụ thuộc OS locale */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> Khung giờ đá (giờ VN, 24h)
              </label>
              <div className="flex items-center gap-2">
                <TimeField value={newTime} onChange={setNewTime} />
                <button
                  type="button"
                  onClick={addTimeSlot}
                  disabled={!newTime || newTime.length < 5}
                  className="px-4 py-2.5 rounded-xl bg-navy-dark border border-navy-light text-emerald-400 hover:border-emerald-500/50 transition-all disabled:opacity-40 flex items-center gap-1.5 font-bold text-sm"
                >
                  <Plus className="w-4 h-4" /> Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {timeSlots.length === 0 ? (
                  <span className="text-xs text-gray-500 italic">Chưa có khung giờ nào — thêm ít nhất một khung giờ.</span>
                ) : (
                  timeSlots.map(t => (
                    <span key={t} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black bg-blue-500/10 border border-blue-500/30 text-blue-300">
                      {t}
                      <button type="button" onClick={() => removeTimeSlot(t)} className="text-blue-300/70 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

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

// ─── Component: Confirm Export Report Modal ───────────────────────────────
// Màn hình check trước khi xuất — fetch server-computed report preview
// (getMatchReportData) và hiện ĐÚNG shape của MatchReportOutput
// (types/matchReport.type.ts) — không đoán field flat như bản cũ.
//
// FIX so với bản trước:
// - Điểm số: đọc từ `preview.score.{home,away}Final` (nested), không phải
//   `preview.homeScore` (field không tồn tại -> luôn fallback stale prop).
// - Timeline bàn thắng: đọc từ `preview.goalsTimeline.{home,away}` (2 mảng
//   tách sẵn theo đội, mỗi entry có `playerName` — không phải `events`/
//   `scorers` phẳng có `teamId` như bản cũ đoán).
// - Đội hình (lineups): trước đây KHÔNG hiển thị gì — giờ render đủ từ
//   `preview.lineups.{home,away}` (đá chính/dự bị, số áo, tên, vị trí, biên
//   captain, số bàn/thẻ) — đây là phần bị thiếu khiến "không thấy tên cầu
//   thủ" vì trước đó preview không đọc đúng field nào chứa tên cả.
// - Logo trận đấu: dùng `preview.home.jersey.logoUrl` (áo thi đấu ĐÚNG trận
//   này, có thể khác logo CLB nếu trùng màu áo phải đổi) khi có, fallback
//   về logo CLB (`teams` store) nếu preview chưa tải xong / lỗi.
// - `isFinished` lấy từ `preview.status` (server, không stale) thay vì
//   `match.status` (prop FE có thể cũ nếu list season chưa refetch).
// - Chữ ký: PDF export có 3 khung ký (2 đội + trọng tài) — preview modal chỉ
//   là bản xem trước dữ liệu, không có ô ký thật (đó là khung để IN RA GIẤY
//   rồi ký tay), nên chỉ hiện dòng ghi chú xác nhận sẽ có khung ký trong PDF,
//   không giả lập ô ký tương tác vô nghĩa.
function ConfirmExportModal({ match, teams, isExporting, onClose, onConfirm }) {
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (!match?.id) return;
    let cancelled = false;
    (async () => {
      setPreviewLoading(true);
      setPreviewError(false);
      setPreview(null);
      try {
        const res = await matchApi.getMatchReportData(match.id);
        const payload = typeof res?.status === 'boolean' ? res.data : (res?.data ?? res);
        if (!cancelled) setPreview(payload);
      } catch (err) {
        console.error('[ConfirmExportModal] fetch report preview failed:', err);
        if (!cancelled) setPreviewError(true);
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [match?.id]);

  if (!match) return null;

  const fallbackHomeTeam = match.home_team || teams?.find(t => t.id === match.home_team_id);
  const fallbackAwayTeam = match.away_team || teams?.find(t => t.id === match.away_team_id);

  // Tên đội: ưu tiên preview (server-computed, luôn đúng), fallback prop FE.
  const homeName = preview?.home?.name ?? fallbackHomeTeam?.name ?? `Đội ${match.home_team_id}`;
  const awayName = preview?.away?.name ?? fallbackAwayTeam?.name ?? `Đội ${match.away_team_id}`;

  // Logo: ưu tiên áo thi đấu của ĐÚNG trận này (jersey.logoUrl), fallback
  // logo CLB chung khi preview chưa có / không set ảnh jersey.
  const homeLogo = preview?.home?.jersey?.logoUrl ?? fallbackHomeTeam?.logo;
  const awayLogo = preview?.away?.jersey?.logoUrl ?? fallbackAwayTeam?.logo;
  const homeColor = preview?.home?.jersey?.primaryColor;
  const awayColor = preview?.away?.jersey?.primaryColor;

  const scheduledLabel = match.scheduled_at
    ? new Date(match.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' })
    : 'Chưa xếp lịch';

  // status server-computed — không dùng match.status (prop FE có thể stale
  // nếu list season chưa refetch sau khi trận vừa finalize).
  const isFinished = preview?.status === MatchStatusFinished;

  const previewHomeScore = preview?.score?.homeFinal;
  const previewAwayScore = preview?.score?.awayFinal;
  const hasFinalScore = isFinished && previewHomeScore != null && previewAwayScore != null;

  const homeHalfTime = preview?.score?.homeHalfTime;
  const awayHalfTime = preview?.score?.awayHalfTime;

  // Gộp 2 mảng goalsTimeline.home/away thành 1 timeline có gắn `side`, sort
  // theo phút — mỗi entry đã có sẵn `playerName` từ BE, không cần lookup gì thêm.
  const mergedGoals = useMemo(() => {
    const home = (preview?.goalsTimeline?.home ?? []).map(e => ({ ...e, side: 'home' }));
    const away = (preview?.goalsTimeline?.away ?? []).map(e => ({ ...e, side: 'away' }));
    return [...home, ...away].sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0));
  }, [preview]);

  const homeLineup = preview?.lineups?.home ?? [];
  const awayLineup = preview?.lineups?.away ?? [];
  const hasLineupData = homeLineup.length > 0 || awayLineup.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-navy border border-navy-light rounded-3xl w-full max-w-2xl shadow-2xl animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-navy-dark border-b border-navy-light shrink-0">
          <h3 className="font-black text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" /> Xác Nhận Xuất Biên Bản
          </h3>
          <button onClick={onClose} disabled={isExporting} className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-40">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* ─── Logo + tên đội + tỉ số ─── */}
          <div className="flex items-center gap-2 justify-between">
            <div className="flex-1 text-center min-w-0">
              {homeLogo ? (
                <img src={homeLogo} alt={homeName} className="w-12 h-12 mx-auto rounded-xl object-contain bg-white mb-1.5 border border-emerald-500/30" />
              ) : (
                <div className="w-12 h-12 mx-auto rounded-xl bg-linear-to-br from-emerald-500/20 to-teal-900 flex items-center justify-center text-emerald-400 font-black mb-1.5 border border-emerald-500/30 text-lg">
                  {homeName[0]}
                </div>
              )}
              <p className="text-emerald-400 font-black text-sm truncate" title={homeName}>{homeName}</p>
            </div>

            <div className="shrink-0 px-2 text-center">
              {previewLoading ? (
                <Loader2 className="w-5 h-5 text-gray-500 animate-spin mx-auto" />
              ) : hasFinalScore ? (
                <>
                  <span className="text-white font-black text-2xl tabular-nums block">
                    {previewHomeScore} - {previewAwayScore}
                  </span>
                  {(homeHalfTime != null && awayHalfTime != null) && (
                    <span className="text-[11px] text-gray-500 font-bold">
                      Hiệp 1: {homeHalfTime} - {awayHalfTime}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-500 font-black text-xs">VS</span>
              )}
            </div>

            <div className="flex-1 text-center min-w-0">
              {awayLogo ? (
                <img src={awayLogo} alt={awayName} className="w-12 h-12 mx-auto rounded-xl object-contain bg-white mb-1.5 border border-blue-500/30" />
              ) : (
                <div className="w-12 h-12 mx-auto rounded-xl bg-linear-to-br from-blue-500/20 to-indigo-900 flex items-center justify-center text-blue-400 font-black mb-1.5 border border-blue-500/30 text-lg">
                  {awayName[0]}
                </div>
              )}
              <p className="text-blue-400 font-black text-sm truncate" title={awayName}>{awayName}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4 text-gray-500 shrink-0" /> {scheduledLabel}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-gray-500 shrink-0" /> {preview?.venueName ?? match.venue?.name ?? 'Chưa xếp sân'}
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={preview?.status ?? match.status} />
            </div>
          </div>

          {/* ─── Timeline bàn thắng ─── */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bàn thắng</label>
            {previewLoading ? (
              <div className="flex items-center gap-2 text-xs text-gray-500 p-3 bg-navy-dark rounded-lg border border-navy-light">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tải preview từ server...
              </div>
            ) : previewError ? (
              <div className="flex items-start gap-2 text-xs text-amber-200 bg-amber-950/60 p-3 rounded-lg border border-amber-500/40">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Không tải được preview chi tiết (đội hình/sự kiện). Vẫn có thể xuất PDF — server sẽ tự tính lại report lúc export.</span>
              </div>
            ) : mergedGoals.length === 0 ? (
              <p className="text-xs text-gray-500 italic p-3 bg-navy-dark rounded-lg border border-navy-light">Chưa có bàn thắng nào được ghi nhận.</p>
            ) : (
              <div className="space-y-1.5 p-3 bg-navy-dark rounded-lg border border-navy-light max-h-40 overflow-y-auto custom-scrollbar">
                {mergedGoals.map((ev, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-10 shrink-0 text-gray-500 font-bold tabular-nums">
                      {ev.minute ?? '-'}{ev.addedMinute ? `+${ev.addedMinute}` : ''}'
                    </span>
                    <span className={`shrink-0 font-black ${ev.side === 'home' ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {ev.side === 'home' ? homeName : awayName}
                    </span>
                    <span className="text-gray-400 truncate">
                      {ev.playerName}{ev.isOwnGoal ? ' (phản lưới nhà)' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Đội hình ─── */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Đội hình
            </label>
            {previewLoading ? (
              <div className="flex items-center gap-2 text-xs text-gray-500 p-3 bg-navy-dark rounded-lg border border-navy-light">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tải đội hình...
              </div>
            ) : previewError ? (
              <p className="text-xs text-gray-500 italic p-3 bg-navy-dark rounded-lg border border-navy-light">
                Không tải được đội hình — sẽ được tính lại đầy đủ khi xuất PDF.
              </p>
            ) : !hasLineupData ? (
              <p className="text-xs text-gray-500 italic p-3 bg-navy-dark rounded-lg border border-navy-light">
                Chưa có đội hình được ghi nhận cho trận này.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <LineupColumn title={homeName} color={homeColor} rows={homeLineup} />
                <LineupColumn title={awayName} color={awayColor} rows={awayLineup} />
              </div>
            )}
          </div>

          {!isFinished && !previewLoading && (
            <div className="flex items-start gap-2 text-sm text-amber-200 bg-amber-950/60 p-3 rounded-lg border border-amber-500/40">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Trận đấu chưa ở trạng thái kết thúc. Biên bản xuất ra có thể chưa đầy đủ tỉ số / sự kiện cuối cùng.</span>
            </div>
          )}

          {isFinished && !hasFinalScore && !previewLoading && (
            <div className="flex items-start gap-2 text-sm text-amber-200 bg-amber-950/60 p-3 rounded-lg border border-amber-500/40">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Không tìm thấy tỉ số cuối cùng cho trận đấu này.</span>
            </div>
          )}

          {/* ─── Ghi chú khung ký ─── */}
          <div className="flex items-start gap-2 text-sm text-gray-400">
            <PenLine className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            <span>File PDF sẽ có khung chữ ký cho đại diện hai đội và trọng tài để ký tay sau khi in.</span>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Vui lòng kiểm tra lại thông tin trận đấu trước khi xuất. File PDF sẽ được tải xuống ngay sau khi xác nhận.</span>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isExporting} className="px-5 py-2.5 rounded-xl border border-navy-light text-gray-400 hover:text-white font-bold text-sm transition-colors disabled:opacity-50">
              Hủy
            </button>
            <button
              type="button"
              onClick={() => onConfirm(match.id)}
              disabled={isExporting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              Xác nhận xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Match.status enum value cho "finished" — tách hằng số để không gõ nhầm
// chuỗi ở nhiều chỗ (preview?.status so sánh với string literal).
const MatchStatusFinished = 'finished';

// Cột đội hình 1 đội — hiển thị đá chính trước, dự bị sau, kèm số áo, biên
// captain, và badge số bàn/thẻ nếu có (đọc thẳng từ MatchReportPlayerRow,
// field đã build sẵn ở BE: goals/ownGoals/yellowCards/redCards là mảng).
function LineupColumn({ title, color, rows }) {
  const starters = rows.filter(r => r.isStarting);
  const subs = rows.filter(r => !r.isStarting);

  const renderRow = (p) => (
    <div key={p.playerId} className="flex items-center gap-2 text-xs py-1 border-b border-navy-light/50 last:border-0">
      <span className="w-6 shrink-0 text-center font-black text-gray-400 tabular-nums">{p.jerseyNumber ?? '-'}</span>
      <span className="flex-1 min-w-0 truncate text-white font-bold">
        {p.fullName}{p.isCaptain ? ' (C)' : ''}
      </span>
      <span className="shrink-0 flex items-center gap-1 text-[10px] text-gray-500 font-bold">
        {p.goals?.length > 0 && <span className="text-emerald-400">⚽{p.goals.length}</span>}
        {p.ownGoals?.length > 0 && <span className="text-red-400">OG{p.ownGoals.length}</span>}
        {p.yellowCards?.length > 0 && <span className="text-yellow-400">🟨{p.yellowCards.length}</span>}
        {p.redCards?.length > 0 && <span className="text-red-500">🟥{p.redCards.length}</span>}
      </span>
    </div>
  );

  return (
    <div className="p-3 bg-navy-dark rounded-lg border border-navy-light">
      <div className="flex items-center gap-2 mb-2">
        {color && <span className="w-3 h-3 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: color }} />}
        <p className="font-black text-white text-xs truncate">{title}</p>
      </div>
      {starters.length === 0 && subs.length === 0 ? (
        <p className="text-[11px] text-gray-500 italic">Chưa có cầu thủ nào.</p>
      ) : (
        <>
          {starters.length > 0 && (
            <div className="mb-1.5">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Đá chính</span>
              {starters.map(renderRow)}
            </div>
          )}
          {subs.length > 0 && (
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase">Dự bị</span>
              {subs.map(renderRow)}
            </div>
          )}
        </>
      )}
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
  const [rescheduleMatchData, setRescheduleMatchData] = useState(null);

  // Màn check trước khi xuất PDF — giữ match object đang chờ admin xác nhận.
  const [confirmExportMatch, setConfirmExportMatch] = useState(null);
  // matchId đang thực sự gọi API tải PDF (để disable nút + hiện spinner đúng trận).
  const [exportingMatchId, setExportingMatchId] = useState(null);

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
    list = list.filter(m => (m.phase?.format ?? m.phaseFormat) !== 'knockout');
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

  // Bước xác nhận: chỉ mở modal check, CHƯA gọi API.
  const handleRequestExportMatchReport = (match) => {
    setConfirmExportMatch(match);
  };

  // Admin đã bấm "Xác nhận xuất" trong modal -> mới thực sự tải PDF.
  const handleConfirmExportMatchReport = async (matchId) => {
    setExportingMatchId(matchId);
    try {
      const res = await matchApi.getMatchReport(matchId);
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
      if (!blob.size) throw new Error('Empty response');
      const filename = extractFilename(res?.headers?.['content-disposition'], `BienBanTranDau_${matchId}.pdf`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = filename;
      document.body.appendChild(link); link.click(); link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Đã xuất biên bản trận đấu.');
      setConfirmExportMatch(null);
    } catch (err) {
      console.error('Lỗi khi xuất biên bản:', err);
      toast.error('Không thể tải biên bản trận đấu.');
    } finally {
      setExportingMatchId(null);
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in">
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
                const isExportingThis = exportingMatchId === m.id;
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
                        {m.scheduled_at ? new Date(m.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }) : 'Chưa xếp lịch'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium truncate mb-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="truncate">{m.venue?.name ?? 'Chưa xếp sân'}</span>
                      </div>
                      <div className="flex gap-2 w-full mt-2">
                        <button
                          onClick={() => handleRequestExportMatchReport(m)}
                          disabled={isExportingThis}
                          className="flex-1 py-2 bg-navy-dark hover:bg-navy-light border border-navy-light rounded-xl text-blue-400 font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isExportingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                          Xuất Biên bản
                        </button>
                        <button
                          onClick={() => onGoToLiveControl(m.id)}
                          className="flex-1 py-2 bg-navy-dark hover:bg-navy-light border border-navy-light rounded-xl text-emerald-400 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <Zap className="w-4 h-4" /> Cập nhật
                        </button>
                      </div>
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

      {confirmExportMatch && createPortal(
        <ConfirmExportModal
          match={confirmExportMatch}
          teams={teams}
          isExporting={exportingMatchId === confirmExportMatch.id}
          onClose={() => setConfirmExportMatch(null)}
          onConfirm={handleConfirmExportMatchReport}
        />,
        document.body
      )}
    </>
  );
}