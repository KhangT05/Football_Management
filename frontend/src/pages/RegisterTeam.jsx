import { useState, useEffect } from 'react';
import {
  UploadCloud, ShieldCheck, CheckCircle2, Trophy, Loader2, ArrowRight, ArrowLeft, X,
  Users, Plus, Trash2, Info, FileSpreadsheet, Upload, FileDown, Shield, UserPlus,
} from 'lucide-react';
import useToastStore from '../store/toastStore';
import useAuthStore from '../store/authStore';
import { teamApi } from '../api/teamApi';
import { seasonTeamApi } from '../api/seasonTeamApi';
import { playerApi } from '../api/playerApi';
import useSeasonStore from '../store/seasonStore';
import { useNavigate } from 'react-router-dom';

// parseList giống MyTeam.jsx — API có thể trả {data:{data:[...]}} hoặc {data:[...]} tùy endpoint,
// tách riêng để không phải import chéo component.
const parseList = (res) => {
  const payload = (typeof res?.status === 'boolean') ? res.data : res;
  return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
};

export default function RegisterTeam() {
  const toast = useToastStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { seasons, fetchAll: fetchSeasons } = useSeasonStore();

  // ── Step control ──
  // 'loading' : đang check xem user đã có team nào chưa
  // 'choice'  : user đã có ≥1 team → hỏi "thêm CT vào team cũ" hay "tạo team mới"
  // 'info'    : form tạo team (mặc định nếu chưa có team nào)
  // 'roster'  : sau khi tạo team mới xong → nhập đội hình (tùy chọn)
  const [step, setStep] = useState('loading');
  const [existingTeams, setExistingTeams] = useState([]);
  const [createdTeam, setCreatedTeam] = useState(null); // { id, name }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const openSeasons = seasons.filter(s => s.status === 'registration_open');

  useEffect(() => {
    fetchSeasons({ per_page: 50, sort: 'id', direction: 'desc' });
  }, [fetchSeasons]);

  // ── FIX: check team hiện có trước khi bắt user tạo mới ──
  // Fail-open: nếu API lỗi, coi như chưa có team nào (step 'info') thay vì
  // chặn hẳn — velocity > edge-case safety cho 1 lần check onboarding.
  useEffect(() => {
    let cancelled = false;
    const checkExisting = async () => {
      if (!user?.id) { setStep('info'); return; }
      try {
        const res = await teamApi.getTeams({ per_page: 50 });
        const mine = parseList(res).filter(t => t.user_id === user.id);
        if (cancelled) return;
        setExistingTeams(mine);
        setStep(mine.length > 0 ? 'choice' : 'info');
      } catch (err) {
        console.warn('Cannot check existing teams:', err);
        if (!cancelled) setStep('info');
      }
    };
    checkExisting();
    return () => { cancelled = true; };
  }, [user?.id]);

  const [teamInfo, setTeamInfo] = useState({
    name: '',
    coach_name: '',
    description: '',
    jersey_color: '#ffffff',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');

  // ── Phương thức nhập cầu thủ ──
  const [playerInputMode, setPlayerInputMode] = useState('manual');
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileName, setExcelFileName] = useState('');

  const [players, setPlayers] = useState([
    { id: 1, email: '', name: '', number: '', position: 'goalkeeper' },
    { id: 2, email: '', name: '', number: '', position: 'defender' },
    { id: 3, email: '', name: '', number: '', position: 'midfielder' },
    { id: 4, email: '', name: '', number: '', position: 'midfielder' },
    { id: 5, email: '', name: '', number: '', position: 'forward' },
  ]);

  const addPlayer = () => {
    setPlayers([...players, { id: Date.now(), email: '', name: '', number: '', position: 'midfielder' }]);
  };

  const removePlayer = (id) => {
    if (players.length <= 5) {
      toast.warning('Đội bóng cần tối thiểu 5 thành viên!');
      return;
    }
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayer = (id, field, value) => {
    setPlayers(players.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleChange = (e) => {
    setTeamInfo({ ...teamInfo, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh (JPG, PNG)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước ảnh tối đa là 2MB');
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleExcelChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      toast.error('Vui lòng chọn file Excel hợp lệ (.xlsx, .xls)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file tối đa là 5MB');
      return;
    }
    setExcelFile(file);
    setExcelFileName(file.name);
  };

  const removeExcelFile = () => {
    setExcelFile(null);
    setExcelFileName('');
  };

  const handleDownloadTemplate = async (e) => {
    e.preventDefault();
    setIsDownloadingTemplate(true);
    try {
      const res = await playerApi.downloadImportTemplate();
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
      if (!blob.size) throw new Error('File mẫu rỗng, vui lòng thử lại.');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'import-cau-thu-mau.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Không thể tải file mẫu Excel.');
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  // ── BƯỚC 1: chỉ tạo Team (+ đăng ký mùa giải nếu có chọn) ──
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamInfo.name.trim()) {
      toast.error('Vui lòng nhập tên đội bóng!');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: teamInfo.name,
        coach_name: teamInfo.coach_name || '',
        description: teamInfo.description || '',
        jersey_color: teamInfo.jersey_color || '#ffffff',
      };
      if (logoFile) payload.logo = logoFile;

      const teamRes = await teamApi.registerTeam(payload);
      const newTeamId = teamRes?.data?.id || teamRes?.id || (Array.isArray(teamRes?.data?.data) ? teamRes?.data?.data[0]?.id : null);

      if (!newTeamId) {
        throw new Error('Không lấy được ID đội bóng vừa tạo.');
      }

      if (selectedSeasonId) {
        await seasonTeamApi.register({ season_id: parseInt(selectedSeasonId) });
      }

      setCreatedTeam({ id: newTeamId, name: teamInfo.name });
      toast.success('Tạo đội bóng thành công! Giờ bạn có thể thêm cầu thủ.', 4000);
      setStep('roster');
    } catch (error) {
      const msg = error?.response?.data?.message || 'Có lỗi xảy ra khi tạo đội. Vui lòng thử lại!';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── BƯỚC 2: chỉ import cầu thủ vào team đã tạo — KHÔNG tạo lại team ──
  const handleAddPlayers = async () => {
    if (!createdTeam?.id) return;
    setIsSubmitting(true);
    try {
      if (playerInputMode === 'excel' && excelFile) {
        const formData = new FormData();
        formData.append('file', excelFile);
        await playerApi.importTeamPlayers(createdTeam.id, formData);
        toast.success('Import danh sách cầu thủ thành công!', 5000);
      } else if (playerInputMode === 'manual') {
        const validPlayers = players.filter(p => p.email.trim() && p.name.trim());
        const skipped = players.length - validPlayers.length;
        if (skipped > 0) {
          toast.warning(`${skipped} dòng bị bỏ qua vì thiếu email hoặc họ tên.`);
        }

        let successCount = 0;
        const failedNames = [];

        for (const p of validPlayers) {
          try {
            await playerApi.createForTeam(createdTeam.id, {
              name: p.name.trim(),
              user_email: p.email.trim(),
              date_of_birth: p.date_of_birth || '2000-01-01', // TODO: thêm ô nhập ngày sinh cho chính xác
              position: p.position || 'forward',
              jersey_number: parseInt(p.number, 10),
            });
            successCount++;
          } catch (e) {
            console.error('Lỗi thêm cầu thủ:', e);
            failedNames.push(p.name || p.email);
          }
        }

        if (successCount > 0) {
          toast.success(`Đã thêm ${successCount} cầu thủ. Email mời đặt mật khẩu đã được gửi tới từng người.`, 5000);
        }
        if (failedNames.length > 0) {
          toast.error(`Không thêm được: ${failedNames.join(', ')}`);
        }
      }

      setIsSuccess(true);
      setTimeout(() => navigate('/doi-cua-toi'), 2000);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Có lỗi khi thêm cầu thủ. Vui lòng thử lại!';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipRoster = () => {
    toast.success('Đã tạo đội bóng! Bạn có thể thêm cầu thủ sau tại trang Quản Lý Đội.', 4000);
    navigate('/doi-cua-toi');
  };

  // Chọn "thêm cầu thủ vào team đã có" → sang MyTeam, active đúng team + auto mở modal add player
  const handleAddPlayerToExisting = (teamId) => {
    navigate('/doi-cua-toi', { state: { autoOpenAddPlayer: true, teamId } });
  };

  // ── Loading state (đang check existing teams) ──
  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-dark">
        <Loader2 className="w-8 h-8 text-neon animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pt-24 pb-20 overflow-x-hidden bg-navy-dark">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[150px] opacity-20 translate-y-1/3 -translate-x-1/4 z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─────────────────────────────────────────────────────
            STEP: choice — user đã có ≥1 team, hỏi muốn làm gì
        ───────────────────────────────────────────────────── */}
        {step === 'choice' && (
          <div className="animate-slide-up">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                Bạn Muốn <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-neon italic">Làm Gì?</span>
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto text-base">
                Bạn đã có {existingTeams.length} đội bóng. Chọn thêm cầu thủ vào đội có sẵn, hoặc tạo một đội hoàn toàn mới.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Card: thêm CT vào team có sẵn */}
              <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-4xl p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                    <UserPlus className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-wide">Thêm Cầu Thủ</h2>
                </div>
                <p className="text-gray-400 text-sm mb-6">Chọn một đội bóng đã có để thêm cầu thủ vào đội hình.</p>

                <div className="space-y-3 mb-6 flex-1 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                  {existingTeams.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleAddPlayerToExisting(t.id)}
                      className="w-full flex items-center gap-3 p-4 rounded-2xl border border-navy-light bg-navy-dark/50 hover:border-emerald-500/50 hover:bg-navy-light/40 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center shrink-0 border border-navy-light">
                        <Shield className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white text-sm truncate">{t.name}</p>
                        <p className="text-xs text-gray-500">{t.is_active ? 'Đang hoạt động' : 'Chờ duyệt'}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Card: tạo team mới */}
              <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-4xl p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-wide">Tạo Đội Mới</h2>
                </div>
                <p className="text-gray-400 text-sm mb-6 flex-1">
                  Khởi tạo một đội bóng hoàn toàn mới, độc lập với các đội hiện có của bạn. Phù hợp nếu bạn quản lý nhiều đội cùng lúc.
                </p>
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-sm bg-blue-600 text-white hover:bg-blue-500 hover:-translate-y-0.5 transition-all shadow-[0_8px_30px_rgba(37,99,235,0.3)]"
                >
                  Khởi Tạo Đội Bóng <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────
            STEP: info / roster — flow tạo team gốc
        ───────────────────────────────────────────────────── */}
        {(step === 'info' || step === 'roster') && (
          <>
            <div className="text-center mb-12 animate-slide-up relative">
              {existingTeams.length > 0 && step === 'info' && (
                <button
                  type="button"
                  onClick={() => setStep('choice')}
                  className="absolute left-0 top-1 flex items-center gap-2 text-gray-400 hover:text-white text-sm font-bold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Quay lại
                </button>
              )}
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                Thiết Lập <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-neon italic">Đội Bóng</span>
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto text-base">
                {step === 'info'
                  ? 'Tạo đội bóng của riêng bạn trước, sau đó thiết lập danh sách đội hình thi đấu.'
                  : `Đội "${createdTeam?.name}" đã được tạo. Giờ hãy thêm cầu thủ vào đội hình.`}
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-3 mb-10 animate-fade-in">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${step === 'info' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                {step === 'roster' ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-4 h-4 rounded-full bg-blue-400 text-navy-dark flex items-center justify-center text-[10px]">1</span>}
                Tạo đội bóng
              </div>
              <div className="w-8 h-px bg-navy-light" />
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${step === 'roster' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-navy border-navy-light text-gray-500'}`}>
                <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">2</span>
                Thêm cầu thủ
              </div>
            </div>

            {isSuccess && (
              <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center gap-5 animate-fade-in shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0 shadow-inner">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <p className="text-emerald-400 font-black text-xl mb-1">Thiết lập thành công!</p>
                  <p className="text-emerald-500/80 text-sm font-medium">Hệ thống đang chuyển hướng bạn đến khu vực quản lý...</p>
                </div>
              </div>
            )}

            {step === 'info' && (
              <form onSubmit={handleCreateTeam} className="space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-black/40">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16">

                    <div className="space-y-8">
                      <div className="flex items-center gap-4 border-b border-navy-light pb-5">
                        <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                          <ShieldCheck className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-wider">Hồ Sơ Đội Bóng</h2>
                      </div>

                      <div className="space-y-6">
                        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
                          <div className="relative group shrink-0">
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-navy-light flex items-center justify-center overflow-hidden bg-navy-dark relative hover:border-blue-500 transition-colors">
                              {logoPreview ? (
                                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-center">
                                  <UploadCloud className="w-8 h-8 text-gray-500 mx-auto mb-1 group-hover:text-blue-400 transition-colors" />
                                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tải Logo</span>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </div>
                            {logoPreview && (
                              <button
                                type="button"
                                onClick={removeLogo}
                                className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="text-center sm:text-left mt-2">
                            <h3 className="text-white font-bold text-lg mb-1">Logo Đội Bóng</h3>
                            <p className="text-gray-500 text-xs leading-relaxed max-w-[250px]">
                              Hỗ trợ JPG, PNG. Dung lượng tối đa 2MB. Logo ấn tượng sẽ giúp đội của bạn nổi bật hơn!
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-300 ml-1">Tên Đội Bóng <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={teamInfo.name}
                            onChange={handleChange}
                            placeholder="VD: FC KTPM K21"
                            className="w-full bg-navy-dark/80 border border-navy-light rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-300 ml-1">Tên Huấn Luyện Viên</label>
                          <input
                            type="text"
                            name="coach_name"
                            value={teamInfo.coach_name}
                            onChange={handleChange}
                            placeholder="VD: Park Hang Seo"
                            className="w-full bg-navy-dark/80 border border-navy-light rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-300 ml-1">Mô Tả / Slogan</label>
                          <textarea
                            name="description"
                            value={teamInfo.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Mô tả ngắn gọn về tinh thần đội bóng..."
                            className="w-full bg-navy-dark/80 border border-navy-light rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium resize-none"
                          ></textarea>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-300 ml-1">Màu áo thi đấu chính</label>
                          <div className="flex items-center gap-4 bg-navy-dark/80 border border-navy-light rounded-2xl px-5 py-3">
                            <input
                              type="color"
                              name="jersey_color"
                              value={teamInfo.jersey_color}
                              onChange={handleChange}
                              className="w-12 h-12 rounded cursor-pointer border-none bg-transparent shrink-0"
                            />
                            <span className="text-gray-400 text-sm font-medium">Mã màu: <span className="text-white uppercase">{teamInfo.jersey_color}</span></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center gap-4 border-b border-navy-light pb-5">
                        <div className="p-3 bg-neon/20 rounded-xl border border-neon/30">
                          <Trophy className="w-6 h-6 text-neon" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-wider">Gia Nhập Giải Đấu</h2>
                      </div>

                      {openSeasons.length === 0 ? (
                        <div className="bg-navy-dark/80 border border-dashed border-navy-light rounded-3xl p-8 text-center flex flex-col items-center justify-center h-[300px]">
                          <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mb-4">
                            <Trophy className="w-8 h-8 text-gray-500" />
                          </div>
                          <h3 className="text-gray-300 font-bold mb-2">Chưa có giải đấu nào mở đăng ký</h3>
                          <p className="text-gray-500 text-sm max-w-xs mx-auto">
                            Bạn vẫn có thể tạo đội trước. Khi có giải đấu mới, bạn có thể đăng ký tham gia sau tại mục "Đội Của Tôi".
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                          <p className="text-gray-400 text-sm mb-4">Chọn một giải đấu đang mở đăng ký để tham gia ngay lập tức cùng đội bóng mới của bạn:</p>

                          {openSeasons.map(season => {
                            const isSelected = selectedSeasonId === String(season.id);
                            return (
                              <div
                                key={season.id}
                                onClick={() => setSelectedSeasonId(isSelected ? '' : String(season.id))}
                                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group flex items-center gap-4
                                  ${isSelected
                                    ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                                    : 'bg-navy-dark/50 border-navy-light hover:border-gray-500 hover:bg-navy-light'
                                  }`}
                              >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                  ${isSelected ? 'border-blue-400 bg-blue-500' : 'border-gray-500 group-hover:border-gray-400'}
                                `}>
                                  {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>

                                <div className="flex-1">
                                  <h4 className={`font-bold text-lg mb-1 transition-colors ${isSelected ? 'text-blue-400' : 'text-gray-200 group-hover:text-white'}`}>
                                    {season.name}
                                  </h4>
                                  <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span>Khai mạc: {new Date(season.start_date).toLocaleDateString('vi-VN')}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                    <span className="text-emerald-400 font-medium tracking-wide uppercase">Đang mở đăng ký</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      relative overflow-hidden group
                      flex items-center gap-3 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-base transition-all duration-300
                      ${isSubmitting
                        ? 'bg-blue-600/50 text-white/50 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-500 hover:-translate-y-1 shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.4)]'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">{selectedSeasonId ? 'Tạo Đội & Tham Gia Giải' : 'Khởi Tạo Đội Bóng'}</span>
                        <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 h-full w-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 'roster' && (
              <div className="space-y-8 animate-slide-up">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <p className="text-emerald-400 font-bold text-sm">
                    Đội bóng "<span className="text-white">{createdTeam?.name}</span>" đã được tạo thành công. Bước tiếp theo là tùy chọn.
                  </p>
                </div>

                <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-black/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-light pb-5 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                        <Users className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-wider">Đội Hình Thi Đấu</h2>
                        <p className="text-gray-400 text-sm mt-1">Thêm cầu thủ vào đội (Tùy chọn — có thể làm sau tại Quản Lý Đội)</p>
                      </div>
                    </div>

                    <div className="flex bg-navy-dark border border-navy-light rounded-xl p-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPlayerInputMode('manual')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${playerInputMode === 'manual'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-400 hover:text-white'
                          }`}
                      >
                        Nhập Thủ Công
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlayerInputMode('excel')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${playerInputMode === 'excel'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-gray-400 hover:text-white'
                          }`}
                      >
                        <FileSpreadsheet className="w-4 h-4" /> Import Excel
                      </button>
                    </div>
                  </div>

                  {playerInputMode === 'excel' ? (
                    <div className="animate-fade-in">
                      <div className="bg-navy border border-navy-light p-4 rounded-xl flex items-start gap-3 mb-8">
                        <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-red-400 leading-relaxed">
                          Tải lên file Excel (.xlsx, .xls) chứa danh sách cầu thủ của bạn. Hệ thống sẽ tự động đọc và gửi lời mời đến email của từng cầu thủ để họ xác nhận tham gia.
                          <br />
                          <button
                            type="button"
                            onClick={handleDownloadTemplate}
                            disabled={isDownloadingTemplate}
                            className="text-red-500 hover:text-red-400 underline font-medium mt-2 inline-flex items-center gap-1.5 disabled:opacity-60"
                          >
                            {isDownloadingTemplate ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                            Tải file mẫu tại đây
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-navy-light rounded-3xl bg-navy-dark/50 hover:border-emerald-500/50 transition-colors relative group">
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={handleExcelChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        {excelFile ? (
                          <div className="text-center relative z-20 pointer-events-none">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                              <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1">{excelFileName}</h3>
                            <p className="text-emerald-400 text-sm font-medium">Đã tải lên thành công • {(excelFile.size / 1024).toFixed(1)} KB</p>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                removeExcelFile();
                              }}
                              className="mt-6 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-bold transition-colors pointer-events-auto flex items-center gap-2 mx-auto"
                            >
                              <Trash2 className="w-4 h-4" /> Xóa file
                            </button>
                          </div>
                        ) : (
                          <div className="text-center pointer-events-none">
                            <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                              <Upload className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Kéo thả file Excel vào đây</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">
                              Hoặc click để chọn file từ máy tính của bạn (Tối đa 5MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <div className="flex justify-end mb-4">
                        <button
                          type="button"
                          onClick={addPlayer}
                          className="flex items-center justify-center gap-2 bg-navy-dark border border-navy-light hover:border-blue-500 text-gray-300 hover:text-blue-400 px-5 py-3 rounded-xl transition-all font-medium text-sm"
                        >
                          <Plus className="w-4 h-4" /> Thêm Cầu Thủ
                        </button>
                      </div>

                      <div className="bg-navy border border-navy-light p-4 rounded-xl flex items-start gap-3 mb-8">
                        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-300 leading-relaxed">
                          Nhập email và họ tên từng cầu thủ. Nếu email chưa có tài khoản trong hệ thống, một tài khoản mới sẽ được tự động tạo cho họ.
                        </div>
                      </div>

                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left min-w-[700px]">
                          <thead>
                            <tr className="text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-navy-light">
                              <th className="pb-4 pl-4">#</th>
                              <th className="pb-4">Email Liên Kết</th>
                              <th className="pb-4">Tên Cầu Thủ</th>
                              <th className="pb-4">Số Áo</th>
                              <th className="pb-4">Vị Trí</th>
                              <th className="pb-4 text-right pr-4">Xóa</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-navy-light/50">
                            {players.map((p, idx) => (
                              <tr key={p.id} className="group hover:bg-navy-light/20 transition-colors">
                                <td className="py-4 pl-4 text-gray-500 font-bold">{idx + 1}</td>
                                <td className="py-4 pr-4">
                                  <input
                                    type="email"
                                    placeholder="Email tài khoản cầu thủ"
                                    value={p.email}
                                    onChange={(e) => updatePlayer(p.id, 'email', e.target.value)}
                                    className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                  />
                                </td>
                                <td className="py-4 pr-4">
                                  <input
                                    type="text"
                                    placeholder="Họ tên cầu thủ"
                                    value={p.name}
                                    onChange={(e) => updatePlayer(p.id, 'name', e.target.value)}
                                    className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                  />
                                </td>
                                <td className="py-4 pr-4 w-24">
                                  <input
                                    type="number"
                                    placeholder="Số"
                                    value={p.number}
                                    onChange={(e) => updatePlayer(p.id, 'number', e.target.value)}
                                    className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                  />
                                </td>
                                <td className="py-4 pr-4 w-40">
                                  <select
                                    value={p.position}
                                    onChange={(e) => updatePlayer(p.id, 'position', e.target.value)}
                                    className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm appearance-none"
                                  >
                                    <option value="goalkeeper">Thủ Môn</option>
                                    <option value="defender">Hậu Vệ</option>
                                    <option value="midfielder">Tiền Vệ</option>
                                    <option value="forward">Tiền Đạo</option>
                                  </select>
                                </td>
                                <td className="py-4 pr-4 text-right w-16">
                                  <button
                                    type="button"
                                    onClick={() => removePlayer(p.id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Xóa cầu thủ"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleSkipRoster}
                    disabled={isSubmitting}
                    className="px-6 py-4 rounded-2xl font-bold text-gray-400 hover:text-white hover:bg-navy-light transition-all"
                  >
                    Bỏ qua, vào Quản Lý Đội
                  </button>
                  <button
                    type="button"
                    onClick={handleAddPlayers}
                    disabled={isSubmitting || isSuccess}
                    className={`
                      relative overflow-hidden group
                      flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-base transition-all duration-300
                      ${isSubmitting || isSuccess
                        ? 'bg-blue-600/50 text-white/50 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-500 hover:-translate-y-1 shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.4)]'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Hoàn Tất</span>
                        <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}