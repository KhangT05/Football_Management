import { uploadApi } from '../api';

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        // Gọi API của ứng dụng để đẩy file lên
        uploadApi.uploadSingle(file, 'articles', 'content_image')
          .then(res => {
            // Trả về { default: URL } theo format CKEditor yêu cầu
            resolve({
              default: res.data.url
            });
          })
          .catch(err => {
            console.error('CKEditor upload failed', err);
            reject(err?.response?.data?.message || 'Không thể tải ảnh lên');
          });
      }));
  }

  // Aborts the upload process.
  abort() {
    // Có thể implement logic abort tại đây nếu uploadApi hỗ trợ axios cancel token
  }
}

export function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}
