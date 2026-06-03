import { CalendarDays, Users, GraduationCap } from "lucide-react";
import { HeroData } from "../data/data";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center bg-navy overflow-hidden border-b border-navy-light">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25"
        style={{ backgroundImage: `url(${HeroData.imageUrl})` }}
      />
      <div className="absolute inset-0 z-0 bg-linear-to-t from-navy via-navy/80 to-transparent" />
      <div className="absolute inset-0 z-0 bg-linear-to-r from-navy via-navy/60 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 py-12 md:py-20">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 font-medium text-sm tracking-wide shadow-lg backdrop-blur-sm">
            <GraduationCap className="w-5 h-5" />
            <span>{HeroData.active}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.1] uppercase tracking-tight">
            {HeroData.textNormal} <br />
            <span className="text-neon italic drop-shadow-md">
              {HeroData.textHighlight}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl font-medium drop-shadow-sm">
            {HeroData.description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
            <Link to="/lich-thi-dau" className="w-full sm:w-auto px-8 py-4 bg-[#003280] text-white font-black rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wide text-sm shadow-lg shadow-blue-900/50">
              <CalendarDays className="w-5 h-5" />
              Lịch Thi Đấu
            </Link>
            <Link to="/bang-xep-hang" className="w-full sm:w-auto px-8 py-4 bg-navy-light/80 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-navy-light transition-all duration-300 flex items-center justify-center gap-3 border border-navy-light uppercase tracking-wide text-sm group shadow-lg shadow-black/20">
              <Users className="w-5 h-5 group-hover:text-neon transition-colors" />
              Bảng Xếp Hạng
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}