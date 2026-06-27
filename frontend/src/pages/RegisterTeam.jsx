import { useState } from 'react';
import { UploadCloud, Plus, Trash2, ShieldCheck, Info, Loader2, CheckCircle2 } from 'lucide-react';
import useToastStore from '../store/toastStore';
import { teamApi } from '../api/teamApi';
import { useNavigate } from 'react-router-dom';

export default function RegisterTeam() {
  const toast = useToastStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [teamInfo, setTeamInfo] = useState({
    teamName: '',
    captainName: '',
    mssv: '',
    email: '',
    phone: '',
  });

  const [players, setPlayers] = useState([
    { id: 1, name: '', number: '', position: 'GK' },
    { id: 2, name: '', number: '', position: 'DEF' },
    { id: 3, name: '', number: '', position: 'MID' },
    { id: 4, name: '', number: '', position: 'MID' },
    { id: 5, name: '', number: '', position: 'FWD' },
  ]);

  const handleTeamInfoChange = (e) => {
    setTeamInfo({ ...teamInfo, [e.target.name]: e.target.value });
  };

  const addPlayer = () => {
    setPlayers([...players, { id: Date.now(), name: '', number: '', position: 'MID' }]);
  };

  const removePlayer = (id) => {
    if (players.length <= 5) return;
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayer = (id, field, value) => {
    setPlayers(players.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate players
    const emptyPlayer = players.find(p => !p.name.trim() || !p.number);
    if (emptyPlayer) {
      toast.error('Vui lòng điền đầy đủ tên và số áo cho tất cả cầu thủ!');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: teamInfo.teamName,
        captain: {
          name: teamInfo.captainName,
          mssv: teamInfo.mssv,
          email: teamInfo.email,
          phone: teamInfo.phone,
        },
        players: players.map(p => ({
          name: p.name,
          jerseyNumber: parseInt(p.number),
          position: p.position,
        })),
      };

      await teamApi.registerTeam(payload);
      setIsSuccess(true);
      toast.success('Đăng ký đội bóng thành công! Vui lòng chờ Admin duyệt. Sau khi được duyệt, bạn sẽ thanh toán lệ phí để chính thức tham gia giải.', 6000);
      setTimeout(() => navigate('/doi-cua-toi'), 3500);

    } catch (error) {
      const msg = error?.response?.data?.message;
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        // Backend chưa implement endpoint này
        toast.warning('Tính năng đăng ký đội đang được phát triển. Vui lòng liên hệ BTC trực tiếp!', 5000);
      } else {
        toast.error(msg || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative pt-24 pb-20 overflow-x-hidden bg-navy-dark">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/3 z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[150px] opacity-20 translate-y-1/3 -translate-x-1/4 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Đăng ký <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-neon italic">Đội Bóng</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base">
            Cổng đăng ký chính thức dành cho các Đội trưởng. Hãy điền đầy đủ thông tin để sẵn sàng tỏa sáng trên chảo lửa Khoa Công nghệ Thông tin.
          </p>
        </div>

        {/* Success state */}
        {isSuccess && (
          <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center gap-5 animate-fade-in shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0 shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-black text-xl mb-1">Đăng ký thành công!</p>
              <p className="text-emerald-500/80 text-sm font-medium">Đang chuyển hướng đến trang đội bóng của bạn...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-black/40 animate-slide-up" style={{ animationDelay: '100ms' }}>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16">

            {/* Section 1: Team Info */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 border-b border-navy-light pb-5">
                <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Thông Tin Đội Bóng</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-300 ml-1">Tên Đội Bóng <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="teamName"
                    required
                    value={teamInfo.teamName}
                    onChange={handleTeamInfoChange}
                    placeholder="VD: KTPM K21"
                    className="w-full bg-navy-dark/80 border border-navy-light rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-300 ml-1">Họ & Tên Đội Trưởng <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="captainName"
                      required
                      value={teamInfo.captainName}
                      onChange={handleTeamInfoChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-navy-dark/80 border border-navy-light rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-300 ml-1">Mã Sinh Viên (MSSV) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="mssv"
                      required
                      value={teamInfo.mssv}
                      onChange={handleTeamInfoChange}
                      placeholder="2152xxxx"
                      className="w-full bg-navy-dark/80 border border-navy-light rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-300 ml-1">Email Liên Hệ <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={teamInfo.email}
                      onChange={handleTeamInfoChange}
                      placeholder="admin@domain.com"
                      className="w-full bg-navy-dark/80 border border-navy-light rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-300 ml-1">Số Điện Thoại <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={teamInfo.phone}
                      onChange={handleTeamInfoChange}
                      placeholder="09xxxxxxx"
                      className="w-full bg-navy-dark/80 border border-navy-light rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Logo Upload Zone */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-300 ml-1">Logo Đội Bóng (Tùy chọn)</label>
                  <div className="border-2 border-dashed border-navy-light rounded-3xl p-10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group bg-navy-dark/30">
                    <div className="p-4 bg-navy rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-white font-bold mb-1">Click hoặc Kéo thả ảnh vào đây</p>
                    <p className="text-xs text-gray-500 font-medium">PNG, JPG tối đa 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Roster */}
            <div className="space-y-8 bg-navy-dark/30 p-6 md:p-8 rounded-4xl border border-navy-light/50">
              <div className="flex items-center justify-between border-b border-navy-light pb-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                    <Plus className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-wider">Danh sách Đội Hình</h2>
                </div>
                <span className="bg-navy border border-navy-light text-blue-400 text-sm px-4 py-1.5 rounded-full font-black">
                  {players.length} / 20
                </span>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex flex-col sm:flex-row gap-4 items-end sm:items-center bg-navy/80 p-4 rounded-2xl border border-navy-light hover:border-blue-500/30 transition-colors animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="w-full sm:flex-1 space-y-1.5">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider ml-1">Họ Tên</label>
                      <input
                        type="text"
                        required
                        value={player.name}
                        onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                        placeholder="Nguyễn Văn B"
                        className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-bold transition-all"
                      />
                    </div>

                    <div className="flex w-full sm:w-auto gap-3 items-end">
                      <div className="w-1/2 sm:w-20 space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider ml-1 text-center">Số Áo</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="99"
                          value={player.number}
                          onChange={(e) => updatePlayer(player.id, 'number', e.target.value)}
                          placeholder="10"
                          className="w-full bg-navy-dark border border-navy-light rounded-xl px-3 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-center font-black transition-all"
                        />
                      </div>

                      <div className="w-1/2 sm:w-24 space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider ml-1 text-center">Vị trí</label>
                        <select
                          value={player.position}
                          onChange={(e) => updatePlayer(player.id, 'position', e.target.value)}
                          className="w-full bg-navy-dark border border-navy-light rounded-xl px-3 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-bold transition-all text-center appearance-none cursor-pointer"
                        >
                          <option value="GK">GK</option>
                          <option value="DEF">DEF</option>
                          <option value="MID">MID</option>
                          <option value="FWD">FWD</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => removePlayer(player.id)}
                        disabled={players.length <= 5}
                        className={`p-3.5 rounded-xl border transition-all shrink-0 ${players.length <= 5 ? 'bg-navy-dark border-navy-light opacity-50 cursor-not-allowed text-gray-600' : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addPlayer}
                disabled={players.length >= 20}
                className="w-full py-4 mt-2 border-2 border-dashed border-blue-500/30 rounded-2xl text-blue-400 font-black text-sm uppercase tracking-wider hover:border-blue-500 hover:text-white hover:bg-blue-500 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" /> Thêm Cầu Thủ
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-12 pt-10 border-t border-navy-light">
            <div className="flex items-start gap-4 bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl mb-8 max-w-4xl mx-auto">
              <div className="p-2 bg-indigo-500/20 rounded-lg shrink-0">
                <Info className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                Bằng việc nhấn "Gửi Đơn Đăng Ký", bạn đại diện cho đội bóng cam kết tuân thủ mọi{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 font-bold underline decoration-blue-500/30 underline-offset-4">Điều lệ và Quy định</a>{' '}
                của Giải Thể thao Khoa CNTT. Mọi quyết định cuối cùng thuộc về BTC.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full sm:w-auto px-12 py-5 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-black text-lg rounded-2xl transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto uppercase tracking-widest"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Đang xử lý...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  Đã gửi thành công!
                </>
              ) : (
                'GỬI ĐƠN ĐĂNG KÝ'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
