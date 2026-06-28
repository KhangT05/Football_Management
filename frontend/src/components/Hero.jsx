import { CalendarDays, Users, GraduationCap, ChevronRight, Activity } from "lucide-react";
import { HeroData } from "../data/data";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center overflow-hidden bg-navy-dark">
      
      {/* Background Layer: Abstract Shapes & Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[150px] opacity-10 translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 py-10 sm:py-16 md:py-20 lg:py-24 flex flex-col lg:flex-row items-center gap-10 md:gap-14 lg:gap-10">
        
        {/* Text Content */}
        <div className="w-full lg:w-3/5 space-y-8 lg:pr-8 animate-slide-up relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/40 bg-blue-500/15 text-blue-500 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-inner backdrop-blur-sm">
            <Activity className="w-4 h-4" />
            <span>{HeroData.active}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight text-white uppercase">
            {HeroData.textNormal} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-neon italic font-black">
              {HeroData.textHighlight}
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-400 font-semibold max-w-2xl">
            Nền tảng quản lý giải đấu toàn diện. Tối ưu hóa việc tổ chức, tự động hóa xếp hạng và kết nối các đội bóng một cách chuyên nghiệp nhất.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 pt-4 sm:pt-6">
            <Link 
              to="/dang-ky-doi-bong" 
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-linear-to-r from-neon to-emerald-500 text-navy-dark font-black rounded-2xl hover:from-emerald-400 hover:to-neon transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider text-sm shadow-[0_0_30px_rgba(57,255,20,0.5)] hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(57,255,20,0.7)]"
            >
              <TrophyIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Đăng Ký Đội
            </Link>
            <Link 
              to="/lich-thi-dau" 
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider text-sm shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(37,99,235,0.6)]"
            >
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
              Lịch Thi Đấu
            </Link>
            <Link 
              to="/bang-xep-hang" 
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-navy/50 backdrop-blur-md text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 border border-navy-light uppercase tracking-wider text-sm group hover:bg-navy-light hover:border-gray-600 hover:-translate-y-1 shadow-lg"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              Bảng Xếp Hạng
            </Link>
          </div>
        </div>

        {/* Visual Graphic (Replaces background image) */}
        <div className="w-full lg:w-2/5 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="relative w-full max-w-md aspect-square flex flex-col justify-center gap-5">
            
            {/* Stat Card 1: Giải đấu */}
            <div className="w-56 sm:w-64 p-4 sm:p-5 bg-navy/60 backdrop-blur-xl border border-navy-light/50 rounded-3xl shadow-2xl z-20 animate-float self-end mr-2 sm:mr-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <TrophyIcon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">12<span className="text-blue-400">+</span></p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Mùa Giải</p>
                </div>
              </div>
            </div>

            {/* Stat Card 2: Đội bóng */}
            <div className="w-64 sm:w-72 p-4 sm:p-5 bg-navy-dark/80 backdrop-blur-xl border border-navy-light rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30 animate-float-delayed self-start ml-0 sm:ml-2 -mt-2">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">48<span className="text-emerald-400">+</span></p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Đội Thi Đấu</p>
                </div>
              </div>
            </div>

            {/* Stat Card 3: Cầu thủ */}
            <div className="w-56 sm:w-64 p-4 sm:p-5 bg-navy/60 backdrop-blur-xl border border-navy-light/50 rounded-3xl shadow-2xl z-20 animate-float self-end mr-4 sm:mr-8 -mt-2" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">850<span className="text-purple-400">+</span></p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Cầu Thủ Đăng Ký</p>
                </div>
              </div>
            </div>

            {/* Decorative Sphere */}
            <div className="absolute inset-10 rounded-full border border-blue-500/20 bg-linear-to-tr from-blue-900/40 to-transparent backdrop-blur-sm z-10 pointer-events-none"></div>
          </div>
        </div>

      </div>
    </div>
  )
}

function TrophyIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}