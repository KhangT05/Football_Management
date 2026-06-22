import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Save, CheckCircle2, Plus, Trash2, Clock, Activity,
  Loader2, AlertTriangle, RefreshCw, Construction
} from 'lucide-react';
import { matchApi, teamApi } from '../../api';
import useToastStore from '../../store/toastStore';

// ─── Goal Event Card ──────────────────────────────────────
function GoalCard({ evt, players, onUpdate, onRemove }) {
  return (
    <div className="flex flex-col gap-2 p-3 bg-navy-dark rounded-xl border border-navy-light relative group">
      <button
        onClick={() => onRemove(evt.id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-navy border border-red-500/40 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/10 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
        title="Xóa bàn thắng"
      >
        <Trash2 className="w-3 h-3" />
      </button>

      <select
        value={evt.player}
        onChange={e => onUpdate(evt.id, 'player', e.target.value)}
        className="w-full text-xs p-2 bg-navy border border-navy-light rounded-lg text-white outline-none focus:border-neon"
      >
        <option value="">Chọn cầu thủ...</option>
        {players.map(p => (
          <option key={p.id} value={String(p.id)}>
            {p.name || p.player?.name} ({p.jersey_number ?? p.number ?? '?'})
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-500 shrink-0" />
        <input
          type="number"
          min="1" max="120"
          placeholder="Phút"
          value={evt.minute}
          onChange={e => onUpdate(evt.id, 'minute', e.target.value)}
          className="w-full text-xs p-2 bg-navy border border-navy-light rounded-lg text-white outline-none text-center font-bold focus:border-neon"
        />
        <span className="text-gray-500 text-xs shrink-0">'</span>
      </div>
    </div>
  );
}

export default function UpdateResults() {
  const toast = useToastStore();

  // ── Load matches từ API ────────────────────────────────
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [matchApiError, setMatchApiError] = useState(null);

  useEffect(() => {
    matchApi.getMatches({ status: 'scheduled,ongoing', per_page: 50 })
      .then(res => {
        const payload = (typeof res?.status === 'boolean') ? res.data : res;
        setMatches(Array.isArray(payload?.data) ? payload.data : []);
        setMatchApiError(null);
      })
      .catch(err => {
        setMatchApiError(err?.response?.data?.message || 'Match API chưa khả dụng.');
        setMatches([]);
      })
      .finally(() => setLoadingMatches(false));
  }, []);

  // selectedMatchId: khởi tạo rỗng, tự động chọn match đầu tiên qua useMemo
  const [selectedMatchId, setSelectedMatchId] = useState('');

  // Derive match đang chọn: nếu chưa chọn hoặc không tìm thấy thì lấy match đầu tiên
  const selectedMatch = useMemo(() => {
    if (matches.length === 0) return null;
    return matches.find(m => String(m.id) === String(selectedMatchId)) ?? matches[0];
  }, [matches, selectedMatchId]);

  // ── Load players theo match đã chọn ───────────────────
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  useEffect(() => {
    if (!selectedMatch) return;
    let cancelled = false;

    const parsePlayers = (res) => {
      const payload = (typeof res?.status === 'boolean') ? res.data : res;
      return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    };

    // Reset và fetch players đồng thời — setState chỉ gọi bên trong callback async
    Promise.allSettled([
      teamApi.getPlayers(selectedMatch.home_team_id, { per_page: 50 }),
      teamApi.getPlayers(selectedMatch.away_team_id, { per_page: 50 }),
    ]).then(([homeRes, awayRes]) => {
      if (cancelled) return;
      setHomePlayers(homeRes.status === 'fulfilled' ? parsePlayers(homeRes.value) : []);
      setAwayPlayers(awayRes.status === 'fulfilled' ? parsePlayers(awayRes.value) : []);
    });

    return () => { cancelled = true; };
  }, [selectedMatchId]); // eslint-disable-line react-hooks/exhaustive-deps

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [homeEvents, setHomeEvents] = useState([]);
  const [awayEvents, setAwayEvents] = useState([]);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleMatchChange = (e) => {
    setSelectedMatchId(e.target.value);
    setHomeScore(0);
    setAwayScore(0);
    setHomeEvents([]);
    setAwayEvents([]);
    setIsDirty(false);
  };

  const handleScoreChange = (side, val) => {
    const n = Math.max(0, parseInt(val) || 0);
    if (side === 'home') setHomeScore(n);
    else setAwayScore(n);
    setIsDirty(true);
  };

  const addEvent = (side) => {
    const newEvt = { id: Date.now(), player: '', minute: '' };
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
    const updater = evts => evts.map(e => e.id === id ? { ...e, [field]: value } : e);
    if (side === 'home') setHomeEvents(updater);
    else setAwayEvents(updater);
    setIsDirty(true);
  };

  const validate = () => {
    const homeGoalEvts = homeEvents.filter(e => e.player && e.minute);
    const awayGoalEvts = awayEvents.filter(e => e.player && e.minute);
    if (homeGoalEvts.length !== homeScore) {
      return `Đội nhà có ${homeScore} bàn nhưng chỉ có ${homeGoalEvts.length} sự kiện bàn thắng được điền đủ.`;
    }
    if (awayGoalEvts.length !== awayScore) {
      return `Đội khách có ${awayScore} bàn nhưng chỉ có ${awayGoalEvts.length} sự kiện bàn thắng được điền đủ.`;
    }
    return '';
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    await new Promise(r => setTimeout(r, 400));
    setIsSavingDraft(false);
    setIsDirty(false);
    toast.info('Đã lưu nháp. Kết quả chưa được công bố công khai.');
  };

  const handlePublish = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setIsPublishing(true);
    // TODO: Gọi matchApi.update(selectedMatch.id, { home_score, away_score, events })
    // khi backend triển khai endpoint update kết quả
    await new Promise(r => setTimeout(r, 600));
    setIsPublishing(false);
    setIsDirty(false);
    toast.success('Đã cập nhật kết quả thành công! 🎉', 5000);
  };

  const handleReset = () => {
    setHomeScore(0);
    setAwayScore(0);
    setHomeEvents([]);
    setAwayEvents([]);
    setIsDirty(false);
    toast.info('Đã đặt lại form.');
  };

  // Lấy tên đội từ match object (nếu có relation) hoặc fallback
  const getHomeName = () => selectedMatch?.home_team?.name ?? `Đội ${selectedMatch?.home_team_id ?? ''}`;
  const getAwayName = () => selectedMatch?.away_team?.name ?? `Đội ${selectedMatch?.away_team_id ?? ''}`;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-neon" /> Cập nhật Kết Quả
            </h2>
            <p className="text-gray-400 text-sm mt-1">Nhập tỷ số và diễn biến bàn thắng cho từng trận đấu.</p>
          </div>
          {isDirty && (
            <div className="flex items-center gap-2 text-amber-400 text-sm font-bold bg-amber-400/10 border border-amber-400/30 px-4 py-2 rounded-xl animate-fade-in">
              <AlertTriangle className="w-4 h-4" /> Có thay đổi chưa lưu
            </div>
          )}
        </div>

        {/* Match API Error Banner */}
        {matchApiError && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-4">
            <Construction className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-400 mb-1">Tính năng đang phát triển</p>
              <p className="text-sm text-gray-400">
                Match Controller chưa được triển khai ở backend. Trang này sẽ hoạt động đầy đủ sau khi backend hoàn thiện API trận đấu.
              </p>
              <p className="text-xs text-gray-600 mt-1">Lỗi: {matchApiError}</p>
            </div>
          </div>
        )}

        {/* Match Selector */}
        <div className="bg-navy p-5 rounded-2xl border border-navy-light shadow-lg shadow-black/20">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Chọn trận đấu cần cập nhật</label>
          {loadingMatches ? (
            <div className="skeleton h-12 rounded-xl" />
          ) : matches.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              {matchApiError ? 'Không thể tải danh sách trận đấu.' : 'Không có trận đấu nào đang diễn ra.'}
            </div>
          ) : (
            <select
              className="w-full text-base p-3 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:outline-none focus:border-neon transition-colors"
              value={selectedMatchId}
              onChange={handleMatchChange}
            >
              {matches.map(m => (
                <option key={m.id} value={m.id}>
                  {m.home_team?.name ?? `Đội #${m.home_team_id}`} vs {m.away_team?.name ?? `Đội #${m.away_team_id}`}
                  {m.scheduled_at ? ` — [${new Date(m.scheduled_at).toLocaleDateString('vi-VN')}]` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Score Editor — chỉ hiện khi có match */}
        {selectedMatch && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Home Goals Column */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="bg-navy p-4 rounded-2xl border border-navy-light shadow-lg shadow-black/20 h-full">
                <div className="flex items-center justify-between border-b border-navy-light pb-3 mb-4">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
                    ⚽ Bàn thắng – {getHomeName()}
                    <span className="ml-1 bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-normal">{homeEvents.length}</span>
                  </h3>
                  <button
                    onClick={() => addEvent('home')}
                    className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg transition-colors"
                    title="Thêm bàn thắng"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {homeEvents.map(evt => (
                    <GoalCard
                      key={evt.id}
                      evt={evt}
                      players={homePlayers}
                      onUpdate={(id, f, v) => updateEvent('home', id, f, v)}
                      onRemove={(id) => removeEvent('home', id)}
                    />
                  ))}
                  {homeEvents.length === 0 && (
                    <p className="text-xs text-center text-gray-500 italic py-6">
                      Chưa có bàn thắng nào. Nhấn <strong className="text-gray-400">+</strong> để thêm.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Central Scoreboard */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="bg-navy p-6 md:p-8 rounded-3xl border border-navy-light shadow-xl h-full flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-blue-500 via-emerald-400 to-amber-400 rounded-t-3xl" />

                <div className="text-center mb-6">
                  <span className="bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
                    {selectedMatch.scheduled_at
                      ? new Date(selectedMatch.scheduled_at).toLocaleDateString('vi-VN', { dateStyle: 'medium' })
                      : 'Chưa có ngày'
                    }
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-6">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 border-navy-light bg-linear-to-br from-blue-600 to-cyan-700 flex items-center justify-center text-white font-black text-xl sm:text-2xl mb-3 shadow-inner">
                      {getHomeName()[0]}
                    </div>
                    <h3 className="font-extrabold text-white text-center uppercase tracking-wider text-xs sm:text-sm line-clamp-2">
                      {getHomeName()}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number" min="0" max="99"
                      value={homeScore}
                      onChange={e => handleScoreChange('home', e.target.value)}
                      className="w-14 h-16 sm:w-20 sm:h-24 text-center text-3xl sm:text-5xl font-black bg-navy-dark border-2 border-navy-light rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-white shadow-inner"
                    />
                    <span className="text-2xl font-black text-gray-500">–</span>
                    <input
                      type="number" min="0" max="99"
                      value={awayScore}
                      onChange={e => handleScoreChange('away', e.target.value)}
                      className="w-14 h-16 sm:w-20 sm:h-24 text-center text-3xl sm:text-5xl font-black bg-navy-dark border-2 border-navy-light rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-white shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col items-center flex-1">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 border-navy-light bg-linear-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white font-black text-xl sm:text-2xl mb-3 shadow-inner">
                      {getAwayName()[0]}
                    </div>
                    <h3 className="font-extrabold text-white text-center uppercase tracking-wider text-xs sm:text-sm line-clamp-2">
                      {getAwayName()}
                    </h3>
                  </div>
                </div>

                <div className="mt-6 text-center text-xs text-gray-500">
                  Sự kiện: <strong className="text-emerald-400">{homeEvents.length}</strong> – <strong className="text-amber-400">{awayEvents.length}</strong>
                  {(homeEvents.length !== homeScore || awayEvents.length !== awayScore) && (
                    <div className="text-amber-400 mt-1 font-semibold">⚠ Số bàn thắng chưa khớp với sự kiện</div>
                  )}
                </div>

                <button
                  onClick={handleReset}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-navy-dark text-gray-400 hover:text-white border border-navy-light rounded-xl text-sm font-bold hover:bg-navy-light transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Đặt lại
                </button>
              </div>
            </div>

            {/* Away Goals Column */}
            <div className="lg:col-span-4 order-3">
              <div className="bg-navy p-4 rounded-2xl border border-navy-light shadow-lg shadow-black/20 h-full">
                <div className="flex items-center justify-between border-b border-navy-light pb-3 mb-4">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
                    ⚽ Bàn thắng – {getAwayName()}
                    <span className="ml-1 bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-normal">{awayEvents.length}</span>
                  </h3>
                  <button
                    onClick={() => addEvent('away')}
                    className="p-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 rounded-lg transition-colors"
                    title="Thêm bàn thắng"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {awayEvents.map(evt => (
                    <GoalCard
                      key={evt.id}
                      evt={evt}
                      players={awayPlayers}
                      onUpdate={(id, f, v) => updateEvent('away', id, f, v)}
                      onRemove={(id) => removeEvent('away', id)}
                    />
                  ))}
                  {awayEvents.length === 0 && (
                    <p className="text-xs text-center text-gray-500 italic py-6">
                      Chưa có bàn thắng nào. Nhấn <strong className="text-gray-400">+</strong> để thêm.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {selectedMatch && (
          <div className="bg-navy p-5 rounded-2xl border border-navy-light shadow-lg shadow-black/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-gray-400 text-center sm:text-left">
              Kiểm tra kỹ tỷ số và sự kiện bàn thắng trước khi công bố công khai.
            </p>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={isSavingDraft || !isDirty}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-navy-dark hover:bg-navy-light border border-navy-light text-gray-300 hover:text-white font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSavingDraft ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Lưu Nháp
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-wider"
              >
                {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Xác nhận & Cập nhật BXH
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
