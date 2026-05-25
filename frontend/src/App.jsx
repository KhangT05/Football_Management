import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ScheduleResults from "./pages/ScheduleResults";
import LeaderboardTeams from "./pages/LeaderboardTeams";
import MatchDetail from "./pages/MatchDetail";
import RegisterTeam from "./pages/RegisterTeam";
import TeamDetail from "./pages/TeamDetail";
import ManageMatches from "./pages/admin/ManageMatches";
import ManageTeams from "./pages/admin/ManageTeams";
import ManagePlayers from "./pages/admin/ManagePlayers";
import UpdateResults from "./pages/admin/UpdateResults";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicLayout from "./layouts/PublicLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lich-thi-dau" element={<ScheduleResults />} />
          <Route path="/bang-xep-hang" element={<LeaderboardTeams />} />
          <Route path="/doi-bong/:id" element={<TeamDetail />} />
          <Route path="/tran-dau/:id" element={<MatchDetail />} />
          <Route path="/dang-ky-doi-bong" element={<RegisterTeam />} />
        </Route>
        {/* Auth Route */}
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
    </Router>
  );
}

export default App;
