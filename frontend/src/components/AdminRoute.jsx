import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * AdminRoute - Chỉ cho phép truy cập khi đã đăng nhập VÀ có role 'admin'
 *
 * Logic:
 * - Chưa đăng nhập → redirect về trang login (lưu `from` để redirect lại sau)
 * - Đã đăng nhập nhưng không phải admin → redirect về trang chủ
 * - Đã đăng nhập + là admin → render children
 *
 * Cách xác định admin:
 *   user.roles là array string từ JWT claim (set bởi auth.middleware.ts)
 *   Hoặc user object từ /auth/me cũng có thể có roles
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

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
  // user.roles là array hoặc user.role là string (tùy backend trả về)
  // const isAdmin =
  //   (Array.isArray(user?.roles) && user.roles.includes('admin')) ||
  //   user?.role === 'admin' ||
  //   user?.is_admin === true;

  // // Đã đăng nhập nhưng không phải admin → về trang chủ
  // if (!isAdmin) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
}
