import axiosClient from './axiosClient';

function buildArticleFormData(data) {
  const fd = new FormData();

  fd.append('title', data.title ?? '');
  fd.append('slug', data.slug ?? '');
  fd.append('content', data.content ?? '');

  if (data.status) fd.append('status', data.status);
  if (data.season_id) fd.append('season_id', String(data.season_id));
  if (data.match_id) fd.append('match_id', String(data.match_id));
  if (data.team_id) fd.append('team_id', String(data.team_id));
  if (data.published_at) fd.append('published_at', data.published_at);

  // tags/media backend nhận dạng JSON string trong form field
  if (data.tags) fd.append('tags', JSON.stringify(data.tags));
  if (data.media) fd.append('media', JSON.stringify(data.media));

  // Chỉ gửi file khi user chọn ảnh mới
  if (data.cover_image_file instanceof File) {
    fd.append('cover_image', data.cover_image_file);
  }

  return fd;
}

export const articleApi = {
  getArticles: (params) => {
    return axiosClient.get('/articles', { params });
  },
  getArticleById: (id) => {
    return axiosClient.get(`/articles/${id}`);
  },
  getArticleBySlug: (slug) => {
    return axiosClient.get(`/articles/slug/${slug}`);
  },
  createArticle: (data) => {
    return axiosClient.post('/articles', buildArticleFormData(data));
  },
  updateArticle: (id, data) => {
    return axiosClient.patch(`/articles/${id}`, buildArticleFormData(data));
  },
  updateStatus: (id, status) => {
    return axiosClient.patch(`/articles/${id}/status`, { status });
  },
  deleteArticle: (id) => {
    return axiosClient.delete(`/articles/${id}`);
  },
  getTags: () => {
    return axiosClient.get('/articles/tags');
  },
  addTag: (articleId, tag) => {
    return axiosClient.post(`/articles/${articleId}/tags`, { tag });
  },
  bulkAddTags: (articleId, tags) => {
    return axiosClient.post(`/articles/${articleId}/tags/bulk`, { tags });
  },
  removeTag: (articleId, tag) => {
    return axiosClient.delete(`/articles/${articleId}/tags/${encodeURIComponent(tag)}`);
  },
  getMedia: (articleId) => {
    return axiosClient.get(`/articles/${articleId}/media`);
  },
  addMedia: (articleId, data) => {
    // data: { url, public_id, format, bytes, width, height, is_cover }
    return axiosClient.post(`/articles/${articleId}/media`, data);
  },
  deleteMedia: (articleId, mediaId) => {
    return axiosClient.delete(`/articles/${articleId}/media/${mediaId}`);
  },
  bulkDeleteMedia: (articleId, mediaIds) => {
    return axiosClient.delete(`/articles/${articleId}/media`, { data: { ids: mediaIds } });
  }
};