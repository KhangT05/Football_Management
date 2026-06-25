import { MapPin, Trophy } from "lucide-react";
import { Information } from "../data/data";

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
        <div 
          className="grid grid-cols-1 border-b pb-12"
          style={{ borderColor: 'var(--color-border-light)' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-6 max-w-md">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-xl border"
                  style={{ 
                    backgroundColor: 'var(--color-bg-elevated)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <img src={Information.imgUrl} alt="" className='w-8 h-8 rounded-full' />
                </div>
                <div>
                  <h2 
                    className="text-xl font-bold tracking-tight uppercase italic"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {Information.logoTitle}
                  </h2>
                  <p 
                    className="text-xs font-bold tracking-wider"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {Information.logoSubtitle}
                  </p>
                </div>
              </div>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {Information.description}
              </p>
            </div>

            <div className="space-y-3 md:text-right">
              <h4 
                className="font-bold tracking-wider uppercase mb-4 text-sm"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Ban Tổ Chức
              </h4>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {Information.organization}
              </p>
              <p className="text-sm flex items-center md:justify-end gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <MapPin className="w-4 h-4 text-neon" /> {Information.address}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Email: {Information.email}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Điện thoại: {Information.phone}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p style={{ color: 'var(--color-text-muted)' }}>&copy; {Information.copyright}</p>
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="font-medium transition-colors hover:opacity-70"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Điều khoản
            </a>
            <a 
              href="#" 
              className="font-medium transition-colors hover:opacity-70"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Bảo mật
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}