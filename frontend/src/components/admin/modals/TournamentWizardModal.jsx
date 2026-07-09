import { useEffect, useMemo, useRef } from 'react';
import { create } from 'zustand';
import {
  Trophy, LayoutGrid, Loader2, UploadCloud, Check, Settings,
  CalendarDays, ChevronUp, ChevronDown, X, Layers, Repeat, Info, ArrowLeft, RefreshCcw
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
// stagesMode 'fixed0'/'fixed1' -> field bị khóa, không cho sửa (tránh gửi sai lên BE).
// stagesMode 'min1'/'min2'     -> field cho sửa, clamp theo min tương ứng.
// ============================================================
const FORMAT_META = [
  {
    value: 'round_robin',
    label: 'Vòng tròn',
    desc: 'Chỉ đá vòng bảng tính điểm, không có loại trực tiếp.',
    icon: LayoutGrid,
    color: 'emerald',
    hasGroupPhase: true,
    stagesMode: 'min1',
  },
  {
    value: 'knockout',
    label: 'Loại trực tiếp',
    desc: 'Đá loại trực tiếp toàn giải ngay từ đầu.',
    icon: Trophy,
    color: 'orange',
    hasGroupPhase: false,
    stagesMode: 'fixed0',
  },
  {
    value: 'round_robin_knockout',
    label: 'Vòng bảng → Loại trực tiếp',
    desc: '1 vòng bảng tính điểm, sau đó vào nhánh knockout.',
    icon: Layers,
    color: 'blue',
    hasGroupPhase: true,
    stagesMode: 'fixed1',
  },
  {
    value: 'multi_round_robin_knockout',
    label: 'Nhiều vòng bảng → Loại trực tiếp',
    desc: 'Nhiều vòng bảng liên tiếp rồi vào knockout.',
    icon: Repeat,
    color: 'indigo',
    hasGroupPhase: true,
    stagesMode: 'min2',
  },
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

// Đúng theo TIEBREAKER_OPTIONS thực tế (tournamentRuleApi JSDoc) — KHÔNG phải bộ cũ.
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
});

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
        .catch(() => toast.error('Lỗi khi tải danh sách giải đấu'));
    }
  }, [tournamentMode, step, tournaments.length, toast, setTournaments]);

  useEffect(() => {
    if (step === 2 && ruleMode === 'template' && effectiveTournamentId && !selectedRuleId) {
      setIsLoadingRuleTemplates(true);
      tournamentRuleApi.getByTournament(effectiveTournamentId)
        .then(res => setRuleTemplates(res.data?.data || res.data || []))
        .catch(() => toast.error('Lỗi khi tải danh sách rule template'))
        .finally(() => setIsLoadingRuleTemplates(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, ruleMode, effectiveTournamentId, selectedRuleId]);

  // Khóa/clamp round_robin_stages mỗi khi đổi format — tránh gửi giá trị vi phạm
  // validateFormatConsistency() của BE (VALIDATION_ERROR ngay khi submit).
  useEffect(() => {
    setRuleForm(f => {
      const clamped = clampStagesForFormat(f.format, f.round_robin_stages);
      return clamped === f.round_robin_stages ? f : { ...f, round_robin_stages: clamped };
    });
  }, [ruleForm.format, setRuleForm]);

  const activeFormatMeta = getFormatMeta(ruleForm.format);
  const hasGroupPhase = activeFormatMeta.hasGroupPhase;

  // Dirty-state: chỉ có ý nghĩa khi đang ở mode 'template' và đã chọn baseline.
  const isTemplateDirty = useMemo(() => {
    if (ruleMode !== 'template' || !templateSnapshot) return false;
    return JSON.stringify(ruleForm) !== JSON.stringify(templateSnapshot);
  }, [ruleMode, ruleForm, templateSnapshot]);

  const willCreateNewRule = ruleMode === 'blank' || (ruleMode === 'template' && isTemplateDirty);

  const nextStepAfterRule = () => (hasGroupPhase ? 3 : 4);
  const prevStepBeforeSeason = () => (hasGroupPhase ? 3 : 2);

  const validateStep = () => {
    if (step === 1) {
      if (tournamentMode === 'new' && !tournamentForm.logo) return 'Vui lòng tải logo cho giải đấu';
      if (tournamentMode === 'new' && !tournamentForm.name.trim()) return 'Tên giải đấu không được để trống';
      if (tournamentMode === 'existing' && !selectedTournamentId) return 'Vui lòng chọn một giải đấu';
    }

    if (step === 2) {
      if (ruleMode === 'template' && !selectedRuleId) return 'Vui lòng chọn một rule template làm baseline';

      const r = ruleForm;
      if (r.points_per_win < 0 || r.points_per_draw < 0 || r.points_per_loss < 0) return 'Điểm trận không được âm';
      if (r.min_players_per_team < 1) return 'Số người tối thiểu phải >= 1';
      if (r.max_players_per_team < r.min_players_per_team) return 'Số người tối đa phải >= tối thiểu';
      if (r.suspension_match_count < 1) return 'Số trận treo giò phải >= 1';
      if (r.yellow_cards_suspension < 1) return 'Số thẻ vàng tích lũy phải >= 1';
      if (r.forfeit_score < 0) return 'Điểm xử thua không được âm';
      if (r.fine_per_yellow_card < 0 || r.fine_per_red_card < 0) return 'Mức phạt không được âm';
      if (r.bonus_per_goal < 0 || r.bonus_per_assist < 0) return 'Mức thưởng không được âm';

      const meta = getFormatMeta(r.format);
      if (meta.hasGroupPhase) {
        if (r.teams_advance_per_group < 1) return 'Số đội đi tiếp mỗi bảng phải >= 1';
        if (!r.tiebreaker_order.length) return 'Vui lòng chọn ít nhất 1 tiêu chí xếp hạng phụ';
      }
    }

    if (step === 3 && hasGroupPhase && (groupCount < 1 || groupCount > 32)) {
      return 'Số lượng bảng đấu phải từ 1 đến 32';
    }

    if (step === 4) {
      if (!seasonForm.name.trim()) return 'Tên mùa giải không được để trống';
      if (!seasonForm.start_date || !seasonForm.end_date) return 'Vui lòng chọn ngày bắt đầu và kết thúc';
      if (!seasonForm.registration_deadline) return 'Vui lòng chọn hạn chót đăng ký';
      if (new Date(seasonForm.registration_deadline) > new Date(seasonForm.start_date)) return 'Hạn đăng ký phải trước hoặc bằng ngày bắt đầu';
      if (new Date(seasonForm.end_date) < new Date(seasonForm.start_date)) return 'Ngày kết thúc phải sau ngày bắt đầu';
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
      if (willCreateNewRule) {
        const rRes = await tournamentRuleApi.create({
          ...ruleForm,
          tournament_id: finalTournamentId,
        });
        finalRuleId = rRes.data?.id || rRes.id;
        finalFormat = ruleForm.format;
      } else {
        finalRuleId = selectedRuleId;
        finalFormat = selectedRuleObj?.format;
      }

      const finalHasGroupPhase = getFormatMeta(finalFormat).hasGroupPhase;

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
        group_count: finalHasGroupPhase ? Number(groupCount) : 0,
        tournament_id: finalTournamentId,
        tournament_rule_id: finalRuleId,
      });
      const finalSeasonId = sRes.data?.id || sRes.id;

      // 4. Generate groups nếu thể thức có vòng bảng
      if (finalHasGroupPhase && groupCount > 0) {
        await groupApi.createGroupsBulk(finalSeasonId, groupCount);
      }

      toast.success('Khởi tạo Giải đấu và Mùa giải thành công!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.apiError(err, 'Đã xảy ra lỗi trong quá trình khởi tạo.');
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
          <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">
            {current.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">{current.subtitle}</p>
        </div>

        <div className="flex items-center justify-between relative">
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

  return (
    <AdminModal
      title="Tạo Giải Đấu Mới"
      icon={Trophy}
      iconClass="text-blue-400"
      onClose={onClose}
      size="lg"
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

      <div className="min-h-[380px] animate-slide-up">
        {/* ================= STEP 1: TOURNAMENT ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${tournamentMode === 'new' ? 'border-blue-500 bg-blue-500/10' : 'border-navy-light bg-navy hover:border-gray-600'}`}>
                <input type="radio" className="hidden" checked={tournamentMode === 'new'} onChange={() => setTournamentMode('new')} />
                <Trophy className={`w-8 h-8 ${tournamentMode === 'new' ? 'text-blue-400' : 'text-gray-500'}`} />
                <span className={`font-bold ${tournamentMode === 'new' ? 'text-white' : 'text-gray-400'}`}>Tạo giải đấu mới</span>
              </label>

              <label className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${tournamentMode === 'existing' ? 'border-indigo-500 bg-indigo-500/10' : 'border-navy-light bg-navy hover:border-gray-600'}`}>
                <input type="radio" className="hidden" checked={tournamentMode === 'existing'} onChange={() => setTournamentMode('existing')} />
                <LayoutGrid className={`w-8 h-8 ${tournamentMode === 'existing' ? 'text-indigo-400' : 'text-gray-500'}`} />
                <span className={`font-bold ${tournamentMode === 'existing' ? 'text-white' : 'text-gray-400'}`}>Chọn giải hiện có</span>
              </label>
            </div>

            {tournamentMode === 'new' ? (
              <div className="space-y-4 animate-fade-in bg-navy-dark/50 p-4 rounded-2xl border border-navy-light">
                <div className="flex flex-col items-center gap-2 mb-2">
                  <div className="relative group cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                    <div className="w-24 h-24 rounded-2xl bg-navy border-2 border-dashed border-navy-light flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-blue-500 group-hover:bg-navy-light/50 shadow-inner">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 text-gray-500 mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tải Logo <span className="text-red-400">*</span></span>
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
                  {!logoPreview && <span className="text-xs text-red-400/80 italic">Logo là bắt buộc, tối đa 5MB</span>}
                </div>
                <FormField label="Tên giải đấu" required>
                  <input className={INPUT} value={tournamentForm.name} onChange={e => setTournamentForm(f => ({ ...f, name: e.target.value }))} placeholder="Nhập tên giải..." />
                </FormField>
                <FormField label="Mô tả">
                  <textarea rows={2} className={`${INPUT} resize-none`} value={tournamentForm.description} onChange={e => setTournamentForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả giải đấu..." />
                </FormField>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in bg-navy-dark/50 p-4 rounded-2xl border border-navy-light">
                <FormField label="Chọn giải đấu" required>
                  <select className={INPUT} value={selectedTournamentId} onChange={e => setSelectedTournamentId(e.target.value)}>
                    <option value="">-- Chọn một giải đấu --</option>
                    {tournaments.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </FormField>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 2: RULE + FORMAT ================= */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${ruleMode === 'blank' ? 'border-blue-500 bg-blue-500/10' : 'border-navy-light bg-navy hover:border-gray-600'}`}>
                <input type="radio" className="hidden" checked={ruleMode === 'blank'} onChange={() => switchRuleMode('blank')} />
                <Settings className={`w-7 h-7 ${ruleMode === 'blank' ? 'text-blue-400' : 'text-gray-500'}`} />
                <span className={`font-bold text-sm text-center ${ruleMode === 'blank' ? 'text-white' : 'text-gray-400'}`}>Tạo rule mới hoàn toàn</span>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${!effectiveTournamentId ? 'opacity-40 cursor-not-allowed border-navy-light bg-navy' :
                  ruleMode === 'template' ? 'cursor-pointer border-indigo-500 bg-indigo-500/10' : 'cursor-pointer border-navy-light bg-navy hover:border-gray-600'
                  }`}
              >
                <input
                  type="radio" className="hidden"
                  checked={ruleMode === 'template'}
                  disabled={!effectiveTournamentId}
                  onChange={() => switchRuleMode('template')}
                />
                <LayoutGrid className={`w-7 h-7 ${ruleMode === 'template' ? 'text-indigo-400' : 'text-gray-500'}`} />
                <span className={`font-bold text-sm text-center ${ruleMode === 'template' ? 'text-white' : 'text-gray-400'}`}>Áp từ rule template có sẵn</span>
              </label>
            </div>
            {!effectiveTournamentId && (
              <p className="text-xs text-gray-500 italic flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0" /> Giải đấu mới chưa có rule nào — chỉ tạo được rule mới.
              </p>
            )}

            {ruleMode === 'template' && !selectedRuleId && (
              <div className="bg-navy-dark/50 p-4 rounded-2xl border border-navy-light space-y-2 max-h-72 overflow-y-auto">
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
                          <p className="text-xs text-gray-500">{meta.label} · {rule.points_per_win}-{rule.points_per_draw}-{rule.points_per_loss} điểm (T-H-T)</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {ruleMode === 'template' && selectedRuleId && (
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${willCreateNewRule ? 'border-amber-500/40 bg-amber-500/10' : 'border-emerald-500/40 bg-emerald-500/10'}`}>
                {willCreateNewRule ? (
                  <>
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs text-amber-300 flex-1">Đã chỉnh sửa — khi submit sẽ tạo <b>rule mới</b>, không đổi rule template gốc (#{selectedRuleObj?.id}).</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs text-emerald-300 flex-1">Dùng nguyên bản rule <b>#{selectedRuleObj?.id} — {selectedRuleObj?.name}</b>, không tạo rule mới.</span>
                  </>
                )}
                <button type="button" onClick={clearTemplateSelection} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 shrink-0">
                  <RefreshCcw className="w-3.5 h-3.5" /> Đổi template
                </button>
              </div>
            )}

            {showRuleForm && (
              <>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Thể thức thi đấu</p>
                  <div className="grid grid-cols-2 gap-3">
                    {FORMAT_META.map(f => {
                      const Icon = f.icon;
                      const active = ruleForm.format === f.value;
                      return (
                        <label
                          key={f.value}
                          className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col gap-1.5 ${active ? `border-${f.color}-500 bg-${f.color}-500/10` : 'border-navy-light bg-navy hover:border-gray-600'}`}
                        >
                          <input type="radio" className="hidden" checked={active} onChange={() => setRuleForm(r => ({ ...r, format: f.value }))} />
                          <div className="flex items-center gap-2">
                            <Icon className={`w-5 h-5 shrink-0 ${active ? `text-${f.color}-400` : 'text-gray-500'}`} />
                            <span className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-400'}`}>{f.label}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 leading-snug">{f.desc}</p>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-navy-dark/50 p-4 rounded-2xl border border-navy-light space-y-4">
                  <FormField label="Tên rule">
                    <input className={INPUT} value={ruleForm.name} onChange={e => setRuleForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Luật chuẩn 2026" />
                  </FormField>

                  {(activeFormatMeta.stagesMode === 'min1' || activeFormatMeta.stagesMode === 'min2') ? (
                    <FormField label="Số vòng bảng liên tiếp" required>
                      <input
                        type="number"
                        min={activeFormatMeta.stagesMode === 'min2' ? 2 : 1}
                        className={INPUT}
                        value={ruleForm.round_robin_stages}
                        onChange={e => setRuleForm(f => ({ ...f, round_robin_stages: clampStagesForFormat(f.format, +e.target.value) }))}
                      />
                    </FormField>
                  ) : (
                    <p className="text-xs text-gray-500 italic flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      Thể thức này cố định round_robin_stages = {ruleForm.round_robin_stages} (BE bắt buộc).
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <FormField label="Điểm Thắng" required>
                      <input type="number" className={INPUT} value={ruleForm.points_per_win} onChange={e => setRuleForm(f => ({ ...f, points_per_win: +e.target.value }))} />
                    </FormField>
                    <FormField label="Điểm Hòa" required>
                      <input type="number" className={INPUT} value={ruleForm.points_per_draw} onChange={e => setRuleForm(f => ({ ...f, points_per_draw: +e.target.value }))} />
                    </FormField>
                    <FormField label="Điểm Thua" required>
                      <input type="number" className={INPUT} value={ruleForm.points_per_loss} onChange={e => setRuleForm(f => ({ ...f, points_per_loss: +e.target.value }))} />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {activeFormatMeta.hasGroupPhase && (
                      <FormField label="Số đội đi tiếp / bảng" required>
                        <input type="number" min="1" className={INPUT} value={ruleForm.teams_advance_per_group} onChange={e => setRuleForm(f => ({ ...f, teams_advance_per_group: +e.target.value }))} />
                      </FormField>
                    )}
                    <FormField label="Điểm xử thua (Forfeit)" required>
                      <input type="number" className={INPUT} value={ruleForm.forfeit_score} onChange={e => setRuleForm(f => ({ ...f, forfeit_score: +e.target.value }))} />
                    </FormField>
                  </div>

                  {activeFormatMeta.hasGroupPhase && (
                    <FormField label="Tiêu chí xếp hạng phụ (thứ tự ưu tiên)" required>
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
                    </FormField>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Số người tối đa / đội" required>
                      <input type="number" className={INPUT} value={ruleForm.max_players_per_team} onChange={e => setRuleForm(f => ({ ...f, max_players_per_team: +e.target.value }))} />
                    </FormField>
                    <FormField label="Số người tối thiểu" required>
                      <input type="number" className={INPUT} value={ruleForm.min_players_per_team} onChange={e => setRuleForm(f => ({ ...f, min_players_per_team: +e.target.value }))} />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Số thẻ vàng tích lũy / treo giò" required>
                      <input type="number" min="1" className={INPUT} value={ruleForm.yellow_cards_suspension} onChange={e => setRuleForm(f => ({ ...f, yellow_cards_suspension: +e.target.value }))} />
                    </FormField>
                    <FormField label="Số trận bị treo giò" required>
                      <input type="number" min="1" className={INPUT} value={ruleForm.suspension_match_count} onChange={e => setRuleForm(f => ({ ...f, suspension_match_count: +e.target.value }))} />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Phạt tiền / thẻ vàng">
                      <input type="number" min="0" step="0.01" className={INPUT} value={ruleForm.fine_per_yellow_card} onChange={e => setRuleForm(f => ({ ...f, fine_per_yellow_card: +e.target.value }))} />
                    </FormField>
                    <FormField label="Phạt tiền / thẻ đỏ">
                      <input type="number" min="0" step="0.01" className={INPUT} value={ruleForm.fine_per_red_card} onChange={e => setRuleForm(f => ({ ...f, fine_per_red_card: +e.target.value }))} />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Thưởng / bàn thắng">
                      <input type="number" min="0" step="0.01" className={INPUT} value={ruleForm.bonus_per_goal} onChange={e => setRuleForm(f => ({ ...f, bonus_per_goal: +e.target.value }))} />
                    </FormField>
                    <FormField label="Thưởng / kiến tạo">
                      <input type="number" min="0" step="0.01" className={INPUT} value={ruleForm.bonus_per_assist} onChange={e => setRuleForm(f => ({ ...f, bonus_per_assist: +e.target.value }))} />
                    </FormField>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= STEP 3: GROUP COUNT (auto-skip nếu format = knockout thuần) ================= */}
        {step === 3 && hasGroupPhase && (
          <div className="bg-navy-dark/50 p-6 rounded-2xl border border-navy-light animate-fade-in text-center space-y-4">
            <p className="text-gray-400 text-sm">
              Thể thức <span className="text-white font-bold">{activeFormatMeta.label}</span> — nhập số lượng bảng đấu cho vòng round-robin.
            </p>
            <div className="flex justify-center items-center gap-4">
              <label className="font-bold text-white">Số lượng Group:</label>
              <input type="number" min="1" max="32" className={`${INPUT} w-24 text-center text-xl font-black`} value={groupCount} onChange={e => setGroupCount(+e.target.value)} />
            </div>
          </div>
        )}

        {/* ================= STEP 4: SEASON ================= */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 flex items-center gap-2 text-xs text-blue-300">
              <Info className="w-4 h-4 shrink-0" />
              Season sẽ thi đấu theo thể thức: <span className="font-bold">{activeFormatMeta.label}</span>
            </div>
            <div className="bg-navy-dark/50 p-4 rounded-2xl border border-navy-light space-y-4">
              <FormField label="Tên mùa giải" required>
                <input className={INPUT} value={seasonForm.name} onChange={e => setSeasonForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Season 2026 - Mùa Hè" />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Ngày bắt đầu" required>
                  <input type="date" className={INPUT} value={seasonForm.start_date} onChange={e => setSeasonForm(f => ({ ...f, start_date: e.target.value }))} />
                </FormField>
                <FormField label="Ngày kết thúc" required>
                  <input type="date" className={INPUT} value={seasonForm.end_date} onChange={e => setSeasonForm(f => ({ ...f, end_date: e.target.value }))} />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Số đội tối đa">
                  <input type="number" className={INPUT} value={seasonForm.max_teams} onChange={e => setSeasonForm(f => ({ ...f, max_teams: +e.target.value }))} />
                </FormField>
                <FormField label="Hạn chót đăng ký">
                  <input type="date" className={INPUT} value={seasonForm.registration_deadline} onChange={e => setSeasonForm(f => ({ ...f, registration_deadline: e.target.value }))} />
                </FormField>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center cursor-pointer gap-3">
                  <div className="relative">
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