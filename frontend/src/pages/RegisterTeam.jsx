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
    <div className="min-h-screen relative pt-24 pb-20 overflow-hidden">
      {/* Sporty Energetic Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-overlay"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
      />
      <div className="absolute inset-0 bg-linear-to-br from-navy-dark via-navy to-slate-900 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Đăng ký <span className="text-neon">Đội Bóng</span> IT Cup
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Cổng đăng ký chính thức dành cho các Đội trưởng. Hãy điền đầy đủ thông tin để sẵn sàng tỏa sáng trên chảo lửa Khoa Công nghệ Thông tin.
          </p>
        </div>

        {/* Success state */}
        {isSuccess && (
          <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-bold text-lg">Đăng ký thành công!</p>
              <p className="text-slate-400 text-sm mt-0.5">Đang chuyển hướng đến trang đội bóng của bạn...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-navy/80 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 md:p-10 shadow-2xl animate-fade-in">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Section 1: Team Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Thông Tin Đội Bóng</h2>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Tên Đội Bóng <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="teamName"
                  required
                  value={teamInfo.teamName}
                  onChange={handleTeamInfoChange}
                  placeholder="VD: KTPM K21"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Họ & Tên Đội Trưởng <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="captainName"
                    required
                    value={teamInfo.captainName}
                    onChange={handleTeamInfoChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Mã Sinh Viên (MSSV) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="mssv"
                    required
                    value={teamInfo.mssv}
                    onChange={handleTeamInfoChange}
                    placeholder="2152xxxx"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Email Liên Hệ <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={teamInfo.email}
                    onChange={handleTeamInfoChange}
                    placeholder="admin@domain.com"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Số Điện Thoại <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={teamInfo.phone}
                    onChange={handleTeamInfoChange}
                    placeholder="09xxxxxxx"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                  />
                </div>
              </div>

              {/* Logo Upload Zone */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Logo Đội Bóng (Tùy chọn)</label>
                <div className="border-2 border-dashed border-slate-600 rounded-2xl p-8 hover:border-emerald-500 hover:bg-slate-800/50 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group">
                  <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-emerald-400 mb-3 transition-colors" />
                  <p className="text-white font-semibold">Click hoặc Kéo thả ảnh vào đây</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG tối đa 5MB</p>
                </div>
              </div>
            </div>

            {/* Section 2: Roster */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <Plus className="w-6 h-6 text-neon" />
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider">Danh sách Đội Hình</h2>
                </div>
                <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full font-bold border border-slate-700">
                  {players.length} / 20 TV
                </span>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 stagger-children">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-slate-900/40 p-3.5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors animate-slide-up"
                  >
                    <div className="w-full sm:flex-1">
                      <label className="block text-xs font-bold text-slate-400 mb-1">Họ Tên Cầu Thủ</label>
                      <input
                        type="text"
                        required
                        value={player.name}
                        onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                        placeholder="Tên thành viên..."
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon text-sm"
                      />
                    </div>

                    <div className="flex w-full sm:w-auto gap-3 items-end">
                      <div className="w-1/2 sm:w-20">
                        <label className="block text-xs font-bold text-slate-400 mb-1">Số Áo</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="99"
                          value={player.number}
                          onChange={(e) => updatePlayer(player.id, 'number', e.target.value)}
                          placeholder="10"
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon text-sm text-center"
                        />
                      </div>

                      <div className="w-1/2 sm:w-24">
                        <label className="block text-xs font-bold text-slate-400 mb-1">Vị trí</label>
                        <select
                          value={player.position}
                          onChange={(e) => updatePlayer(player.id, 'position', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon text-sm uppercase"
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
                        className={`p-2 rounded-lg border transition-colors shrink-0 mb-px ${players.length <= 5 ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed' : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20 hover:text-red-300'}`}
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
                className="w-full py-3 mt-2 border-2 border-dashed border-slate-600 rounded-xl text-slate-300 font-bold hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" /> Thêm Cầu Thủ Khác
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-12 pt-8 border-t border-slate-700">
            <div className="flex items-start gap-3 bg-blue-500/10 border border-navy-light/20 p-4 rounded-xl mb-6">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 leading-relaxed">
                Bằng việc nhấn "Gửi Đơn Đăng Ký", bạn đại diện cho đội bóng cam kết tuân thủ mọi{' '}
                <a href="#" className="text-neon hover:underline">Điều lệ và Quy định</a>{' '}
                của Giải Thể thao Khoa CNTT. Mọi quyết định cuối cùng thuộc về BTC.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full sm:w-auto px-10 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed text-slate-900 font-extrabold text-lg rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 mx-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang gửi...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
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
