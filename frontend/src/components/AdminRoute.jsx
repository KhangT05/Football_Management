import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * AdminRoute - Chỉ cho phép truy cập khi đã đăng nhập VÀ có role 'admin'
 *
 * Logic:
 * - Đang loading → render null (App.jsx đã chờ isInitialized nên case này ít xảy ra)
 * - Chưa đăng nhập → redirect về trang login (lưu `from` để redirect lại sau)
 * - Đã đăng nhập nhưng không phải admin → redirect về /forbidden (403)
 * - Đã đăng nhập + là admin → render children
 *
 * Cách xác định admin:
 *   user.role = 'admin' (string, từ backend /auth/me)
 *   hoặc user.roles = ['admin'] (array JWT claim)
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuthStore(useShallow(state => ({ isAuthenticated: state.isAuthenticated, user: state.user, loading: state.loading })));
  const location = useLocation();

  // Đang refresh token → tạm thời render null
  if (loading) return null;

  // Chưa đăng nhập → về trang login, lưu đường dẫn hiện tại
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/dang-nhap"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Kiểm tra user có role admin hoặc organizing không
  // Hỗ trợ cả hai format: user.role = 'admin'/'organizing' hoặc user.roles = ['admin', 'organizing']
  // HOẶC hardcode email admin@gmail.com do backend không trả về role
  const userRoles = Array.isArray(user?.roles) 
    ? user.roles.map(r => typeof r === 'string' ? r.toLowerCase() : r) 
    : (user?.role ? [typeof user.role === 'string' ? user.role.toLowerCase() : user.role] : []);
    
  const hasAccess =
    userRoles.includes('admin') ||
    userRoles.includes('organizing') ||
    user?.is_admin === true;

  // Đã đăng nhập nhưng không có quyền → trang Forbidden (403)
  if (!hasAccess) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
