import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Settings as SettingsIcon, AlertTriangle, Save, RotateCcw, Trash2 } from 'lucide-react';

export default function Settings() {
  const [status, setStatus] = useState('ongoing');

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
             <SettingsIcon className="w-6 h-6 text-slate-600" /> Tournament Settings
          </h2>
          <p className="text-gray-400 text-sm mt-1">Quản lý các thiết lập chung và trạng thái sống của giải đấu</p>
        </div>

        {/* General Settings Card */}
        <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-navy-dark/50">
             <h3 className="font-bold text-white text-lg">General Information</h3>
             <p className="text-xs text-gray-400 mt-1">Thông tin cơ bản hiển thị trên trang chủ của hệ thống.</p>
          </div>
          
          <div className="p-6 space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Tournament Name <span className="text-red-500">*</span></label>
                   <input 
                      type="text" 
                      defaultValue="Khoa IT Super League" 
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-lg shadow-black/20 font-semibold text-white" 
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Season / Year <span className="text-red-500">*</span></label>
                   <input 
                      type="text" 
                      defaultValue="Mùa giải 2026" 
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-lg shadow-black/20 font-semibold text-white" 
                   />
                </div>
             </div>

             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea 
                   rows="4" 
                   defaultValue="Giải bóng đá sinh viên Khoa Công nghệ Thông tin, mang đến sân chơi thể thao và giao lưu học viện tốt nhất."
                   className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-lg shadow-black/20 resize-none text-slate-700"
                ></textarea>
             </div>
          </div>
        </div>

        {/* Status Toggle Card */}
        <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-navy-dark/50">
             <h3 className="font-bold text-white text-lg">Tournament Status</h3>
             <p className="text-xs text-gray-400 mt-1">Trạng thái này quyết định cách hiển thị UI public (VD: Đóng đăng ký, Tổng kết giải).</p>
          </div>
          
          <div className="p-6">
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Upcoming */}
                <label className={`relative flex flex-col items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${status === 'upcoming' ? 'border-slate-500 bg-navy-dark shadow-lg shadow-black/20' : 'border-navy-light hover:border-slate-300'}`}>
                   <input type="radio" name="status" value="upcoming" checked={status === 'upcoming'} onChange={() => setStatus('upcoming')} className="hidden" />
                   <div className="w-4 h-4 rounded-full border-2 border-slate-400 mb-3 flex items-center justify-center">
                      {status === 'upcoming' && <div className="w-2 h-2 rounded-full bg-slate-600"></div>}
                   </div>
                   <span className={`font-bold uppercase tracking-wider text-sm ${status === 'upcoming' ? 'text-slate-700' : 'text-slate-400'}`}>Upcoming</span>
                   <span className="text-xs text-slate-400 mt-1 text-center">Chưa diễn ra</span>
                </label>

                {/* Ongoing */}
                <label className={`relative flex flex-col items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${status === 'ongoing' ? 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-black/20' : 'border-navy-light hover:border-slate-300'}`}>
                   <input type="radio" name="status" value="ongoing" checked={status === 'ongoing'} onChange={() => setStatus('ongoing')} className="hidden" />
                   <div className="w-4 h-4 rounded-full border-2 border-emerald-400 mb-3 flex items-center justify-center">
                      {status === 'ongoing' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                   </div>
                   <span className={`font-bold uppercase tracking-wider text-sm ${status === 'ongoing' ? 'text-emerald-700' : 'text-slate-400'}`}>Ongoing</span>
                   <span className="text-xs text-slate-400 mt-1 text-center">Đang phát trực tiếp</span>
                </label>

                {/* Completed */}
                <label className={`relative flex flex-col items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${status === 'completed' ? 'border-navy-light bg-blue-50/50 shadow-lg shadow-black/20' : 'border-navy-light hover:border-slate-300'}`}>
                   <input type="radio" name="status" value="completed" checked={status === 'completed'} onChange={() => setStatus('completed')} className="hidden" />
                   <div className="w-4 h-4 rounded-full border-2 border-blue-400 mb-3 flex items-center justify-center">
                      {status === 'completed' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                   </div>
                   <span className={`font-bold uppercase tracking-wider text-sm ${status === 'completed' ? 'text-blue-700' : 'text-slate-400'}`}>Completed</span>
                   <span className="text-xs text-slate-400 mt-1 text-center">Đã kết thúc giải</span>
                </label>

             </div>
          </div>

          <div className="p-5 bg-navy-dark border-t border-slate-100 flex justify-end">
             <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#003280] hover:bg-navy-light text-white font-bold rounded-lg shadow-md transition-colors w-full sm:w-auto">
               <Save className="w-4 h-4" /> Save Settings
             </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50/30 border-2 border-red-200 rounded-xl overflow-hidden mt-12 mb-10 shadow-lg shadow-black/20">
           <div className="p-6 border-b border-red-200 bg-red-100/50 flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-black text-lg">Danger Zone</h3>
           </div>
           
           <div className="p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-red-100">
                 <div>
                    <h4 className="font-bold text-white">Reset All Matches</h4>
                    <p className="text-sm text-gray-400 mt-0.5">Xóa sạch toàn bộ kết quả trận đấu, thẻ phạt và lịch sử. Tác vụ này không thể hoàn tác.</p>
                 </div>
                 <button className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-navy border border-slate-300 text-slate-700 hover:bg-navy-dark hover:text-red-500 font-bold rounded-lg transition-colors shadow-lg shadow-black/20 w-full sm:w-auto">
                    <RotateCcw className="w-4 h-4" /> Reset Matches
                 </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div>
                    <h4 className="font-bold text-white">Delete Tournament</h4>
                    <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      Xóa hoàn toàn giải đấu khỏi bộ nhớ. <strong className="text-red-500 bg-red-100 px-2 py-0.5 rounded uppercase text-xs">Cảnh báo vô cùng nguy hiểm</strong>
                    </p>
                 </div>
                 <button className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-md shadow-red-500/20 w-full sm:w-auto">
                    <Trash2 className="w-4 h-4" /> Delete Completely
                 </button>
              </div>

           </div>
        </div>

      </div>
    </AdminLayout>
  );
}
