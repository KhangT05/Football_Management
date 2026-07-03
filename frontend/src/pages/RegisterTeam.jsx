import { useState, useEffect } from 'react';
import { UploadCloud, ShieldCheck, CheckCircle2, Trophy, Loader2, ArrowRight, X, Users, Plus, Trash2, Info, FileSpreadsheet, Upload } from 'lucide-react';
import useToastStore from '../store/toastStore';
import { teamApi } from '../api/teamApi';
import { seasonTeamApi } from '../api/seasonTeamApi';
import { playerApi } from '../api/playerApi';
import { userApi } from '../api/userApi';
import useSeasonStore from '../store/seasonStore';
import { useNavigate } from 'react-router-dom';

export default function RegisterTeam() {
  const toast = useToastStore();
  const navigate = useNavigate();
  const { seasons, fetchAll: fetchSeasons } = useSeasonStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Chỉ hiển thị các giải đấu đang Mở đăng ký
  const openSeasons = seasons.filter(s => s.status === 'registration_open');

  useEffect(() => {
    fetchSeasons({ per_page: 50, sort: 'id', direction: 'desc' });
  }, [fetchSeasons]);

  const [teamInfo, setTeamInfo] = useState({
    name: '',
    coach_name: '',
    description: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');

  // ── Phương thức nhập cầu thủ ──
  const [playerInputMode, setPlayerInputMode] = useState('manual'); // 'manual' or 'excel'
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileName, setExcelFileName] = useState('');

  // ── Danh sách cầu thủ Draft ──
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamInfo.name.trim()) {
      toast.error('Vui lòng nhập tên đội bóng!');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Tạo Team
      const payload = {
        name: teamInfo.name,
        coach_name: teamInfo.coach_name || '',
        description: teamInfo.description || '',
      };
      if (logoFile) {
        payload.logo = logoFile;
      }

      const teamRes = await teamApi.registerTeam(payload);
      const newTeamId = teamRes?.data?.id || teamRes?.id || (Array.isArray(teamRes?.data?.data) ? teamRes?.data?.data[0]?.id : null);

      if (newTeamId) {
        // Xử lý thêm cầu thủ
        if (playerInputMode === 'excel' && excelFile) {
          try {
            const formData = new FormData();
            formData.append('file', excelFile);
            await playerApi.importTeamPlayers(newTeamId, formData);
          } catch (err) {
            console.error('Lỗi khi import excel:', err);
            toast.error(err?.response?.data?.message || 'Có lỗi khi import file Excel.');
          }
        } else if (playerInputMode === 'manual') {
          const validPlayers = players.filter(p => p.email.trim() || p.name.trim());
          for (const p of validPlayers) {
            try {
              let userId = null;
              const emailToUse = p.email?.trim() || `player_${Date.now()}_${Math.random().toString(36).substr(2,5)}@temp.local`;
              
              if (p.email?.trim()) {
                try {
                  const searchRes = await userApi.getAll({ q: p.email.trim() });
                  const payload = typeof searchRes?.status === 'boolean' ? searchRes.data : searchRes;
                  const users = Array.isArray(payload?.data) ? payload.data : [];
                  const exactUser = users.find(u => u.email === p.email.trim());
                  if (exactUser) userId = exactUser.id;
                } catch (e) { console.error('Lỗi tìm user:', e); }
              }

              if (!userId) {
                const createRes = await userApi.create({
                  name: p.name || 'Unknown',
                  email: emailToUse,
                  password: 'Password123!',
                  phone: '0000000000'
                });
                const userPayload = typeof createRes?.status === 'boolean' ? createRes.data : createRes;
                userId = userPayload.id;
              }

              const playerRes = await playerApi.create({
                user_id: userId,
                date_of_birth: "2000-01-01",
                position: p.position || 'forward',
              });
              const pId = playerRes?.data?.id || playerRes?.id;
              
              if (pId) {
                await playerApi.addToTeam(newTeamId, {
                  player_id: pId,
                  jersey_number: parseInt(p.number) || 0,
                  position: p.position || 'forward',
                  role: 'player'
                });
              }
            } catch (e) {
              console.error('Lỗi thêm cầu thủ manual:', e);
            }
          }
        }
      }

      // 2. Nếu có chọn mùa giải thì đăng ký tham gia
      if (selectedSeasonId) {
        await seasonTeamApi.register({ season_id: parseInt(selectedSeasonId) });
      }

      setIsSuccess(true);
      
      // Kiểm tra xem có nhập cầu thủ không
      if (playerInputMode === 'excel' && excelFile) {
        toast.success('Đội bóng đã tạo và import danh sách cầu thủ thành công!', 6000);
      } else {
        const hasPlayers = players.some(p => p.email.trim() || p.name.trim());
        if (hasPlayers) {
          toast.success('Đội bóng và danh sách cầu thủ đã được tạo thành công!', 6000);
        } else {
          if (selectedSeasonId) {
            toast.success('Đã tạo đội và nộp đơn đăng ký giải đấu thành công!', 4000);
          } else {
            toast.success('Tạo đội bóng thành công!', 4000);
          }
        }
      }
      
      setTimeout(() => navigate('/doi-cua-toi'), 3500);

    } catch (error) {
      const msg = error?.response?.data?.message || 'Có lỗi xảy ra khi tạo đội. Vui lòng thử lại!';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative pt-24 pb-20 overflow-x-hidden bg-navy-dark">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[150px] opacity-20 translate-y-1/3 -translate-x-1/4 z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Thiết Lập <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-neon italic">Đội Bóng</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base">
            Tạo đội bóng của riêng bạn và thiết lập danh sách đội hình thi đấu.
          </p>
        </div>

        {/* Success state */}
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

        <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>

          {/* Khối 1: Thông tin và Mùa giải */}
          <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-black/40">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16">

              {/* Cột 1: Thông Tin Đội Bóng */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-navy-light pb-5">
                  <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-wider">Hồ Sơ Đội Bóng</h2>
                </div>

                <div className="space-y-6">
                  {/* Logo Upload */}
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
                </div>
              </div>


              {/* Cột 2: Chọn Mùa Giải */}
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

          {/* Khối 2: Danh sách đội hình (Draft) */}
          <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-black/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-light pb-5 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-wider">Đội Hình Thi Đấu</h2>
                  <p className="text-gray-400 text-sm mt-1">Lưu trữ danh sách cầu thủ ban đầu (Tùy chọn)</p>
                </div>
              </div>
              
              <div className="flex bg-navy-dark border border-navy-light rounded-xl p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setPlayerInputMode('manual')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    playerInputMode === 'manual' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Nhập Thủ Công
                </button>
                <button
                  type="button"
                  onClick={() => setPlayerInputMode('excel')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    playerInputMode === 'excel' 
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
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-start gap-3 mb-8">
                  <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-emerald-200/80 leading-relaxed">
                    Tải lên file Excel (.xlsx, .xls) chứa danh sách cầu thủ của bạn. Hệ thống sẽ tự động đọc và gửi lời mời đến email của từng cầu thủ để họ xác nhận tham gia.
                    <br/>
                    <a href="#" className="text-emerald-400 hover:text-emerald-300 underline font-medium mt-2 inline-block">Tải file mẫu tại đây</a>
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
                
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex items-start gap-3 mb-8">
                  <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-200/80 leading-relaxed">
                    Để thêm cầu thủ vào hệ thống, cầu thủ cần có <strong>Tài khoản đã đăng ký</strong>. Form dưới đây giúp bạn lập danh sách nháp. Khi hệ thống Backend nâng cấp tính năng tự động gửi lời mời qua Email, danh sách này sẽ được tự động xử lý. Bạn cũng có thể bỏ trống và vào trang Quản Lý Đội để Import trực tiếp từ file Excel sau.
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

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`
                relative overflow-hidden group
                flex items-center gap-3 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-base transition-all duration-300
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
                  <span className="relative z-10">{selectedSeasonId ? 'Tạo Đội & Tham Gia Giải' : 'Khởi Tạo Đội Bóng'}</span>
                  <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 h-full w-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
