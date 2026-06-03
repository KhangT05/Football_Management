import { MapPin, Trophy } from "lucide-react";
import { Information } from "../data/data";

export default function Footer() {
  return (
    <footer className="bg-[#003280] border-t border-navy-light pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 border-b border-navy-light pb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-6 max-w-md">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-xl">
                  <img src={Information.imgUrl} alt="" className='w-8 h-8 text-white rounded-full' />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight uppercase italic">{Information.logoTitle}</h2>
                  <p className="text-white text-xs font-bold tracking-wider">{Information.logoSubtitle}</p>
                </div>
              </div>
              <p className="text-white text-sm leading-relaxed">
                {Information.description}
              </p>
            </div>
            
            <div className="space-y-3 md:text-right">
              <h4 className="text-black font-bold tracking-wider uppercase mb-4 text-sm">Ban Tổ Chức</h4>
              <p className="text-white text-sm">{Information.organization}</p>
              <p className="text-white text-sm flex items-center md:justify-end gap-2">
                <MapPin className="w-4 h-4 text-red-500" /> {Information.address}
              </p>
              <p className="text-white text-sm">Email: {Information.email}</p>
              <p className="text-white text-sm">Điện thoại: {Information.phone}</p>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; {Information.copyright}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white hover:text-black font-medium transition-colors">Điều khoản</a>
            <a href="#" className="text-white hover:text-black font-medium transition-colors">Bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  )
}