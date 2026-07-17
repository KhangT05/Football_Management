/**
 * Helper để parse lỗi API (đặc biệt lỗi validation) và dịch sang tiếng Việt.
 */
export const parseApiError = (err, defaultMsg = 'Có lỗi xảy ra') => {
  if (!err?.response?.data) return defaultMsg;

  const data = err.response.data;
  const errors = data?.details || data?.errors || data?.data?.body || data?.data;

  // Nếu có validation errors chi tiết (VD: từ Laravel, tsoa hoặc NestJS)
  if (errors && typeof errors === 'object') {
    const errorMessages = [];
    for (const key in errors) {
      let messages = errors[key];
      // Một số cấu trúc NestJS có { message: "error string" } cho mỗi field
      if (messages && typeof messages === 'object' && messages.message) {
        messages = messages.message;
      }

      if (Array.isArray(messages)) {
        errorMessages.push(...messages.map(msg => translateValidationError(key, msg)));
      } else if (typeof messages === 'string') {
        errorMessages.push(translateValidationError(key, messages));
      }
    }
    if (errorMessages.length > 0) {
      return errorMessages.join(' • ');
    }
  }

  // Nếu message là array (VD: NestJS default ValidationPipe)
  if (Array.isArray(data.message)) {
    return data.message.map(msg => translateValidationError('', msg)).join(' • ');
  }

  // Nếu message đúng bằng "Validation failed" nhưng không tìm thấy chi tiết
  if (data.message === 'Validation failed') {
    return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
  }

  // FIX: Không giấu toàn bộ message tiếng Anh nữa. Nếu message là tiếng Việt thì dùng luôn.
  // Nếu là tiếng Anh/lỗi khác, nối vào fallback để người dùng/tester có thể thấy nguyên nhân gốc
  // (ví dụ: "Phase already confirmed" hay lỗi swap team).
  if (typeof data.message === 'string') {
    if (isLikelyVietnameseMessage(data.message)) {
      return data.message;
    }
    return `${defaultMsg} (${data.message})`;
  }

  return defaultMsg;
};

// Dictionary đơn giản để dịch các validation message phổ biến sang tiếng Việt
function translateValidationError(field, msg) {
  let translated = msg;

  // Convert field name sang tiếng Việt nếu có thể
  const fieldNames = {
    name: 'Tên',
    email: 'Email',
    user_email: 'Email tài khoản',
    password: 'Mật khẩu',
    number: 'Số áo',
    position: 'Vị trí',
    phone: 'Số điện thoại',
    avatar: 'Ảnh đại diện',
    logo: 'Logo',
    description: 'Mô tả',
    start_date: 'Ngày bắt đầu',
    end_date: 'Ngày kết thúc',
    title: 'Tiêu đề',
    slug: 'Đường dẫn (Slug)',
    content: 'Nội dung',
    cover_image: 'Ảnh bìa',
    status: 'Trạng thái',
    tags: 'Thẻ',
    registration_deadline: 'Hạn đăng ký'
  };

  let cleanField = field.replace('body.', '');
  const fName = fieldNames[cleanField.toLowerCase()] || cleanField;

  // Common English validation rules sang tiếng Việt
  if (msg.includes('is required') || msg.includes('should not be empty') || msg === 'Required') {
    translated = `${fName} không được để trống`;
  } else if (msg.includes('must be an email') || msg.includes('Invalid email')) {
    translated = `${fName} phải là một địa chỉ email hợp lệ`;
  } else if (msg.includes('must be a number') || msg.includes('must be an integer') || msg.includes('Expected number') || msg.includes('invalid float number') || msg.includes('invalid integer number')) {
    translated = `${fName} phải là một số`;
  } else if (msg.includes('must be at least') || msg.includes('contain at least')) {
    const min = msg.match(/\d+/)?.[0] || '';
    translated = `${fName} phải có ít nhất ${min} ký tự`;
  } else if (msg.includes('must not be greater than') || msg.includes('contain at most')) {
    const max = msg.match(/\d+/)?.[0] || '';
    translated = `${fName} không được vượt quá ${max} ký tự`;
  } else if (msg.includes('already exists') || msg.includes('has already been taken')) {
    translated = `${fName} đã tồn tại trong hệ thống`;
  } else if (msg.includes('must be a valid date') || msg.includes('invalid Date') || msg.includes('invalid date')) {
    translated = `${fName} phải là một ngày hợp lệ`;
  } else if (msg.includes('not found')) {
    translated = `Không tìm thấy ${fName}`;
  } else if (msg.includes('is an excess property')) {
    translated = `${fName} không được phép gửi kèm trong yêu cầu này`;
  } else if (msg.includes('invalid type') || msg.includes('Expected') || msg.includes('invalid boolean') || msg.includes('invalid string')) {
    translated = `${fName} sai định dạng dữ liệu`;
  } else if (msg.includes('invalid')) {
    translated = `${fName} không hợp lệ`;
  } else if (msg === 'Validation failed') {
    translated = 'Dữ liệu không hợp lệ';
  }

  // Viết hoa chữ cái đầu
  return translated.charAt(0).toUpperCase() + translated.slice(1);
}
// ─── Nhận diện & chuẩn hoá thông báo lỗi hiển thị cho người dùng ───────────
// Dùng chung cho MỌI nơi hiển thị lỗi API ra toast trong toàn bộ FE admin.
// Không định nghĩa lại 3 hằng số/hàm này ở từng component nữa — luôn import
// từ đây.
//
// Lý do: AppError nghiệp vụ từ BE (schedule.service.ts, matchresult.service.ts,
// v.v.) luôn viết tiếng Việt có dấu ("Season phải ở...", "Không đủ slot...").
// Nhưng lỗi validate framework-level (Zod/Joi, kiểu "\"status\" is an excess
// property and therefore is not allowed") hoặc lỗi network ("Network Error")
// là tiếng Anh thuần — không được hiện thẳng những lỗi này ra UI.
export const VIETNAMESE_DIACRITICS_REGEX = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

export const isLikelyVietnameseMessage = (msg) =>
  typeof msg === 'string' && VIETNAMESE_DIACRITICS_REGEX.test(msg);

/**
 * Helper dùng chung cho MỌI catch-block hiển thị lỗi API ra toast: ưu tiên
 * message tiếng Việt cụ thể từ backend (AppError), nếu message là tiếng Anh
 * (lỗi validate framework-level, lỗi network, v.v.) thì luôn dùng fallback
 * tiếng Việt — không bao giờ để lộ text tiếng Anh thô ra UI.
 *
 * @param {*} err - error object từ axios catch
 * @param {string} fallback - message tiếng Việt mặc định khi backend message
 *                             không đáng tin (không có dấu / không tồn tại)
 */
export const getFriendlyErrorMessage = (err, fallback) => {
  return parseApiError(err, fallback);
};