import { useState, useEffect, useMemo } from 'react';
import { Trophy, AlertTriangle, Loader2, X, Plus, CalendarClock, Zap, Info, Lock, ShieldCheck } from 'lucide-react';
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

// Nhận diện message tiếng Việt (có dấu) — dùng để lọc message backend trước
// khi đẩy ra toast. Các AppError nghiệp vụ của BE thường viết tiếng Việt có
// dấu, nhưng lỗi validate framework-level (Zod/Joi kiểu "is not allowed",
// "is required") hoặc lỗi network (err.message dạng "Network Error") là
// tiếng Anh thuần — không nên hiện thẳng ra cho người dùng.
const VIETNAMESE_DIACRITICS_REGEX = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
const isLikelyVietnameseMessage = (msg) => typeof msg === 'string' && VIETNAMESE_DIACRITICS_REGEX.test(msg);

// Helper dùng chung cho mọi catch-block hiển thị lỗi API ra toast: ưu tiên
// message tiếng Việt cụ thể từ backend, nếu message là tiếng Anh (lỗi
// validate framework-level, lỗi network, v.v.) thì luôn dùng fallback tiếng
// Việt — không bao giờ để lộ text tiếng Anh thô ra UI.
const getFriendlyErrorMessage = (err, fallback) => {
  const backendMessage = err?.response?.data?.body?.message || err?.response?.data?.message || '';
  return isLikelyVietnameseMessage(backendMessage) ? backendMessage : fallback;
};

// Khớp helper.match.helper.ts::nextPowerOf2 phía BE — dùng để PREVIEW
// bracket size / số bye cho user trước khi submit, KHÔNG dùng để chặn submit
// (validation thật nằm ở BE, xem generateKnockoutBracket()._buildBracketInPhase).
function nextPowerOf2(n) {
  if (n < 1) return 1;
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

// Rút gọn Date|ISO string về "YYYY-MM-DD" cho <input type="date"> — dùng để
// clamp khoảng ngày xếp lịch knockout trong khung season, cùng logic với
// GenerateScheduleModal bên ScheduleTab (tránh gửi ngày ngoài season.end_date
// khiến BE trả lỗi "dateRangeEnd vượt quá season.end_date").
const toDateInputValue = (value) => {
  if (!value) return '';
  const iso = value instanceof Date ? value.toISOString() : String(value);
  return iso.slice(0, 10);
};

const PHASE_STORAGE_KEY = (seasonId) => `knockout:lastPhase:${seasonId}`;

// Bracket knockout thường được TẠO trong lúc season đang 'ongoing' (ngay
// sau khi xong vòng bảng), nên KHÔNG khoá theo 'ongoing' như GroupDrawUI.
// Chỉ khóa khi season đã thực sự KẾT THÚC (finished/cancelled) — lúc đó
// bracket coi như dữ liệu lịch sử, không còn ý nghĩa để sửa/tạo lại nữa.
const isSeasonClosedStatus = (status) => status === 'finished' || status === 'cancelled';

// FIX: trạng thái "đã xác nhận" của bracket CHÍNH LÀ PhaseStatus.locked —
// KnockoutService.confirmBracket() set thẳng phase.status = 'locked', và
// swapSeeds()/generate lại đều bị chặn dựa trên field này. Field này đã
// có sẵn trong mỗi phần tử của availablePhases (season.phases[].status),
// không cần thêm API nào — chỉ cần đọc đúng thay vì hardcode false.
const isBracketConfirmedStatus = (status) => status === 'locked';

function ScheduleBracketModal({ phaseId, season, venues, onClose, onScheduled }) {
  const toast = useToastStore();
  const seasonStartStr = toDateInputValue(season?.start_date);
  const seasonEndStr = toDateInputValue(season?.end_date);
  const seasonHasDateRange = Boolean(seasonStartStr && seasonEndStr);
  const isSeasonClosed = isSeasonClosedStatus(season?.status);

  const [venueIds, setVenueIds] = useState([]);
  const [matchTimes, setMatchTimes] = useState([]);
  const [timeInput, setTimeInput] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // FIX: prefill + kẹp dateRangeStart/End trong đúng khung season ngay khi
  // mở modal — trước đây để trống, cho phép chọn ngày ngoài season, BE mới
  // trả lỗi (`dateRangeEnd vượt quá season.end_date` / `dateRangeStart
  // trước season.start_date`) khiến người dùng chỉ biết sau khi submit.
  useEffect(() => {
    if (!seasonHasDateRange) return;
    setDateRangeStart(prev => (!prev || prev < seasonStartStr || prev > seasonEndStr) ? seasonStartStr : prev);
    setDateRangeEnd(prev => (!prev || prev > seasonEndStr || prev < seasonStartStr) ? seasonEndStr : prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasonStartStr, seasonEndStr, seasonHasDateRange]);

  const addTimeSlot = () => {
    if (!timeInput) return;
    if (matchTimes.includes(timeInput)) return toast.error('Giờ này đã được thêm');
    setMatchTimes(prev => [...prev, timeInput].sort());
    setTimeInput('');
  };

  const removeTimeSlot = (t) => setMatchTimes(prev => prev.filter(x => x !== t));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSeasonClosed) return toast.error('Mùa giải đã kết thúc — không thể xếp lịch knockout nữa.');
    if (venueIds.length === 0) return toast.error('Chọn ít nhất 1 sân đấu');
    if (matchTimes.length === 0) return toast.error('Thêm ít nhất 1 khung giờ');
    if (dateRangeStart && dateRangeEnd && dateRangeStart > dateRangeEnd) {
      return toast.error('Ngày bắt đầu phải trước ngày kết thúc');
    }
    // FIX: chặn ngay ở FE thay vì để BE trả lỗi rồi mới biết.
    if (seasonHasDateRange && ((dateRangeStart && dateRangeStart < seasonStartStr) || (dateRangeEnd && dateRangeEnd > seasonEndStr))) {
      return toast.error(`Khoảng ngày phải nằm trong khung mùa giải (${seasonStartStr} → ${seasonEndStr})`);
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
      toast.error(getFriendlyErrorMessage(err, 'Lỗi xếp lịch knockout, vui lòng kiểm tra lại thông tin và thử lại.'));
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

          {isSeasonClosed && (
            <p className="text-xs text-amber-200 bg-amber-950/60 p-3 rounded-lg border border-amber-500/40">
              Mùa giải đã kết thúc ({season?.status}) — không thể xếp lịch thêm cho vòng knockout này.
            </p>
          )}

          {!seasonHasDateRange && (
            <p className="text-xs text-amber-200 bg-amber-950/60 p-3 rounded-lg border border-amber-500/40">
              Mùa giải chưa có ngày bắt đầu/kết thúc — không thể giới hạn khoảng ngày xếp lịch. Vui lòng cập
              nhật thông tin mùa giải trước.
            </p>
          )}

          <fieldset disabled={isSeasonClosed} className="space-y-5 disabled:opacity-50">
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
                  Từ ngày {seasonHasDateRange && <span className="text-gray-600">({seasonStartStr} → {seasonEndStr})</span>}
                </label>
                <input
                  type="date"
                  value={dateRangeStart}
                  min={seasonStartStr || undefined}
                  max={dateRangeEnd || seasonEndStr || undefined}
                  disabled={!seasonHasDateRange}
                  onChange={e => setDateRangeStart(e.target.value)}
                  className={`${SELECT_INPUT_CLASS} w-full scheme-dark disabled:opacity-50`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  Đến ngày {seasonHasDateRange && <span className="text-gray-600">({seasonStartStr} → {seasonEndStr})</span>}
                </label>
                <input
                  type="date"
                  value={dateRangeEnd}
                  min={dateRangeStart || seasonStartStr || undefined}
                  max={seasonEndStr || undefined}
                  disabled={!seasonHasDateRange}
                  onChange={e => setDateRangeEnd(e.target.value)}
                  className={`${SELECT_INPUT_CLASS} w-full scheme-dark disabled:opacity-50`}
                />
              </div>
            </div>
          </fieldset>

          <div className="pt-4 flex justify-end gap-3 border-t border-navy-light">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-navy-light text-gray-400 hover:text-white font-bold text-sm">
              Đóng
            </button>
            <button
              type="submit"
              disabled={submitting || isSeasonClosed}
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
  const [season, setSeason] = useState(null);
  const [bracketData, setBracketData] = useState(null);
  const [loadingBracket, setLoadingBracket] = useState(false);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Khóa cứng CHỈ khi season đã kết thúc thật sự — xem isSeasonClosedStatus.
  // 'ongoing' KHÔNG bị khóa vì bracket thường được tạo trong lúc season
  // đang ongoing.
  const isSeasonClosed = isSeasonClosedStatus(season?.status);

  // FIX: đọc trạng thái "đã xác nhận" thật từ phase.status thay vì hardcode
  // false. selectedPhase lấy từ availablePhases (đã có sẵn field status vì
  // đến từ season.phases), nên không cần thêm request nào.
  const selectedPhase = useMemo(
    () => availablePhases.find(p => p.id === Number(selectedPhaseId)),
    [availablePhases, selectedPhaseId],
  );
  const isBracketConfirmed = isBracketConfirmedStatus(selectedPhase?.status);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  // FIX (mất bracket sau F5): bản cũ chỉ auto-select phase khi
  // `knockoutPhases.length === 1` — season có từ 2 phase knockout trở lên
  // (rất dễ xảy ra sau vài lần test/tạo) thì sau khi F5 không phase nào
  // được chọn -> bracketData = null -> "Chưa có dữ liệu sơ đồ", dù dữ liệu
  // vẫn còn nguyên trên server. Giờ ưu tiên khôi phục lựa chọn gần nhất từ
  // sessionStorage (theo seasonId); nếu không có / phase đó không còn tồn
  // tại nữa, fallback chọn phase MỚI NHẤT (id lớn nhất) thay vì bỏ trống.
  const refreshPhases = async () => {
    const res = await seasonApi.getById(seasonId);
    const seasonRes = typeof res?.status === 'boolean' ? res.data : res;
    setSeason(seasonRes);
    const phases = seasonRes?.phases ?? [];
    const knockoutPhases = phases.filter(p => p.format === 'knockout');
    setAvailablePhases(knockoutPhases);

    if (knockoutPhases.length > 0) {
      const savedId = Number(sessionStorage.getItem(PHASE_STORAGE_KEY(seasonId)));
      const savedStillExists = knockoutPhases.some(p => p.id === savedId);
      if (savedStillExists) {
        setSelectedPhaseId(savedId);
      } else {
        const latest = [...knockoutPhases].sort((a, b) => b.id - a.id)[0];
        setSelectedPhaseId(latest.id);
      }
    }
    return knockoutPhases;
  };

  // FIX: SeasonTeam.group_id trỏ thẳng Group (schema), nên groups derive
  // trực tiếp từ seasonTeams đã fetch, không cần call thêm endpoint nào.
  const deriveGroupsFromSeasonTeams = (seasonTeams) => {
    const groupMap = new Map();
    seasonTeams.forEach(st => {
      if (st.group_id == null) return;
      if (!groupMap.has(st.group_id)) {
        groupMap.set(st.group_id, {
          id: st.group_id,
          name: st.group?.name ?? `Bảng ${st.group_id}`,
        });
      }
    });
    return Array.from(groupMap.values());
  };

  // FIX (root cause 409 CONFLICT "2 seed trỏ cùng 1 team"): season_team có
  // thể chứa nhiều dòng cùng team_id (đội bị đăng ký trùng — data issue,
  // hoặc do doi-transfer giữa group). Bản cũ hiển thị thẳng từng dòng
  // season_team làm checkbox riêng, key={st.team_id} bị TRÙNG giữa các dòng
  // trùng team, khiến React xử lý state không nhất quán và có thể đẩy cùng
  // 1 teamId vào seededTeamIds nhiều lần — BE nhận seeds trùng teamId,
  // resolveSeeds() ném CONFLICT ngay cả khi người dùng chỉ tick "8 đội
  // khác nhau" theo mắt thường. Dedupe NGAY tại nguồn — theo team_id, giữ
  // dòng season_team đầu tiên — để danh sách hiển thị và state luôn nhất
  // quán 1-đội-1-checkbox.
  const dedupeByTeamId = (seasonTeams) => {
    const seen = new Set();
    const result = [];
    for (const st of seasonTeams) {
      if (seen.has(st.team_id)) continue;
      seen.add(st.team_id);
      result.push(st);
    }
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshPhases();

        const teamRes = await seasonTeamApi.getAll({ season_id: seasonId, per_page: 500 });
        const allTeams = typeof teamRes?.status === 'boolean' ? teamRes.data : teamRes;
        const seasonTeams = (Array.isArray(allTeams?.data) ? allTeams.data : [])
          .filter(st => String(st.season_id) === String(seasonId) && st.status === 'approved');

        const dedupedTeams = dedupeByTeamId(seasonTeams);
        if (dedupedTeams.length !== seasonTeams.length) {
          console.warn(
            `[KnockoutUI] Phát hiện ${seasonTeams.length - dedupedTeams.length} season_team trùng team_id ` +
            `— đã lọc bớt để tránh lỗi CONFLICT khi tạo bracket. Nên kiểm tra lại dữ liệu đăng ký đội.`,
          );
        }

        setAvailableTeams(dedupedTeams);
        setAvailableGroups(deriveGroupsFromSeasonTeams(dedupedTeams));
      } catch (err) {
        console.error('Error fetching knockout data:', err);
      }
    };
    if (seasonId) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasonId]);

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
    if (selectedPhaseId) {
      fetchBracket(selectedPhaseId);
      sessionStorage.setItem(PHASE_STORAGE_KEY(seasonId), String(selectedPhaseId));
    }
  }, [selectedPhaseId, seasonId]);

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
    if (isSeasonClosed) return toast.error('Mùa giải đã kết thúc — không thể tạo sơ đồ knockout mới.');

    // FIX: dedupe seed teamId trước khi build payload — lưới an toàn cuối
    // cùng, kể cả nếu availableTeams vẫn còn sót trùng vì lý do nào khác.
    const seeds = seedMode === 'manual'
      ? [...new Set(seededTeamIds)].map(teamId => ({ kind: 'manual', teamId }))
      : buildStandingSeeds(groupConfigs);

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
          const friendlyWarning = isLikelyVietnameseMessage(w) ? w : 'Có cảnh báo khi tạo bracket, vui lòng kiểm tra lại sơ đồ.';
          if (toast.info) toast.info(friendlyWarning);
          else if (toast.warning) toast.warning(friendlyWarning);
          else console.warn('[Knockout warning]', w);
        });
      }

      if (newPhaseId) {
        await refreshPhases();
        setSelectedPhaseId(newPhaseId);
        fetchBracket(newPhaseId);
      }
    } catch (err) {
      // FIX: nếu backend trả đúng lỗi "2 seed trỏ cùng 1 team", diễn giải
      // rõ ràng hơn cho admin thay vì hiện nguyên message kỹ thuật — kèm
      // gợi ý hành động cụ thể thay vì chỉ báo lỗi suông. Mọi trường hợp
      // khác đều đi qua getFriendlyErrorMessage để không lộ text tiếng Anh.
      const rawMessage = err?.response?.data?.body?.message || err?.response?.data?.message || err.message || '';
      if (rawMessage.includes('trỏ cùng 1 team')) {
        toast.error('Có 2 đội trùng nhau trong danh sách seed (khả năng do dữ liệu đăng ký đội bị trùng) — bỏ chọn rồi chọn lại, hoặc liên hệ kỹ thuật kiểm tra season_team.');
      } else {
        toast.error(getFriendlyErrorMessage(err, 'Lỗi tạo sơ đồ knockout, vui lòng kiểm tra lại thông tin và thử lại.'));
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleSwapSeeds = async (source, target) => {
    if (isSeasonClosed) return toast.error('Mùa giải đã kết thúc — không thể đổi nhánh đấu.');
    // FIX: chặn sớm ở FE khi bracket đã confirm — trước đây không có guard
    // này, người dùng vẫn kéo-thả được trong BracketView (editable luôn
    // truyền true) rồi mới ăn lỗi CONFLICT từ swapSeeds() sau khi gọi API.
    if (isBracketConfirmed) return toast.error('Sơ đồ đã được xác nhận — không thể đổi nhánh nữa.');
    try {
      await knockoutApi.swapSeeds(selectedPhaseId, {
        slotIdA: source.slotId, sideA: source.side,
        slotIdB: target.slotId, sideB: target.side,
      });
      toast.success('Đã đổi nhánh đấu');
      fetchBracket(selectedPhaseId);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi đổi nhánh — có thể trận đã diễn ra hoặc bracket đã xác nhận.'));
    }
  };

  const handleConfirmBracket = async () => {
    if (isSeasonClosed) return toast.error('Mùa giải đã kết thúc — không thể xác nhận sơ đồ.');
    // FIX: guard idempotent — trước đây bấm "xác nhận" khi đã confirmed
    // (không hiển nhưng có thể trigger qua code path khác) sẽ luôn ăn lỗi
    // "Sơ đồ đã được xác nhận trước đó" từ BE thay vì được chặn êm ở FE.
    if (isBracketConfirmed) return toast.error('Sơ đồ đã được xác nhận trước đó.');
    setConfirming(true);
    try {
      await knockoutApi.confirmBracket(selectedPhaseId);
      toast.success('Đã xác nhận sơ đồ knockout');
      await refreshPhases();
      fetchBracket(selectedPhaseId);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Lỗi khi xác nhận sơ đồ, vui lòng thử lại.'));
    } finally {
      setConfirming(false);
    }
  };

  const currentSeedCount = seedMode === 'manual'
    ? new Set(seededTeamIds).size
    : buildStandingSeeds(groupConfigs).length;

  const previewBracketSize = currentSeedCount >= 2 ? nextPowerOf2(currentSeedCount) : null;
  const previewByeCount = previewBracketSize ? previewBracketSize - currentSeedCount : 0;

  const round1MatchCount = Array.isArray(bracketData)
    ? bracketData.filter(s => s.round === 1 && !s.isBye && s.matchId).length
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-navy border border-navy-light p-5 rounded-2xl shadow-xl shadow-black/20">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" /> Tạo Vòng Loại Trực Tiếp (Knockout)
          {isSeasonClosed && (
            <span className="ml-auto flex items-center gap-1.5 bg-gray-500/15 text-gray-400 text-xs font-bold px-2.5 py-1 rounded-full">
              <Lock className="w-3.5 h-3.5" /> Mùa giải đã kết thúc
            </span>
          )}
          {!isSeasonClosed && isBracketConfirmed && (
            <span className="ml-auto flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> Sơ đồ đã xác nhận
            </span>
          )}
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Bước này chỉ sinh cấu trúc cặp đấu (seed → bracket). Xếp sân/giờ thi đấu là bước riêng, thực hiện
          sau khi bracket đã được tạo.
        </p>

        {/* Banner khóa — CHỈ hiện khi season đã finished/cancelled, KHÔNG
            hiện khi ongoing (bracket vẫn tạo/sửa bình thường lúc season
            đang diễn ra, khác hẳn GroupDrawUI). */}
        {isSeasonClosed && (
          <div className="flex items-start gap-2.5 text-gray-400 text-xs bg-navy-dark/60 border border-navy-light rounded-xl px-4 py-3 mb-4">
            <Lock className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Mùa giải đã ở trạng thái <strong className="text-gray-300">{season?.status}</strong> — sơ đồ knockout
              được giữ nguyên làm dữ liệu lịch sử. Không thể tạo mới, đổi nhánh, xác nhận, hoặc xếp thêm lịch.
            </span>
          </div>
        )}

        {/* FIX: banner riêng cho "phase hiện tại đã confirm" — trước đây
            không có, người dùng chỉ biết khi thao tác bị BE từ chối. */}
        {!isSeasonClosed && isBracketConfirmed && (
          <div className="flex items-start gap-2.5 text-emerald-300 text-xs bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 mb-4">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Sơ đồ của vòng này đã được xác nhận — không thể đổi nhánh (swap) hoặc tạo lại bracket cho phase này nữa.
              Chọn phase khác nếu muốn tạo sơ đồ knockout mới.
            </span>
          </div>
        )}

        <fieldset disabled={isSeasonClosed} className="disabled:opacity-60">
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
                            if (e.target.checked) {
                              // FIX: chặn add trùng ngay tại nguồn thay vì chỉ
                              // dựa vào checked={.includes(...)} để tránh hiện
                              // trạng thái "checked" nhưng thực chất đã có sẵn
                              // trong mảng từ trước (double add do event bắn 2
                              // lần / key trùng — nguyên nhân gốc gây CONFLICT).
                              setSeededTeamIds(prev => prev.includes(st.team_id) ? prev : [...prev, st.team_id]);
                            } else {
                              setSeededTeamIds(prev => prev.filter(id => id !== st.team_id));
                            }
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
              disabled={generating || currentSeedCount < 2 || isSeasonClosed}
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
        </fieldset>
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
              <option key={p.id} value={p.id}>
                {p.name}{isBracketConfirmedStatus(p.status) ? ' (đã xác nhận)' : ''}
              </option>
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
            {round1MatchCount > 0 && !isSeasonClosed && (
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
          {round1MatchCount > 0 && !isSeasonClosed && (
            <div className="flex items-start gap-2 text-[11px] text-gray-500 bg-navy-dark/60 border border-navy-light rounded-lg px-3 py-2 mb-4">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Sơ đồ hiện chưa hiển thị được trạng thái "đã xếp lịch hay chưa" cho từng trận vì API bracket
                chưa trả field này. Bấm "Xếp lịch" vẫn an toàn — trận đã có sân/giờ sẽ được giữ nguyên.
              </span>
            </div>
          )}
          <BracketView
            slots={bracketData}
            teams={teams}
            // FIX: editable/confirmed giờ phản ánh đúng phase.status thay
            // vì hardcode confirmed=false — trước đây BracketView luôn cho
            // kéo-thả swap seed kể cả sau khi confirmBracket() đã chạy, chỉ
            // bị chặn khi BE trả lỗi CONFLICT sau khi bấm.
            editable={!isSeasonClosed && !isBracketConfirmed}
            confirmed={isBracketConfirmed}
            onSwapSeeds={handleSwapSeeds}
            onConfirm={handleConfirmBracket}
            confirming={confirming}
          />
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
          season={season}
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