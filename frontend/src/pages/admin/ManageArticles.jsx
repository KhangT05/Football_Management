import { useState, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Plus, Edit, Trash2, Newspaper,
  AlertTriangle, RefreshCw, Search,
  CheckCircle, XCircle
} from 'lucide-react';
import { useApiQuery, useCrudModal, useDebouncedValue } from '../../hooks';
import useToastStore from '../../store/toastStore';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import ArticleFormModal from '../../components/admin/ArticleFormModal';
import Pagination from '../../components/ui/Pagination';
import { articleApi } from '../../api';

const EMPTY_ARTICLE = {
  title: '',
  slug: '',
  content: '',
  cover_image: '',
  tags: [],
  is_published: false
};

export default function ManageArticles() {
  const toast = useToastStore();

  // Pagination & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const debouncedSearch = useDebouncedValue(searchTerm, 400);


  // ── Data fetching — dùng useApiQuery thống nhất với các trang admin khác ──
  const {
    data: articles,
    meta,
    isLoading,
    error: fetchError,
    fetch: fetchArticles,
  } = useApiQuery(
    (params) => articleApi.getArticles(params),
    {
      perPage: itemsPerPage,
      params: {
        page: currentPage,
        per_page: itemsPerPage,
        q: debouncedSearch || undefined,
        sort: 'created_at',
        direction: 'desc',
      },
      deps: [currentPage, itemsPerPage, debouncedSearch],
      errorMsg: 'Lỗi khi tải danh sách bài viết',
    }
  );

  const totalPages = meta?.last_page || 1;

  // CRUD Modal
  const articleCrud = useCrudModal({ emptyForm: EMPTY_ARTICLE, onSuccess: fetchArticles });

  const openAddArticle = () => articleCrud.openAdd();

  const openEditArticle = (article) => {
    articleCrud.openEdit(article, {
      title: article.title,
      content: article.content,
      cover_image: article.cover_image,
      status: article.status,
      tags: (article.tags || []).map(t => typeof t === 'object' ? t.tag : t),
    });
  };

  const handleSaveArticle = useCallback((payload) => {
    const finalPayload = { ...payload };
    delete finalPayload.excerpt; // in case it's lingering in older data
    
    if (!finalPayload.slug) {
      finalPayload.slug = finalPayload.title.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }

    if (!finalPayload.cover_image) {
      delete finalPayload.cover_image;
    }

    articleCrud.save(async () => {
      if (articleCrud.modal === 'add') {
        await articleApi.createArticle(finalPayload);
        toast.success(`Đã tạo bài viết "${payload.title}"`);
      } else {
        await articleApi.updateArticle(articleCrud.editing.id, finalPayload);
        toast.success(`Đã cập nhật bài viết "${payload.title}"`);
      }
    });
  }, [articleCrud, toast]);

  const handleDeleteArticle = () => {
    const article = articleCrud.deleting;
    articleCrud.confirmDelete(async () => {
      await articleApi.deleteArticle(article.id);
      toast.success(`Đã xóa bài viết "${article.title}".`);
      fetchArticles();
    }).catch((err) => {
      toast.error(err?.response?.data?.message || 'Không thể xóa bài viết.');
    });
  };

  const toggleStatus = async (article) => {
    try {
      const newStatus = article.status === 'published' ? 'draft' : 'published';
      await articleApi.updateStatus(article.id, newStatus);
      toast.success(`Đã đổi trạng thái thành ${newStatus}`);
      fetchArticles();
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi đổi trạng thái');
    }
  };

  return (
    <AdminLayout>
      <div className="w-full space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Bài Viết</h2>
            <p className="text-gray-400 text-sm mt-1">
              <span className="font-bold text-neon">{meta?.total || 0}</span> bài viết trong hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchArticles}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openAddArticle}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-5 h-5" /> Viết bài mới
            </button>
          </div>
        </div>

        <div className="bg-navy p-4 rounded-xl border border-navy-light flex flex-col sm:flex-row gap-3 shadow-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-emerald-500 text-sm transition-colors"
            />
          </div>
        </div>

        <div className="bg-navy border border-navy-light rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 w-20 text-center">Ảnh bìa</th>
                  <th className="py-4 px-6">Tiêu đề</th>
                  <th className="py-4 px-6">Tác giả</th>
                  <th className="py-4 px-6 text-center">Trạng thái</th>
                  <th className="py-4 px-6">Ngày tạo</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-navy-light">
                      {[1, 2, 3, 4, 5, 6].map(j => (
                        <td key={j} className="py-4 px-6"><div className="skeleton h-4 w-full rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : fetchError ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-red-400">
                      <div className="flex flex-col items-center gap-3">
                        <AlertTriangle className="w-10 h-10 text-red-500/50" />
                        <p className="font-semibold">{fetchError}</p>
                      </div>
                    </td>
                  </tr>
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <Newspaper className="w-10 h-10 text-gray-600" />
                        <p className="font-semibold">Chưa có bài viết nào.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article.id} className="border-b border-navy-light hover:bg-navy-dark/70 transition-colors">
                      <td className="py-4 px-6 text-center">
                        {article.cover_image ? (
                          <img src={article.cover_image} alt="cover" className="w-12 h-8 rounded object-cover mx-auto border border-navy-light" />
                        ) : (
                          <div className="w-12 h-8 rounded bg-navy-dark border border-navy-light flex items-center justify-center mx-auto text-gray-500">
                            <Newspaper className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-white max-w-xs truncate">{article.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{article.slug}</p>
                      </td>
                      <td className="py-4 px-6 text-gray-300 text-sm">{article.author?.name || 'Admin'}</td>
                      <td className="py-4 px-6 text-center">
                        <button onClick={() => toggleStatus(article)} className={`px-2.5 py-1 text-xs font-bold rounded-lg border inline-flex items-center gap-1.5 transition-colors ${article.status === 'published'
                          ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30 hover:bg-emerald-400/20'
                          : 'bg-amber-400/10 text-amber-400 border-amber-400/30 hover:bg-amber-400/20'
                          }`}>
                          {article.status === 'published' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-sm">
                        {new Date(article.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditArticle(article)} className="p-2 rounded-lg bg-navy-dark text-blue-400 hover:bg-blue-500/10 border border-navy-light hover:border-blue-500/40 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => articleCrud.setDeleting(article)} className="p-2 rounded-lg bg-navy-dark text-red-400 hover:bg-red-500/10 border border-navy-light hover:border-red-500/40 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-navy-light bg-navy-dark rounded-b-xl">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}
        </div>
      </div>

      {articleCrud.modal && (
        <ArticleFormModal
          mode={articleCrud.modal}
          initialData={articleCrud.form}
          isSaving={articleCrud.isSaving}
          onSave={handleSaveArticle}
          onClose={articleCrud.closeModal}
        />
      )}

      {articleCrud.deleting && (
        <ConfirmDeleteModal
          title="Xóa bài viết?"
          message={<>Xóa <strong className="text-white">{articleCrud.deleting.title}</strong>? Hành động này không thể hoàn tác.</>}
          onConfirm={handleDeleteArticle}
          onCancel={() => articleCrud.setDeleting(null)}
          isDeleting={articleCrud.isDeleting}
        />
      )}
    </AdminLayout>
  );
}
