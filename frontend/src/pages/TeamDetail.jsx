import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Target, Shield, UserSquare2, Activity } from 'lucide-react';
import { teamsData, leaderboardData, rosterData } from '../data/data';
import StatBox from '../components/StatBox';
import PlayerCard from '../components/PlayerCard';

// Skeleton for stat boxes
function StatBoxSkeleton() {
  return (
    <div className="bg-navy border border-navy-light rounded-xl p-4 shadow-lg shadow-black/20">
      <div className="skeleton h-4 w-16 mx-auto mb-3 rounded" />
      <div className="skeleton h-8 w-12 mx-auto rounded" />
    </div>
  );
}

// Skeleton for player cards
function PlayerCardSkeleton() {
  return (
    <div className="bg-navy border border-navy-light rounded-xl p-4 shadow-lg shadow-black/20">
      <div className="skeleton w-16 h-16 rounded-full mx-auto mb-3" />
      <div className="skeleton h-4 w-20 mx-auto mb-2 rounded" />
      <div className="skeleton h-3 w-12 mx-auto rounded" />
    </div>
  );
}

export default function TeamDetail() {
  const { id } = useParams();
  const teamId = id ? parseInt(id) : 1;

  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const [stats, setStats] = useState(null);
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
      const foundTeam = teamsData.find(t => t.id === teamId) || teamsData[0];
      const foundStats = leaderboardData.find(t => t.team === foundTeam.short) || leaderboardData[0];
      setTeam(foundTeam);
      setStats(foundStats);
      setRoster(rosterData);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [teamId]);

  return (
    <div className="pb-20 bg-navy-dark min-h-screen">

      {/* Back Button */}
      <div className="container mx-auto px-4 lg:px-8 pt-6 animate-fade-in">
        <Link
          to="/bang-xep-hang"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-neon transition-colors text-sm font-bold uppercase tracking-wider group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </Link>
      </div>

      {/* Hero Header */}
      <section className="relative mt-6 mb-12 bg-navy border-b border-navy-light shadow-lg shadow-black/20 overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 lg:px-8 py-12 md:py-20 animate-slide-up">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Giant Logo */}
            {isLoading ? (
              <div className="skeleton w-32 h-32 md:w-48 md:h-48 rounded-full shrink-0" />
            ) : (
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-neon/30 bg-navy-dark flex items-center justify-center font-black text-5xl md:text-7xl text-gray-400 shadow-[0_0_30px_rgba(57,255,20,0.1)] shrink-0 animate-fade-in">
                {team?.logo}
              </div>
            )}

            <div className="text-center md:text-left space-y-4 max-w-3xl">
              {isLoading ? (
                <>
                  <div className="skeleton h-6 w-24 rounded-full" />
                  <div className="skeleton h-12 w-64 rounded" />
                  <div className="skeleton h-4 w-full max-w-md rounded" />
                </>
              ) : (
                <>
                  <div className="inline-block px-4 py-1.5 bg-red-600 text-white rounded-full text-sm font-bold uppercase tracking-widest shadow-lg shadow-black/20 animate-fade-in">
                    Hạng: {stats?.rank}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-extrabold text-neon uppercase italic tracking-tight animate-slide-up">
                    {team?.name}
                  </h1>
                  <p className="text-gray-400 text-lg md:text-xl font-medium animate-fade-in">
                    Đại diện ưu tú của khoa, được dẫn dắt bởi HLV{' '}
                    <span className="text-white font-bold">{team?.coach}</span>.
                    Đội bóng luôn thi đấu với tinh thần rực cháy và đam mê mãnh liệt trên mọi mặt trận.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 space-y-16">

        {/* Stats Summary */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3 animate-slide-up">
            <Target className="w-6 h-6 text-neon" /> Thành Tích Mùa Giải
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 stagger-children">
            {isLoading ? (
              <>
                <StatBoxSkeleton /><StatBoxSkeleton /><StatBoxSkeleton />
                <StatBoxSkeleton /><StatBoxSkeleton />
              </>
            ) : (
              <>
                <div className="animate-slide-up"><StatBox label="Số Trận (P)" value={stats?.p} icon={Activity} /></div>
                <div className="animate-slide-up"><StatBox label="Thắng (W)" value={stats?.w} icon={Target} /></div>
                <div className="animate-slide-up"><StatBox label="Hòa (D)" value={stats?.d} icon={Shield} /></div>
                <div className="animate-slide-up"><StatBox label="Thua (L)" value={stats?.l} icon={UserSquare2} /></div>
                <div className="animate-slide-up"><StatBox label="Điểm (PTS)" value={stats?.pts} icon={Trophy} /></div>
              </>
            )}
          </div>
        </section>

        {/* Player Roster */}
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-navy-light animate-slide-up">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <Users className="w-6 h-6 text-neon" /> Danh Sách Cầu Thủ
            </h2>
            {!isLoading && (
              <span className="text-neon font-bold bg-navy-dark px-4 py-1.5 rounded-lg border border-navy-light shadow-lg shadow-black/20">
                Sĩ số: {team?.players}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
            {isLoading ? (
              <>
                {[1,2,3,4,5,6,7,8].map(i => (
                  <PlayerCardSkeleton key={i} />
                ))}
              </>
            ) : (
              roster.map((player, idx) => (
                <div key={player.id} className="animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
                  <PlayerCard player={player} />
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
