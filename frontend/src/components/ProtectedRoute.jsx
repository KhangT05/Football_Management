import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * ProtectedRoute - Chỉ cho phép truy cập khi đã đăng nhập
 * Nếu chưa đăng nhập → redirect về trang login, giữ lại `from` để sau login redirect lại
 *
 * Note: App.jsx đã chờ isInitialized trước khi render routes
 * nên ProtectedRoute chỉ cần kiểm tra isAuthenticated (đã là giá trị cuối cùng).
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore(useShallow(state => ({ isAuthenticated: state.isAuthenticated, loading: state.loading })));
  const location = useLocation();

  // loading = đang refresh token (rare case)
  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/dang-nhap"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
}
