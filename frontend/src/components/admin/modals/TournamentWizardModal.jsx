import { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Trophy, LayoutGrid, Loader2, UploadCloud, Check, Settings,
  CalendarDays, ArrowLeft, Info,
} from 'lucide-react';
import AdminModal from '../AdminModal';
import FormField from '../../ui/FormField';
import { INPUT } from '../../../data/data';
import useToastStore from '../../../store/toastStore';

import StepRule from './Steprule';
import StepSeason from './Stepseason';

import { wizardSchema, defaultWizardValues } from '../../../schemas/wizard.schema';
import { ruleDtoToFormValues } from '../../../schemas/wizard.mappers';
import { getFormatMeta, safeInt } from '../../../schemas/wizard.constants';
import { useTournamentsQuery, useRuleTemplatesQuery, useSubmitWizard } from '../../../queries/wizard.queries';

const STEP_META = [
  { id: 1, title: 'Giải đấu', subtitle: 'Chọn giải đấu mới hoặc giải đã có', icon: Trophy },
  { id: 2, title: 'Luật & Thể thức', subtitle: 'Season này sẽ thi đấu theo thể thức nào', icon: Settings },
  { id: 3, title: 'Vòng bảng', subtitle: 'Số lượng bảng đấu cho vòng round-robin', icon: LayoutGrid },
  { id: 4, title: 'Mùa giải', subtitle: 'Thời gian, số đội, hạn đăng ký', icon: CalendarDays },
];

const STEP_FIELDS = {
  1: ['tournamentMode', 'tournamentNew', 'existingTournamentId'],
  2: ['ruleSourceId', 'rule'],
  3: ['groupCount'],
  4: ['season'],
};

// Gom message lỗi từ 1 nhánh RHF errors (chỉ dùng để tóm tắt lên toast — inline FormField
// đã hiện lỗi tại chỗ rồi, không cần list đầy đủ path).
const collectErrorMessages = (errNode) => {
  if (!errNode) return [];
  if (errNode.message) return [errNode.message];
  return Object.values(errNode).flatMap((v) => (v && typeof v === 'object' ? collectErrorMessages(v) : []));
};

const blockNonNumericKeys = (e) => {
  if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
};

export default function TournamentWizardModal({ onClose, onSuccess }) {
  const toast = useToastStore();
  const logoInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [step, setStep] = useState(1);

  const methods = useForm({
    resolver: zodResolver(wizardSchema),
    defaultValues: defaultWizardValues,
    mode: 'onSubmit',
  });
  const {
    control, register, setValue, trigger, handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const tournamentMode = useWatch({ control, name: 'tournamentMode' });
  const existingTournamentId = useWatch({ control, name: 'existingTournamentId' });
  const ruleMode = useWatch({ control, name: 'ruleMode' });
  const ruleSourceId = useWatch({ control, name: 'ruleSourceId' });
  const format = useWatch({ control, name: 'rule.format' });

  const { data: tournaments = [] } = useTournamentsQuery(tournamentMode === 'existing');

  // Cùng queryKey với query bên trong StepRule -> react-query cache dedupe, KHÔNG bắn
  // thêm request. Chỉ để tự tra selectedRuleTemplate.__formShape phục vụ check
  // "usingTemplateAsIs" trong useSubmitWizard (StepRule không lift state này lên).
  const effectiveTournamentId = tournamentMode === 'existing' ? existingTournamentId : null;
  const { data: ruleTemplates = [] } = useRuleTemplatesQuery(ruleMode === 'template' ? effectiveTournamentId : null);
  const selectedRuleTemplate = useMemo(() => {
    const rule = ruleTemplates.find((r) => String(r.id) === String(ruleSourceId));
    return rule ? { ...rule, __formShape: ruleDtoToFormValues(rule) } : null;
  }, [ruleTemplates, ruleSourceId]);

  const activeFormatMeta = getFormatMeta(format);
  const isCustomFormat = activeFormatMeta.value === 'custom';
  const hasGroupPhase = isCustomFormat ? false : activeFormatMeta.hasGroupPhase;

  const visibleSteps = STEP_META.filter((s) => s.id !== 3 || hasGroupPhase);
  const currentVisibleIndex = visibleSteps.findIndex((s) => s.id === step);
  const displayIndex = currentVisibleIndex === -1 ? visibleSteps.length : currentVisibleIndex + 1;
  const isLastStep = step === 4;

  useEffect(() => () => { if (logoPreview) URL.revokeObjectURL(logoPreview); }, [logoPreview]);

  const submitWizard = useSubmitWizard(selectedRuleTemplate);

  const nextStepAfterRule = () => (hasGroupPhase ? 3 : 4);
  const prevStepBeforeSeason = () => (hasGroupPhase ? 3 : 2);

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) {
      const msgs = STEP_FIELDS[step].flatMap(
        (f) => collectErrorMessages(f.split('.').reduce((acc, k) => acc?.[k], errors)),
      );
      toast.warning(msgs[0] || 'Vui lòng kiểm tra lại các thông tin chưa hợp lệ.', {
        details: msgs.length > 1 ? msgs : undefined,
      });
      return;
    }
    setStep(step === 2 ? nextStepAfterRule() : step + 1);
  };

  const goBack = () => setStep(step === 4 ? prevStepBeforeSeason() : step - 1);

  const handleLogoChange = (e, onChange) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.warning('Logo phải là file ảnh'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.warning('Logo tối đa 5MB'); return; }
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    onChange(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values) => {
    try {
      const result = await submitWizard.mutateAsync(values);
      if (result.warning) {
        toast.warning(result.warning);
      } else if (result.finalIsCustom && result.customStagesCount > 1) {
        toast.success('Khởi tạo Giải đấu và Mùa giải thành công! Stage đầu tiên đã sẵn sàng — các stage tiếp theo cần kích hoạt thủ công sau khi stage đầu kết thúc.');
      } else if (!result.finalIsCustom && result.finalFormat === 'knockout') {
        toast.success('Khởi tạo Giải đấu và Mùa giải thành công! Vào mục Knockout để tạo sơ đồ bracket (chọn seed thủ công).');
      } else {
        toast.success('Khởi tạo Giải đấu và Mùa giải thành công!');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const backendMessage = err?.response?.data?.body?.message || err?.response?.data?.message || '';
      const backendCode = err?.response?.data?.body?.code || err?.response?.data?.code || '';
      const isDuplicateName = backendMessage.includes('Unique constraint');
      const isValidationError = backendCode === 'VALIDATION_ERROR' || /validation/i.test(backendMessage);
      let friendlyMessage = 'Đã xảy ra lỗi trong quá trình khởi tạo, vui lòng thử lại.';
      if (isDuplicateName) friendlyMessage = 'Tên giải đấu đã tồn tại, vui lòng chọn tên khác.';
      else if (isValidationError) friendlyMessage = 'Dữ liệu nhập chưa hợp lệ, vui lòng kiểm tra lại các trường bắt buộc rồi thử lại.';
      toast.apiError(err, friendlyMessage);
    }
  };

  const renderStepper = () => {
    const current = STEP_META[step - 1];
    return (
      <div className="mb-8">
        <div className="mb-6">
          <p className="text-xs font-mono tracking-widest text-blue-400 uppercase mb-1">
            Bước {displayIndex} / {visibleSteps.length}
          </p>
          <h3 className="text-xl font-black text-white uppercase tracking-tight leading-none">{current.title}</h3>
          <p className="text-sm text-gray-400 mt-1">{current.subtitle}</p>
        </div>
        <div className="flex items-center justify-between relative max-w-2xl">
          <div className="absolute left-0 top-5 w-full h-1 bg-navy-light -z-10 rounded-full" />
          <div
            className="absolute left-0 top-5 h-1 bg-linear-to-r from-blue-600 to-blue-400 -z-10 rounded-full transition-all duration-500"
            style={{ width: `${(visibleSteps.length > 1 ? (displayIndex - 1) / (visibleSteps.length - 1) : 0) * 100}%` }}
          />
          {visibleSteps.map((s, idx) => {
            const isDone = displayIndex > idx + 1;
            const isActive = displayIndex === idx + 1;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                <div className="relative">
                  {isActive && <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping" />}
                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${isDone ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : isActive ? 'bg-navy border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]' : 'bg-navy border-navy-light text-gray-500'}`}>
                    {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider hidden sm:block ${isActive ? 'text-amber-400' : isDone ? 'text-blue-400' : 'text-gray-500'}`}>{s.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <FormProvider {...methods}>
      <AdminModal
        title="Tạo Giải Đấu Mới"
        icon={Trophy}
        iconClass="text-blue-400"
        onClose={onClose}
        size="4xl"
        footer={
          <>
            {step > 1 ? (
              <button onClick={goBack} className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white bg-navy border border-navy-light hover:bg-navy-light transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>
            ) : (
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white bg-navy border border-navy-light hover:bg-navy-light transition-colors">Hủy</button>
            )}
            {!isLastStep ? (
              <button onClick={goNext} className="px-6 py-2.5 rounded-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/40 transition-all">Tiếp tục</button>
            ) : (
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || submitWizard.isPending}
                className="px-6 py-2.5 rounded-xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-emerald-900/40 transition-all"
              >
                {(isSubmitting || submitWizard.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
                Hoàn tất khởi tạo
              </button>
            )}
          </>
        }
      >
        {renderStepper()}
        <div className="min-h-[440px] animate-slide-up">
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${tournamentMode === 'new' ? 'border-blue-500 bg-blue-500/10' : 'border-navy-light bg-navy hover:border-gray-600'}`}>
                  <input type="radio" className="hidden" checked={tournamentMode === 'new'} onChange={() => setValue('tournamentMode', 'new')} />
                  <Trophy className={`w-9 h-9 shrink-0 ${tournamentMode === 'new' ? 'text-blue-400' : 'text-gray-500'}`} />
                  <div>
                    <span className={`font-bold block ${tournamentMode === 'new' ? 'text-white' : 'text-gray-400'}`}>Tạo giải đấu mới</span>
                    <span className="text-xs text-gray-500">Nhập tên, mô tả và logo cho giải đấu</span>
                  </div>
                </label>
                <label className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${tournamentMode === 'existing' ? 'border-indigo-500 bg-indigo-500/10' : 'border-navy-light bg-navy hover:border-gray-600'}`}>
                  <input type="radio" className="hidden" checked={tournamentMode === 'existing'} onChange={() => setValue('tournamentMode', 'existing')} />
                  <LayoutGrid className={`w-9 h-9 shrink-0 ${tournamentMode === 'existing' ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <div>
                    <span className={`font-bold block ${tournamentMode === 'existing' ? 'text-white' : 'text-gray-400'}`}>Chọn giải hiện có</span>
                    <span className="text-xs text-gray-500">Thêm một mùa giải mới vào giải đấu đã tồn tại</span>
                  </div>
                </label>
              </div>

              {tournamentMode === 'new' ? (
                <div className="flex gap-5 animate-fade-in bg-navy-dark/50 p-5 rounded-2xl border border-navy-light">
                  <Controller
                    name="tournamentNew.logo"
                    control={control}
                    render={({ field }) => (
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
                        <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoChange(e, field.onChange)} />
                        {!logoPreview && <span className="text-[11px] text-red-400/80 italic text-center">Bắt buộc<br />tối đa 5MB</span>}
                      </div>
                    )}
                  />
                  <div className="flex-1 space-y-4 min-w-0">
                    <FormField label="Tên giải đấu" required error={errors?.tournamentNew?.name?.message}>
                      <input className={INPUT} {...register('tournamentNew.name')} placeholder="Nhập tên giải..." />
                    </FormField>
                    <FormField label="Mô tả">
                      <textarea rows={4} className={`${INPUT} resize-none`} {...register('tournamentNew.description')} placeholder="Mô tả giải đấu..." />
                    </FormField>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in bg-navy-dark/50 p-5 rounded-2xl border border-navy-light">
                  <FormField label="Chọn giải đấu" required error={errors?.existingTournamentId?.message}>
                    <select className={INPUT} {...register('existingTournamentId')}>
                      <option value="">-- Chọn một giải đấu --</option>
                      {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
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

          {step === 2 && <StepRule />}

          {step === 3 && hasGroupPhase && (
            <div className="max-w-xl mx-auto bg-navy-dark/50 p-8 rounded-2xl border border-navy-light animate-fade-in text-center space-y-5">
              <LayoutGrid className="w-10 h-10 text-blue-400 mx-auto" />
              <p className="text-gray-400 text-sm">
                Thể thức <span className="text-white font-bold">{activeFormatMeta.label}</span> — nhập số lượng bảng đấu cho vòng round-robin.
              </p>
              <div className="flex justify-center items-center gap-4">
                <label className="font-bold text-white">Số lượng Group:</label>
                <Controller
                  name="groupCount"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number" min="1" max="32" inputMode="numeric"
                      className={`${INPUT} w-28 text-center text-2xl font-black`}
                      value={field.value}
                      onKeyDown={blockNonNumericKeys}
                      onChange={(e) => field.onChange(safeInt(e.target.value, 1))}
                    />
                  )}
                />
              </div>
              <p className="text-xs text-gray-500">Từ 1 đến 32 bảng.</p>
            </div>
          )}

          {step === 4 && <StepSeason />}
        </div>
      </AdminModal>
    </FormProvider>
  );
}