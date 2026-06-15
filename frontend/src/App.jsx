import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import ScheduleResults from "./pages/ScheduleResults";
import LeaderboardTeams from "./pages/LeaderboardTeams";
import MatchDetail from "./pages/MatchDetail";
import RegisterTeam from "./pages/RegisterTeam";  
import TeamDetail from "./pages/TeamDetail";
import Profile from "./pages/Profile";
import MyTeam from "./pages/MyTeam";
import ManageMatches from "./pages/admin/ManageMatches";
import ManageTeams from "./pages/admin/ManageTeams";
import ManagePlayers from "./pages/admin/ManagePlayers";
import UpdateResults from "./pages/admin/UpdateResults";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastContainer from "./components/ToastContainer";
import useAuthStore from "./store/authStore";

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

        {/* Admin Routes */}
        <Route path="/quan-ly-giai-dau" element={<Dashboard />} />
        <Route path="/quan-ly-giai-dau/tran-dau" element={<ManageMatches />} />
        <Route path="/quan-ly-giai-dau/ket-qua" element={<UpdateResults />} />
        <Route path="/quan-ly-giai-dau/doi-bong" element={<ManageTeams />} />
        <Route path="/quan-ly-giai-dau/cau-thu" element={<ManagePlayers />} />
        <Route path="/quan-ly-giai-dau/cai-dat" element={<Settings />} />
      </Routes>

      {/* Global toast notifications */}
      <ToastContainer />
    </Router>
  );
}

export default App;
