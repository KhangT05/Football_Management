import { LayoutDashboard, Users, UserPlus, Calendar, CheckSquare, Settings, Newspaper, Trophy, Scale, LayoutGrid, CalendarDays, CreditCard, AlertTriangle, CheckCircle, XCircle, Loader2, GraduationCap, ArrowRightLeft } from 'lucide-react';
import React from 'react';
import { IoFootballOutline, IoFootball } from 'react-icons/io5';

// Map tên tiếng Anh → tiếng Việt cho nav items (hiện tại đã đổi thẳng sang tiếng Việt ở data.js)
export const VI_LABELS = {};

// Metadata của từng bước — dùng chung cho cả header động và stepper icon-row
export const STEP_META = [
  { id: 1, title: 'Giải đấu', subtitle: 'Chọn hoặc tạo giải đấu', icon: Trophy },
  { id: 2, title: 'Luật giải', subtitle: 'Thiết lập quy định thi đấu', icon: Scale },
  { id: 3, title: 'Thể thức', subtitle: 'Chọn hình thức và số group', icon: LayoutGrid },
  { id: 4, title: 'Mùa giải', subtitle: 'Tạo mùa giải, mở đăng ký', icon: CalendarDays },
];

// ── Helpers ───────────────────────────────────────────────────
export const STATUS_CONFIG = {
  upcoming: {
    label: 'Sắp diễn ra',
    cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dotCls: 'bg-blue-400',
  },
  registration_open: {
    label: 'Mở đăng ký',
    cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dotCls: 'bg-emerald-400 animate-pulse',
  },
  ongoing: {
    label: 'Đang diễn ra',
    cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    dotCls: 'bg-orange-400 animate-pulse',
  },
  finished: {
    label: 'Đã kết thúc',
    cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    dotCls: 'bg-gray-400',
  },
  cancelled: {
    label: 'Đã hủy',
    cls: 'bg-red-700/10 text-red-500 border-red-700/20',
    dotCls: 'bg-red-500',
  },
};

export const INPUT_CLASS = "w-full pl-11 pr-4 py-3.5 bg-navy/50 border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50 disabled:bg-navy-dark disabled:cursor-not-allowed transition-all duration-300 text-sm";

export const INPUT = 'w-full px-4 py-3 bg-navy border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm';

export const initialWizardState = {
  step: 1,
  isSubmitting: false,
  tournamentMode: 'new', // 'new' | 'existing'
  tournaments: [],
  tournamentForm: { name: '', description: '', logo: null, is_active: true },
  selectedTournamentId: '',
  logoPreview: null,
  ruleForm: {
    points_per_win: 3, points_per_draw: 1, points_per_loss: 0, forfeit_score: 3,
    yellow_cards_suspension: 2, max_players_per_team: 25, min_players_per_team: 11,
    teams_advance_per_group: 2,
    tiebreaker_order: ['goal_diff', 'goals_scored', 'head_to_head']
  },
  format: 'round_robin',
  groupCount: 2,
  seasonForm: {
    name: '', description: '', start_date: '', end_date: '', registration_deadline: '',
    max_teams: 16, is_registration_open: false, status: 'upcoming'
  }
};

export const MENU_GROUPS = [
  {
    groupLabel: 'Hệ thống',
    items: ['Tổng quan', 'Quản lý Lớp học']
  },
  {
    groupLabel: 'Quy trình giải đấu',
    items: [
      'Thiết lập giải đấu',
      'Đội bóng & Duyệt đăng ký',
      'Bốc thăm & Lên lịch',
      'Thi đấu & Loại trực tiếp'
    ]
  },
  {
    groupLabel: 'Truyền Thông & Bảo Mật',
    items: ['Tài khoản & Phân quyền', 'Quản lý bài viết']
  },
  {
    groupLabel: 'Quản lý Tài chính',
    items: ['Xác nhận thanh toán']
  }
];

export const navItems = [
  { name: 'Tổng quan', path: '/quan-ly-giai-dau', icon: LayoutDashboard },
  { name: 'Quản lý Lớp học', path: '/quan-ly-giai-dau/lop-hoc', icon: GraduationCap },
  { name: 'Thiết lập giải đấu', path: '/quan-ly-giai-dau/thiet-lap-giai-dau', icon: Settings },
  { name: 'Đội bóng & Duyệt đăng ký', path: '/quan-ly-giai-dau/doi-bong', icon: Users },
  { name: 'Bốc thăm & Lên lịch', path: '/quan-ly-giai-dau/boc-tham-len-lich', icon: CheckSquare },
  { name: 'Thi đấu & Loại trực tiếp', path: '/quan-ly-giai-dau/tran-dau', icon: Calendar },
  { name: 'Tài khoản & Phân quyền', path: '/quan-ly-giai-dau/tai-khoan', icon: UserPlus },
  { name: 'Quản lý bài viết', path: '/quan-ly-giai-dau/bai-viet', icon: Newspaper },
  { name: 'Xác nhận thanh toán', path: '/quan-ly-giai-dau/xac-nhan-thanh-toan', icon: CreditCard },
];

export const getRowStyle = (rank) => {
  if (rank === 1) return 'bg-[#FFD700]/10 border-l-4 border-l-[#FFD700] hover:bg-[#FFD700]/20';
  if (rank === 2) return 'bg-[#C0C0C0]/10 border-l-4 border-l-[#C0C0C0] hover:bg-[#C0C0C0]/20';
  if (rank === 3) return 'bg-[#CD7F32]/10 border-l-4 border-l-[#CD7F32] hover:bg-[#CD7F32]/20';
  return 'bg-navy-light/20 border-l-4 border-l-transparent hover:bg-navy-light/40';
};

export const HeroData = {
  textNormal: 'Giải Bóng Đá Sinh Viên',
  textHighlight: 'Cúp Cao Thắng',
  active: 'Đồng hành cùng đam mê tuổi trẻ Sinh viên',
  description: 'Sân chơi thể thao lành mạnh, chuyên nghiệp dành cho sinh viên. Nơi giao lưu học hỏi, rèn luyện thể chất và cháy hết mình cùng đam mê bóng đá.',
  buttonLink: '/lich-thi-dau',
  imageUrl: 'https://images.unsplash.com/photo-1519332978332-21b7d621d05e?q=80&w=2670&auto=format&fit=crop',
};

export const Information = {
  imgUrl: 'https://cntt.caothang.edu.vn/uploads/media/logo.jpg',
  organization: 'Khoa Công nghệ Thông tin',
  description: 'Hệ thống quản lý chuyên nghiệp dành riêng cho giải bóng đá sinh viên Khoa Công Nghệ Thông Tin. Mang phong cách thể thao, năng động và đậm chất IT.',
  address: '65 Huỳnh Thúc Kháng, Phường Sài Gòn, TP.HCM',
  email: 'btc.football@it.edu.vn',
  phone: '0123.456.789',
  logoTitle: 'CKC LEAGUE',
  logoSubtitle: 'Khoa Công Nghệ Thông Tin',
  copyright: '© 2026 Giải bóng đá Khoa CNTT. Bản quyền đã được bảo hộ.',
};

export const POSITIONS = [
  { value: 'GK', label: 'GK – Thủ môn' },
  { value: 'DEF', label: 'DEF – Hậu vệ' },
  { value: 'MID', label: 'MID – Tiền vệ' },
  { value: 'FW', label: 'FW – Tiền đạo' },
];
export const EMPTY_TEAM = { name: '', coach_name: '', description: '', logo: null, jersey_color: '#ffffff', is_active: true };
export const EMPTY_PLAYER = { name: '', number: '', position: 'forward', role: 'player' };

// FIX: khớp đúng PaymentStatus enum thật (Prisma) — chỉ có 4 giá trị:
//   pending | confirmed | refund_pending | refunded
// Bản cũ có 'success'/'failed' không tồn tại trong domain (dead code, không
// bao giờ match được payment nào) và THIẾU 'refund_pending' (payment đang
// refund sẽ fallback nhầm về style của 'pending').
export const STATUS_LABELS = {
  pending: { label: 'Chờ duyệt', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle },
  confirmed: { label: 'Đã thanh toán', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle },
  refund_pending: { label: 'Đang hoàn tiền', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: Loader2 },
  refunded: { label: 'Đã hoàn tiền', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: XCircle },
};

export const MATCH_STATUS_LABEL = {
  scheduled: 'Chưa đấu',
  upcoming: 'Sắp diễn ra',
  ongoing: 'Đang diễn ra',
  live: 'Đang diễn ra',
  completed: 'Đã kết thúc',
  finished: 'Đã kết thúc',
  cancelled: 'Bị hủy',
  postponed: 'Hoãn',
};

export const MATCH_STATUS_CLASS = {
  scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  upcoming: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  ongoing: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse',
  live: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse',
  completed: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  finished: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  postponed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
};

export const POSITION_COLORS = {
  GK: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
  DEF: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  MID: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
  FW: 'bg-red-400/10 text-red-400 border-red-400/30',
};
export const EVENT_ICON = {
  goal: React.createElement(IoFootball, { className: "w-4 h-4" }),
  own_goal: React.createElement(IoFootball, { className: "w-4 h-4 text-red-500" }),
  penalty_scored: React.createElement(IoFootballOutline, { className: "w-4 h-4 text-emerald-400" }),
  yellow_card: React.createElement('div', { className: "w-3 h-4 bg-yellow-400 rounded-sm shadow-[0_0_5px_rgba(250,204,21,0.5)]" }),
  second_yellow: React.createElement('div', { className: "relative w-4 h-4 shrink-0" },
    React.createElement('div', { className: "absolute inset-y-0 left-0 w-3 h-4 bg-yellow-400 rounded-sm" }),
    React.createElement('div', { className: "absolute inset-y-0 left-1 w-3 h-4 bg-red-500 rounded-sm shadow-[0_0_5px_rgba(239,68,68,0.5)]" })
  ),
  red_card: React.createElement('div', { className: "w-3 h-4 bg-red-500 rounded-sm shadow-[0_0_5px_rgba(239,68,68,0.5)]" }),
  substitution_in: React.createElement(ArrowRightLeft, { className: "w-4 h-4 text-emerald-400" }),
  substitution_out: React.createElement(ArrowRightLeft, { className: "w-4 h-4 text-red-400" }),
};