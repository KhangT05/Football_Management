import { useState, useRef } from 'react';
import { X, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadApi } from '../../api';

export default function ArticleFormModal({ mode, initialData, isSaving, onSave, onClose }) {
  const [form, setForm] = useState(initialData);
  const [formError, setFormError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tagsArray = value.split(',').map(t => t.trim()).filter(Boolean);
    setForm(prev => ({ ...prev, tags: tagsArray }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setFormError('');
      const res = await uploadApi.uploadSingle(file, 'articles', 'cover_image');
      // result from backend: { url, publicId, format, bytes }
      setForm(prev => ({ ...prev, cover_image: res.data.url }));
    } catch (err) {
      console.error(err);
      setFormError('Lỗi khi tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('Vui lòng nhập tiêu đề bài viết.');
      return;
    }
    if (!form.content.trim()) {
      setFormError('Vui lòng nhập nội dung bài viết.');
      return;
    }
    setFormError('');
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-navy border border-navy-light rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-navy-light flex items-center justify-between bg-navy-dark/50">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            {mode === 'add' ? 'Viết bài mới' : 'Chỉnh sửa bài viết'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {formError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium animate-slide-down">
              {formError}
            </div>
          )}

          <form id="article-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                Ảnh bìa
              </label>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-64 aspect-video bg-navy-dark border-2 border-dashed border-navy-light rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-colors flex items-center justify-center relative group"
                >
                  {form.cover_image ? (
                    <>
                      <img src={form.cover_image} alt="Cover Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-navy-dark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-bold text-sm">Đổi ảnh</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-blue-400 transition-colors">
                      {isUploading ? <Loader2 className="w-8 h-8 animate-spin mb-2" /> : <ImageIcon className="w-8 h-8 mb-2" />}
                      <span className="text-sm font-medium">{isUploading ? 'Đang tải lên...' : 'Chọn ảnh bìa'}</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                Tiêu đề bài viết <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Nhập tiêu đề..."
                className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-medium text-lg"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                Tóm tắt (Excerpt)
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Đoạn văn ngắn tóm tắt nội dung..."
                rows="3"
                className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-medium resize-none custom-scrollbar"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                Thẻ (Tags) - Phân cách bằng dấu phẩy
              </label>
              <input
                type="text"
                value={form.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="Ví dụ: highlight, thong-bao, lich-thi-dau..."
                className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full sm:w-1/2 bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
              >
                <option value="draft">Bản nháp (Draft)</option>
                <option value="published">Xuất bản (Published)</option>
              </select>
            </div>

            {/* Content (HTML) */}
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                Nội dung (HTML) <span className="text-red-400">*</span>
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Nhập nội dung bài viết. Bạn có thể sử dụng các thẻ HTML..."
                rows="15"
                className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono text-sm resize-y custom-scrollbar"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-light bg-navy-dark/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="article-form"
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {mode === 'add' ? 'Đăng bài' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}
