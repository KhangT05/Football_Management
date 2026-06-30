import axiosClient from './axiosClient';

export const uploadApi = {
  /**
   * Upload single file
   * @param {File} file 
   * @param {string} namespace (e.g. "articles", "teams")
   * @param {string} kind (e.g. "cover", "logo")
   */
  uploadSingle: (file, namespace, kind) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('namespace', namespace);
    formData.append('kind', kind);
    return axiosClient.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Upload multiple files
   * @param {File[]} files 
   * @param {string} namespace 
   * @param {string} kind 
   */
  uploadMulti: (files, namespace, kind) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    formData.append('namespace', namespace);
    formData.append('kind', kind);
    return axiosClient.post('/upload/multi', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
