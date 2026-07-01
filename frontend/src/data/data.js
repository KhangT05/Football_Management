import { LayoutDashboard, Users, UserPlus, Calendar, CheckSquare, Settings, Newspaper, Shield } from 'lucide-react';

export const navItems = [
  { name: 'Dashboard', path: '/quan-ly-giai-dau', icon: LayoutDashboard },
  { name: 'Manage Teams', path: '/quan-ly-giai-dau/doi-bong', icon: Users },
  { name: 'Manage Accounts', path: '/quan-ly-giai-dau/tai-khoan', icon: UserPlus },
  { name: 'Season Teams', path: '/quan-ly-giai-dau/dang-ky-giai', icon: Users },
  { name: 'Manage Matches', path: '/quan-ly-giai-dau/tran-dau', icon: Calendar },
  { name: 'Manage Articles', path: '/quan-ly-giai-dau/bai-viet', icon: Newspaper },
  { name: 'Tournament Settings', path: '/quan-ly-giai-dau/cai-dat', icon: Settings },
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
  logoTitle: 'IT Faculty',
  logoSubtitle: 'SUPER LEAGUE',
  copyright: '© 2026 Giải bóng đá Khoa CNTT. Bản quyền đã được bảo hộ.',
};