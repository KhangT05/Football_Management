import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Target, Shield, UserSquare2, Activity } from 'lucide-react';
import { teamsData, leaderboardData, rosterData } from '../data/data';
import StatBox from '../components/StatBox';
import PlayerCard from '../components/PlayerCard';

export default function TeamDetail() {
  const { id } = useParams();
  const teamId = id ? parseInt(id) : 1;
  const team = teamsData.find(t => t.id === teamId) || teamsData[0];
  const stats = leaderboardData.find(t => t.team === team.short) || leaderboardData[0];

  return (
    <div className="pb-20 bg-navy-dark min-h-screen">
      
      {/* Back Button */}
      <div className="container mx-auto px-4 lg:px-8 pt-6">
        <Link to="/bang-xep-hang" className="inline-flex items-center gap-2 text-gray-400 hover:text-neon transition-colors text-sm font-bold uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </Link>
      </div>

      {/* Hero Header */}
      <section className="relative mt-6 mb-12 bg-navy border-b border-navy-light shadow-lg shadow-black/20 overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 lg:px-8 py-12 md:py-20">
           <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Giant Logo */}
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-navy-light bg-navy-dark flex items-center justify-center font-black text-5xl md:text-7xl text-gray-400 shadow-md shrink-0">
                {team.logo}
              </div>
              
              <div className="text-center md:text-left space-y-4 max-w-3xl">
                 <div className="inline-block px-4 py-1.5 bg-red-600 text-white rounded-full text-sm font-bold uppercase tracking-widest shadow-lg shadow-black/20">
                   Hạng: {stats.rank}
                 </div>
                 <h1 className="text-4xl md:text-6xl font-extrabold text-neon uppercase italic tracking-tight">
                   {team.name}
                 </h1>
                 <p className="text-gray-400 text-lg md:text-xl font-medium">
                   Đại diện ưu tú của khoa, được dẫn dắt bởi HLV <span className="text-white font-bold">{team.coach}</span>. Đội bóng luôn thi đấu với tinh thần rực cháy và đam mê mãnh liệt trên mọi mặt trận.
                 </p>
              </div>
           </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 space-y-16">
        
        {/* Stats Summary */}
        <section className="max-w-6xl mx-auto">
           <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
             <Target className="w-6 h-6 text-neon" /> Thành Tích Mùa Giải
           </h2>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              <StatBox label="Số Trận (P)" value={stats.p} icon={Activity} />
              <StatBox label="Thắng (W)" value={stats.w} icon={Target} />
              <StatBox label="Hòa (D)" value={stats.d} icon={Shield} />
              <StatBox label="Thua (L)" value={stats.l} icon={UserSquare2} />
              <StatBox label="Điểm (PTS)" value={stats.pts} icon={Trophy} />
           </div>
        </section>

        {/* Player Roster */}
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-navy-light">
             <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
               <Users className="w-6 h-6 text-neon" /> Danh Sách Cầu Thủ
             </h2>
             <span className="text-neon font-bold bg-blue-50 px-4 py-1.5 rounded-lg border border-navy-light shadow-lg shadow-black/20">
               Sĩ số: {team.players}
             </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
             {rosterData.map(player => (
               <PlayerCard key={player.id} player={player} />
             ))}
          </div>
        </section>

      </div>
    </div>
  );
}
