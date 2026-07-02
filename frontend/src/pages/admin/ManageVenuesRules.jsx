import AdminLayout from '../../layouts/AdminLayout';
import { MapPin } from 'lucide-react';
import VenuesSection from '../../components/admin/sections/VenuesSection';
import TournamentRulesSection from '../../components/admin/sections/TournamentRulesSection';

export default function ManageVenuesRules() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-gray-400" /> Sân bóng & Luật giải
          </h2>
          <p className="text-gray-400 text-sm mt-1">Cấu hình các thông số chung của hệ thống như Sân thi đấu và Luật giải.</p>
        </div>

        <VenuesSection />
        <TournamentRulesSection />

      </div>
    </AdminLayout>
  );
}
