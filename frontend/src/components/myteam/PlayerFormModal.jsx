import { useState } from 'react';
import { UserPlus, Edit, Camera, AlertTriangle, Info, Loader2, FileDown, UploadCloud, CheckCircle2, X } from 'lucide-react';

export default function PlayerFormModal({ mode, player,
  onSave, onClose, isSaving, error, onImport, onDownloadTemplate, isDownloadingTemplate }) {
  const [form, setForm] = useState({
    name: player?.name || '',
    number: player?.number || '',
    position: player?.position || 'MID',
    goals: player?.goals || 0,
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-navy-dark/95 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] shadow-2xl w-full max-w-md animate-scale-in flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-navy-light relative z-10 bg-navy/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30">
              {mode === 'add' ? <UserPlus className="w-5 h-5 text-blue-400" /> : <Edit className="w-5 h-5 text-blue-400" />}
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              {mode === 'add' ? 'Thêm cầu thủ' : 'Chỉnh sửa'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 relative z-10">
          {/* Avatar */}
          {player?.avatar && (
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full border-[3px] border-navy-light overflow-hidden relative group cursor-pointer shadow-lg shadow-black/50">
                <img src={player.avatar} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white scale-75 group-hover:scale-100 transition-transform duration-300" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-5 py-4 rounded-xl flex items-center gap-3 animate-fade-in shadow-[0_0_20px_rgba(239,68,68,0.1)] font-medium">
              <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
            </div>
          )}

          {/* Import Excel block (chỉ hiện khi thêm mới) */}
          {mode === 'add' && onImport && (
            <div className="bg-navy border border-navy-light rounded-2xl p-5 space-y-4 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-500/20 rounded-xl border border-red-500/30 shrink-0 mt-0.5">
                  <Info className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-red-500 font-black mb-1 leading-relaxed">
                    Thêm nhiều cầu thủ cùng lúc
                  </p>
                  <p className="text-xs text-red-400/90 font-medium leading-relaxed">
                    Tải file mẫu Excel, điền đầy đủ thông tin rồi tải lên lại để tiết kiệm thời gian.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={onDownloadTemplate}
                  disabled={isDownloadingTemplate}
                  className="w-full sm:w-1/2 px-4 py-3.5 font-bold bg-navy-dark text-gray-300 border border-navy-light rounded-xl flex items-center justify-center gap-2 hover:bg-navy-light hover:text-white transition-all duration-300 text-sm whitespace-nowrap disabled:opacity-60"
                >
                  {isDownloadingTemplate ? <Loader2 className="w-5 h-5 animate-spin shrink-0" /> : <FileDown className="w-5 h-5 shrink-0" />}
                  Tải file mẫu
                </button>
                <div className="relative w-full sm:w-1/2">
                  <input type="file" id="import-excel-modal" accept=".xlsx,.xls" className="hidden" onChange={onImport} disabled={isSaving} />
                  <label htmlFor="import-excel-modal" className={`w-full px-4 py-3.5 font-black bg-linear-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer text-sm shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:-translate-y-0.5 uppercase tracking-wider whitespace-nowrap ${isSaving ? 'opacity-70 pointer-events-none' : ''}`}>
                    <UploadCloud className="w-5 h-5 shrink-0" /> Import Excel
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Họ tên */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Họ và tên <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm transition-all font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Số áo */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                Số áo <span className="text-red-400">*</span>
              </label>
              <input
                name="number"
                type="number"
                min="1" max="99"
                value={form.number}
                onChange={handleChange}
                placeholder="10"
                className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm font-black text-center transition-all"
              />
            </div>

            {/* Vị trí */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Vị trí</label>
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm transition-all font-bold appearance-none cursor-pointer text-center"
              >
                <option value="GK">GK – Thủ môn</option>
                <option value="DEF">DEF – Hậu vệ</option>
                <option value="MID">MID – Tiền vệ</option>
                <option value="FW">FW – Tiền đạo</option>
              </select>
            </div>
          </div>

          {/* Bàn thắng (chỉ khi edit) */}
          {mode === 'edit' && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 text-center">Số bàn thắng</label>
              <input
                name="goals"
                type="number"
                min="0"
                value={form.goals}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-neon focus:outline-none focus:border-neon focus:ring-4 focus:ring-neon/20 text-xl font-black text-center transition-all"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-navy-light bg-navy/40 flex justify-end gap-4 relative z-10">
          <button onClick={onClose} className="px-6 py-3.5 font-bold text-gray-400 hover:text-white hover:bg-navy-light rounded-2xl transition-all duration-300">
            Hủy bỏ
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={isSaving}
            className="px-8 py-3.5 font-black bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center gap-3 hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 disabled:opacity-70 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] uppercase tracking-wider text-sm hover:-translate-y-0.5"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            {mode === 'add' ? 'LƯU CẦU THỦ' : 'CẬP NHẬT'}
          </button>
        </div>
      </div>
    </div>
  );
}