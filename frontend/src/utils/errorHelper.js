/**
 * Helper to parse API errors, especially validation errors, and translate them to Vietnamese.
 */
export const parseApiError = (err, defaultMsg = 'Có lỗi xảy ra') => {
  if (!err?.response?.data) return defaultMsg;

  const data = err.response.data;
  const errors = data?.errors || data?.data?.body || data?.data;
  
  // If we have detailed validation errors (e.g., from Laravel or NestJS formatted)
  if (errors && typeof errors === 'object') {
    const errorMessages = [];
    for (const key in errors) {
      let messages = errors[key];
      // some NestJS structures have { message: "error string" } for each field
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

  // If message is an array (e.g., NestJS default ValidationPipe)
  if (Array.isArray(data.message)) {
    return data.message.map(msg => translateValidationError('', msg)).join(' • ');
  }

  // If the message is exactly "Validation failed" but no detailed errors were found
  if (data.message === 'Validation failed') {
    return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
  }

  return data.message || defaultMsg;
};

// Simple dictionary to translate common validation messages to Vietnamese
function translateValidationError(field, msg) {
  let translated = msg;
  
  // Convert field names to Vietnamese if possible
  const fieldNames = {
    name: 'Tên',
    email: 'Email',
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

  // Common english validation rules to Vietnamese
  if (msg.includes('is required') || msg.includes('should not be empty')) {
    translated = `${fName} không được để trống`;
  } else if (msg.includes('must be an email')) {
    translated = `${fName} phải là một địa chỉ email hợp lệ`;
  } else if (msg.includes('must be a number') || msg.includes('must be an integer')) {
    translated = `${fName} phải là một số`;
  } else if (msg.includes('must be at least')) {
    const min = msg.match(/\d+/)?.[0] || '';
    translated = `${fName} phải có ít nhất ${min} ký tự`;
  } else if (msg.includes('must not be greater than')) {
    const max = msg.match(/\d+/)?.[0] || '';
    translated = `${fName} không được vượt quá ${max} ký tự`;
  } else if (msg.includes('already exists') || msg.includes('has already been taken')) {
    translated = `${fName} đã tồn tại trong hệ thống`;
  } else if (msg.includes('must be a valid date')) {
    translated = `${fName} phải là một ngày hợp lệ`;
  } else if (msg.includes('not found')) {
    translated = `Không tìm thấy ${fName}`;
  } else if (msg.includes('invalid')) {
    translated = `${fName} không hợp lệ`;
  } else if (msg === 'Validation failed') {
    translated = 'Dữ liệu không hợp lệ';
  }

  // Capitalize first letter
  return translated.charAt(0).toUpperCase() + translated.slice(1);
}
