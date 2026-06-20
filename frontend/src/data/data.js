import { LayoutDashboard, Users, UserPlus, Calendar, CheckSquare, Settings } from 'lucide-react';

export const Matches = [
  { id: 1, date: '2026-04-15 17:30', home: 'KTPM K22', away: 'HTTT K21', status: 'Scheduled' },
  { id: 2, date: '2026-04-14 15:30', home: 'KTPM K21', away: 'MMT K22', status: 'Played' },
  { id: 3, date: '2026-04-16 15:30', home: 'KHMT K23', away: 'ATTT K22', status: 'Scheduled' },
];

export const navItems = [
  { name: 'Dashboard', path: '/quan-ly-giai-dau', icon: LayoutDashboard },
  { name: 'Manage Teams', path: '/quan-ly-giai-dau/doi-bong', icon: Users },
  { name: 'Manage Players', path: '/quan-ly-giai-dau/cau-thu', icon: UserPlus },
  { name: 'Season Teams', path: '/quan-ly-giai-dau/dang-ky-giai', icon: Users },
  { name: 'Manage Matches', path: '/quan-ly-giai-dau/tran-dau', icon: Calendar },
  { name: 'Update Results', path: '/quan-ly-giai-dau/ket-qua', icon: CheckSquare },
  { name: 'Tournament Settings', path: '/quan-ly-giai-dau/cai-dat', icon: Settings },
];

export const leaderboardData = [
  { rank: 1, team: 'KTPM K21', logo: 'KP', p: 5, w: 4, d: 1, l: 0, gf: 12, ga: 3, gd: 9, pts: 13 },
  { rank: 2, team: 'MMT K22', logo: 'MM', p: 5, w: 3, d: 2, l: 0, gf: 9, ga: 4, gd: 5, pts: 11 },
  { rank: 3, team: 'ATTT K21', logo: 'AT', p: 5, w: 3, d: 1, l: 1, gf: 8, ga: 5, gd: 3, pts: 10 },
  { rank: 4, team: 'KHDL K21', logo: 'KD', p: 5, w: 2, d: 2, l: 1, gf: 6, ga: 5, gd: 1, pts: 8 },
  { rank: 5, team: 'HTTT K22', logo: 'HT', p: 5, w: 2, d: 1, l: 2, gf: 7, ga: 8, gd: -1, pts: 7 },
  { rank: 6, team: 'KTPM K23', logo: 'K3', p: 5, w: 1, d: 2, l: 2, gf: 4, ga: 7, gd: -3, pts: 5 },
  { rank: 7, team: 'KHMT K23', logo: 'KM', p: 5, w: 0, d: 2, l: 3, gf: 3, ga: 10, gd: -7, pts: 2 },
  { rank: 8, team: 'ATTT K22', logo: 'A2', p: 5, w: 0, d: 1, l: 4, gf: 2, ga: 9, gd: -7, pts: 1 },
];

export const teamsData = [
  { id: 1, name: 'Kỹ thuật Phần mềm K21', short: 'KTPM K21', logo: 'KP', players: 18, coach: 'Trần Văn A' },
  { id: 2, name: 'Mạng máy tính K22', short: 'MMT K22', logo: 'MM', players: 20, coach: 'Nguyễn Văn B' },
  { id: 3, name: 'An toàn Thông tin K21', short: 'ATTT K21', logo: 'AT', players: 19, coach: 'Lê Văn C' },
  { id: 4, name: 'Khoa học Dữ liệu K21', short: 'KHDL K21', logo: 'KD', players: 16, coach: 'Phạm Văn D' },
  { id: 5, name: 'Hệ thống Thông tin K22', short: 'HTTT K22', logo: 'HT', players: 22, coach: 'Hoàng Văn E' },
  { id: 6, name: 'Kỹ thuật Phần mềm K23', short: 'KTPM K23', logo: 'K3', players: 17, coach: 'Vũ Văn F' },
];

export const getRowStyle = (rank) => {
  if (rank === 1) return 'bg-[#FFD700]/10 border-l-4 border-l-[#FFD700] hover:bg-[#FFD700]/20';
  if (rank === 2) return 'bg-[#C0C0C0]/10 border-l-4 border-l-[#C0C0C0] hover:bg-[#C0C0C0]/20';
  if (rank === 3) return 'bg-[#CD7F32]/10 border-l-4 border-l-[#CD7F32] hover:bg-[#CD7F32]/20';
  return 'bg-navy-light/20 border-l-4 border-l-transparent hover:bg-navy-light/40';
};
 
export const upcomingMatches = [
  { id: 1, date: '15/04/2026', time: '17:30', location: 'Sân Mini Khu A', teamA: 'KTPM K22', teamB: 'HTTT K21', logoA: 'KP', logoB: 'HT' },
  { id: 2, date: '16/04/2026', time: '15:30', location: 'Sân Chuyên Đề', teamA: 'KHMT K23', teamB: 'ATTT K22', logoA: 'KM', logoB: 'AT' },
  { id: 5, date: '17/04/2026', time: '17:30', location: 'Sân Mini Khu A', teamA: 'MMT K23', teamB: 'KTPM K21', logoA: 'MM', logoB: 'KP' },
];

export const matchResults = [
  { id: 3, date: '14/04/2026', time: '17:30', location: 'Sân Mini Khu A', teamA: 'KTPM K21', teamB: 'MMT K22', logoA: 'KP', logoB: 'MM', scoreA: 3, scoreB: 1 },
  { id: 4, date: '13/04/2026', time: '15:30', location: 'Sân Chuyên Đề', teamA: 'KHDL K21', teamB: 'KTPM K23', logoA: 'KD', logoB: 'KP', scoreA: 2, scoreB: 2 },
  { id: 6, date: '12/04/2026', time: '17:30', location: 'Sân Mini Khu A', teamA: 'ATTT K21', teamB: 'HTTT K23', logoA: 'AT', logoB: 'HT', scoreA: 1, scoreB: 0 },
];

export const rosterData = [
  { id: 1, name: 'Nguyễn Văn A', position: 'Tiền đạo (FW)', number: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=0f172a' },
  { id: 2, name: 'Trần Văn B', position: 'Tiền vệ (MF)', number: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=0f172a' },
  { id: 3, name: 'Lê Văn C', position: 'Hậu vệ (DF)', number: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb&backgroundColor=0f172a' },
  { id: 4, name: 'Phạm Văn D', position: 'Thủ môn (GK)', number: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&backgroundColor=0f172a' },
  { id: 5, name: 'Hoàng Văn E', position: 'Tiền vệ (MF)', number: 19, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam&backgroundColor=0f172a' },
  { id: 6, name: 'Vũ Văn F', position: 'Tiền đạo (FW)', number: 11, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luke&backgroundColor=0f172a' },
  { id: 7, name: 'Đặng Văn G', position: 'Hậu vệ (DF)', number: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=0f172a' },
  { id: 8, name: 'Bùi Văn H', position: 'Tiền vệ (MF)', number: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden&backgroundColor=0f172a' },
];

export const topScorers = [
  { id: 1, rank: 1, name: 'Nguyễn Văn A', team: 'KTPM K21', goals: 8 },
  { id: 2, rank: 2, name: 'Trần Văn B', team: 'MMT K22', goals: 6 },
  { id: 3, rank: 3, name: 'Lê Văn C', team: 'ATTT K21', goals: 5 },
  { id: 4, rank: 4, name: 'Vũ Văn F', team: 'KTPM K23', goals: 4 },
  { id: 5, rank: 5, name: 'Bùi Văn H', team: 'KHDL K21', goals: 3 },
];

export const timelineEvents = [
  { id: 1, minute: "12'", type: 'goal', player: 'Nguyễn Văn A', team: 'home' },
  { id: 2, minute: "28'", type: 'card_yellow', player: 'Lê Văn C', team: 'away' },
  { id: 3, minute: "45+2'", type: 'goal', player: 'Nguyễn Văn A', team: 'home' },
  { id: 4, minute: "60'", type: 'card_red', player: 'Trần Văn D', team: 'home' },
  { id: 5, minute: "82'", type: 'goal', player: 'Phạm Văn E', team: 'away' },
  { id: 6, minute: "89'", type: 'goal', player: 'Nguyễn Văn A', team: 'home' },
];

export const lineupData = {
  home: [
    { number: 1, name: 'Thủ Môn A', position: 'GK' },
    { number: 4, name: 'Hậu Vệ B', position: 'DF' },
    { number: 5, name: 'Hậu Vệ C', position: 'DF' },
    { number: 8, name: 'Tiền Vệ D', position: 'MF' },
    { number: 10, name: 'Nguyễn Văn A', position: 'FW' },
  ],
  away: [
    { number: 1, name: 'Thủ Môn Z', position: 'GK' },
    { number: 2, name: 'Hậu Vệ Y', position: 'DF' },
    { number: 3, name: 'Hậu Vệ X', position: 'DF' },
    { number: 7, name: 'Tiền Vệ W', position: 'MF' },
    { number: 9, name: 'Phạm Văn E', position: 'FW' },
  ]
};

export const activeMatches = [
  { id: 1, home: 'KTPM K21', away: 'HTTT K21', homeLogo: '🛡️', awayLogo: '🌟', date: 'LIVE • Phút 68' },
  { id: 2, home: 'ATTT K21', away: 'MMT K22', homeLogo: '🔐', awayLogo: '🦅', date: 'Hôm nay • 15:30' },
  { id: 3, home: 'KTPM K23', away: 'KHDL K21', homeLogo: '⚔️', awayLogo: '⚡', date: 'Đang giải lao (HT)' }
];

export const initialPlayers = [
  { id: 1, name: 'Nguyễn Văn A', number: 10, position: 'FW', team: 'KTPM K21', teamLogo: '🛡️', goals: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=e2e8f0' },
  { id: 2, name: 'Trần Văn B', number: 8, position: 'MID', team: 'MMT K22', teamLogo: '🦅', goals: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=e2e8f0' },
  { id: 3, name: 'Lê Văn C', number: 5, position: 'DEF', team: 'ATTT K21', teamLogo: '🔐', goals: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=e2e8f0' },
  { id: 4, name: 'Vũ Văn F', number: 11, position: 'FW', team: 'KTPM K23', teamLogo: '⚔️', goals: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luke&backgroundColor=e2e8f0' },
  { id: 5, name: 'Đặng Văn G', number: 1, position: 'GK', team: 'KHDL K21', teamLogo: '⚡', goals: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=e2e8f0' },
  { id: 6, name: 'Bùi Văn H', number: 6, position: 'MID', team: 'HTTT K21', teamLogo: '🌟', goals: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden&backgroundColor=e2e8f0' },
];

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
  address: '65 Huỳnh Thúc Kháng, Phường Sài Gòn, TP.HCM, Việt Nam',
  email: 'btc.football@it.edu.vn',
  phone: '0123.456.789',
  logoTitle: 'IT Faculty',
  logoSubtitle: 'SUPER LEAGUE',
  copyright: '© 2026 Giải bóng đá Khoa CNTT. Bản quyền đã được bảo hộ.',
};