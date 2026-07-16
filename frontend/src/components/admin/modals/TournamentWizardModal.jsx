import { useEffect, useMemo, useRef } from 'react';
import { create } from 'zustand';
import {
  Trophy, LayoutGrid, Loader2, UploadCloud, Check, Settings,
  CalendarDays, ChevronUp, ChevronDown, X, Layers, Repeat, Info, ArrowLeft, RefreshCcw,
  Puzzle, Plus, Trash2
} from 'lucide-react';
import AdminModal from '../AdminModal';
import FormField from '../../ui/FormField';
import { tournamentApi, tournamentRuleApi, seasonApi, groupApi } from '../../../api';
import useToastStore from '../../../store/toastStore';
import { INPUT } from '../../../data/data';

// ============================================================
// Format metadata — khớp enum SeasonFormat (Prisma) + ràng buộc
// round_robin_stages mà TournamentRuleService.validateFormatConsistency() enforce:
//   knockout                    -> stages phải = 0
//   round_robin_knockout        -> stages phải = 1
//   multi_round_robin_knockout  -> stages phải >= 2
//   round_robin                 -> stages phải >= 1
//   custom                      -> round_robin_stages KHÔNG được đọc, cấu trúc do
//                                  custom_stages[] quyết định hoàn toàn.
// stagesMode 'fixed0'/'fixed1' -> field bị khóa, không cho sửa (tránh gửi sai lên BE).
// stagesMode 'min1'/'min2'     -> field cho sửa, clamp theo min tương ứng.
// stagesMode 'custom'          -> field bị ẩn hoàn toàn, thay bằng stage builder.
// hasGroupPhase/hasKnockout = null cho 'custom' vì nó phụ thuộc từng stage, không cố định
// theo format — mọi chỗ dùng 2 flag này phải tự xử lý riêng case custom, không được coi null
// như falsy một cách vô thức (null !== false về mặt ý nghĩa ở đây).
// ============================================================
const FORMAT_META = [
  {
    value: 'round_robin',
    label: 'Vòng tròn',
    desc: 'Chỉ đá vòng bảng tính điểm, không có loại trực tiếp.',
    icon: LayoutGrid,
    color: 'emerald',
    hasGroupPhase: true,
    hasKnockout: false,
    stagesMode: 'min1',
  },
  {
    value: 'knockout',
    label: 'Loại trực tiếp',
    desc: 'Đá loại trực tiếp toàn giải ngay từ đầu.',
    icon: Trophy,
    color: 'orange',
    hasGroupPhase: false,
    hasKnockout: true,
    stagesMode: 'fixed0',
  },
  {
    value: 'round_robin_knockout',
    label: 'Vòng bảng → Loại trực tiếp',
    desc: '1 vòng bảng tính điểm, sau đó vào nhánh knockout.',
    icon: Layers,
    color: 'blue',
    hasGroupPhase: true,
    hasKnockout: true,
    stagesMode: 'fixed1',
  },
  {
    value: 'multi_round_robin_knockout',
    label: 'Nhiều vòng bảng → Loại trực tiếp',
    desc: 'Nhiều vòng bảng liên tiếp rồi vào knockout.',
    icon: Repeat,
    color: 'indigo',
    hasGroupPhase: true,
    hasKnockout: true,
    stagesMode: 'min2',
  },
  {
    value: 'custom',
    label: 'Tùy chỉnh (Hybrid)',
    desc: 'Tự dựng pipeline nhiều stage: vòng bảng → knockout → tranh hạng... Dùng cho giải có cấu trúc không khớp 4 mẫu trên (VD: knockout trước rồi vào vòng tròn tính điểm, top mỗi bảng đá vòng tròn chọn hạng, nhiều nhánh song song...).',
    icon: Puzzle,
    color: 'fuchsia',
    hasGroupPhase: null,
    hasKnockout: null,
    stagesMode: 'custom',
  },
];

const PITCH_TYPE_META = [
  { value: 'san_5', label: 'Sân 5' },
  { value: 'san_7', label: 'Sân 7' },
  { value: 'san_11', label: 'Sân 11' },
];

const STAGE_TYPE_META = [
  { value: 'round_robin', label: 'Vòng bảng' },
  { value: 'knockout', label: 'Loại trực tiếp' },
  { value: 'classification', label: 'Tranh hạng (phụ)' },
];

const SEED_MODE_META = [
  { value: 'standing_straight', label: 'Xếp thẳng theo bảng xếp hạng' },
  { value: 'standing_cross', label: 'Bắt cặp chéo (1A-2B, 1B-2A...)' },
  { value: 'standing_random', label: 'Bốc thăm ngẫu nhiên' },
  { value: 'manual', label: 'Xếp cặp thủ công' },
];

const getFormatMeta = (value) => FORMAT_META.find(f => f.value === value) || FORMAT_META[2];

const clampStagesForFormat = (format, stages) => {
  const meta = getFormatMeta(format);
  if (meta.stagesMode === 'fixed0') return 0;
  if (meta.stagesMode === 'fixed1') return 1;
  if (meta.stagesMode === 'min1') return stages < 1 ? 1 : stages;
  if (meta.stagesMode === 'min2') return stages < 2 ? 2 : stages;
  return stages;
};

const KNOCKOUT_LEG_TYPE_META = [
  { value: 'single_leg', label: '1 trận', desc: 'Đá 1 trận duy nhất (chung kết/sân trung lập).' },
  { value: 'two_legged', label: 'Lượt đi - lượt về', desc: 'Đá 2 lượt, cộng dồn tỷ số.' },
];

const TIEBREAKER_LABELS = {
  goal_diff: 'Hiệu số bàn thắng-thua',
  goals_scored: 'Bàn thắng ghi được',
  goals_conceded: 'Bàn thua (càng ít càng ưu tiên)',
  head_to_head: 'Đối đầu trực tiếp',
  yellow_cards: 'Thẻ vàng (càng ít càng ưu tiên)',
  red_cards: 'Thẻ đỏ (càng ít càng ưu tiên)',
};
const ALL_TIEBREAKERS = Object.keys(TIEBREAKER_LABELS);

const STEP_META = [
  { id: 1, title: 'Giải đấu', subtitle: 'Chọn giải đấu mới hoặc giải đã có', icon: Trophy },
  { id: 2, title: 'Luật & Thể thức', subtitle: 'Season này sẽ thi đấu theo thể thức nào', icon: Settings },
  { id: 3, title: 'Vòng bảng', subtitle: 'Số lượng bảng đấu cho vòng round-robin', icon: LayoutGrid },
  { id: 4, title: 'Mùa giải', subtitle: 'Thời gian, số đội, hạn đăng ký', icon: CalendarDays },
];

// ============================================================
// Numeric-only helpers — mọi input number trong file này phải đi qua đây.
// Trước đây dùng thẳng `+e.target.value`: chuỗi rỗng -> 0 (im lặng sai), chuỗi không
// phải số ("abc", hoặc paste text) -> NaN chảy thẳng vào state, render ra "NaN" trên UI
// và làm hỏng mọi phép tính/validate phía sau (VD: NaN < 1 luôn false -> qua mặt validateStep).
// ============================================================
const safeInt = (raw, fallback = 0) => {
  if (raw === '' || raw === null || raw === undefined) return fallback;
  const n = Math.trunc(Number(raw));
  return Number.isFinite(n) ? n : fallback;
};
const safeFloat = (raw, fallback = 0) => {
  if (raw === '' || raw === null || raw === undefined) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
};
// Chặn ký tự browser <input type="number"> vẫn cho gõ được nhưng không hợp lệ với business
// data ở đây (điểm số, số người, tiền phạt... không bao giờ âm hoặc dạng khoa học).
const blockNonNumericKeys = (e) => {
  if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
};

// Input số dùng chung — đảm bảo mọi field số trong wizard có cùng hành vi (chặn ký tự rác,
// không bao giờ set NaN vào state) và cùng cấu trúc DOM (FormField + input), tránh lệch
// chiều cao/label như bản cũ khi mỗi chỗ tự viết input riêng.
const NumField = ({ label, required, value, onChange, min, max, step, allowDecimal = false, placeholder }) => (
  <FormField label={label} required={required}>
    <input
      type="number"
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
      className={INPUT}
      value={value}
      min={min}
      max={max}
      step={step ?? (allowDecimal ? 0.01 : 1)}
      placeholder={placeholder}
      onKeyDown={blockNonNumericKeys}
      onChange={(e) => onChange(allowDecimal ? safeFloat(e.target.value, 0) : safeInt(e.target.value, 0))}
    />
  </FormField>
);

// ============================================================
// Custom stage builder — REWRITTEN
//
// Trước đây builder chỉ dựng được pipeline TUYẾN TÍNH (stage sau luôn lấy nguồn từ đúng
// stage liền trước, chỉ append/xóa-cuối, luôn ép stage đầu = round_robin). Điều đó không
// khớp với tinh thần "custom": người dùng phải tự do chọn NGUỒN của mỗi stage (không bị ép
// theo vị trí), được xóa/sửa stage bất kỳ, và stage đầu có thể là round_robin HOẶC knockout.
//
// Model mới: mỗi stage có `_cid` (client-only id, KHÔNG gửi lên BE) làm khóa tham chiếu ổn
// định. `source_stage_cid` trỏ tới `_cid` của 1 stage khác (thay vì order số, vốn dễ vỡ khi
// thêm/xóa giữa chừng). Chỉ convert `_cid` -> `order` số nguyên đúng 1 lần lúc build payload
// gửi BE (convertCustomStagesForApi). Nhiều stage được phép cùng trỏ 1 nguồn (branching —
// vd 1 vòng bảng tách ra Cup chính + Cup phụ) — LƯU Ý: khả năng branching thật sự với
// round_robin còn tùy backend hỗ trợ (xem phần "kiểm tra knockout và group" cuối câu trả lời).
//
// source_rank_range: field mới cho round_robin có nguồn — xác định lấy đội HẠNG MẤY (trong
// mỗi group của stage nguồn) để đưa vào pool của stage này. VD [1,1] = chỉ lấy đội hạng 1
// mỗi bảng (case "4 đội nhất bảng vào đá vòng tròn tính điểm chọn hạng 1-2-3-4").
// ============================================================
const newCid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `s${Date.now()}_${Math.random().toString(36).slice(2)}`);

const createDefaultStage = (type, cid, defaultSourceCid, sameTypeCount = 0) => {
  if (type === 'round_robin') {
    return {
      _cid: cid,
      type: 'round_robin',
      name: sameTypeCount === 0 ? 'Vòng bảng' : `Vòng bảng ${sameTypeCount + 1}`,
      group_count: 4,
      teams_advance_per_group: 2,
      points_per_win: 3,
      points_per_draw: 1,
      points_per_loss: 0,
      // Mặc định null (pool đăng ký mới) — KHÔNG tự gán theo vị trí như bản cũ. User tự
      // chọn nguồn qua dropdown nếu muốn stage này lấy đội advance từ 1 stage trước.
      source_stage_cid: null,
      // Chỉ có ý nghĩa khi source_stage_cid != null và nguồn là round_robin.
      source_rank_range: null,
    };
  }
  if (type === 'knockout') {
    return {
      _cid: cid,
      type: 'knockout',
      name: sameTypeCount === 0 ? 'Loại trực tiếp' : `Loại trực tiếp ${sameTypeCount + 1}`,
      // Gợi ý mặc định = stage cuối cùng hiện có (tiện dụng), luôn sửa được qua dropdown.
      // null nếu đây là stage đầu tiên -> bốc thăm trực tiếp từ pool đăng ký approved.
      source_stage_cid: defaultSourceCid,
      seed_mode: 'standing_cross',
      leg_type: 'single_leg',
    };
  }
  return {
    _cid: cid,
    type: 'classification',
    name: sameTypeCount === 0 ? 'Tranh hạng 3' : `Tranh hạng ${sameTypeCount + 1}`,
    source_stage_cid: defaultSourceCid,
    source_kind: 'standing',
    leg_type: 'single_leg',
  };
};

// Mirror validateCustomStages() bên BE ở mức đủ để chặn lỗi sớm trên FE. Không thay thế
// validate BE — chỉ giảm số lần user bị reject sau khi submit.
const validateCustomStagesLocal = (stages) => {
  if (!stages || stages.length === 0) return 'Vui lòng thêm ít nhất 1 stage cho thể thức tùy chỉnh';

  const names = stages.map(s => (s.name || '').trim().toLowerCase());
  if (names.some(n => !n)) return 'Tên stage không được để trống';
  if (new Set(names).size !== names.length) return 'Tên các stage không được trùng nhau';

  // Stage đầu tiên (vị trí 0 trong danh sách hiển thị): round_robin hoặc knockout —
  // classification không thể là stage đầu vì chưa có gì để tranh hạng.
  if (!['round_robin', 'knockout'].includes(stages[0].type)) {
    return 'Stage đầu tiên phải là "Vòng bảng" hoặc "Loại trực tiếp"';
  }
  if (stages[0].source_stage_cid) {
    return `Stage "${stages[0].name}" là stage đầu tiên, không được có nguồn`;
  }

  const cidToIndex = new Map(stages.map((s, i) => [s._cid, i]));

  for (let i = 0; i < stages.length; i++) {
    const s = stages[i];

    if (s.type === 'round_robin') {
      if (s.group_count < 1 || s.group_count > 32) return `Stage "${s.name}": số bảng phải từ 1 đến 32`;
      if (s.teams_advance_per_group < 1) return `Stage "${s.name}": số đội đi tiếp mỗi bảng phải >= 1`;
      if (s.points_per_win < 0 || s.points_per_draw < 0 || s.points_per_loss < 0) return `Stage "${s.name}": điểm trận không được âm`;

      if (i > 0 && s.source_stage_cid) {
        const srcIdx = cidToIndex.get(s.source_stage_cid);
        if (srcIdx === undefined || srcIdx >= i) return `Stage "${s.name}": nguồn không hợp lệ (phải trỏ về stage đứng trước nó)`;
        const src = stages[srcIdx];
        if (!s.source_rank_range) return `Stage "${s.name}": thiếu khoảng hạng lấy đội (source_rank_range)`;
        const [from, to] = s.source_rank_range;
        if (from < 1 || to < from) return `Stage "${s.name}": khoảng hạng không hợp lệ`;
        if (src.type === 'round_robin' && to > src.teams_advance_per_group) {
          return `Stage "${s.name}": lấy tới hạng ${to} nhưng stage nguồn "${src.name}" chỉ cho ${src.teams_advance_per_group} đội đi tiếp/bảng`;
        }
      }
      continue;
    }

    // knockout / classification không phải stage đầu
    if (i === 0) return `Stage "${s.name}" (${s.type === 'knockout' ? 'Loại trực tiếp' : 'Tranh hạng'}) không thể là stage đầu tiên nếu không đứng ở vị trí 0`;
    if (!s.source_stage_cid) return `Stage "${s.name}": thiếu stage nguồn`;
    const srcIdx = cidToIndex.get(s.source_stage_cid);
    if (srcIdx === undefined || srcIdx >= i) return `Stage "${s.name}": nguồn không hợp lệ (phải trỏ về stage đứng trước nó)`;

    if (s.type === 'classification' && s.source_kind === 'loser_of_stage' && stages[srcIdx].type !== 'knockout') {
      return `Stage "${s.name}": "Đội thua ở stage nguồn" chỉ hợp lệ khi nguồn là Loại trực tiếp`;
    }
  }
  return null;
};

// Convert state FE (dùng _cid) -> payload BE (dùng order số nguyên). Gọi ĐÚNG 1 LẦN lúc
// build request submit — KHÔNG lưu dạng order trong state, tránh vỡ liên kết khi thêm/xóa
// stage giữa chừng (index dịch chuyển nhưng _cid luôn ổn định).
const convertCustomStagesForApi = (stages) => {
  const cidToOrder = new Map(stages.map((s, idx) => [s._cid, idx]));
  return stages.map((s, idx) => {
    const { _cid, source_stage_cid, ...rest } = s;
    return {
      ...rest,
      order: idx,
      source_stage_order: source_stage_cid != null ? (cidToOrder.get(source_stage_cid) ?? null) : null,
    };
  });
};

// Convert ngược: payload BE (order số) -> state FE (_cid). Dùng khi load 1 rule template có
// sẵn custom_stages từ DB vào form để sửa tiếp.
const convertCustomStagesFromApi = (stagesFromApi) => {
  if (!Array.isArray(stagesFromApi)) return [];
  const sorted = [...stagesFromApi].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const cids = sorted.map(() => newCid());
  return sorted.map((s, idx) => {
    const { order: _order, source_stage_order, ...rest } = s;
    return {
      ...rest,
      _cid: cids[idx],
      source_stage_cid: source_stage_order != null ? (cids[source_stage_order] ?? null) : null,
    };
  });
};

const defaultRuleForm = {
  name: '',
  format: 'round_robin_knockout',
  round_robin_stages: 1,
  points_per_win: 3,
  points_per_draw: 1,
  points_per_loss: 0,
  max_players_per_team: 11,
  min_players_per_team: 7,
  suspension_match_count: 1,
  yellow_cards_suspension: 3,
  fine_per_yellow_card: 0,
  fine_per_red_card: 0,
  forfeit_score: 3,
  bonus_per_goal: 0,
  bonus_per_assist: 0,
  teams_advance_per_group: 2,
  tiebreaker_order: ['goal_diff', 'goals_scored', 'head_to_head'],
  custom_stages: [],
};

// Map 1 TournamentRuleDto (từ BE) -> shape ruleForm để prefill + so dirty-state.
const ruleDtoToFormShape = (rule) => ({
  name: rule.name ?? '',
  format: rule.format,
  round_robin_stages: rule.round_robin_stages ?? 1,
  points_per_win: rule.points_per_win ?? 3,
  points_per_draw: rule.points_per_draw ?? 1,
  points_per_loss: rule.points_per_loss ?? 0,
  max_players_per_team: rule.max_players_per_team ?? 11,
  min_players_per_team: rule.min_players_per_team ?? 7,
  suspension_match_count: rule.suspension_match_count ?? 1,
  yellow_cards_suspension: rule.yellow_cards_suspension ?? 3,
  fine_per_yellow_card: Number(rule.fine_per_yellow_card ?? 0),
  fine_per_red_card: Number(rule.fine_per_red_card ?? 0),
  forfeit_score: rule.forfeit_score ?? 3,
  bonus_per_goal: Number(rule.bonus_per_goal ?? 0),
  bonus_per_assist: Number(rule.bonus_per_assist ?? 0),
  teams_advance_per_group: rule.teams_advance_per_group ?? 2,
  tiebreaker_order: Array.isArray(rule.tiebreaker_order) ? [...rule.tiebreaker_order] : [],
  // CHANGED — convert order-based (từ BE) sang _cid-based (cho FE builder)
  custom_stages: convertCustomStagesFromApi(rule.custom_stages),
});

// So sánh theo string ISO date (YYYY-MM-DD), KHÔNG qua Date object.
// new Date('2026-07-09') parse theo UTC midnight trong khi new Date() là local time,
// nên gần biên ngày sẽ off-by-one nếu user không ở UTC. So string tránh hoàn toàn vấn đề này.
const todayStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Cộng/trừ N ngày vào 1 chuỗi ISO date (YYYY-MM-DD), trả về cũng dạng string.
// Dùng để tính mốc "trước ngày bắt đầu 1 ngày" cho hạn đăng ký — cùng nguyên tắc
// tránh Date/timezone drift như todayStr().
const addDaysStr = (dateStr, delta) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() + delta);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

const initialWizardState = {
  step: 1,
  isSubmitting: false,

  tournamentMode: 'new',
  tournaments: [],
  tournamentForm: { name: '', description: '', logo: null },
  selectedTournamentId: '',
  logoPreview: null,

  ruleMode: 'blank',       // 'blank' (tạo mới trắng) | 'template' (áp từ rule có sẵn rồi sửa)
  ruleForm: defaultRuleForm,
  ruleTemplates: [],
  isLoadingRuleTemplates: false,
  selectedRuleId: '',
  selectedRuleObj: null,
  templateSnapshot: null,  // baseline để so dirty-state khi ruleMode = 'template'

  groupCount: 4,

  seasonForm: {
    name: '',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    max_teams: 16,
    is_registration_open: true,
    pitch_type: 'san_5',
  },
};

const useWizardStore = create((set) => ({
  ...initialWizardState,
  setStep: (step) => set(typeof step === 'function' ? (state) => ({ step: step(state.step) }) : { step }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setTournamentMode: (tournamentMode) => set({ tournamentMode }),
  setTournaments: (tournaments) => set({ tournaments }),
  setTournamentForm: (updater) => set((state) => ({ tournamentForm: typeof updater === 'function' ? updater(state.tournamentForm) : updater })),
  setSelectedTournamentId: (selectedTournamentId) => set({ selectedTournamentId }),
  setLogoPreview: (logoPreview) => set({ logoPreview }),
  setRuleMode: (ruleMode) => set({ ruleMode }),
  setRuleForm: (updater) => set((state) => ({ ruleForm: typeof updater === 'function' ? updater(state.ruleForm) : updater })),
  setRuleTemplates: (ruleTemplates) => set({ ruleTemplates }),
  setIsLoadingRuleTemplates: (isLoadingRuleTemplates) => set({ isLoadingRuleTemplates }),
  setSelectedRuleId: (selectedRuleId) => set({ selectedRuleId }),
  setSelectedRuleObj: (selectedRuleObj) => set({ selectedRuleObj }),
  setTemplateSnapshot: (templateSnapshot) => set({ templateSnapshot }),
  setGroupCount: (groupCount) => set({ groupCount }),
  setSeasonForm: (updater) => set((state) => ({ seasonForm: typeof updater === 'function' ? updater(state.seasonForm) : updater })),
  reset: () => set(initialWizardState),
}));

export default function TournamentWizardModal({ onClose, onSuccess }) {
  const toast = useToastStore();
  const logoInputRef = useRef(null);
  const {
    step, setStep,
    isSubmitting, setIsSubmitting,
    tournamentMode, setTournamentMode,
    tournaments, setTournaments,
    tournamentForm, setTournamentForm,
    selectedTournamentId, setSelectedTournamentId,
    logoPreview, setLogoPreview,
    ruleMode, setRuleMode,
    ruleForm, setRuleForm,
    ruleTemplates, setRuleTemplates,
    isLoadingRuleTemplates, setIsLoadingRuleTemplates,
    selectedRuleId, setSelectedRuleId,
    selectedRuleObj, setSelectedRuleObj,
    templateSnapshot, setTemplateSnapshot,
    groupCount, setGroupCount,
    seasonForm, setSeasonForm,
    reset,
  } = useWizardStore();

  useEffect(() => {
    return () => { reset(); };
  }, [reset]);

  useEffect(() => {
    return () => { if (logoPreview) URL.revokeObjectURL(logoPreview); };
  }, [logoPreview]);

  // Tournament "new" chưa có id -> không thể query rule template theo tournament_id.
  const effectiveTournamentId = tournamentMode === 'existing' ? selectedTournamentId : null;

  useEffect(() => {
    if (tournamentMode === 'existing' && step === 1 && tournaments.length === 0) {
      tournamentApi.getAll({ per_page: 100, is_active: true })
        .then(res => setTournaments(res.data?.data || res.data || []))
        .catch(() => toast.error('Không tải được danh sách giải đấu, vui lòng thử lại.'));
    }
  }, [tournamentMode, step, tournaments.length, toast, setTournaments]);

  useEffect(() => {
    if (step === 2 && ruleMode === 'template' && effectiveTournamentId && !selectedRuleId) {
      setIsLoadingRuleTemplates(true);
      tournamentRuleApi.getByTournament(effectiveTournamentId)
        .then(res => setRuleTemplates(res.data?.data || res.data || []))
        .catch(() => toast.error('Không tải được danh sách rule template, vui lòng thử lại.'))
        .finally(() => setIsLoadingRuleTemplates(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, ruleMode, effectiveTournamentId, selectedRuleId]);

  // Khóa/clamp round_robin_stages mỗi khi đổi format — tránh gửi giá trị vi phạm
  // validateFormatConsistency() của BE (VALIDATION_ERROR ngay khi submit).
  // Zero-out các field mất ý nghĩa theo format (chỉ áp dụng cho 4 format "chuẩn").
  // Với format='custom': không zero-out gì (BE bỏ qua toàn bộ các field này), chỉ đảm bảo
  // custom_stages có ít nhất 1 stage khởi tạo sẵn để user không thấy màn hình trống trơn.
  // Stage khởi tạo mặc định là round_robin CHỈ vì tiện dụng cho form trống — user có thể
  // xóa nó và bắt đầu bằng knockout nếu muốn (vd knockout 32 đội trước, RR sau).
  // Trade-off: đổi qua lại format sẽ MẤT giá trị đã nhập (không auto-restore) —
  // chấp nhận được vì step 2 còn ở đầu wizard, chưa có side-effect gì cần rollback.
  useEffect(() => {
    setRuleForm(f => {
      const meta = getFormatMeta(f.format);

      if (meta.value === 'custom') {
        if (f.custom_stages && f.custom_stages.length > 0) return f;
        return { ...f, custom_stages: [createDefaultStage('round_robin', newCid(), null, 0)] };
      }

      // Clamp round_robin_stages theo format constraint.
      // Không zero-out tiebreaker_order hay teams_advance_per_group — BE vẫn validate
      // 2 field này ngay cả khi format không có group phase, chỉ cần giá trị >= 0 hợp lệ.
      // Chỉ zero-out points khi format không có group phase để tránh hiểu nhầm.
      if (!meta.hasGroupPhase) {
        if (f.points_per_win === 0 && f.points_per_draw === 0 && f.points_per_loss === 0) {
          return f; // đã ở trạng thái đúng, tránh set thừa gây re-render
        }
        return { ...f, points_per_win: 0, points_per_draw: 0, points_per_loss: 0 };
      }
      return f;
    });
  }, [ruleForm.format, setRuleForm]);

  const activeFormatMeta = getFormatMeta(ruleForm.format);
  const isCustomFormat = activeFormatMeta.value === 'custom';
  // Custom: group-count đã được nhập TRỰC TIẾP trong stage builder (stage round_robin đầu
  // tiên có field group_count riêng) -> không cần step 3 riêng nữa, luôn skip.
  const hasGroupPhase = isCustomFormat ? false : activeFormatMeta.hasGroupPhase;

  // Dirty-state: chỉ có ý nghĩa khi đang ở mode 'template' và đã chọn baseline.
  const isTemplateDirty = useMemo(() => {
    if (ruleMode !== 'template' || !templateSnapshot) return false;
    return JSON.stringify(ruleForm) !== JSON.stringify(templateSnapshot);
  }, [ruleMode, ruleForm, templateSnapshot]);

  const willCreateNewRule = ruleMode === 'blank' || (ruleMode === 'template' && isTemplateDirty);

  const nextStepAfterRule = () => (hasGroupPhase ? 3 : 4);
  const prevStepBeforeSeason = () => (hasGroupPhase ? 3 : 2);

  // Mốc hạn đăng ký muộn nhất được phép chọn = 1 ngày trước ngày bắt đầu.
  // Không dùng seasonForm.start_date trực tiếp làm max vì input date "max" là bao gồm (inclusive),
  // nếu để nguyên start_date thì user vẫn chọn trùng ngày được -> phải trừ đi 1 ngày.
  const maxRegistrationDate = seasonForm.start_date ? addDaysStr(seasonForm.start_date, -1) : undefined;

  // ---------- Custom stage builder mutators ----------

  const addCustomStage = (type) => {
    setRuleForm(f => {
      const stages = f.custom_stages || [];
      if (type === 'classification' && stages.length === 0) {
        toast.warning('Tranh hạng không thể là stage đầu tiên — cần có nguồn đội từ stage trước.');
        return f;
      }
      const cid = newCid();
      const sameTypeCount = stages.filter(s => s.type === type).length;
      const lastStage = stages[stages.length - 1] || null;
      const newStage = createDefaultStage(type, cid, lastStage ? lastStage._cid : null, sameTypeCount);
      return { ...f, custom_stages: [...stages, newStage] };
    });
  };

  // Xóa được BẤT KỲ stage nào (không chỉ cuối cùng như bản cũ). Nếu có stage khác đang trỏ
  // nguồn vào stage bị xóa, tự động gỡ nguồn của chúng về null/'standing' và cảnh báo user
  // chọn lại — tránh để lại tham chiếu treo (_cid không tồn tại).
  const removeCustomStage = (cid) => {
    setRuleForm(f => {
      const stages = f.custom_stages || [];
      if (stages.length <= 1) {
        toast.warning('Phải có ít nhất 1 stage.');
        return f;
      }
      const removed = stages.find(s => s._cid === cid);
      const remaining = stages.filter(s => s._cid !== cid);
      let cascaded = 0;
      const patched = remaining.map(s => {
        if (s.source_stage_cid === cid) {
          cascaded++;
          return {
            ...s,
            source_stage_cid: null,
            ...(s.type === 'round_robin' ? { source_rank_range: null } : {}),
            ...(s.type === 'classification' ? { source_kind: 'standing' } : {}),
          };
        }
        return s;
      });
      if (cascaded > 0) {
        toast.warning(`Đã xóa "${removed?.name}" — ${cascaded} stage phụ thuộc vào nó đã bị gỡ nguồn, vui lòng chọn lại.`);
      }
      return { ...f, custom_stages: patched };
    });
  };

  const updateCustomStage = (cid, patch) => {
    setRuleForm(f => ({
      ...f,
      custom_stages: (f.custom_stages || []).map(s => (s._cid === cid ? { ...s, ...patch } : s)),
    }));
  };

  // Đổi nguồn của 1 stage — reset kèm các field phụ thuộc vào nguồn cũ (rank_range,
  // source_kind) để tránh giữ lại giá trị không còn ý nghĩa với nguồn mới.
  const updateStageSource = (cid, sourceCid) => {
    setRuleForm(f => ({
      ...f,
      custom_stages: (f.custom_stages || []).map(s => {
        if (s._cid !== cid) return s;
        const patch = { source_stage_cid: sourceCid || null };
        if (s.type === 'round_robin') patch.source_rank_range = sourceCid ? [1, s.teams_advance_per_group || 1] : null;
        if (s.type === 'classification') patch.source_kind = 'standing';
        return { ...s, ...patch };
      }),
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (tournamentMode === 'new' && !tournamentForm.logo) return 'Vui lòng tải logo cho giải đấu';
      if (tournamentMode === 'new' && !tournamentForm.name.trim()) return 'Tên giải đấu không được để trống';
      if (tournamentMode === 'existing' && !selectedTournamentId) return 'Vui lòng chọn một giải đấu';
    }

    if (step === 2) {
      if (ruleMode === 'template' && !selectedRuleId) return 'Vui lòng chọn một rule template làm baseline';

      const r = ruleForm;
      if (willCreateNewRule && !r.name.trim()) return 'Vui lòng nhập tên rule';
      if (r.min_players_per_team < 1) return 'Số người tối thiểu phải >= 1';
      if (r.max_players_per_team < r.min_players_per_team) return 'Số người tối đa phải >= tối thiểu';
      if (r.suspension_match_count < 1) return 'Số trận treo giò phải >= 1';
      if (r.yellow_cards_suspension < 1) return 'Số thẻ vàng tích lũy phải >= 1';
      if (r.forfeit_score < 0) return 'Điểm xử thua không được âm';
      if (r.fine_per_yellow_card < 0 || r.fine_per_red_card < 0) return 'Mức phạt không được âm';
      if (r.bonus_per_goal < 0 || r.bonus_per_assist < 0) return 'Mức thưởng không được âm';

      const meta = getFormatMeta(r.format);
      if (meta.value === 'custom') {
        const stageErr = validateCustomStagesLocal(r.custom_stages);
        if (stageErr) return stageErr;
      } else {
        if (r.points_per_win < 0 || r.points_per_draw < 0 || r.points_per_loss < 0) return 'Điểm trận không được âm';
        if (meta.hasGroupPhase) {
          if (meta.hasKnockout && r.teams_advance_per_group < 1) return 'Số đội đi tiếp mỗi bảng phải >= 1';
          if (!r.tiebreaker_order.length) return 'Vui lòng chọn ít nhất 1 tiêu chí xếp hạng phụ';
        }
      }
    }

    if (step === 3 && hasGroupPhase && (groupCount < 1 || groupCount > 32)) {
      return 'Số lượng bảng đấu phải từ 1 đến 32';
    }

    if (step === 4) {
      if (!seasonForm.name.trim()) return 'Tên mùa giải không được để trống';
      if (!seasonForm.start_date || !seasonForm.end_date) return 'Vui lòng chọn ngày bắt đầu và kết thúc';
      if (!seasonForm.registration_deadline) return 'Vui lòng chọn hạn chót đăng ký';

      // Chặn quá khứ — so string ISO, không qua Date object (tránh timezone drift).
      if (seasonForm.start_date < todayStr()) return 'Ngày bắt đầu không được ở quá khứ';
      if (seasonForm.registration_deadline < todayStr()) return 'Hạn đăng ký không được ở quá khứ';

      // Hạn đăng ký phải TRƯỚC ngày bắt đầu, không được trùng ngày (so sánh strict, không dùng >=).
      if (seasonForm.registration_deadline >= seasonForm.start_date) {
        return 'Hạn đăng ký phải trước ngày bắt đầu, không được trùng ngày với ngày bắt đầu';
      }
      if (seasonForm.end_date < seasonForm.start_date) return 'Ngày kết thúc phải sau ngày bắt đầu';
      if (!seasonForm.max_teams || Number(seasonForm.max_teams) < 2) return 'Số đội tối đa ít nhất là 2';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { toast.warning(err); return; }
    if (step === 2) setStep(nextStepAfterRule());
    else setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 4) setStep(prevStepBeforeSeason());
    else setStep(s => s - 1);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.warning('Logo phải là file ảnh'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.warning('Logo tối đa 5MB'); return; }
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setTournamentForm(f => ({ ...f, logo: file }));
    setLogoPreview(URL.createObjectURL(file));
  };

  const toggleTiebreaker = (key) => {
    setRuleForm(f => {
      const exists = f.tiebreaker_order.includes(key);
      return {
        ...f,
        tiebreaker_order: exists
          ? f.tiebreaker_order.filter(k => k !== key)
          : [...f.tiebreaker_order, key],
      };
    });
  };

  const moveTiebreaker = (index, dir) => {
    setRuleForm(f => {
      const arr = [...f.tiebreaker_order];
      const target = index + dir;
      if (target < 0 || target >= arr.length) return f;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...f, tiebreaker_order: arr };
    });
  };

  // Áp 1 rule template làm baseline: prefill ruleForm + lưu snapshot để so dirty-state.
  const applyTemplate = (rule) => {
    const shape = ruleDtoToFormShape(rule);
    setSelectedRuleId(rule.id);
    setSelectedRuleObj(rule);
    setRuleForm(shape);
    setTemplateSnapshot(shape);
  };

  const clearTemplateSelection = () => {
    setSelectedRuleId('');
    setSelectedRuleObj(null);
    setTemplateSnapshot(null);
    setRuleForm(defaultRuleForm);
  };

  const switchRuleMode = (mode) => {
    setRuleMode(mode);
    setSelectedRuleId('');
    setSelectedRuleObj(null);
    setTemplateSnapshot(null);
    setRuleForm(defaultRuleForm);
  };

  // Đổi ngày bắt đầu -> tự dọn các ngày phụ thuộc nếu chúng không còn hợp lệ,
  // tránh việc user next qua step 4 rồi mới bị BE/step-validate chặn lại.
  const handleStartDateChange = (value) => {
    setSeasonForm(f => {
      const next = { ...f, start_date: value };
      if (value && f.end_date && f.end_date < value) {
        next.end_date = '';
        toast.warning('Ngày kết thúc đã bị xóa vì trước ngày bắt đầu mới, vui lòng chọn lại.');
      }
      if (value && f.registration_deadline && f.registration_deadline >= value) {
        next.registration_deadline = '';
        toast.warning('Hạn đăng ký đã bị xóa vì trùng hoặc sau ngày bắt đầu mới, vui lòng chọn lại.');
      }
      return next;
    });
  };

  // Validate ngay khi chọn hạn đăng ký, không đợi tới lúc bấm "Tiếp tục"/"Hoàn tất".
  const handleRegistrationDeadlineChange = (value) => {
    if (value && seasonForm.start_date && value >= seasonForm.start_date) {
      toast.warning('Hạn đăng ký phải trước ngày bắt đầu, không được trùng ngày.');
      return;
    }
    if (value && value < todayStr()) {
      toast.warning('Hạn đăng ký không được ở quá khứ.');
      return;
    }
    setSeasonForm(f => ({ ...f, registration_deadline: value }));
  };

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) { toast.warning(err); return; }
    setIsSubmitting(true);

    try {
      // 1. Tournament
      let finalTournamentId = selectedTournamentId;
      if (tournamentMode === 'new') {
        const tRes = await tournamentApi.create(tournamentForm);
        finalTournamentId = tRes.data?.id || tRes.id;
      }

      // 2. Rule — dùng nguyên template (không sửa) hoặc fork thành rule mới (blank / đã sửa).
      // Không bao giờ PATCH rule template tại đây: rule dùng chung cho nhiều season
      // (TournamentRule.seasons: Season[]), sửa tại chỗ sẽ ảnh hưởng các season khác
      // đang share rule đó — service tự chặn việc này bằng CONFLICT khi đã có phase/match official.
      let finalRuleId;
      let finalFormat;
      let finalCustomStages = null;
      if (willCreateNewRule) {
        // CHANGED — convert _cid-based state sang order-based payload đúng 1 lần ở đây.
        const apiCustomStages = ruleForm.format === 'custom' ? convertCustomStagesForApi(ruleForm.custom_stages) : null;
        const rulePayload = {
          ...ruleForm,
          name: ruleForm.name.trim(),
          tournament_id: finalTournamentId,
          // format != custom -> custom_stages phải null (schema cấm gửi kèm format khác custom).
          // format == custom -> round_robin_stages không được BE đọc, gửi 0 cho rõ ràng thay vì
          // giá trị default 1 gây hiểu lầm là "có 1 vòng bảng cố định".
          custom_stages: apiCustomStages,
          round_robin_stages: ruleForm.format === 'custom' ? 0 : ruleForm.round_robin_stages,
        };
        const rRes = await tournamentRuleApi.create(rulePayload);
        finalRuleId = rRes.data?.id || rRes.id;
        finalFormat = ruleForm.format;
        finalCustomStages = apiCustomStages;
      } else {
        finalRuleId = selectedRuleId;
        finalFormat = selectedRuleObj?.format;
        finalCustomStages = selectedRuleObj?.custom_stages ?? null; // đã order-based sẵn (từ BE)
      }

      const finalMeta = getFormatMeta(finalFormat);
      const finalIsCustom = finalFormat === 'custom';
      const firstCustomStage = finalIsCustom ? finalCustomStages?.[0] : null;

      // Group phase ban đầu: format chuẩn dùng flag hasGroupPhase + groupCount (step 3);
      // format custom lấy trực tiếp từ stage[0] — có thể là round_robin (group_count có sẵn)
      // hoặc knockout (không tạo group ban đầu, bốc thăm trực tiếp toàn bộ pool đăng ký).
      const shouldCreateInitialGroups = finalIsCustom
        ? firstCustomStage?.type === 'round_robin'
        : finalMeta.hasGroupPhase;
      const initialGroupCount = finalIsCustom
        ? Number(firstCustomStage?.group_count || 0)
        : Number(groupCount);

      // 3. Season
      const formattedSeasonForm = {
        ...seasonForm,
        start_date: seasonForm.start_date ? `${seasonForm.start_date}T00:00:00` : undefined,
        end_date: seasonForm.end_date ? `${seasonForm.end_date}T23:59:59` : undefined,
        registration_deadline: seasonForm.registration_deadline ? `${seasonForm.registration_deadline}T23:59:59` : undefined,
      };

      const sRes = await seasonApi.create({
        ...formattedSeasonForm,
        is_active: true,
        group_count: shouldCreateInitialGroups ? initialGroupCount : 0,
        tournament_id: finalTournamentId,
        tournament_rule_id: finalRuleId,
      });
      const finalSeasonId = sRes.data?.id || sRes.id;

      // 4. Generate groups nếu thể thức có vòng bảng ở stage đầu.
      // LƯU Ý: season vừa tạo mặc định ở status 'upcoming', trong khi BE chỉ cho phép
      // tạo/sửa group khi season ở 'registration_open' hoặc 'ongoing' (CONFLICT nếu không).
      // Nếu user chọn "Mở đăng ký ngay" thì tự động chuyển status trước khi tạo group.
      // Các bước này không throw ra ngoài để không rollback tournament/rule/season đã tạo thành công.
      //
      // Với format='custom' + stage đầu = round_robin: builder này CHỈ tự động tạo group cho
      // stage đầu tiên. Với stage đầu = knockout: KHÔNG tạo group gì cả — bracket knockout sẽ
      // được generate thủ công ở màn hình quản lý season. Các stage sau (round_robin/knockout/
      // classification có nguồn) cần dữ liệu chỉ có được SAU KHI stage nguồn kết thúc (standings/
      // kết quả bracket thật) — không thể generate trước tại thời điểm tạo season, và (xem phần
      // "kiểm tra knockout và group" cuối câu trả lời) chính API để tự động hoá bước này vẫn còn
      // thiếu ở service layer — hiện phải làm thủ công ở màn hình quản lý season.
      let groupCreationWarning = null;
      if (shouldCreateInitialGroups && initialGroupCount > 0) {
        if (seasonForm.is_registration_open) {
          try {
            await seasonApi.updateStatus(finalSeasonId, { status: 'registration_open' });
          } catch (_statusErr) {
            groupCreationWarning = 'Mùa giải đã được tạo nhưng chưa thể tự động mở đăng ký. Vui lòng vào mùa giải để mở đăng ký và tạo bảng đấu thủ công.';
          }
        }
        if (!groupCreationWarning) {
          try {
            await groupApi.createGroupsBulk(finalSeasonId, initialGroupCount);
          } catch (_groupErr) {
            groupCreationWarning = 'Mùa giải đã được tạo nhưng chưa thể tự động tạo bảng đấu (season chưa ở trạng thái phù hợp). Vui lòng vào mùa giải để tạo bảng đấu thủ công.';
          }
        }
      }

      if (groupCreationWarning) {
        toast.warning(groupCreationWarning);
      } else if (finalIsCustom && finalCustomStages?.length > 1) {
        toast.success('Khởi tạo Giải đấu và Mùa giải thành công! Stage đầu tiên đã sẵn sàng — các stage tiếp theo cần kích hoạt thủ công sau khi stage đầu kết thúc.');
      } else {
        toast.success('Khởi tạo Giải đấu và Mùa giải thành công!');
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const backendMessage = err?.response?.data?.body?.message || err?.response?.data?.message || '';
      const backendCode = err?.response?.data?.body?.code || err?.response?.data?.code || '';
      const isDuplicateName = backendMessage.includes('Unique constraint');
      const isValidationError = backendCode === 'VALIDATION_ERROR' || /validation/i.test(backendMessage);

      let friendlyMessage = 'Đã xảy ra lỗi trong quá trình khởi tạo, vui lòng thử lại.';
      if (isDuplicateName) {
        friendlyMessage = 'Tên giải đấu đã tồn tại, vui lòng chọn tên khác.';
      } else if (isValidationError) {
        friendlyMessage = 'Dữ liệu nhập chưa hợp lệ, vui lòng kiểm tra lại các trường bắt buộc rồi thử lại.';
      }
      toast.apiError(err, friendlyMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleSteps = STEP_META.filter(s => s.id !== 3 || hasGroupPhase);
  const currentVisibleIndex = visibleSteps.findIndex(s => s.id === step);
  const displayIndex = currentVisibleIndex === -1 ? visibleSteps.length : currentVisibleIndex + 1;

  const renderStepper = () => {
    const current = STEP_META[step - 1];
    return (
      <div className="mb-8">
        <div className="mb-6">
          <p className="text-xs font-mono tracking-widest text-blue-400 uppercase mb-1">
            Bước {displayIndex} / {visibleSteps.length}
          </p>
          <h3 className="text-xl font-black text-white uppercase tracking-tight leading-none">
            {current.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">{current.subtitle}</p>
        </div>

        <div className="flex items-center justify-between relative max-w-2xl">
          <div className="absolute left-0 top-5 w-full h-1 bg-navy-light -z-10 rounded-full"></div>
          <div
            className="absolute left-0 top-5 h-1 bg-linear-to-r from-blue-600 to-blue-400 -z-10 rounded-full transition-all duration-500"
            style={{ width: `${(visibleSteps.length > 1 ? (displayIndex - 1) / (visibleSteps.length - 1) : 0) * 100}%` }}
          ></div>

          {visibleSteps.map((s, idx) => {
            const isDone = displayIndex > idx + 1;
            const isActive = displayIndex === idx + 1;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                <div className="relative">
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping"></span>
                  )}
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${isDone
                      ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                      : isActive
                        ? 'bg-navy border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                        : 'bg-navy border-navy-light text-gray-500'
                      }`}
                  >
                    {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider hidden sm:block ${isActive ? 'text-amber-400' : isDone ? 'text-blue-400' : 'text-gray-500'
                    }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const isLastStep = step === 4;
  const showRuleForm = ruleMode === 'blank' || (ruleMode === 'template' && selectedRuleId);
  const todayMin = todayStr();

  // ---------- Custom stage card renderer ----------
  const renderStageCard = (stage, index) => {
    const typeLabel = STAGE_TYPE_META.find(t => t.value === stage.type)?.label || stage.type;
    const priorStages = ruleForm.custom_stages.filter((_, i) => i < index);
    const sourceStage = ruleForm.custom_stages.find(s => s._cid === stage.source_stage_cid) || null;

    return (
      <div key={stage._cid} className="bg-navy border border-navy-light rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-xs font-bold flex items-center justify-center shrink-0">
              {index + 1}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-300">{typeLabel}</span>
          </div>
          {ruleForm.custom_stages.length > 1 && (
            <button
              type="button"
              onClick={() => removeCustomStage(stage._cid)}
              className="text-gray-500 hover:text-red-400 flex items-center gap-1 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa
            </button>
          )}
        </div>

        <FormField label="Tên stage" required>
          <input
            className={INPUT}
            value={stage.name}
            placeholder="VD: Vòng bảng, Bán kết, Tranh hạng 3"
            onChange={(e) => updateCustomStage(stage._cid, { name: e.target.value })}
          />
        </FormField>

        {/* Nguồn đội — chọn TỰ DO trong số các stage đứng trước, không ép "phải là stage liền
            trước" như bản cũ. index===0 luôn ngầm hiểu là lấy toàn bộ pool đăng ký approved. */}
        {index > 0 && (
          <FormField
            label={stage.type === 'round_robin' ? 'Nguồn đội (tùy chọn)' : 'Nguồn đội'}
            required={stage.type !== 'round_robin'}
          >
            <select
              className={INPUT}
              value={stage.source_stage_cid ?? ''}
              onChange={(e) => updateStageSource(stage._cid, e.target.value || null)}
            >
              {stage.type === 'round_robin' && <option value="">— Pool đăng ký mới (độc lập) —</option>}
              {stage.type !== 'round_robin' && <option value="" disabled>-- chọn stage nguồn --</option>}
              {priorStages.map(s => (
                <option key={s._cid} value={s._cid}>{s.name}</option>
              ))}
            </select>
          </FormField>
        )}
        {index === 0 && stage.type === 'knockout' && (
          <p className="text-[11px] text-gray-500 italic flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            Bốc thăm trực tiếp từ danh sách đội đã duyệt — không qua vòng bảng nào trước.
          </p>
        )}

        {stage.type === 'round_robin' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumField
                label="Số bảng" required min={1} max={32}
                value={stage.group_count}
                onChange={(v) => updateCustomStage(stage._cid, { group_count: v })}
              />
              <NumField
                label="Số đội đi tiếp / bảng" required min={1}
                value={stage.teams_advance_per_group}
                onChange={(v) => updateCustomStage(stage._cid, { teams_advance_per_group: v })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NumField
                label="Điểm Thắng" required min={0}
                value={stage.points_per_win}
                onChange={(v) => updateCustomStage(stage._cid, { points_per_win: v })}
              />
              <NumField
                label="Điểm Hòa" required min={0}
                value={stage.points_per_draw}
                onChange={(v) => updateCustomStage(stage._cid, { points_per_draw: v })}
              />
              <NumField
                label="Điểm Thua" required min={0}
                value={stage.points_per_loss}
                onChange={(v) => updateCustomStage(stage._cid, { points_per_loss: v })}
              />
            </div>

            {/* NEW — khoảng hạng lấy đội từ stage nguồn. VD: 4 đội hạng 1 mỗi bảng vào đá
                vòng tròn tính điểm lần 2 -> chọn [1,1]. Chỉ hiện khi đã chọn nguồn. */}
            {stage.source_stage_cid && (
              <div className="grid grid-cols-2 gap-4">
                <NumField
                  label="Lấy đội từ hạng"
                  required min={1}
                  value={stage.source_rank_range ? stage.source_rank_range[0] : 1}
                  onChange={(v) => updateCustomStage(stage._cid, {
                    source_rank_range: [v, Math.max(v, stage.source_rank_range ? stage.source_rank_range[1] : v)],
                  })}
                />
                <NumField
                  label="Đến hạng"
                  required min={1}
                  value={stage.source_rank_range ? stage.source_rank_range[1] : 1}
                  onChange={(v) => updateCustomStage(stage._cid, {
                    source_rank_range: [Math.min(v, stage.source_rank_range ? stage.source_rank_range[0] : v), v],
                  })}
                />
                {sourceStage?.type === 'round_robin' && (
                  <p className="col-span-2 text-[11px] text-gray-500 italic flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    Ví dụ [1,1] = chỉ lấy đội hạng 1 mỗi bảng của "{sourceStage.name}" (tối đa {sourceStage.teams_advance_per_group}).
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {stage.type === 'knockout' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Cách bốc thăm" required>
              <select
                className={INPUT}
                value={stage.seed_mode}
                onChange={(e) => updateCustomStage(stage._cid, { seed_mode: e.target.value })}
              >
                {SEED_MODE_META.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Thể thức sân đấu" required>
              <select
                className={INPUT}
                value={stage.leg_type}
                onChange={(e) => updateCustomStage(stage._cid, { leg_type: e.target.value })}
              >
                {KNOCKOUT_LEG_TYPE_META.map(k => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
            </FormField>
          </div>
        )}

        {stage.type === 'classification' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Nguồn đội (loại)" required>
              <select
                className={INPUT}
                value={stage.source_kind}
                onChange={(e) => updateCustomStage(stage._cid, { source_kind: e.target.value })}
                disabled={sourceStage?.type !== 'knockout'}
              >
                <option value="standing">Theo bảng xếp hạng</option>
                <option value="loser_of_stage" disabled={sourceStage?.type !== 'knockout'}>
                  Đội thua ở stage nguồn
                </option>
              </select>
            </FormField>
            <FormField label="Thể thức sân đấu" required>
              <select
                className={INPUT}
                value={stage.leg_type}
                onChange={(e) => updateCustomStage(stage._cid, { leg_type: e.target.value })}
              >
                {KNOCKOUT_LEG_TYPE_META.map(k => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
            </FormField>
            {sourceStage?.type !== 'knockout' && (
              <p className="sm:col-span-2 text-[11px] text-gray-500 italic flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                "Đội thua ở stage nguồn" chỉ dùng được khi stage nguồn đang chọn là Loại trực tiếp.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminModal
      title="Tạo Giải Đấu Mới"
      icon={Trophy}
      iconClass="text-blue-400"
      onClose={onClose}
      size="xl"
      footer={
        <>
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white bg-navy border border-navy-light hover:bg-navy-light transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
          ) : (
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white bg-navy border border-navy-light hover:bg-navy-light transition-colors">
              Hủy
            </button>
          )}

          {!isLastStep ? (
            <button onClick={handleNext} className="px-6 py-2.5 rounded-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/40 transition-all">
              Tiếp tục
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 rounded-xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-emerald-900/40 transition-all">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
              Hoàn tất khởi tạo
            </button>
          )}
        </>
      }
    >
      {renderStepper()}

      <div className="min-h-[440px] animate-slide-up">
        {/* ================= STEP 1: TOURNAMENT ================= */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột trái: chọn mode */}
            <div className="space-y-4">
              <label className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${tournamentMode === 'new' ? 'border-blue-500 bg-blue-500/10' : 'border-navy-light bg-navy hover:border-gray-600'}`}>
                <input type="radio" className="hidden" checked={tournamentMode === 'new'} onChange={() => setTournamentMode('new')} />
                <Trophy className={`w-9 h-9 shrink-0 ${tournamentMode === 'new' ? 'text-blue-400' : 'text-gray-500'}`} />
                <div>
                  <span className={`font-bold block ${tournamentMode === 'new' ? 'text-white' : 'text-gray-400'}`}>Tạo giải đấu mới</span>
                  <span className="text-xs text-gray-500">Nhập tên, mô tả và logo cho giải đấu</span>
                </div>
              </label>

              <label className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${tournamentMode === 'existing' ? 'border-indigo-500 bg-indigo-500/10' : 'border-navy-light bg-navy hover:border-gray-600'}`}>
                <input type="radio" className="hidden" checked={tournamentMode === 'existing'} onChange={() => setTournamentMode('existing')} />
                <LayoutGrid className={`w-9 h-9 shrink-0 ${tournamentMode === 'existing' ? 'text-indigo-400' : 'text-gray-500'}`} />
                <div>
                  <span className={`font-bold block ${tournamentMode === 'existing' ? 'text-white' : 'text-gray-400'}`}>Chọn giải hiện có</span>
                  <span className="text-xs text-gray-500">Thêm một mùa giải mới vào giải đấu đã tồn tại</span>
                </div>
              </label>
            </div>

            {/* Cột phải: chi tiết form */}
            {tournamentMode === 'new' ? (
              <div className="flex gap-5 animate-fade-in bg-navy-dark/50 p-5 rounded-2xl border border-navy-light">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="relative group cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                    <div className="w-28 h-28 rounded-2xl bg-navy border-2 border-dashed border-navy-light flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-blue-500 group-hover:bg-navy-light/50 shadow-inner">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 text-gray-500 mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center px-1">Tải Logo <span className="text-red-400">*</span></span>
                        </>
                      )}
                    </div>
                    {logoPreview && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-sm">
                        <UploadCloud className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  {!logoPreview && <span className="text-[11px] text-red-400/80 italic text-center">Bắt buộc<br />tối đa 5MB</span>}
                </div>
                <div className="flex-1 space-y-4 min-w-0">
                  <FormField label="Tên giải đấu" required>
                    <input className={INPUT} value={tournamentForm.name} onChange={e => setTournamentForm(f => ({ ...f, name: e.target.value }))} placeholder="Nhập tên giải..." />
                  </FormField>
                  <FormField label="Mô tả">
                    <textarea rows={4} className={`${INPUT} resize-none`} value={tournamentForm.description} onChange={e => setTournamentForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả giải đấu..." />
                  </FormField>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in bg-navy-dark/50 p-5 rounded-2xl border border-navy-light">
                <FormField label="Chọn giải đấu" required>
                  <select className={INPUT} value={selectedTournamentId} onChange={e => setSelectedTournamentId(e.target.value)}>
                    <option value="">-- Chọn một giải đấu --</option>
                    {tournaments.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </FormField>
                {tournaments.length === 0 && (
                  <p className="text-xs text-gray-500 italic flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0" /> Chưa có giải đấu nào đang hoạt động.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 2: RULE + FORMAT ================= */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in">
            {/* Cột trái (2/5): nguồn rule + thể thức */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Nguồn rule</p>
                <div className="space-y-3">
                  <label className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 ${ruleMode === 'blank' ? 'border-blue-500 bg-blue-500/10' : 'border-navy-light bg-navy hover:border-gray-600'}`}>
                    <input type="radio" className="hidden" checked={ruleMode === 'blank'} onChange={() => switchRuleMode('blank')} />
                    <Settings className={`w-6 h-6 shrink-0 ${ruleMode === 'blank' ? 'text-blue-400' : 'text-gray-500'}`} />
                    <span className={`font-bold text-sm ${ruleMode === 'blank' ? 'text-white' : 'text-gray-400'}`}>Tạo rule mới hoàn toàn</span>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 ${!effectiveTournamentId ? 'opacity-40 cursor-not-allowed border-navy-light bg-navy' :
                      ruleMode === 'template' ? 'cursor-pointer border-indigo-500 bg-indigo-500/10' : 'cursor-pointer border-navy-light bg-navy hover:border-gray-600'
                      }`}
                  >
                    <input
                      type="radio" className="hidden"
                      checked={ruleMode === 'template'}
                      disabled={!effectiveTournamentId}
                      onChange={() => switchRuleMode('template')}
                    />
                    <LayoutGrid className={`w-6 h-6 shrink-0 ${ruleMode === 'template' ? 'text-indigo-400' : 'text-gray-500'}`} />
                    <span className={`font-bold text-sm ${ruleMode === 'template' ? 'text-white' : 'text-gray-400'}`}>Áp từ rule template có sẵn</span>
                  </label>
                </div>
                {!effectiveTournamentId && (
                  <p className="text-xs text-gray-500 italic flex items-center gap-1.5 mt-2">
                    <Info className="w-3.5 h-3.5 shrink-0" /> Giải đấu mới chưa có rule nào — chỉ tạo được rule mới.
                  </p>
                )}
              </div>

              {ruleMode === 'template' && !selectedRuleId && (
                <div className="bg-navy-dark/50 p-3 rounded-2xl border border-navy-light space-y-2 max-h-64 overflow-y-auto">
                  {isLoadingRuleTemplates ? (
                    <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Đang tải rule template...
                    </div>
                  ) : ruleTemplates.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 py-8">Giải đấu này chưa có rule template nào.</p>
                  ) : (
                    ruleTemplates.map(rule => {
                      const meta = getFormatMeta(rule.format);
                      const Icon = meta.icon;
                      return (
                        <button
                          type="button"
                          key={rule.id}
                          onClick={() => applyTemplate(rule)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-navy-light hover:border-blue-500 transition-all text-left"
                        >
                          <Icon className="w-5 h-5 shrink-0 text-gray-500" />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm truncate text-gray-300">{rule.name || `Rule #${rule.id}`}</p>
                            <p className="text-xs text-gray-500">
                              {meta.label}
                              {meta.value !== 'custom' && ` · ${rule.points_per_win}-${rule.points_per_draw}-${rule.points_per_loss} điểm (T-H-T)`}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}

              {ruleMode === 'template' && selectedRuleId && (
                <div className={`flex flex-col gap-2 p-3.5 rounded-xl border ${willCreateNewRule ? 'border-amber-500/40 bg-amber-500/10' : 'border-emerald-500/40 bg-emerald-500/10'}`}>
                  <div className="flex items-start gap-2">
                    {willCreateNewRule ? (
                      <>
                        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-amber-300 flex-1">Đã chỉnh sửa — khi submit sẽ tạo <b>rule mới</b>, không đổi rule template gốc (#{selectedRuleObj?.id}).</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-emerald-300 flex-1">Dùng nguyên bản rule <b>#{selectedRuleObj?.id} — {selectedRuleObj?.name}</b>, không tạo rule mới.</span>
                      </>
                    )}
                  </div>
                  <button type="button" onClick={clearTemplateSelection} className="self-start text-xs text-gray-400 hover:text-white flex items-center gap-1">
                    <RefreshCcw className="w-3.5 h-3.5" /> Đổi template
                  </button>
                </div>
              )}

              {showRuleForm && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Thể thức thi đấu</p>
                  <div className="space-y-2.5">
                    {FORMAT_META.map(f => {
                      const Icon = f.icon;
                      const active = ruleForm.format === f.value;
                      return (
                        <label
                          key={f.value}
                          className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 ${active ? `border-${f.color}-500 bg-${f.color}-500/10` : 'border-navy-light bg-navy hover:border-gray-600'}`}
                        >
                          <input type="radio" className="hidden" checked={active} onChange={() => setRuleForm(r => ({ ...r, format: f.value }))} />
                          <Icon className={`w-6 h-6 shrink-0 ${active ? `text-${f.color}-400` : 'text-gray-500'}`} />
                          <div className="min-w-0">
                            <span className={`font-bold text-sm block ${active ? 'text-white' : 'text-gray-400'}`}>{f.label}</span>
                            <p className="text-[11px] text-gray-500 leading-snug">{f.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Cột phải (3/5): chi tiết số liệu */}
            {showRuleForm && (
              <div className="lg:col-span-3 bg-navy-dark/50 p-5 rounded-2xl border border-navy-light space-y-5 lg:max-h-[560px] lg:overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Tên rule" required>
                    <input className={INPUT} value={ruleForm.name} onChange={e => setRuleForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Luật chuẩn 2026" />
                  </FormField>

                  {isCustomFormat ? (
                    <div className="flex items-end pb-2.5">
                      <p className="text-xs text-gray-500 italic flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 shrink-0" />
                        Cấu trúc vòng đấu do các stage bên dưới quyết định.
                      </p>
                    </div>
                  ) : (activeFormatMeta.stagesMode === 'min1' || activeFormatMeta.stagesMode === 'min2') ? (
                    <NumField
                      label="Số vòng bảng liên tiếp" required
                      min={activeFormatMeta.stagesMode === 'min2' ? 2 : 1}
                      value={ruleForm.round_robin_stages}
                      onChange={(v) => setRuleForm(f => ({ ...f, round_robin_stages: clampStagesForFormat(f.format, v) }))}
                    />
                  ) : (
                    <div className="flex items-end pb-2.5">
                      <p className="text-xs text-gray-500 italic flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 shrink-0" />
                        round_robin_stages cố định = {ruleForm.round_robin_stages} (BE bắt buộc).
                      </p>
                    </div>
                  )}
                </div>

                {!isCustomFormat && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Điểm số</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <NumField label="Điểm Thắng" required min={0} max={10} value={ruleForm.points_per_win} onChange={(v) => setRuleForm(f => ({ ...f, points_per_win: v }))} />
                      <NumField label="Điểm Hòa" required min={0} max={10} value={ruleForm.points_per_draw} onChange={(v) => setRuleForm(f => ({ ...f, points_per_draw: v }))} />
                      <NumField label="Điểm Thua" required min={0} max={10} value={ruleForm.points_per_loss} onChange={(v) => setRuleForm(f => ({ ...f, points_per_loss: v }))} />
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Đội hình & xử thua</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <NumField label="Số người tối đa / đội" required min={1} max={50} value={ruleForm.max_players_per_team} onChange={(v) => setRuleForm(f => ({ ...f, max_players_per_team: v }))} />
                    <NumField label="Số người tối thiểu" required min={1} max={50} value={ruleForm.min_players_per_team} onChange={(v) => setRuleForm(f => ({ ...f, min_players_per_team: v }))} />
                    <NumField label="Điểm xử thua" required min={0} max={20} value={ruleForm.forfeit_score} onChange={(v) => setRuleForm(f => ({ ...f, forfeit_score: v }))} />
                  </div>
                </div>

                {!isCustomFormat && activeFormatMeta.hasKnockout && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeFormatMeta.hasGroupPhase && (
                      <NumField label="Số đội đi tiếp / bảng" required min={1} value={ruleForm.teams_advance_per_group} onChange={(v) => setRuleForm(f => ({ ...f, teams_advance_per_group: v }))} />
                    )}
                    <FormField label="Thể thức sân đấu (Knockout)" required>
                      <select
                        className={INPUT}
                        value={seasonForm.knockout_leg_type}
                        onChange={e => setSeasonForm(f => ({ ...f, knockout_leg_type: e.target.value }))}
                      >
                        {KNOCKOUT_LEG_TYPE_META.map(k => (
                          <option key={k.value} value={k.value}>{k.label}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Kỷ luật</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NumField label="Thẻ vàng tích lũy / treo giò" required min={1} value={ruleForm.yellow_cards_suspension} onChange={(v) => setRuleForm(f => ({ ...f, yellow_cards_suspension: v }))} />
                    <NumField label="Số trận bị treo giò" required min={1} value={ruleForm.suspension_match_count} onChange={(v) => setRuleForm(f => ({ ...f, suspension_match_count: v }))} />
                    <NumField label="Phạt tiền / thẻ vàng" min={0} allowDecimal value={ruleForm.fine_per_yellow_card} onChange={(v) => setRuleForm(f => ({ ...f, fine_per_yellow_card: v }))} />
                    <NumField label="Phạt tiền / thẻ đỏ" min={0} allowDecimal value={ruleForm.fine_per_red_card} onChange={(v) => setRuleForm(f => ({ ...f, fine_per_red_card: v }))} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Thưởng</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NumField label="Thưởng / bàn thắng" min={0} allowDecimal value={ruleForm.bonus_per_goal} onChange={(v) => setRuleForm(f => ({ ...f, bonus_per_goal: v }))} />
                    <NumField label="Thưởng / kiến tạo" min={0} allowDecimal value={ruleForm.bonus_per_assist} onChange={(v) => setRuleForm(f => ({ ...f, bonus_per_assist: v }))} />
                  </div>
                </div>

                {!isCustomFormat && activeFormatMeta.hasGroupPhase && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Tiêu chí xếp hạng phụ <span className="text-red-400">*</span>
                    </p>
                    <div className="space-y-2">
                      {ruleForm.tiebreaker_order.map((key, idx) => (
                        <div key={key} className="flex items-center gap-2 bg-navy border border-navy-light rounded-lg px-3 py-2">
                          <span className="text-xs font-mono text-gray-500 w-4">{idx + 1}</span>
                          <span className="text-sm text-white flex-1">{TIEBREAKER_LABELS[key] || key}</span>
                          <button type="button" onClick={() => moveTiebreaker(idx, -1)} disabled={idx === 0} className="text-gray-400 hover:text-white disabled:opacity-30">
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => moveTiebreaker(idx, 1)} disabled={idx === ruleForm.tiebreaker_order.length - 1} className="text-gray-400 hover:text-white disabled:opacity-30">
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => toggleTiebreaker(key)} className="text-gray-500 hover:text-red-400">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {ALL_TIEBREAKERS.filter(k => !ruleForm.tiebreaker_order.includes(k)).length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {ALL_TIEBREAKERS.filter(k => !ruleForm.tiebreaker_order.includes(k)).map(k => (
                            <button
                              key={k} type="button" onClick={() => toggleTiebreaker(k)}
                              className="text-xs px-2.5 py-1 rounded-full border border-dashed border-navy-light text-gray-400 hover:text-white hover:border-blue-500"
                            >
                              + {TIEBREAKER_LABELS[k]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ============ CUSTOM STAGE BUILDER ============ */}
                {isCustomFormat && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Pipeline vòng đấu <span className="text-red-400">*</span>
                    </p>
                    <p className="text-[11px] text-gray-500 italic mb-3 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      Mỗi stage tự chọn nguồn đội (bất kỳ stage nào đứng trước, không bắt buộc liền kề). Xóa/sửa được stage bất kỳ.
                    </p>
                    <div className="space-y-3">
                      {ruleForm.custom_stages.map((stage, idx) => renderStageCard(stage, idx))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button type="button" onClick={() => addCustomStage('round_robin')} className="text-xs px-3 py-1.5 rounded-lg border border-dashed border-navy-light text-gray-400 hover:text-white hover:border-blue-500 flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Vòng bảng
                      </button>
                      <button type="button" onClick={() => addCustomStage('knockout')} className="text-xs px-3 py-1.5 rounded-lg border border-dashed border-navy-light text-gray-400 hover:text-white hover:border-blue-500 flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Loại trực tiếp
                      </button>
                      <button type="button" onClick={() => addCustomStage('classification')} className="text-xs px-3 py-1.5 rounded-lg border border-dashed border-navy-light text-gray-400 hover:text-white hover:border-blue-500 flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Tranh hạng
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 3: GROUP COUNT (auto-skip nếu format = knockout thuần hoặc custom) ================= */}
        {step === 3 && hasGroupPhase && (
          <div className="max-w-xl mx-auto bg-navy-dark/50 p-8 rounded-2xl border border-navy-light animate-fade-in text-center space-y-5">
            <LayoutGrid className="w-10 h-10 text-blue-400 mx-auto" />
            <p className="text-gray-400 text-sm">
              Thể thức <span className="text-white font-bold">{activeFormatMeta.label}</span> — nhập số lượng bảng đấu cho vòng round-robin.
            </p>
            <div className="flex justify-center items-center gap-4">
              <label className="font-bold text-white">Số lượng Group:</label>
              <input
                type="number" min="1" max="32" inputMode="numeric"
                className={`${INPUT} w-28 text-center text-2xl font-black`}
                value={groupCount}
                onKeyDown={blockNonNumericKeys}
                onChange={e => setGroupCount(safeInt(e.target.value, 1))}
              />
            </div>
            <p className="text-xs text-gray-500">Từ 1 đến 32 bảng.</p>
          </div>
        )}

        {/* ================= STEP 4: SEASON ================= */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-2 bg-navy-dark/50 p-5 rounded-2xl border border-navy-light space-y-4">
              <FormField label="Tên mùa giải" required>
                <input className={INPUT} value={seasonForm.name} onChange={e => setSeasonForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Season 2026 - Mùa Hè" />
              </FormField>
              <FormField label="Loại sân thi đấu" required>
                <select
                  className={INPUT}
                  value={seasonForm.pitch_type}
                  onChange={e => setSeasonForm(f => ({ ...f, pitch_type: e.target.value }))}
                >
                  {PITCH_TYPE_META.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Ngày bắt đầu" required>
                  <input
                    type="date" min={todayMin} className={INPUT}
                    value={seasonForm.start_date}
                    onChange={e => handleStartDateChange(e.target.value)}
                  />
                </FormField>
                <FormField label="Ngày kết thúc" required>
                  <input
                    type="date" min={seasonForm.start_date || todayMin} className={INPUT}
                    value={seasonForm.end_date}
                    onChange={e => setSeasonForm(f => ({ ...f, end_date: e.target.value }))}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumField
                  label="Số đội tối đa" required min={2}
                  value={seasonForm.max_teams}
                  onChange={(v) => setSeasonForm(f => ({ ...f, max_teams: v }))}
                />
                <FormField label="Hạn chót đăng ký" required>
                  <input
                    type="date" min={todayMin} max={maxRegistrationDate} className={INPUT}
                    value={seasonForm.registration_deadline}
                    onChange={e => handleRegistrationDeadlineChange(e.target.value)}
                  />
                </FormField>
              </div>
              {seasonForm.start_date && (
                <p className="text-xs text-gray-500 italic flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  Hạn chót đăng ký phải trước ngày bắt đầu (chậm nhất là {maxRegistrationDate}), không được trùng ngày.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-2 text-xs text-blue-300">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Season sẽ thi đấu theo thể thức: <span className="font-bold">{activeFormatMeta.label}</span></span>
              </div>

              <div className="bg-navy-dark/50 p-4 rounded-2xl border border-navy-light">
                <label className="flex items-center cursor-pointer gap-3">
                  <div className="relative shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={seasonForm.is_registration_open} onChange={e => setSeasonForm(f => ({ ...f, is_registration_open: e.target.checked }))} />
                    <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                  <span className="text-sm font-bold text-gray-300">Mở đăng ký ngay</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminModal>
  );
}