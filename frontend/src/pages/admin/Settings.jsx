import AdminLayout from '../../layouts/AdminLayout';
import { Settings as SettingsIcon } from 'lucide-react';
import TournamentsSection from '../../components/admin/sections/TournamentsSection';
import SeasonsSection from '../../components/admin/sections/SeasonsSection';
import VenuesSection from '../../components/admin/sections/VenuesSection';
import TournamentRulesSection from '../../components/admin/sections/TournamentRulesSection';

export default function Settings() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-gray-400" /> Cài đặt hệ thống
          </h2>
          <p className="text-gray-400 text-sm mt-1">Quản lý giải đấu, mùa giải, sân thi đấu và luật giải trong hệ thống.</p>
        </div>

        <TournamentsSection />
        <SeasonsSection />
        <VenuesSection />
        <TournamentRulesSection />

      </div>
    </AdminLayout>
  );
}
