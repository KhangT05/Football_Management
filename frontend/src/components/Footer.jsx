import { MapPin, Phone, Mail, Smartphone, Play } from "lucide-react";
import { IoLogoFacebook } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { Information } from "../data/data";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer 
      className="border-t pt-16 pb-8 transition-colors duration-500"
      style={{ 
        backgroundColor: 'var(--color-bg-surface)', 
        borderColor: 'var(--color-border)' 
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-8 mb-12">
          
          {/* Column 1: Brand & Links */}
          <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-4">
              <img src={Information.imgUrl} alt="Logo" className="w-16 h-16 rounded-full shadow-md border border-navy-light/50" />
              <h3 
                className="font-black uppercase tracking-widest text-xl lg:text-2xl"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {Information.logoSubtitle}
              </h3>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-sm">
                <Link to="/dieu-khoan-su-dung" className="transition-colors hover:text-white" style={{ color: 'var(--color-text-secondary)' }}>Điều khoản sử dụng</Link>
                <Link to="/chinh-sach-bao-mat" className="transition-colors hover:text-white" style={{ color: 'var(--color-text-secondary)' }}>Chính sách bảo mật</Link>
                <Link to="/lien-he" className="transition-colors hover:text-white" style={{ color: 'var(--color-text-secondary)' }}>Liên Hệ</Link>
            </div>
          </div>

          {/* Column 2: Contact Info & Socials */}
          <div className="space-y-6 flex flex-col items-center md:items-center text-center">
            <div className="space-y-4 text-sm flex flex-col items-center" style={{ color: 'var(--color-text-secondary)' }}>
                <p className="flex items-start md:items-center gap-2 max-w-sm justify-center">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 md:mt-0" />
                    <span>{Information.address}</span>
                </p>
                <p className="flex items-center gap-2 justify-center">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{Information.phone}</span>
                </p>
                <p className="flex items-center gap-2 justify-center">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>{Information.email}</span>
                </p>
            </div>
            <div className="flex items-center gap-4 pt-2 justify-center">
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-500/10 text-gray-400 hover:bg-gray-500 hover:text-white transition-all">
                  <Mail className="w-4 h-4"/>
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-all">
                  <IoLogoFacebook className="w-4 h-4"/>
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-500/10 text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
                  <FaGithub className="w-4 h-4"/>
                </a>
            </div>
          </div>

          {/* Column 3: QR Code and App Downloads */}
          <div className="flex flex-col items-center md:items-end">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-200">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://myleague.vn&color=000000&bgcolor=ffffff`} 
                    alt="QR Code" 
                    className="w-[120px] h-[120px]" 
                  />
              </div>
              <div className="flex gap-2">
                  <button className="flex items-center gap-2 bg-navy border border-navy-light px-3 py-1.5 rounded-lg hover:bg-navy-light transition-all group">
                      <Smartphone className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      <div className="flex flex-col items-start">
                          <span className="text-[8px] text-gray-500 leading-none mb-0.5">Available on</span>
                          <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors leading-none">App Store</span>
                      </div>
                  </button>
                  <button className="flex items-center gap-2 bg-navy border border-navy-light px-3 py-1.5 rounded-lg hover:bg-navy-light transition-all group">
                      <Play className="w-5 h-5 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                      <div className="flex flex-col items-start">
                          <span className="text-[8px] text-gray-500 leading-none mb-0.5">Available on</span>
                          <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors leading-none">Google Play</span>
                      </div>
                  </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div 
          className="pt-6 border-t text-center text-xs" 
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
        >
           <p>{Information.copyright}</p>
        </div>
      </div>
    </footer>
  )
}