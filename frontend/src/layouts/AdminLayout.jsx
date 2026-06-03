import AsideAdmin from '../pages/admin/AsideAdmin';

export default function AdminLayout({ children }) {
  
  return (
    <div className="min-h-screen flex bg-navy-dark text-white font-sans">
      <AsideAdmin />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-navy border-b border-navy-light px-4 md:px-8 flex items-center justify-between shrink-0 shadow-lg shadow-black/20">
          <h1 className="text-lg md:text-xl font-bold text-neon hidden sm:block">Tournament Management</h1>
          <div className="flex-1 sm:hidden"></div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
               <p className="text-sm font-bold text-white leading-tight">Admin User</p>
               <p className="text-xs text-gray-400">Manage System</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center font-bold text-neon border border-navy-light shadow-lg shadow-black/20">
               AD
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
           {children}
        </div>
      </main>
    </div>
  );
}
