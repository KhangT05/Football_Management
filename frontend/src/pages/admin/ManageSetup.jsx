import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Trophy, MapPin, Scale, CalendarDays, Settings, Plus } from 'lucide-react';
import TournamentsSection from '../../components/admin/sections/TournamentsSection';
import SeasonsSection from '../../components/admin/sections/SeasonsSection';
import VenuesSection from '../../components/admin/sections/VenuesSection';
import TournamentRulesSection from '../../components/admin/sections/TournamentRulesSection';
import TournamentWizardModal from '../../components/admin/modals/TournamentWizardModal';
import useTournamentStore from '../../store/tournamentStore';
import { useShallow } from 'zustand/react/shallow';

export default function ManageSetup({ defaultTab = 'tournaments' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { invalidate: invalidateTournamentStore } = useTournamentStore(useShallow(state => ({ invalidate: state.invalidate })));

  // Cập nhật tab khi click từ Sidebar (đổi Route nhưng vẫn cùng Component)
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  return (
    <AdminLayout>
      <div className="w-full space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Settings className="w-6 h-6 text-neon" /> Thiết lập giải đấu
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Quản lý tập trung các cấu hình chung: Giải đấu, Mùa giải, Luật thi đấu và Sân bóng.
            </p>
          </div>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/50 hover:shadow-emerald-900/80 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Tạo giải đấu</span>
          </button>
        </div>

        {/* Custom Tabs */}
        <div className="flex items-center gap-2 border-b border-navy-light pb-0 overflow-x-auto custom-scrollbar">
          <button 
            onClick={() => setActiveTab('tournaments')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'tournaments' 
              ? 'text-neon border-neon bg-neon/10' 
              : 'text-gray-400 border-transparent hover:text-white hover:bg-navy-light/50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Giải đấu
          </button>
          
          <button 
            onClick={() => setActiveTab('seasons')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'seasons' 
              ? 'text-blue-400 border-blue-400 bg-blue-500/10' 
              : 'text-gray-400 border-transparent hover:text-white hover:bg-navy-light/50'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Mùa giải
          </button>
          
          <button 
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'rules' 
              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/10' 
              : 'text-gray-400 border-transparent hover:text-white hover:bg-navy-light/50'
            }`}
          >
            <Scale className="w-4 h-4" />
            Luật giải
          </button>
          
          <button 
            onClick={() => setActiveTab('venues')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'venues' 
              ? 'text-amber-400 border-amber-400 bg-amber-500/10' 
              : 'text-gray-400 border-transparent hover:text-white hover:bg-navy-light/50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Sân bóng
          </button>
        </div>

        {/* Content */}
        <div className="pt-4">
          {activeTab === 'rules' && <div className="animate-fade-in"><TournamentRulesSection /></div>}
          {activeTab === 'tournaments' && <div className="animate-fade-in"><TournamentsSection refreshTrigger={refreshTrigger} /></div>}
          {activeTab === 'seasons' && <div className="animate-fade-in"><SeasonsSection refreshTrigger={refreshTrigger} /></div>}
          {activeTab === 'venues' && <div className="animate-fade-in"><VenuesSection /></div>}
        </div>

      </div>

      {isWizardOpen && (
        <TournamentWizardModal
          onClose={() => setIsWizardOpen(false)}
          onSuccess={() => {
            invalidateTournamentStore();
            setRefreshTrigger(prev => prev + 1);
          }}
        />
      )}
    </AdminLayout>
  );
}
