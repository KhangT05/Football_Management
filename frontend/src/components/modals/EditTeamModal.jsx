import { useState, useRef } from 'react';
import { X, Save, Loader2, Camera, AlertTriangle } from 'lucide-react';

export default function EditTeamModal({ team, onSave, onClose, isSaving, error }) {
  const [form, setForm] = useState({
    name: team?.name || '',
    coach_name: team?.captain || '', // mapped from myTeam
    description: team?.description || '',
    logo: null,
  });
  
  const [logoPreview, setLogoPreview] = useState(team?.logo || null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(prev => ({ ...prev, logo: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-navy-dark/95 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] shadow-2xl w-full max-w-md animate-scale-in flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-navy-light relative z-10 bg-navy/40">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Cập nhật thông tin đội</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 relative z-10">
          
          <div className="flex flex-col items-center gap-2">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-3xl bg-navy border border-navy-light flex items-center justify-center cursor-pointer hover:border-neon transition-colors overflow-hidden relative group"
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="text-4xl text-gray-500">{team?.emoji || '🛡️'}</div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-xs text-gray-500 font-bold">Nhấn để đổi Logo</p>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleLogoChange} />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-5 py-4 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tên đội <span className="text-red-400">*</span></label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white focus:border-neon focus:ring-4 focus:ring-neon/20 outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Đội trưởng</label>
              <input
                name="coach_name"
                value={form.coach_name}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white focus:border-neon focus:ring-4 focus:ring-neon/20 outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Giới thiệu ngắn</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white focus:border-neon focus:ring-4 focus:ring-neon/20 outline-none transition-all font-bold custom-scrollbar resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-navy-light bg-navy/40 flex justify-end gap-4 relative z-10">
          <button onClick={onClose} className="px-6 py-3.5 font-bold text-gray-400 hover:text-white hover:bg-navy-light rounded-2xl transition-all">
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3.5 font-black bg-linear-to-r from-neon to-emerald-500 text-black rounded-2xl flex items-center gap-3 hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(57,255,20,0.3)] uppercase tracking-wider text-sm"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            LƯU THAY ĐỔI
          </button>
        </div>
      </div>
    </div>
  );
}
