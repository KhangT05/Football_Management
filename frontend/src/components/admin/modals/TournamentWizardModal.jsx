import { useEffect } from 'react';
import { create } from 'zustand';
import { Trophy, LayoutGrid, Loader2, UploadCloud, Check } from 'lucide-react';
import AdminModal from '../AdminModal';
import FormField from '../../ui/FormField';
import { tournamentApi, tournamentRuleApi, seasonApi, groupApi } from '../../../api';
import useToastStore from '../../../store/toastStore';
import { initialWizardState, INPUT, STEP_META } from '../../../data/data';

const useWizardStore = create((set) => ({
  ...initialWizardState,
  setStep: (step) => set(typeof step === 'function' ? (state) => ({ step: step(state.step) }) : { step }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setTournamentMode: (tournamentMode) => set({ tournamentMode }),
  setTournaments: (tournaments) => set({ tournaments }),
  setTournamentForm: (updater) => set((state) => ({ tournamentForm: typeof updater === 'function' ? updater(state.tournamentForm) : updater })),
  setSelectedTournamentId: (selectedTournamentId) => set({ selectedTournamentId }),
  setLogoPreview: (logoPreview) => set({ logoPreview }),
  setRuleForm: (updater) => set((state) => ({ ruleForm: typeof updater === 'function' ? updater(state.ruleForm) : updater })),
  setFormat: (format) => set({ format }),
  setGroupCount: (groupCount) => set({ groupCount }),
  setSeasonForm: (updater) => set((state) => ({ seasonForm: typeof updater === 'function' ? updater(state.seasonForm) : updater })),
  reset: () => set(initialWizardState),
}));

export default function TournamentWizardModal({ onClose, onSuccess }) {
  const toast = useToastStore();
  const {
    step, setStep,
    isSubmitting, setIsSubmitting,
    tournamentMode, setTournamentMode,
    tournaments, setTournaments,
    tournamentForm, setTournamentForm,
    selectedTournamentId, setSelectedTournamentId,
    logoPreview, setLogoPreview,
    ruleForm, setRuleForm,
    format, setFormat,
    groupCount, setGroupCount,
    seasonForm, setSeasonForm,
    reset
  } = useWizardStore();

  useEffect(() => {
    return () => reset(); // Reset state khi đóng modal
  }, [reset]);

  // Fetch tournaments if mode is 'existing'
  useEffect(() => {
    if (tournamentMode === 'existing' && step === 1 && tournaments.length === 0) {
      tournamentApi.getAll({ per_page: 100, is_active: true })
        .then(res => setTournaments(res.data?.data || res.data || []))
        .catch(() => toast.error('Lỗi khi tải danh sách giải đấu'));
    }
  }, [tournamentMode, step, tournaments.length, toast, setTournaments]);

  const validateStep = () => {
    if (step === 1) {
      if (tournamentMode === 'new' && !tournamentForm.logo) return 'Vui lòng tải logo cho giải đấu';
      if (tournamentMode === 'new' && !tournamentForm.name.trim()) return 'Tên giải đấu không được để trống';
      if (tournamentMode === 'existing' && !selectedTournamentId) return 'Vui lòng chọn một giải đấu';
    }
    if (step === 3 && format.includes('round_robin') && (groupCount < 1 || groupCount > 32)) {
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
    if (err) {
      toast.warning(err);
      return;
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) {
      toast.warning(err);
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. Create or get Tournament ID
      let finalTournamentId = selectedTournamentId;
      if (tournamentMode === 'new') {
        const tRes = await tournamentApi.create(tournamentForm);
        finalTournamentId = tRes.data?.id || tRes.id;
      }

      // 2. Create Rule (pass format into it as well based on business rules)
      const rRes = await tournamentRuleApi.create({
        ...ruleForm,
        tournament_id: finalTournamentId,
        format
      });
      const finalRuleId = rRes.data?.id || rRes.id;

      // 3. Create Season (associate with tournament and rule)
      const formattedSeasonForm = {
        ...seasonForm,
        start_date: seasonForm.start_date ? `${seasonForm.start_date}T00:00:00` : undefined,
        end_date: seasonForm.end_date ? `${seasonForm.end_date}T23:59:59` : undefined,
        registration_deadline: seasonForm.registration_deadline ? `${seasonForm.registration_deadline}T23:59:59` : undefined,
      };

      const sRes = await seasonApi.create({
        ...formattedSeasonForm,
        is_active: true,
        group_count: format.includes('round_robin') ? Number(groupCount) : 0,
        tournament_id: finalTournamentId,
        tournament_rule_id: finalRuleId
      });
      const finalSeasonId = sRes.data?.id || sRes.id;

      // 4. Generate Groups if round_robin
      if (format.includes('round_robin') && groupCount > 0) {
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

  const renderStepper = () => {
    const current = STEP_META[step - 1];
    return (
      <div className="mb-8">
        {/* Header động: cho biết đang ở bước nào và bước đó làm gì */}
        <div className="mb-6">
          <p className="text-xs font-mono tracking-widest text-blue-400 uppercase mb-1">
            Bước {step} / {STEP_META.length}
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
            style={{ width: `${((step - 1) / (STEP_META.length - 1)) * 100}%` }}
          ></div>

          {STEP_META.map(s => {
            const isDone = step > s.id;
            const isActive = step === s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                <div className="relative">
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping"></span>
                  )}
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${
                      isDone
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
                  className={`text-[11px] font-bold uppercase tracking-wider hidden sm:block ${
                    isActive ? 'text-amber-400' : isDone ? 'text-blue-400' : 'text-gray-500'
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

  return (
    <AdminModal
      title="Tạo Giải Đấu Mới"
      icon={Trophy}
      iconClass="text-blue-400"
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white bg-navy border border-navy-light hover:bg-navy-light transition-colors">
            Hủy
          </button>
          {step < 4 ? (
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

      <div className="min-h-[350px] animate-slide-up">
        {/* ================= STEP 1 ================= */}
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
                  <div className="relative group cursor-pointer" onClick={() => document.getElementById('wizard-logo-upload').click()}>
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
                  <input id="wizard-logo-upload" type="file" accept="image/*" className="hidden" onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      setTournamentForm(f => ({ ...f, logo: file }));
                      setLogoPreview(URL.createObjectURL(file));
                    }
                  }} />
                  {!logoPreview && <span className="text-xs text-red-400/80 italic">Logo là bắt buộc để tạo giải đấu</span>}
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

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="space-y-4 bg-navy-dark/50 p-4 rounded-2xl border border-navy-light animate-fade-in">
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Điểm trận Thắng" required>
                <input type="number" className={INPUT} value={ruleForm.points_per_win} onChange={e => setRuleForm(f => ({...f, points_per_win: +e.target.value}))} />
              </FormField>
              <FormField label="Điểm trận Hòa" required>
                <input type="number" className={INPUT} value={ruleForm.points_per_draw} onChange={e => setRuleForm(f => ({...f, points_per_draw: +e.target.value}))} />
              </FormField>
              <FormField label="Điểm trận Thua" required>
                <input type="number" className={INPUT} value={ruleForm.points_per_loss} onChange={e => setRuleForm(f => ({...f, points_per_loss: +e.target.value}))} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Số người tối đa / đội" required>
                <input type="number" className={INPUT} value={ruleForm.max_players_per_team} onChange={e => setRuleForm(f => ({...f, max_players_per_team: +e.target.value}))} />
              </FormField>
              <FormField label="Số người tối thiểu" required>
                <input type="number" className={INPUT} value={ruleForm.min_players_per_team} onChange={e => setRuleForm(f => ({...f, min_players_per_team: +e.target.value}))} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Án treo giò (thẻ vàng)" required>
                <input type="number" className={INPUT} value={ruleForm.yellow_cards_suspension} onChange={e => setRuleForm(f => ({...f, yellow_cards_suspension: +e.target.value}))} />
              </FormField>
              <FormField label="Điểm xử thua (Forfeit)" required>
                <input type="number" className={INPUT} value={ruleForm.forfeit_score} onChange={e => setRuleForm(f => ({...f, forfeit_score: +e.target.value}))} />
              </FormField>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${format === 'round_robin' ? 'border-emerald-500 bg-emerald-500/10' : 'border-navy-light bg-navy hover:border-gray-600'}`}>
                <input type="radio" className="hidden" checked={format === 'round_robin'} onChange={() => setFormat('round_robin')} />
                <LayoutGrid className={`w-8 h-8 ${format === 'round_robin' ? 'text-emerald-400' : 'text-gray-500'}`} />
                <span className={`font-bold ${format === 'round_robin' ? 'text-white' : 'text-gray-400'}`}>Vòng tròn (Chia bảng)</span>
              </label>

              <label className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${format === 'knockout' ? 'border-orange-500 bg-orange-500/10' : 'border-navy-light bg-navy hover:border-gray-600'}`}>
                <input type="radio" className="hidden" checked={format === 'knockout'} onChange={() => setFormat('knockout')} />
                <Trophy className={`w-8 h-8 ${format === 'knockout' ? 'text-orange-400' : 'text-gray-500'}`} />
                <span className={`font-bold ${format === 'knockout' ? 'text-white' : 'text-gray-400'}`}>Loại trực tiếp (Knockout)</span>
              </label>
            </div>

            {format === 'round_robin' && (
              <div className="bg-navy-dark/50 p-6 rounded-2xl border border-navy-light animate-fade-in text-center space-y-4">
                <p className="text-gray-400 text-sm">Vui lòng nhập số lượng bảng đấu bạn muốn chia.</p>
                <div className="flex justify-center items-center gap-4">
                  <label className="font-bold text-white">Số lượng Group:</label>
                  <input type="number" min="1" max="32" className={`${INPUT} w-24 text-center text-xl font-black`} value={groupCount} onChange={e => setGroupCount(+e.target.value)} />
                </div>
              </div>
            )}

            {format === 'knockout' && (
              <div className="bg-navy-dark/50 p-6 rounded-2xl border border-navy-light animate-fade-in text-center">
                <p className="text-gray-400 text-sm">Hệ thống sẽ tự động tạo sơ đồ Knockout dựa trên số lượng đội được duyệt.<br/>Bạn không cần cấu hình thêm ở bước này.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 4 ================= */}
        {step === 4 && (
          <div className="space-y-4 bg-navy-dark/50 p-4 rounded-2xl border border-navy-light animate-fade-in">
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
        )}
      </div>
    </AdminModal>
  );
}