import { Information, MENU_GROUPS, navItems, VI_LABELS } from "../../data/data";
import { LogOut, X } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { useShallow } from 'zustand/react/shallow';

export default function AsideAdmin({ onClose, isCollapsed }) {
  const { user } = useAuthStore(useShallow(state => ({ user: state.user })));
  
  const userRoles = Array.isArray(user?.roles) 
    ? user.roles.map(r => typeof r === 'string' ? r.toLowerCase() : r) 
    : (user?.role ? [typeof user.role === 'string' ? user.role.toLowerCase() : user.role] : []);
    
  const isAdmin = userRoles.includes('admin') || user?.is_admin === true;
  const isOrganizing = userRoles.includes('organizing');

  let allowedItems = new Set(['Tổng quan']);
  
  if (isAdmin) {
    allowedItems.add('Tài khoản & Phân quyền');
    allowedItems.add('Quản lý Lớp học');
  } 
  
  if (isOrganizing) {
    [
      'Thiết lập giải đấu',
      'Đội bóng & Duyệt đăng ký',
      'Bốc thăm & Lên lịch',
      'Thi đấu & Loại trực tiếp',
      'Quản lý bài viết',
      'Xác nhận thanh toán'
    ].forEach(item => allowedItems.add(item));
  }

  const allowedItemsArray = Array.from(allowedItems);

  const filteredMenuGroups = MENU_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => allowedItemsArray.includes(item))
  })).filter(group => group.items.length > 0);

  return (
    <aside className={`
      h-full bg-navy border-r border-navy-light text-white flex flex-col shadow-2xl z-20 shrink-0
      transition-all duration-300 ease-in-out
      w-64 ${isCollapsed ? 'md:w-20' : 'md:w-64'}
    `}>

      {/* Logo / Brand */}
      <div className={`
        h-16 md:h-[72px] flex items-center border-b border-navy-light shrink-0 transition-all duration-300
        px-5 ${isCollapsed ? 'md:justify-center md:px-0' : 'md:justify-between'} justify-between
      `}>
        <div className={`flex items-center w-full ${isCollapsed ? 'md:justify-center gap-0' : 'gap-3'} transition-all`}>
          <Link to="/" className="flex items-center shrink-0 w-full overflow-hidden" title={Information.logoTitle}>
            <div className={`flex items-center justify-center shrink-0 ${isCollapsed ? '' : ''}`}>
              <img src={Information.imgUrl} alt="" className={`text-white rounded-full transition-all duration-300 w-12 h-12 ${isCollapsed ? 'md:w-10 md:h-10' : ''}`} />
            </div>
            <div className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'md:opacity-0 md:w-0 md:ml-0' : 'opacity-100'} overflow-hidden`}>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none uppercase italic whitespace-nowrap">{Information.logoTitle}</h1>
              <p className="text-gray-400 text-xs font-semibold tracking-wider truncate">{Information.logoSubtitle}</p>
            </div>
          </Link>
        </div>

        {/* Close button (mobile) */}
        {onClose && (
          <button
            onClick={onClose}
            className={`md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors shrink-0`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className={`flex-1 pb-4 space-y-4 overflow-y-auto custom-scrollbar px-3 ${isCollapsed ? 'md:px-2 mt-4' : 'mt-4'}`}>
        {filteredMenuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className={`pt-2 pb-1 transition-all duration-300 px-3 ${isCollapsed ? 'md:px-0 md:text-center' : ''}`}>
              <p className={`text-[10px] font-black text-gray-500 uppercase tracking-widest truncate ${isCollapsed ? 'md:hidden' : ''}`}>
                {group.groupLabel}
              </p>
              <div className={`hidden ${isCollapsed ? 'md:block' : ''} w-4 h-px bg-gray-600 mx-auto mt-2 transition-all`}></div>
            </div>
            
            {group.items.map((itemName) => {
              const item = navItems.find(i => i.name === itemName);
              if (!item) return null;
              const Icon = item.icon;
              const label = VI_LABELS[item.name] ?? item.name;
              
              return (
                <NavLink
                  end
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  title={label}
                  className={({ isActive }) =>
                    `group flex items-center rounded-xl transition-all duration-200 overflow-hidden
                    px-3 py-2.5 gap-3 ${isCollapsed ? 'md:px-0 md:justify-center md:gap-0' : ''}
                    ${isActive
                      ? 'bg-neon/10 text-neon border border-neon/20 shadow-sm shadow-neon/10 font-bold'
                      : 'text-gray-400 hover:bg-navy-light/60 hover:text-white border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`
                        rounded-lg flex items-center justify-center shrink-0 transition-all duration-300
                        w-8 h-8 ${isCollapsed ? 'md:w-10 md:h-10' : ''}
                        ${isActive
                          ? 'bg-neon/20 text-neon'
                          : 'bg-navy-dark text-gray-500 group-hover:bg-navy-light group-hover:text-white'}
                      `}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'md:opacity-0 md:w-0' : 'opacity-100'}`}>
                        {label}
                      </span>
                      {isActive && (
                        <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-neon shrink-0 ${isCollapsed ? 'md:hidden' : ''}`} />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: back to home */}
      <div className={`p-3 border-t border-navy-light shrink-0 ${isCollapsed ? 'md:p-2 md:flex md:justify-center' : ''}`}>
        <Link
          to="/"
          className={`group flex items-center rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 overflow-hidden
            px-3 py-2.5 gap-3 ${isCollapsed ? 'md:px-0 md:py-2 md:justify-center md:gap-0 md:w-12' : ''}`}
          title="Về trang chủ"
        >
          <div className={`rounded-lg bg-navy-dark flex items-center justify-center shrink-0 group-hover:bg-red-500/10 transition-colors
            w-8 h-8 ${isCollapsed ? 'md:w-10 md:h-10' : ''}`}>
            <LogOut className="w-4 h-4" />
          </div>
          <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'md:opacity-0 md:w-0' : 'opacity-100'}`}>
            Về trang chính
          </span>
        </Link>
      </div>
    </aside>
  );
}