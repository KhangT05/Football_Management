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
        to="/quan-ly-giai-dau/dang-nhap"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Kiểm tra user có role admin không
  // Hỗ trợ cả hai format: user.role = 'admin' hoặc user.roles = ['admin']
  // HOẶC hardcode email admin@gmail.com do backend không trả về role
  const isAdmin =
    user?.role === 'admin' ||
    (Array.isArray(user?.roles) && user.roles.includes('admin')) ||
    user?.is_admin === true

  // Đã đăng nhập nhưng không phải admin → trang Forbidden (403)
  if (!isAdmin) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
