import { useState, useEffect, useMemo } from 'react';
import { X, Clock, MapPin, Shield, Activity, Users, User, ChevronDown } from 'lucide-react';
import { teamApi } from '../api';

const POSITION_LABELS = { GK: 'TM', DEF: 'HV', MID: 'TV', FW: 'TĐ' };
const POSITION_COLORS = {
  GK:  'bg-amber-400/10 text-amber-400',
  DEF: 'bg-blue-400/10 text-blue-400',
  MID: 'bg-emerald-400/10 text-emerald-400',
  FW:  'bg-red-400/10 text-red-400',
};

const getInitials = (name) =>
  name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?';

function PlayerItem({ tp }) {
  const name = tp.player?.name ?? tp.player?.player?.name ?? `#${tp.player_id}`;
  const pos = tp.position;
  const jersey = tp.jersey_number ?? '?';
  return (
    <li className="flex items-center gap-3 py-2.5 border-b border-navy-light/50 last:border-0 hover:bg-navy-light/30 px-2 rounded-lg transition-colors">
      <span className="w-7 h-7 flex items-center justify-center rounded-md bg-navy-light/50 font-mono text-neon font-bold text-xs shrink-0 shadow-inner">
        {jersey}
      </span>
      <span className="font-medium text-white text-sm flex-1 truncate">{name}</span>
      {pos && (
        <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${POSITION_COLORS[pos] ?? 'bg-gray-400/10 text-gray-400'}`}>
          {POSITION_LABELS[pos] ?? pos}
        </span>
      )}
    </li>
  );
}

// Hàm sinh mock event để làm đẹp giao diện (tính năng chưa có API)
function generateMockEvents(match, homePlayers, awayPlayers) {
  const events = [];
  let time = 10;
  
  // Helper lấy random player
  const getRandomPlayer = (players) => {
    if (!players || players.length === 0) return { player: { name: 'Cầu thủ' }, player_id: '?' };
    return players[Math.floor(Math.random() * players.length)];
  };

  // Mock Ghi bàn
  for (let i = 0; i < (match.home_score || 0); i++) {
    const p = getRandomPlayer(homePlayers);
    events.push({
      time: time,
      team: 'home',
      type: 'goal',
      player: p.player?.name ?? p.player?.player?.name ?? `Cầu thủ #${p.player_id}`,
    });
    time += Math.floor(Math.random() * 10) + 5;
  }
  
  for (let i = 0; i < (match.away_score || 0); i++) {
    const p = getRandomPlayer(awayPlayers);
    events.push({
      time: time,
      team: 'away',
      type: 'goal',
      player: p.player?.name ?? p.player?.player?.name ?? `Cầu thủ #${p.player_id}`,
    });
    time += Math.floor(Math.random() * 10) + 5;
  }

  // Mock thẻ phạt ngẫu nhiên
  const numCards = Math.floor(Math.random() * 3) + 1; // 1 đến 3 thẻ
  for (let i = 0; i < numCards; i++) {
    const isHome = Math.random() > 0.5;
    const teamKey = isHome ? 'home' : 'away';
    const p = getRandomPlayer(isHome ? homePlayers : awayPlayers);
    const isRed = Math.random() > 0.8; // 20% thẻ đỏ
    
    events.push({
      time: Math.floor(Math.random() * 90) + 1,
      team: teamKey,
      type: isRed ? 'red_card' : 'yellow_card',
      player: p.player?.name ?? p.player?.player?.name ?? `Cầu thủ #${p.player_id}`,
    });
  }

  return events.sort((a, b) => a.time - b.time);
}

export default function MatchModal({ match, onClose }) {
  // Gom toàn bộ player state vào 1 object → chỉ update trong async callback,
  // không bao giờ gọi setState đồng bộ trong effect body
  const [playerState, setPlayerState] = useState({ home: [], away: [], loading: true });
  const [activeTab, setActiveTab] = useState('events');

  // Aliases cho gọn JSX
  const homePlayers   = playerState.home;
  const awayPlayers   = playerState.away;
  const loadingPlayers = playerState.loading;

  useEffect(() => {
    // Ngăn scroll cuộn body khi modal mở
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (!match) return;

    // cancelled ref: dừng set state nếu component unmount trước khi fetch xong
    let cancelled = false;

    const parsePage = (res) => {
      const payload = (typeof res?.status === 'boolean') ? res.data : res;
      return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    };

    // Tất cả state update đều nằm trong .then() — không gọi setState đồng bộ
    Promise.allSettled([
      teamApi.getPlayers(match.home_team_id, { approval_status: 'approved', per_page: 30 }),
      teamApi.getPlayers(match.away_team_id, { approval_status: 'approved', per_page: 30 })
    ]).then(([homeRes, awayRes]) => {
      if (cancelled) return;
      setPlayerState({
        home:    homeRes.status === 'fulfilled' ? parsePage(homeRes.value) : [],
        away:    awayRes.status === 'fulfilled' ? parsePage(awayRes.value) : [],
        loading: false,
      });
    });

    // Cleanup: đánh dấu cancelled + reset về loading=true
    // (setState trong cleanup function là hợp lệ — không phải sync trong body)
    return () => {
      cancelled = true;
      setPlayerState({ home: [], away: [], loading: true });
    };
  }, [match]);


  const mockEvents = useMemo(() => {
    if (loadingPlayers || !match) return [];
    // Chỉ mock khi match đã đá
    if (match.status === 'scheduled' || match.status === 'cancelled') return [];
    return generateMockEvents(match, homePlayers, awayPlayers);
  }, [match, homePlayers, awayPlayers, loadingPlayers]);

  // Lắng nghe phím ESC để đóng modal
  // PHẢI đặt trước early return để không vi phạm Rules of Hooks
  useEffect(() => {
    if (!match) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [match, onClose]);

  if (!match) return null;

  const homeName = match.home_team?.name ?? `Đội #${match.home_team_id}`;
  const awayName = match.away_team?.name ?? `Đội #${match.away_team_id}`;
  const hasScore = match.home_score != null && match.away_score != null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-dark/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Modal Card */}
      <div className="relative w-full max-w-5xl bg-navy border border-navy-light shadow-2xl rounded-3xl flex flex-col max-h-full animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Modal Header */}
        <div className="relative shrink-0 p-6 bg-linear-to-b from-blue-900/20 to-transparent border-b border-navy-light/50">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-navy-light/50 hover:bg-navy-light text-gray-400 hover:text-white rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="flex items-center justify-center w-full gap-4 sm:gap-10">
              
              {/* Home */}
              <div className="flex flex-col items-center flex-1 max-w-[150px]">
                {match.home_team?.logo ? (
                  <img src={match.home_team.logo} alt={homeName} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg border-2 border-blue-500/30" />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-blue-500/30 bg-linear-to-br from-blue-700 to-cyan-800 flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-blue-900/30">
                    {getInitials(homeName)}
                  </div>
                )}
                <h2 className="mt-3 text-center font-bold text-sm sm:text-base text-white uppercase line-clamp-2">{homeName}</h2>
              </div>
              
              {/* Score */}
              <div className="flex flex-col items-center shrink-0">
                {hasScore ? (
                  <div className="px-5 py-3 sm:px-8 sm:py-4 bg-navy-dark border border-navy-light rounded-2xl shadow-inner flex items-center gap-3 sm:gap-5">
                    <span className="text-3xl sm:text-5xl font-black text-white">{match.home_score}</span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-500">–</span>
                    <span className="text-3xl sm:text-5xl font-black text-white">{match.away_score}</span>
                  </div>
                ) : (
                  <div className="px-5 py-3 sm:px-8 sm:py-4 bg-navy-dark border border-navy-light rounded-2xl shadow-inner flex items-center justify-center">
                    <span className="text-xl sm:text-3xl font-black text-gray-400 tracking-widest italic pr-1">VS</span>
                  </div>
                )}
                <div className="mt-3 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {match.status === 'finished' ? 'Đã kết thúc' : match.status === 'ongoing' ? 'Đang diễn ra' : 'Sắp diễn ra'}
                </div>
              </div>

              {/* Away */}
              <div className="flex flex-col items-center flex-1 max-w-[150px]">
                {match.away_team?.logo ? (
                  <img src={match.away_team.logo} alt={awayName} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg border-2 border-rose-500/30" />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-rose-500/30 bg-linear-to-br from-amber-700 to-orange-800 flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-amber-900/30">
                    {getInitials(awayName)}
                  </div>
                )}
                <h2 className="mt-3 text-center font-bold text-sm sm:text-base text-white uppercase line-clamp-2">{awayName}</h2>
              </div>
              
            </div>
          </div>
        </div>

        {/* Tab Navigation (Mobile Only) */}
        <div className="lg:hidden flex border-b border-navy-light/50 bg-navy-dark/50">
          <button 
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-colors ${activeTab === 'events' ? 'text-neon border-b-2 border-neon bg-neon/5' : 'text-gray-400'}`}
          >
            <Activity className="w-4 h-4" /> Diễn biến
          </button>
          <button 
            onClick={() => setActiveTab('lineup')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-colors ${activeTab === 'lineup' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5' : 'text-gray-400'}`}
          >
            <Users className="w-4 h-4" /> Đội hình
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-navy-dark/30">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            
            {/* Cột trái: Đội nhà (Ẩn trên mobile nếu tab khác lineup) */}
            <div className={`${activeTab !== 'lineup' ? 'hidden lg:flex' : 'flex'} flex-col bg-navy border border-navy-light rounded-2xl p-4 lg:col-span-1 shadow-lg`}>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-navy-light/50">
                <Shield className="w-5 h-5 text-blue-400" />
                <h3 className="font-black text-white uppercase tracking-wider text-sm truncate">{homeName}</h3>
                <span className="ml-auto bg-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">Đội hình</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {loadingPlayers ? (
                  <div className="space-y-3">
                    {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-10 w-full rounded-lg" />)}
                  </div>
                ) : homePlayers.length > 0 ? (
                  <ul>{homePlayers.map(p => <PlayerItem key={p.id} tp={p} />)}</ul>
                ) : (
                  <p className="text-gray-500 text-center py-6 text-sm font-medium">Chưa có danh sách</p>
                )}
              </div>
            </div>

            {/* Cột giữa: Events / Diễn biến (Ẩn trên mobile nếu tab khác events) */}
            <div className={`${activeTab !== 'events' ? 'hidden lg:flex' : 'flex'} flex-col lg:col-span-1 border border-navy-light/50 rounded-2xl bg-navy-dark/60 p-4 shadow-inner relative overflow-hidden`}>
              <div className="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-navy-light/50 relative z-10">
                <Activity className="w-5 h-5 text-neon" />
                <h3 className="font-black text-white uppercase tracking-wider text-sm">Diễn biến trận đấu</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto px-2 relative z-10 custom-scrollbar">
                {match.status === 'scheduled' || match.status === 'cancelled' ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10 opacity-70">
                    <Clock className="w-12 h-12 mb-3 text-gray-600" />
                    <p className="text-sm font-bold uppercase tracking-widest text-center">Trận đấu chưa diễn ra</p>
                  </div>
                ) : mockEvents.length > 0 ? (
                  <div className="space-y-5 py-2 relative">
                    {/* Line center */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-navy-light/50 -translate-x-1/2"></div>
                    
                    {mockEvents.map((ev, idx) => {
                      const isHome = ev.team === 'home';
                      return (
                        <div key={idx} className={`flex items-center w-full relative z-10 ${isHome ? 'justify-start' : 'justify-end'}`}>
                          {/* Event Bubble */}
                          <div className={`w-1/2 flex items-center ${isHome ? 'justify-end pr-5' : 'justify-start pl-5'}`}>
                            <div className={`flex flex-col ${isHome ? 'items-end' : 'items-start'} bg-navy border border-navy-light p-3 rounded-xl shadow-lg w-full max-w-[200px]`}>
                              <div className="flex items-center gap-2 mb-1">
                                {ev.type === 'goal' && <span className="text-lg leading-none" title="Bàn thắng">⚽</span>}
                                {ev.type === 'yellow_card' && <div className="w-3 h-4 bg-yellow-400 rounded-sm shadow-[0_0_5px_rgba(250,204,21,0.5)]" title="Thẻ vàng"></div>}
                                {ev.type === 'red_card' && <div className="w-3 h-4 bg-red-500 rounded-sm shadow-[0_0_5px_rgba(239,68,68,0.5)]" title="Thẻ đỏ"></div>}
                                <span className="text-xs font-black text-gray-400">{ev.time}'</span>
                              </div>
                              <span className="text-sm font-bold text-white line-clamp-1">{ev.player}</span>
                            </div>
                          </div>
                          {/* Timeline dot */}
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-navy border-2 border-navy-light shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10 opacity-70">
                    <p className="text-sm font-bold uppercase tracking-widest text-center">Đang cập nhật diễn biến</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cột phải: Đội khách (Ẩn trên mobile nếu tab khác lineup) */}
            <div className={`${activeTab !== 'lineup' ? 'hidden lg:flex' : 'flex'} flex-col bg-navy border border-navy-light rounded-2xl p-4 lg:col-span-1 shadow-lg`}>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-navy-light/50">
                <Shield className="w-5 h-5 text-rose-400" />
                <h3 className="font-black text-white uppercase tracking-wider text-sm truncate">{awayName}</h3>
                <span className="ml-auto bg-rose-500/20 text-rose-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">Đội hình</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {loadingPlayers ? (
                  <div className="space-y-3">
                    {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-10 w-full rounded-lg" />)}
                  </div>
                ) : awayPlayers.length > 0 ? (
                  <ul>{awayPlayers.map(p => <PlayerItem key={p.id} tp={p} />)}</ul>
                ) : (
                  <p className="text-gray-500 text-center py-6 text-sm font-medium">Chưa có danh sách</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
