import { useState, useEffect } from 'react';
import { Shirt, Trash2, Save, X, Plus } from 'lucide-react';
import { jerseyApi } from '../../api';
import useToastStore from '../../store/toastStore';
import { INPUT, BTN_PRIMARY } from '../../utils/adminStyles';

export default function ManageJerseysModal({ isOpen, onClose, seasonTeam }) {
  const toast = useToastStore();
  const [jerseys, setJerseys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  
  const [formData, setFormData] = useState({
    type: 'home',
    color_primary: '#ffffff',
    color_secondary: '#000000'
  });

  useEffect(() => {
    if (isOpen && seasonTeam) {
      loadJerseys();
      setEditingIndex(null);
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, seasonTeam]);

  const loadJerseys = async () => {
    setLoading(true);
    try {
      const res = await jerseyApi.getBySeasonTeam(seasonTeam.id);
      const payload = typeof res?.status === 'boolean' ? res.data : res;
      setJerseys(Array.isArray(payload) ? payload : []);
    } catch (_err) {
      toast.error('Không thể tải danh sách áo đấu');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ type: 'home', color_primary: '#ffffff', color_secondary: '#000000' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.type) return toast.error('Vui lòng chọn loại áo');
    
    try {
      await jerseyApi.upsert(seasonTeam.id, formData);
      toast.success('Lưu thông tin áo đấu thành công');
      loadJerseys();
      setEditingIndex(null);
      resetForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Lỗi khi lưu áo đấu');
    }
  };

  const handleDelete = async (type) => {
    if (!confirm(`Xóa áo ${type}?`)) return;
    try {
      await jerseyApi.delete(seasonTeam.id, type);
      toast.success('Đã xóa áo đấu');
      loadJerseys();
    } catch (_err) {
      toast.error('Lỗi khi xóa áo đấu');
    }
  };

  const handleEdit = (jersey, index) => {
    setFormData({
      type: jersey.type,
      color_primary: jersey.color_primary || '#ffffff',
      color_secondary: jersey.color_secondary || '#000000'
    });
    setEditingIndex(index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-navy border border-navy-light w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-navy-light bg-navy-dark/50 rounded-t-2xl">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Shirt className="w-5 h-5 text-emerald-400" />
            Áo đấu: {seasonTeam?.team?.name}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          
          {/* List Existing */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400">Danh sách hiện tại</h3>
            {loading ? (
              <div className="text-center py-4 text-gray-500">Đang tải...</div>
            ) : jerseys.length === 0 ? (
              <div className="text-center py-4 text-gray-500 border border-dashed border-navy-light rounded-lg">Chưa có áo đấu</div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {jerseys.map((j, idx) => (
                  <div key={j.id || idx} className="flex items-center justify-between p-3 rounded-xl border border-navy-light bg-navy-dark">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md border border-white/10"
                        style={{ 
                          background: `linear-gradient(135deg, ${j.color_primary} 50%, ${j.color_secondary} 50%)`
                        }}
                      >
                        <Shirt className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                      <div>
                        <div className="font-bold text-white uppercase text-sm">{j.type}</div>
                        <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{backgroundColor: j.color_primary}}></span> {j.color_primary}</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{backgroundColor: j.color_secondary}}></span> {j.color_secondary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(j, idx)} className="text-blue-400 hover:text-blue-300 text-xs font-bold px-2 py-1 bg-blue-500/10 rounded">Sửa</button>
                      <button onClick={() => handleDelete(j.type)} className="text-red-400 hover:text-red-300 text-xs font-bold px-2 py-1 bg-red-500/10 rounded">Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-navy-light" />

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4 bg-navy-dark p-4 rounded-xl border border-navy-light">
            <h3 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> {editingIndex !== null ? 'Cập nhật' : 'Thêm mới'}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 mb-1">Loại áo (Home, Away, Third...)</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className={INPUT}
                  disabled={editingIndex !== null}
                >
                  <option value="home">Home (Sân nhà)</option>
                  <option value="away">Away (Sân khách)</option>
                  <option value="third">Third (Mẫu thứ 3)</option>
                  <option value="gk">Goalkeeper (Thủ môn)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Màu chính</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.color_primary}
                    onChange={e => setFormData({ ...formData, color_primary: e.target.value })}
                    className="w-10 h-10 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.color_primary}
                    onChange={e => setFormData({ ...formData, color_primary: e.target.value })}
                    className={INPUT}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Màu phụ</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.color_secondary}
                    onChange={e => setFormData({ ...formData, color_secondary: e.target.value })}
                    className="w-10 h-10 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.color_secondary}
                    onChange={e => setFormData({ ...formData, color_secondary: e.target.value })}
                    className={INPUT}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button type="submit" className={`${BTN_PRIMARY} flex-1`}>
                <Save className="w-4 h-4" /> Lưu áo
              </button>
              {editingIndex !== null && (
                <button type="button" onClick={() => { setEditingIndex(null); resetForm(); }} className="px-4 bg-navy-light text-white rounded-xl hover:bg-gray-700 transition-colors">
                  Hủy
                </button>
              )}
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
