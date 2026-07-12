import { useState, useRef, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor, Bold, Italic, Essentials, Heading, Link, Paragraph, List,
  Image, ImageUpload, ImageToolbar, ImageCaption, ImageStyle, ImageResize,
  BlockQuote, Indent, IndentBlock
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import '../../assets/ckeditor-dark.css';
import { MyCustomUploadAdapterPlugin } from '../../utils/UploadAdapter';
import { getFriendlyErrorMessage } from '../../utils/errorHelper';

const EDITOR_CONFIG = {
  licenseKey: 'GPL',
  plugins: [
    Essentials, Bold, Italic, Heading, Link, Paragraph, List,
    Image, ImageUpload, ImageToolbar, ImageCaption, ImageStyle, ImageResize,
    BlockQuote, Indent, IndentBlock, MyCustomUploadAdapterPlugin
  ],
  toolbar: [
    'undo', 'redo', '|', 'heading', '|', 'bold', 'italic', '|',
    'link', 'uploadImage', 'blockQuote', '|',
    'bulletedList', 'numberedList', 'outdent', 'indent'
  ],
  image: {
    toolbar: [
      'imageTextAlternative', 'toggleImageCaption', 'imageStyle:inline',
      'imageStyle:block', 'imageStyle:side'
    ]
  }
};

// Override đúng CSS custom properties CKEditor5 v42+ dùng để tô theme —
// override background-color thường không ăn vì bị var(--ck-color-*) đè lại.
function CKEditorDarkThemeStyles() {
  return (
    <style>{`
      .article-editor-wrapper .ck.ck-editor {
        --ck-color-base-background: #0b1220;
        --ck-color-base-foreground: #0b1220;
        --ck-color-base-border: #2a3550;
        --ck-color-focus-border: #3b82f6;
        --ck-color-text: #e5e7eb;
        --ck-color-toolbar-background: #0f1729;
        --ck-color-toolbar-border: #2a3550;
        --ck-color-button-default-background: transparent;
        --ck-color-button-default-hover-background: rgba(255,255,255,0.08);
        --ck-color-button-on-background: rgba(59,130,246,0.2);
        --ck-color-button-on-color: #93c5fd;
        --ck-color-panel-background: #111a2e;
        --ck-color-panel-border: #2a3550;
        --ck-color-list-background: #111a2e;
        --ck-color-list-button-hover-background: rgba(255,255,255,0.08);
        --ck-color-input-background: #0b1220;
        --ck-color-input-border: #2a3550;
        --ck-color-input-text: #e5e7eb;
      }
      .article-editor-wrapper .ck.ck-editor__editable {
        background: var(--ck-color-base-background);
        color: var(--ck-color-text);
        min-height: 260px;
      }
      .article-editor-wrapper .ck.ck-toolbar {
        background: var(--ck-color-toolbar-background);
        border-color: var(--ck-color-toolbar-border);
      }
    `}</style>
  );
}

export default function ArticleFormModal({ mode, initialData, isSaving, onSave, onClose }) {
  const [form, setForm] = useState(initialData);
  const [formError, setFormError] = useState('');
  const [coverPreview, setCoverPreview] = useState(initialData?.cover_image || '');
  const fileInputRef = useRef(null);

  // Dọn object URL khi unmount / đổi ảnh để tránh leak bộ nhớ
  useEffect(() => {
    return () => {
      if (coverPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tagsArray = value.split(',').map(t => t.trim()).filter(Boolean);
    setForm(prev => ({ ...prev, tags: tagsArray }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Vui lòng chọn file ảnh hợp lệ.');
      toast.error('Vui lòng chọn file ảnh hợp lệ.');
      return;
    }

    setFormError('');
    setForm(prev => ({ ...prev, cover_image_file: file }));

    if (coverPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      const msg = 'Vui lòng nhập tiêu đề bài viết.';
      setFormError(msg);
      toast.error(msg);
      return;
    }
    if (!form.content.trim()) {
      const msg = 'Vui lòng nhập nội dung bài viết.';
      setFormError(msg);
      toast.error(msg);
      return;
    }
    setFormError('');
    onSave(form); // form.cover_image_file (nếu có) sẽ được articleApi build thành FormData
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

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                Ảnh bìa
              </label>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-64 aspect-video bg-navy-dark border-2 border-dashed border-navy-light rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-colors flex items-center justify-center relative group"
                >
                  {coverPreview ? (
                    <>
                      <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-navy-dark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-bold text-sm">Đổi ảnh</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-blue-400 transition-colors">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Chọn ảnh bìa</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Ảnh sẽ được upload lên server cùng lúc khi bạn bấm {mode === 'add' ? '"Đăng bài"' : '"Lưu thay đổi"'}.
              </p>
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

            {/* Slug */}
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="vi-du-duong-dan-bai-viet"
                className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
                Thẻ (Tags) - Phân cách bằng dấu phẩy
              </label>
              <input
                type="text"
                value={(form.tags || []).join(', ')}
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
                Nội dung bài viết <span className="text-red-400">*</span>
              </label>
              <div className="article-editor-wrapper prose prose-invert max-w-none">
                <CKEditorDarkThemeStyles />
                <CKEditor
                  editor={ClassicEditor}
                  config={EDITOR_CONFIG}
                  data={form.content}
                  onReady={(editor) => {
                    if (!editor.plugins.has('FileRepository')) {
                      console.error('[CKEditor] FileRepository plugin không tồn tại — upload ảnh sẽ không hoạt động.');
                      toast.error('Không thể khởi tạo chức năng upload ảnh trong trình soạn thảo.');
                      return;
                    }

                    // Tắt banner lỗi nội bộ của CKEditor (Notification plugin) để tránh
                    // hiện lỗi 2 lần — mọi lỗi upload đã được xử lý bằng toast trong
                    // UploadAdapter.js rồi, dùng chung 1 kênh thông báo cho đồng bộ UI.
                    const notification = editor.plugins.get('Notification');
                    notification.on(
                      'show:warning',
                      (evt) => evt.stop(),
                      { priority: 'high' }
                    );
                  }}
                  onError={(error, { willEditorRestart }) => {
                    console.error('[CKEditor] Lỗi runtime:', error);
                    const message = getFriendlyErrorMessage(
                      { response: null, message: error?.message },
                      'Trình soạn thảo gặp sự cố. Vui lòng tải lại trang.'
                    );
                    toast.error(message);
                    if (willEditorRestart) {
                      console.warn('[CKEditor] Editor sẽ tự khởi động lại do lỗi context.');
                    }
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setForm(prev => ({ ...prev, content: data }));
                  }}
                />
              </div>
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
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {mode === 'add' ? 'Đăng bài' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}