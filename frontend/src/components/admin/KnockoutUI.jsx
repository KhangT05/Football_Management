import { useState, useEffect } from 'react';
import { Trophy, AlertTriangle, Loader2, X, Plus, CalendarClock, Zap, Info } from 'lucide-react';
import { createPortal } from 'react-dom';
import { knockoutApi, seasonApi, seasonTeamApi } from '../../api';
import useToastStore from '../../store/toastStore';
import useVenueStore from '../../store/venueStore';
import useTeamStore from '../../store/teamStore';
import { useShallow } from 'zustand/react/shallow';
import { BTN_PRIMARY } from '../../utils/adminStyles';
import BracketView from './BracketView';

const TIME_INPUT_CLASS =
  'px-3 py-2 bg-navy-dark border border-navy-light rounded-lg text-white text-sm ' +
  'focus:outline-none focus:border-amber-500 scheme-dark cursor-pointer';

const SELECT_INPUT_CLASS =
  'px-3 py-2 bg-navy-dark border border-navy-light rounded-lg text-white text-sm ' +
  'focus:outline-none focus:border-amber-500';

// Khớp helper.match.helper.ts::nextPowerOf2 phía BE — dùng để PREVIEW
// bracket size / số bye cho user trước khi submit, KHÔNG dùng để chặn submit
// (validation thật nằm ở BE, xem generateKnockoutBracket()._buildBracketInPhase).
function nextPowerOf2(n) {
  if (n < 1) return 1;
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

function ScheduleBracketModal({ phaseId, venues, onClose, onScheduled }) {
  const toast = useToastStore();
  const [venueIds, setVenueIds] = useState([]);
  const [matchTimes, setMatchTimes] = useState([]);
  const [timeInput, setTimeInput] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const addTimeSlot = () => {
    if (!timeInput) return;
    if (matchTimes.includes(timeInput)) return toast.error('Giờ này đã được thêm');
    setMatchTimes(prev => [...prev, timeInput].sort());
    setTimeInput('');
  };

  const removeTimeSlot = (t) => setMatchTimes(prev => prev.filter(x => x !== t));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (venueIds.length === 0) return toast.error('Chọn ít nhất 1 sân đấu');
    if (matchTimes.length === 0) return toast.error('Thêm ít nhất 1 khung giờ');
    if (dateRangeStart && dateRangeEnd && dateRangeStart > dateRangeEnd) {
      return toast.error('Ngày bắt đầu phải trước ngày kết thúc');
    }

    setSubmitting(true);
    try {
      const payload = { venueIds, matchTimes };
      if (dateRangeStart) payload.dateRangeStart = dateRangeStart;
      if (dateRangeEnd) payload.dateRangeEnd = dateRangeEnd;

      const res = await knockoutApi.scheduleBracket(phaseId, payload);
      const result = typeof res?.status === 'boolean' ? res.data : res;
      toast.success(`Đã xếp lịch ${result?.scheduledCount ?? ''} trận`.trim());
      onScheduled();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Lỗi xếp lịch knockout');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-navy border border-navy-light rounded-3xl w-full max-w-lg shadow-2xl animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-navy-dark border-b border-navy-light shrink-0">
          <h3 className="font-black text-white uppercase tracking-wider flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-amber-400" /> Xếp Lịch Knockout
          </h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <p className="text-xs text-gray-500">
            Trận đã xếp lịch trước đó sẽ giữ nguyên, không bị ghi đè — có thể bấm xếp lịch nhiều lần an toàn.
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Giờ thi đấu</label>
            <div className="flex gap-2 mb-2">
              <input
                type="time"
                value={timeInput}
                onChange={e => setTimeInput(e.target.value)}
                className={`${TIME_INPUT_CLASS} flex-1`}
              />
              <button
                type="button"
                onClick={addTimeSlot}
                className="px-3 rounded-lg bg-navy-dark border border-navy-light text-gray-300 hover:text-white hover:border-amber-500"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {matchTimes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {matchTimes.map(t => (
                  <span key={t} className="flex items-center gap-1 bg-navy-dark border border-navy-light rounded-full px-3 py-1 text-xs text-gray-300">
                    {t}
                    <button type="button" onClick={() => removeTimeSlot(t)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">Sân thi đấu</label>
            <div className="bg-navy-dark border border-navy-light rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
              {venues.length === 0 && <p className="text-gray-500 text-xs">Không có sân nào.</p>}
              {venues.map(v => (
                <label key={v.id} className="flex items-center gap-2 cursor-pointer hover:bg-navy p-1 rounded">
                  <input
                    type="checkbox"
                    className="accent-amber-500 w-4 h-4"
                    checked={venueIds.includes(v.id)}
                    onChange={(e) => {
                      if (e.target.checked) setVenueIds(prev => [...prev, v.id]);
                      else setVenueIds(prev => prev.filter(id => id !== v.id));
                    }}
                  />
                  <span className="text-sm text-gray-300">{v.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">
                Từ ngày <span className="text-gray-600">(mặc định = season)</span>
              </label>
              <input
                type="date"
                value={dateRangeStart}
                onChange={e => setDateRangeStart(e.target.value)}
                className={`${SELECT_INPUT_CLASS} w-full scheme-dark`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">
                Đến ngày <span className="text-gray-600">(mặc định = season)</span>
              </label>
              <input
                type="date"
                value={dateRangeEnd}
                onChange={e => setDateRangeEnd(e.target.value)}
                className={`${SELECT_INPUT_CLASS} w-full scheme-dark`}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-navy-light">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-navy-light text-gray-400 hover:text-white font-bold text-sm">
              Đóng
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Xếp lịch
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default function KnockoutUI({ seasonId }) {
  const toast = useToastStore();
  const { venues, fetchAll: fetchVenues } = useVenueStore();
  const { teams } = useTeamStore(useShallow(state => ({ teams: state.teams })));

  const [seedMode, setSeedMode] = useState('manual');

  const [seededTeamIds, setSeededTeamIds] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);

  const [availableGroups, setAvailableGroups] = useState([]);
  const [groupConfigs, setGroupConfigs] = useState([]);

  const [legs, setLegs] = useState(1);
  const [generating, setGenerating] = useState(false);

  const [availablePhases, setAvailablePhases] = useState([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState('');
  const [bracketData, setBracketData] = useState(null);
  const [loadingBracket, setLoadingBracket] = useState(false);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  // Chỉ còn trách nhiệm knockout phases. Groups derive từ seasonTeams
  // (xem fetchData bên dưới) — season.getById không nested groups per phase.
  const refreshPhases = async () => {
    const res = await seasonApi.getById(seasonId);
    const seasonRes = typeof res?.status === 'boolean' ? res.data : res;
    const phases = seasonRes?.phases ?? [];
    const knockoutPhases = phases.filter(p => p.format === 'knockout');
    setAvailablePhases(knockoutPhases);
    return knockoutPhases;
  };

  // FIX: SeasonTeam.group_id trỏ thẳng Group (schema), nên groups derive
  // trực tiếp từ seasonTeams đã fetch, không cần call thêm endpoint nào.
  // Trước đó group data hoặc không được đọc (season.getById không có nested
  // groups), hoặc phải đi qua getStandings/groupApi (N+1, sai domain).
  const deriveGroupsFromSeasonTeams = (seasonTeams) => {
    const groupMap = new Map();
    seasonTeams.forEach(st => {
      if (st.group_id == null) return; // team chưa gán bảng -> không phải seed candidate cho standing mode
      if (!groupMap.has(st.group_id)) {
        // ASSUMPTION: seasonTeamApi.getAll include st.group (name). Nếu
        // withRelations không include group, fallback "Bảng {id}" vẫn chạy
        // được, chỉ mất label đẹp — verify bằng console.log(seasonTeams[0]).
        groupMap.set(st.group_id, {
          id: st.group_id,
          name: st.group?.name ?? `Bảng ${st.group_id}`,
        });
      }
    });
    return Array.from(groupMap.values());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const knockoutPhases = await refreshPhases();
        if (knockoutPhases.length === 1) setSelectedPhaseId(knockoutPhases[0].id);

        const teamRes = await seasonTeamApi.getAll({ season_id: seasonId, per_page: 500 });
        const allTeams = typeof teamRes?.status === 'boolean' ? teamRes.data : teamRes;
        const seasonTeams = (Array.isArray(allTeams?.data) ? allTeams.data : [])
          .filter(st => String(st.season_id) === String(seasonId) && st.status === 'approved');

        setAvailableTeams(seasonTeams);
        setAvailableGroups(deriveGroupsFromSeasonTeams(seasonTeams));
      } catch (err) {
        console.error('Error fetching knockout data:', err);
      }
    };
    if (seasonId) fetchData();
  }, [seasonId]);

  // FIX: KnockoutService.getBracket() trả THẲNG một mảng BracketSlotNode[]
  // (slotId, round, slotNumber, matchId, isBye, seededHomeTeamId,
  // seededAwayTeamId, sourceASlotId, sourceBSlotId) — KHÔNG có field
  // `.matches`, và mỗi node cũng KHÔNG có `scheduled_at`. Trước đây code
  // set bracketData = payload (mảng) rồi lại đọc bracketData?.matches ở
  // chỗ khác -> luôn undefined -> unscheduledCount luôn = 0 -> nút "Xếp
  // lịch" không bao giờ hiện dù bracket vừa tạo chưa có sân/giờ.
  // Không có scheduled_at trong response nên KHÔNG thể tính chính xác số
  // trận "chưa xếp lịch" ở client. Giải pháp đúng: đếm số slot round 1
  // không phải bye (đây là các trận thực sự cần xếp lịch khi vừa generate),
  // và luôn cho phép mở modal xếp lịch — backend tự bỏ qua trận đã có lịch
  // (xem comment "không bị ghi đè" trong modal).
  const fetchBracket = async (phaseId) => {
    if (!phaseId) return;
    setLoadingBracket(true);
    try {
      const res = await knockoutApi.getBracket(phaseId);
      const payload = typeof res?.status === 'boolean' ? res.data : res;
      setBracketData(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.log('Chưa có bracket hoặc lỗi:', err);
      setBracketData(null);
    } finally {
      setLoadingBracket(false);
    }
  };

  useEffect(() => {
    if (selectedPhaseId) fetchBracket(selectedPhaseId);
  }, [selectedPhaseId]);

  const buildStandingSeeds = (configs) => {
    const maxTopN = Math.max(0, ...configs.map(c => c.topN));
    const seeds = [];
    for (let rank = 1; rank <= maxTopN; rank++) {
      for (const c of configs) {
        if (rank <= c.topN) seeds.push({ kind: 'standing', groupId: c.groupId, rank });
      }
    }
    return seeds;
  };

  const moveGroupConfig = (groupId, dir) => {
    setGroupConfigs(prev => {
      const i = prev.findIndex(c => c.groupId === groupId);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const handleGenerate = async () => {
    const seeds = seedMode === 'manual'
      ? seededTeamIds.map(teamId => ({ kind: 'manual', teamId }))
      : buildStandingSeeds(groupConfigs);

    // FIX: bỏ chặn "seeds.length phải nằm trong [2,4,8,16]". Service thật
    // (generateKnockoutBracket -> _buildBracketInPhase) tự tính
    // nextPowerOf2(seeds.length) và tự tạo bye slot cho phần dư — nghĩa là
    // 3, 5, 6, 7, 9..15 đội... đều hợp lệ, không cần đúng luỹ thừa 2. Chặn
    // cứng như cũ chặn nhầm rất nhiều trường hợp hợp lệ. Chỉ cần seeds >= 2;
    // nếu size sau khi làm tròn không map được PhaseType (vd quá lớn), BE
    // sẽ trả VALIDATION_ERROR rõ ràng và mình hiện toast.error như cũ.
    if (seeds.length < 2) return toast.error('Cần ít nhất 2 seed');

    setGenerating(true);
    try {
      const payload = { seeds, legs: Number(legs) };
      const res = await knockoutApi.generateBracket(seasonId, payload);

      const result = typeof res?.status === 'boolean' ? res.data : res;
      const newPhaseId = result?.phaseId;

      toast.success(`Đã tạo sơ đồ Knockout — ${result?.round1Matches} trận, ${result?.byeSlots} bye`);

      if (result?.warnings?.length) {
        result.warnings.forEach(w => {
          if (toast.info) toast.info(w);
          else if (toast.warning) toast.warning(w);
          else console.warn('[Knockout warning]', w);
        });
      }

      if (newPhaseId) {
        await refreshPhases();
        setSelectedPhaseId(newPhaseId);
        fetchBracket(newPhaseId);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Lỗi tạo knockout');
    } finally {
      setGenerating(false);
    }
  };

  const currentSeedCount = seedMode === 'manual'
    ? seededTeamIds.length
    : buildStandingSeeds(groupConfigs).length;

  // Preview thuần client-side để user thấy trước bracket sẽ to cỡ nào /
  // có bao nhiêu bye — KHÔNG dùng để chặn submit (xem comment handleGenerate).
  const previewBracketSize = currentSeedCount >= 2 ? nextPowerOf2(currentSeedCount) : null;
  const previewByeCount = previewBracketSize ? previewBracketSize - currentSeedCount : 0;

  // FIX: bracketData giờ là mảng slot thô (đúng shape getBracket() trả về).
  // Không có scheduled_at nên đếm "trận thật sự tồn tại trong round 1, không
  // phải bye" làm số hiển thị trên nút — không khẳng định là "chưa xếp lịch"
  // 100% chính xác (vì có thể đã xếp ở lần trước), chỉ để user biết có trận
  // cần kiểm tra lịch. Modal xếp lịch tự bỏ qua trận đã có sân/giờ.
  const round1MatchCount = Array.isArray(bracketData)
    ? bracketData.filter(s => s.round === 1 && !s.isBye && s.matchId).length
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-navy border border-navy-light p-5 rounded-2xl shadow-xl shadow-black/20">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" /> Tạo Vòng Loại Trực Tiếp (Knockout)
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Bước này chỉ sinh cấu trúc cặp đấu (seed → bracket). Xếp sân/giờ thi đấu là bước riêng, thực hiện
          sau khi bracket đã được tạo.
        </p>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setSeedMode('manual')}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${seedMode === 'manual' ? 'bg-amber-600 text-white' : 'bg-navy-dark text-gray-400'}`}
          >
            Chọn thủ công
          </button>
          <button
            type="button"
            onClick={() => setSeedMode('standing')}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${seedMode === 'standing' ? 'bg-amber-600 text-white' : 'bg-navy-dark text-gray-400'}`}
          >
            Seed theo bảng xếp hạng
          </button>
        </div>

        <div className="mb-6 max-w-xs">
          <label className="block text-xs font-bold text-gray-400 mb-1">Số lượt trận (Legs)</label>
          <select value={legs} onChange={e => setLegs(e.target.value)} className={`${SELECT_INPUT_CLASS} w-full`}>
            <option value={1}>1 lượt</option>
            <option value={2}>2 lượt (Đi & về)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          {seedMode === 'manual' ? (
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">Đội hạt giống (Seeded Teams)</label>
              <div className="bg-navy-dark border border-navy-light rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {availableTeams.length === 0 && <p className="text-gray-500 text-xs">Không có đội nào hợp lệ.</p>}
                {availableTeams.map(st => {
                  const team = teams.find(t => t.id === st.team_id);
                  return (
                    <label key={st.team_id} className="flex items-center gap-2 cursor-pointer hover:bg-navy p-1 rounded">
                      <input
                        type="checkbox"
                        className="accent-amber-500 w-4 h-4 rounded border-gray-600 bg-gray-700"
                        checked={seededTeamIds.includes(st.team_id)}
                        onChange={(e) => {
                          if (e.target.checked) setSeededTeamIds(prev => [...prev, st.team_id]);
                          else setSeededTeamIds(prev => prev.filter(id => id !== st.team_id));
                        }}
                      />
                      <span className="text-sm text-gray-300">{team?.name || `Team ID: ${st.team_id}`}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">Seed theo bảng xếp hạng</label>
              <p className="text-xs text-gray-500 mb-2">
                Thứ tự bảng bên dưới = thứ tự seed (không phải thứ tự đấu thật).
                Standings sẽ được recompute lại ngay trong transaction tạo bracket — không dùng snapshot cũ.
              </p>
              <div className="bg-navy-dark border border-navy-light rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {availableGroups.length === 0 && <p className="text-gray-500 text-xs">Chưa có bảng đấu nào trong season.</p>}
                {availableGroups.map(g => {
                  const cfg = groupConfigs.find(c => c.groupId === g.id);
                  return (
                    <div key={g.id} className="flex items-center gap-2 bg-navy p-2 rounded">
                      <input
                        type="checkbox"
                        className="accent-amber-500 w-4 h-4"
                        checked={!!cfg}
                        onChange={(e) => {
                          if (e.target.checked) setGroupConfigs(prev => [...prev, { groupId: g.id, name: g.name, topN: 1 }]);
                          else setGroupConfigs(prev => prev.filter(c => c.groupId !== g.id));
                        }}
                      />
                      <span className="text-sm text-gray-300 flex-1">{g.name}</span>
                      {cfg && (
                        <>
                          <button type="button" onClick={() => moveGroupConfig(g.id, -1)} className="text-xs text-gray-400 px-1 hover:text-white" aria-label="Di chuyển lên">↑</button>
                          <button type="button" onClick={() => moveGroupConfig(g.id, 1)} className="text-xs text-gray-400 px-1 hover:text-white" aria-label="Di chuyển xuống">↓</button>
                          {/* FIX: trước đây khoá cứng chỉ Top 1 / Top 2 dù
                              buildStandingSeeds không có giới hạn topN nào —
                              chỉ cần group có đủ standing. Mở rộng lên Top 6,
                              đủ dùng cho hầu hết giải; số thật vẫn bị giới
                              hạn tự nhiên bởi số đội trong bảng (BE sẽ báo
                              lỗi CONFLICT nếu topN vượt số đội thật). */}
                          <select
                            value={cfg.topN}
                            onChange={(e) => setGroupConfigs(prev => prev.map(c => c.groupId === g.id ? { ...c, topN: Number(e.target.value) } : c))}
                            className="bg-navy-dark border border-navy-light rounded px-2 py-1 text-xs text-gray-300"
                          >
                            {[1, 2, 3, 4, 5, 6].map(n => (
                              <option key={n} value={n}>Top {n}</option>
                            ))}
                          </select>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleGenerate}
            disabled={generating || currentSeedCount < 2}
            className={`${BTN_PRIMARY} bg-amber-600 hover:bg-amber-500`}
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
            Tạo Sơ Đồ Bracket
          </button>
          <span className="text-xs text-gray-500">
            {currentSeedCount} seed đã chọn
            {previewBracketSize && (
              <span className="text-gray-400">
                {' '}→ bracket {previewBracketSize} ô
                {previewByeCount > 0 && <span className="text-amber-400"> ({previewByeCount} bye)</span>}
              </span>
            )}
          </span>
        </div>
      </div>

      {availablePhases.length > 1 && (
        <div className="bg-navy border border-navy-light p-5 rounded-2xl shadow-xl shadow-black/20">
          <label className="block text-xs font-bold text-gray-400 mb-1">Xem Bracket theo Phase</label>
          <select
            value={selectedPhaseId}
            onChange={e => setSelectedPhaseId(Number(e.target.value))}
            className={`${SELECT_INPUT_CLASS} w-full`}
          >
            <option value="">-- Chọn Phase --</option>
            {availablePhases.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {loadingBracket ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
        </div>
      ) : Array.isArray(bracketData) && bracketData.length > 0 ? (
        <div className="bg-navy border border-navy-light rounded-xl p-5 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-white">Sơ đồ Knockout</h4>
            {round1MatchCount > 0 && (
              <button
                onClick={() => setScheduleModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-black flex items-center gap-2"
                title="getBracket() không trả scheduled_at nên không biết chính xác trận nào đã có lịch — bấm để mở modal, BE tự bỏ qua trận đã xếp"
              >
                <CalendarClock className="w-4 h-4" />
                Xếp lịch ({round1MatchCount} trận vòng 1)
              </button>
            )}
          </div>
          {round1MatchCount > 0 && (
            <div className="flex items-start gap-2 text-[11px] text-gray-500 bg-navy-dark/60 border border-navy-light rounded-lg px-3 py-2 mb-4">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Sơ đồ hiện chưa hiển thị được trạng thái "đã xếp lịch hay chưa" cho từng trận vì API bracket
                chưa trả field này. Bấm "Xếp lịch" vẫn an toàn — trận đã có sân/giờ sẽ được giữ nguyên.
              </span>
            </div>
          )}
          <BracketView slots={bracketData} teams={teams} />
        </div>
      ) : (
        <div className="text-center py-12 bg-navy border border-navy-light rounded-xl border-dashed">
          <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h4 className="text-gray-400 font-bold">Chưa có dữ liệu sơ đồ</h4>
          <p className="text-gray-500 text-sm mt-1">Tạo mới hoặc chọn Phase để xem bracket.</p>
        </div>
      )}

      {scheduleModalOpen && (
        <ScheduleBracketModal
          phaseId={selectedPhaseId}
          venues={venues}
          onClose={() => setScheduleModalOpen(false)}
          onScheduled={() => {
            setScheduleModalOpen(false);
            fetchBracket(selectedPhaseId);
          }}
        />
      )}
    </div>
  );
}