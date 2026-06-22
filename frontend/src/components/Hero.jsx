import { CalendarDays, Users, GraduationCap } from "lucide-react";
import { HeroData } from "../data/data";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div 
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center overflow-hidden border-b transition-colors duration-500"
      style={{ 
        background: 'var(--gradient-hero)', 
        borderColor: 'var(--color-border)' 
      }}
    >
      {/* Background Image with Theme-aware Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-30 mix-blend-overlay"
        style={{ backgroundImage: `url(${HeroData.imageUrl})` }}
      />
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ background: 'linear-gradient(to top, var(--color-bg-base) 0%, transparent 100%)' }} 
      />
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ background: 'linear-gradient(to right, var(--color-bg-base) 0%, transparent 100%)' }} 
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 py-12 md:py-20">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neon/30 bg-neon/10 text-neon font-medium text-sm tracking-wide shadow-lg backdrop-blur-sm">
            <GraduationCap className="w-5 h-5" />
            <span>{HeroData.active}</span>
          </div>
          
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] uppercase tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {HeroData.textNormal} <br />
            <span className="text-neon italic drop-shadow-md">
              {HeroData.textHighlight}
            </span>
          </h1>
          
          <p 
            className="text-lg md:text-xl leading-relaxed max-w-2xl font-medium drop-shadow-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {HeroData.description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
            <Link 
              to="/lich-thi-dau" 
              className="w-full sm:w-auto px-8 py-4 bg-neon text-white font-black rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wide text-sm shadow-lg"
              style={{ boxShadow: '0 4px 20px var(--color-accent-glow)' }}
            >
              <CalendarDays className="w-5 h-5" />
              Lịch Thi Đấu
            </Link>
            <Link 
              to="/bang-xep-hang" 
              className="w-full sm:w-auto px-8 py-4 backdrop-blur-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-3 border uppercase tracking-wide text-sm group shadow-lg"
              style={{ 
                backgroundColor: 'var(--color-bg-card)', 
                color: 'var(--color-text-primary)',
                borderColor: 'var(--color-border)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <Users className="w-5 h-5 text-neon transition-colors" />
              Bảng Xếp Hạng
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}