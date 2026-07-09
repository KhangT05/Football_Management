import { LayoutDashboard, Users, UserPlus, Calendar, CheckSquare, Settings, Newspaper, Shield, Trophy, Scale, LayoutGrid, CalendarDays } from 'lucide-react';

// Map tên tiếng Anh → tiếng Việt cho nav items (hiện tại đã đổi thẳng sang tiếng Việt ở data.js)
export const VI_LABELS = {};

// Metadata của từng bước — dùng chung cho cả header động và stepper icon-row
export const STEP_META = [
  { id: 1, title: 'Giải đấu', subtitle: 'Chọn hoặc tạo giải đấu', icon: Trophy },
  { id: 2, title: 'Luật giải', subtitle: 'Thiết lập quy định thi đấu', icon: Scale },
  { id: 3, title: 'Thể thức', subtitle: 'Chọn hình thức và số group', icon: LayoutGrid },
  { id: 4, title: 'Mùa giải', subtitle: 'Tạo mùa giải, mở đăng ký', icon: CalendarDays },
];

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
    items: ['Tổng quan']
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
  }
];

export const navItems = [
  { name: 'Tổng quan', path: '/quan-ly-giai-dau', icon: LayoutDashboard },
  { name: 'Thiết lập giải đấu', path: '/quan-ly-giai-dau/thiet-lap-giai-dau', icon: Settings },
  { name: 'Đội bóng & Duyệt đăng ký', path: '/quan-ly-giai-dau/doi-bong', icon: Users },
  { name: 'Bốc thăm & Lên lịch', path: '/quan-ly-giai-dau/boc-tham-len-lich', icon: CheckSquare },
  { name: 'Thi đấu & Loại trực tiếp', path: '/quan-ly-giai-dau/tran-dau', icon: Calendar },
  { name: 'Tài khoản & Phân quyền', path: '/quan-ly-giai-dau/tai-khoan', icon: UserPlus },
  { name: 'Quản lý bài viết', path: '/quan-ly-giai-dau/bai-viet', icon: Newspaper },
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