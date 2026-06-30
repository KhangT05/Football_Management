import axiosClient from './axiosClient';

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
    return axiosClient.post('/articles', data);
  },

  updateArticle: (id, data) => {
    return axiosClient.patch(`/articles/${id}`, data);
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
