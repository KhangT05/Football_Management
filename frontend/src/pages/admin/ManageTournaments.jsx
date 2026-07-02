import AdminLayout from '../../layouts/AdminLayout';
import { Trophy } from 'lucide-react';
import TournamentsSection from '../../components/admin/sections/TournamentsSection';
import SeasonsSection from '../../components/admin/sections/SeasonsSection';

export default function ManageTournaments() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-gray-400" /> Giải đấu & Mùa giải
          </h2>
          <p className="text-gray-400 text-sm mt-1">Quản lý các giải đấu và mùa giải hiện hành trong hệ thống.</p>
        </div>

        <TournamentsSection />
        
        <div id="seasons-section">
          <SeasonsSection />
        </div>
      </div>
    </AdminLayout>
  );
}
