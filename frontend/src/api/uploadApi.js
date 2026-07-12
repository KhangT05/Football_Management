import { uploadApi } from '../api';
import toast from 'react-hot-toast';
import { getFriendlyErrorMessage } from './errorHelper';

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  // CKEditor gọi upload() riêng biệt cho MỖI ảnh khi bạn chọn/kéo-thả nhiều ảnh
  // cùng lúc → nên "upload multi ảnh" đã tự chạy song song, không cần sửa gì thêm.
  upload() {
    return this.loader.file.then((file) => {
      // Validate sớm phía client, khớp với backend (storageService chỉ nhận ảnh)
      if (!file.type.startsWith('image/')) {
        const msg = 'Chỉ hỗ trợ upload file ảnh (JPG, PNG, WEBP...). Vui lòng chọn lại.';
        toast.error(msg);
        return Promise.reject(msg);
      }

      return new Promise((resolve, reject) => {
        uploadApi
          .uploadSingle(file, 'articles', 'content_image')
          .then((res) => {
            // an toàn dù axiosClient đã tự unwrap response.data hay chưa
            const data = res?.data ?? res;
            const url = data?.url;

            if (!url) {
              const msg = 'Máy chủ không trả về đường dẫn ảnh hợp lệ. Vui lòng thử lại.';
              toast.error(msg);
              reject(msg);
              return;
            }

            resolve({ default: url });
          })
          .catch((err) => {
            console.error('[CKEditor] Upload ảnh thất bại:', err);

            // Ưu tiên message tiếng Việt cụ thể từ backend (AppError),
            // nếu backend trả lỗi raw tiếng Anh (network, timeout, 500, validate
            // framework-level...) thì luôn fallback sang message tiếng Việt dễ hiểu.
            let fallback = 'Tải ảnh lên thất bại. Vui lòng thử lại.';
            const status = err?.response?.status;

            if (!err?.response) {
              fallback = 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại.';
            } else if (status === 413) {
              fallback = 'Ảnh quá lớn, vui lòng chọn ảnh dung lượng nhỏ hơn.';
            } else if (status === 415 || status === 400) {
              fallback = 'Định dạng ảnh không được hỗ trợ. Vui lòng chọn ảnh JPG, PNG hoặc WEBP.';
            } else if (status === 401 || status === 403) {
              fallback = 'Bạn không có quyền upload ảnh hoặc phiên đăng nhập đã hết hạn.';
            } else if (status >= 500) {
              fallback = 'Máy chủ đang gặp sự cố, vui lòng thử lại sau ít phút.';
            }

            const message = getFriendlyErrorMessage(err, fallback);
            toast.error(message);
            reject(message);
          });
      });
    });
  }

  abort() {
    // TODO: hỗ trợ hủy upload thực sự nếu uploadApi dùng AbortController/CancelToken
  }
}

export function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}