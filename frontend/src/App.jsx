import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ToastContainer from "./components/ToastContainer";
import useAuthStore from "./store/authStore";
import { useShallow } from 'zustand/react/shallow';

// ── Lazy-loaded Pages ──────────────────────────────────────
// Mỗi page chỉ được tải khi user navigate tới → giảm initial bundle size
const Home = lazy(() => import("./pages/Home"));
const ScheduleResults = lazy(() => import("./pages/ScheduleResults"));
const LeaderboardTeams = lazy(() => import("./pages/LeaderboardTeams"));
const SearchTeams = lazy(() => import("./pages/SearchTeams"));
const SearchPlayers = lazy(() => import("./pages/SearchPlayers"));
const MatchDetail = lazy(() => import("./pages/MatchDetail"));
const RegisterTeam = lazy(() => import("./pages/RegisterTeam"));
const TeamDetail = lazy(() => import("./pages/TeamDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const MyTeam = lazy(() => import("./pages/MyTeam"));
const ManageMatchLineup = lazy(() => import("./pages/ManageMatchLineup"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ForbiddenPage = lazy(() => import("./pages/ForbiddenPage"));
const PaymentResultPage = lazy(() => import("./pages/PaymentResultPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PlayerCareer = lazy(() => import("./pages/PlayerCareer"));
// Admin pages — các trang lớn nhất, tách riêng chunk
const ManageMatches = lazy(() => import("./pages/admin/ManageMatches"));
const ManageTeams = lazy(() => import("./pages/admin/ManageTeams"));

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageSetup = lazy(() => import("./pages/admin/ManageSetup"));
const ManageSeasonTeams = lazy(() => import("./pages/admin/ManageSeasonTeams"));
const ManageArticles = lazy(() => import("./pages/admin/ManageArticles"));
const ManageAccounts = lazy(() => import("./pages/admin/ManageAccounts"));
const ManagePayments = lazy(() => import("./pages/admin/ManagePayments"));

// News pages
const News = lazy(() => import("./pages/News"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));

// Tournament detail
const TournamentDetail = lazy(() => import("./pages/TournamentDetail"));

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

// ── Auth Initializing Loader ───────────────────────────────
// Hiển thị trong khi initializeAuth() đang chạy (F5 / mở tab mới)
// Ngăn AdminRoute/ProtectedRoute redirect sai trước khi biết auth state
function AuthInitLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-dark">
      <div className="flex flex-col items-center gap-5 animate-fade-in">
        <div className="relative">
          <div className="w-14 h-14 border-2 border-navy-light border-t-neon rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-navy-light border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-sm">Đang khôi phục phiên đăng nhập...</p>
          <p className="text-gray-500 text-xs mt-1">Vui lòng chờ</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { initializeAuth, isInitialized } = useAuthStore(useShallow(state => ({ initializeAuth: state.initializeAuth, isInitialized: state.isInitialized })));

  useEffect(() => {
    /**
     * Khôi phục session khi user F5 hoặc mở tab mới
     * - access token (in-memory) bị mất khi reload → cần refresh
     * - httpOnly cookie refresh_token vẫn còn → gọi /auth/refresh để lấy token mới
     * - Sau khi xong → set isInitialized = true → App render routes
     */
    initializeAuth();
  }, [initializeAuth]);

  // Chờ auth initialization xong trước khi render routes
  // Tránh AdminRoute/ProtectedRoute đọc isAuthenticated = false sai lúc đang refresh
  if (!isInitialized) {
    return <AuthInitLoader />;
  }

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/lich-thi-dau" element={<ScheduleResults />} />
            <Route path="/bang-xep-hang" element={<LeaderboardTeams />} />
            <Route path="/tra-cuu-doi-bong" element={<SearchTeams />} />
            <Route path="/tra-cuu-cau-thu" element={<SearchPlayers />} />
            <Route path="/doi-bong/:id" element={<TeamDetail />} />
            <Route path="/tran-dau/:id" element={<MatchDetail />} />
            <Route path="/tin-tuc" element={<News />} />
            <Route path="/tin-tuc/:slug" element={<ArticleDetail />} />
            <Route path="/giai-dau/:id" element={<TournamentDetail />} />
            <Route path="/players/:playerId/career" element={<PlayerCareer />} />
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
            <Route path="/tran-dau/:matchId/doi-hinh" element={
              <ProtectedRoute><ManageMatchLineup /></ProtectedRoute>
            } />

            {/* Payment Result — VNPay callback return URL */}
            <Route path="/thanh-toan/ket-qua" element={
              <ProtectedRoute><PaymentResultPage /></ProtectedRoute>
            } />

            {/* 403 Forbidden */}
            <Route path="/forbidden" element={<ForbiddenPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/dang-ky" element={<Register />} />
          <Route path="/quen-mau-khau" element={<ForgotPassword />} />
          <Route path="/khoi-phuc-mat-khau" element={<ResetPassword />} />

          {/* Admin Routes – bắt buộc đã đăng nhập + có role admin */}
          <Route path="/quan-ly-giai-dau" element={
            <AdminRoute><Dashboard /></AdminRoute>
          } />
          <Route path="/quan-ly-giai-dau/tran-dau" element={
            <AdminRoute><ManageMatches /></AdminRoute>
          } />
          <Route path="/quan-ly-giai-dau/doi-bong" element={
            <AdminRoute><ManageTeams /></AdminRoute>
          } />
          <Route path="/quan-ly-giai-dau/tai-khoan" element={
            <AdminRoute><ManageAccounts /></AdminRoute>
          } />
          <Route path="/quan-ly-giai-dau/boc-tham-len-lich" element={
            <AdminRoute><ManageSeasonTeams /></AdminRoute>
          } />
          <Route path="/quan-ly-giai-dau/thiet-lap-giai-dau" element={
            <AdminRoute><ManageSetup defaultTab="tournaments" /></AdminRoute>
          } />
          <Route path="/quan-ly-giai-dau/bai-viet" element={
            <AdminRoute><ManageArticles /></AdminRoute>
          } />
          <Route path="/quan-ly-giai-dau/xac-nhan-thanh-toan" element={
            <AdminRoute><ManagePayments /></AdminRoute>
          } />

          {/* 404 — phải để cuối cùng */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {/* Global toast notifications */}
      <ToastContainer />
    </Router>
  );
}

export default App;
