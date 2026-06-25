import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ToastContainer from "./components/ToastContainer";
import useAuthStore from "./store/authStore";

// ── Lazy-loaded Pages ──────────────────────────────────────
// Mỗi page chỉ được tải khi user navigate tới → giảm initial bundle size
const Home = lazy(() => import("./pages/Home"));
const ScheduleResults = lazy(() => import("./pages/ScheduleResults"));
const LeaderboardTeams = lazy(() => import("./pages/LeaderboardTeams"));
const MatchDetail = lazy(() => import("./pages/MatchDetail"));
const RegisterTeam = lazy(() => import("./pages/RegisterTeam"));
const TeamDetail = lazy(() => import("./pages/TeamDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const MyTeam = lazy(() => import("./pages/MyTeam"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

// Admin pages — các trang lớn nhất, tách riêng chunk
const ManageMatches = lazy(() => import("./pages/admin/ManageMatches"));
const ManageTeams = lazy(() => import("./pages/admin/ManageTeams"));
const ManagePlayers = lazy(() => import("./pages/admin/ManagePlayers"));
const UpdateResults = lazy(() => import("./pages/admin/UpdateResults"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const ManageSeasonTeams = lazy(() => import("./pages/admin/ManageSeasonTeams"));

// ── Loading Fallback ───────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-dark">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-10 h-10 border-3 border-navy-light border-t-neon rounded-full animate-spin" />
        <p className="text-gray-400 text-sm font-medium">Đang tải...</p>
      </div>
    </div>
  );
}

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    /**
     * Khôi phục session khi user F5 hoặc mở tab mới
     * - access token (in-memory) bị mất khi reload → cần refresh
     * - httpOnly cookie refresh_token vẫn còn → gọi /auth/refresh để lấy token mới
     * - Nếu không có csrf_token trong localStorage → bỏ qua (chưa login)
     */
    initializeAuth();
  }, []); // Chỉ chạy 1 lần khi app mount

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/lich-thi-dau" element={<ScheduleResults />} />
            <Route path="/bang-xep-hang" element={<LeaderboardTeams />} />
            <Route path="/doi-bong/:id" element={<TeamDetail />} />
            <Route path="/tran-dau/:id" element={<MatchDetail />} />
            
            {/* Protected routes – cần đăng nhập */}
            <Route path="/dang-ky-doi-bong" element={
              <ProtectedRoute><RegisterTeam /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/doi-cua-toi" element={
              <ProtectedRoute><MyTeam /></ProtectedRoute>
            } />
          </Route>

          {/* Auth Routes */}
          <Route path="/quan-ly-giai-dau/dang-nhap" element={<Login />} />
          <Route path="/dang-ky" element={<Register />} />

          {/* Admin Routes – bắt buộc đã đăng nhập + có role admin */}
          <Route path="/quan-ly-giai-dau" element={
            <AdminRoute><Dashboard /></AdminRoute>
          } />
          <Route path="/quan-ly-giai-dau/tran-dau" element={
            <AdminRoute><ManageMatches /></AdminRoute>
          } />
          <Route path="/quan-ly-giai-dau/ket-qua" element={
            <AdminRoute><UpdateResults /></AdminRoute>
          } />
          <Route path="/quan-ly-giai-dau/doi-bong" element={
            <AdminRoute><ManageTeams /></AdminRoute>
          } />
          <Route path="/quan-ly-giai-dau/cau-thu" element={
            <AdminRoute><ManagePlayers /></AdminRoute>
          } />
          <Route path="/quan-ly-giai-dau/dang-ky-giai" element={
            <AdminRoute><ManageSeasonTeams /></AdminRoute>
          } />
          <Route path="/quan-ly-giai-dau/cai-dat" element={
            <AdminRoute><Settings /></AdminRoute>
          } />
        </Routes>
      </Suspense>

      {/* Global toast notifications */}
      <ToastContainer />
    </Router>
  );
}

export default App;

