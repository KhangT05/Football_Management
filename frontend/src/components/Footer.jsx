import { MapPin, Phone, Mail, Smartphone, Play } from "lucide-react";
import { IoLogoFacebook } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { Information } from "../data/data";

export default function Footer() {
  return (
    <footer 
      className="border-t pt-16 pb-12 transition-colors duration-500"
      style={{ 
        backgroundColor: 'var(--color-bg-surface)', 
        borderColor: 'var(--color-border)' 
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-8">
          
          {/* Column 1: Links & Social */}
          <div className="space-y-6">
            <h3 
              className="font-bold uppercase tracking-wider text-sm"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {Information.logoSubtitle}
            </h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <a href="#" className="transition-colors hover:text-white" style={{ color: 'var(--color-text-secondary)' }}>Điều khoản sử dụng</a>
                <a href="#" className="transition-colors hover:text-white" style={{ color: 'var(--color-text-secondary)' }}>Chính sách bảo mật</a>
                <a href="#" className="transition-colors hover:text-white" style={{ color: 'var(--color-text-secondary)' }}>Chính sách thanh toán</a>
                <a href="#" className="transition-colors hover:text-white" style={{ color: 'var(--color-text-secondary)' }}>Liên Hệ</a>
                <a href="#" className="transition-colors hover:text-white col-span-2" style={{ color: 'var(--color-text-secondary)' }}>Chính sách bảo mật thông tin cá nhân</a>
                <a href="#" className="transition-colors hover:text-white" style={{ color: 'var(--color-text-secondary)' }}>Nhận xét về MyLeague</a>
                <a href="#" className="transition-colors hover:text-white" style={{ color: 'var(--color-text-secondary)' }}>Bảng giá</a>
            </div>
            <div className="flex items-center gap-4 pt-2">
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded bg-gray-500/10 text-gray-400 hover:bg-gray-500 hover:text-white transition-colors">
                  <Mail className="w-4 h-4"/>
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors">
                  <IoLogoFacebook className="w-4 h-4"/>
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded bg-gray-500/10 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                  <FaGithub className="w-4 h-4"/>
                </a>
            </div>
          </div>

          {/* Column 2: Company Info */}
          <div className="space-y-5 flex flex-col md:items-center">
            <h2 
              className="font-bold uppercase tracking-wider text-lg"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {Information.organization}
            </h2>
            <div className="space-y-3 text-sm flex flex-col md:items-center" style={{ color: 'var(--color-text-secondary)' }}>
                <p className="flex items-start md:items-center gap-2 text-left md:text-center max-w-sm">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 md:mt-0" />
                    <span>{Information.address}</span>
                </p>
                <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{Information.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>{Information.email}</span>
                </p>
            </div>
            <div className="pt-2 text-xs flex flex-col md:items-center space-y-1" style={{ color: 'var(--color-text-muted)' }}>
                <p>{Information.copyright}</p>
            </div>
          </div>

          {/* Column 3: QR Code and App Downloads */}
          <div className="flex flex-col items-start md:items-end space-y-5">
            <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-200">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://myleague.vn&color=000000&bgcolor=ffffff`} 
                  alt="QR Code" 
                  className="w-[120px] h-[120px]" 
                />
            </div>
            <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-[#ffffff] border border-gray-700 px-3 py-1.5 rounded-lg hover:border-gray-500 hover:bg-[#2a2a2a] transition-all">
                    <Smartphone className="w-5 h-5 text-white" />
                    <div className="flex flex-col items-start">
                        <span className="text-[8px] text-gray-400 leading-none">Available on</span>
                        <span className="text-xs font-bold text-white leading-tight">App Store</span>
                    </div>
                </button>
                <button className="flex items-center gap-2 bg-[#ffffff] border border-gray-700 px-3 py-1.5 rounded-lg hover:border-gray-500 hover:bg-[#2a2a2a] transition-all">
                    <Play className="w-5 h-5 text-green-500" />
                    <div className="flex flex-col items-start">
                        <span className="text-[8px] text-gray-400 leading-none">Available on</span>
                        <span className="text-xs font-bold text-white leading-tight">Google play</span>
                    </div>
                </button>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}