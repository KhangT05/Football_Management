import { navItems } from "../../data/data";
import { LogOut, Trophy } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

export default function AsideAdmin() {

  return (
    <aside className="w-16 md:w-64 bg-navy border-r border-navy-light text-white flex flex-col shadow-xl z-20 shrink-0 transition-all duration-300">
      <div className="h-20 flex items-center justify-center md:justify-start px-0 md:px-6 border-b border-navy-light">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 md:w-6 md:h-6 text-white" />
          <span className="font-bold text-lg tracking-wide uppercase italic hidden md:block">IT Admin</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-2 md:px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              end
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-lg transition-colors ${isActive
                  ? "bg-navy text-neon shadow-md font-bold"
                  : "text-gray-400 hover:bg-navy-light hover:text-white"
                }`
              }
              title={item.name}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="font-medium hidden md:block whitespace-nowrap">
                {item.name}
              </span>
            </NavLink>
          )
        })}
      </nav>

      <div className="p-2 md:p-4 border-t border-navy-light">
        <Link to="/" className="flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-lg text-gray-400 hover:bg-navy-light hover:text-white transition-colors" title="Về trang chính">
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="font-medium hidden md:block whitespace-nowrap">Về trang chính</span>
        </Link>
      </div>
    </aside>
  )
}