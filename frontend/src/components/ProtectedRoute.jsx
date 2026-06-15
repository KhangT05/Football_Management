import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * ProtectedRoute - Chỉ cho phép truy cập khi đã đăng nhập
 * Nếu chưa đăng nhập → redirect về trang login, giữ lại `from` để sau login redirect lại
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/quan-ly-giai-dau/dang-nhap"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
}
