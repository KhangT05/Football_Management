import { useMemo } from 'react';
import { getInitials, AVATAR_COLORS } from '../utils/constants';
import { Trophy, Clock } from 'lucide-react';

const TeamRow = ({ team, isWinner }) => {
  if (!team) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 text-gray-400 bg-navy-dark/50 border-b border-navy-light last:border-0 h-[42px]">
         <div className="w-5 h-5 rounded-full bg-navy flex items-center justify-center shrink-0 border border-navy-light" />
         <span className="text-xs font-medium truncate">Đang chờ...</span>
      </div>
    );
  }

  const colorIdx = team.id % AVATAR_COLORS.length;
  
  return (
    <div className={`flex items-center justify-between px-3 py-2 border-b border-navy-light last:border-0 h-[42px] ${isWinner ? 'bg-blue-500/10' : 'bg-navy-dark'}`}>
      <div className="flex items-center gap-3 min-w-0">
        {team.logo ? (
          <img src={team.logo} alt={team.name} className="w-5 h-5 rounded-full object-cover shrink-0 border border-navy-light" />
        ) : (
          <div className={`w-5 h-5 rounded-full bg-linear-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center shrink-0 shadow-sm border border-navy-light`}>
            <span className="text-[9px] font-bold text-white leading-none">
              {getInitials(team.name).substring(0, 1)}
            </span>
          </div>
        )}
        <span className={`text-xs truncate ${isWinner ? 'font-black text-white' : 'font-semibold text-gray-300'}`}>
          {team.name}
        </span>
      </div>
    </div>
  );
};

const MatchCard = ({ slot, teams }) => {
  if (!slot) return <div className="w-48 h-20" />;

  const homeTeam = teams.find(t => String(t.id) === String(slot.seededHomeTeamId));
  const awayTeam = teams.find(t => String(t.id) === String(slot.seededAwayTeamId));

  // Determine winner if match is finished
  const isFinished = slot.matchStatus === 'finished';
  let homeWinner = false;
  let awayWinner = false;
  
  if (isFinished) {
      // In a real scenario, we'd need match scores. But since the API returns bracket slots,
      // and we just need to display them, we can highlight the team that advanced if any.
      // We will leave it neutral if we don't have scores directly in the slot.
  }

  return (
    <div className="w-[180px] shrink-0 rounded-xl shadow-lg border border-navy-light overflow-hidden relative group hover:shadow-xl hover:border-blue-500 transition-all z-10 bg-navy">
      {slot.isBye && (
        <div className="absolute top-0 right-0 bg-amber-500/90 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg z-10 shadow-sm">
          BYE
        </div>
      )}
      {!slot.isBye && slot.matchStatus === 'scheduled' && (
        <div className="absolute top-0 right-0 bg-blue-500/90 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg z-10 flex items-center gap-1 shadow-sm">
          <Clock className="w-2.5 h-2.5" /> Sắp đá
        </div>
      )}
      <div className="flex flex-col">
        <TeamRow team={homeTeam} isWinner={homeWinner} />
        <TeamRow team={awayTeam} isWinner={awayWinner} />
      </div>
    </div>
  );
};

const BracketTree = ({ node, teams }) => {
  if (!node) return null;
  const { children, slot } = node;
  const hasChildren = children && children.length > 0;

  return (
    <div className="flex items-center">
      {hasChildren && (
        <>
          <div className="flex flex-col justify-center">
            {children.map((child, idx) => {
              const isTop = idx === 0;
              return (
                <div key={child.slot.slotId} className="flex items-center relative">
                  <BracketTree node={child} teams={teams} />
                  
                  {/* Right horizontal connector from child */}
                  <div className="w-6 border-b-2 border-navy-light" />
                  
                  {/* Vertical connector joining children */}
                  <div 
                    className="absolute right-0 w-[2px] bg-navy-light" 
                    style={{
                       top: isTop ? '50%' : 'auto',
                       bottom: isTop ? 'auto' : '50%',
                       height: 'calc(50% + 0px)' // Will be connected precisely
                    }}
                  />
                  {/* To perfectly join corners: */}
                  {isTop ? (
                     <div className="absolute right-0 top-1/2 w-2 h-2 border-t-2 border-r-2 border-navy-light rounded-tr-sm" style={{ transform: 'translate(100%, -100%)' }} />
                  ) : (
                     <div className="absolute right-0 bottom-1/2 w-2 h-2 border-b-2 border-r-2 border-navy-light rounded-br-sm" style={{ transform: 'translate(100%, 100%)' }} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Horizontal line feeding into current slot */}
          <div className="w-6 border-b-2 border-navy-light" />
        </>
      )}
      
      <div className="py-3">
        <MatchCard slot={slot} teams={teams} />
      </div>
    </div>
  );
};

export default function PublicBracketView({ slots, teams }) {
  const rootNodes = useMemo(() => {
    if (!Array.isArray(slots) || slots.length === 0) return [];
    
    // Map to quickly find slots
    const slotMap = new Map(slots.map(s => [s.slotId, { slot: s, children: [] }]));
    
    const roots = [];
    
    // Build tree
    slots.forEach(slot => {
      const node = slotMap.get(slot.slotId);
      let isRoot = true;
      
      // If this slot is a source for another slot, it's a child in the tree
      for (const parentSlot of slots) {
        if (parentSlot.sourceASlotId === slot.slotId || parentSlot.sourceBSlotId === slot.slotId) {
          const parentNode = slotMap.get(parentSlot.slotId);
          if (parentNode) {
             // Keep array ordered: sourceA first, sourceB second
             if (parentSlot.sourceASlotId === slot.slotId) {
                parentNode.children.unshift(node);
             } else {
                parentNode.children.push(node);
             }
             isRoot = false;
             break;
          }
        }
      }
      
      if (isRoot) {
        roots.push(node);
      }
    });
    
    // Ensure children order (top/bottom) is correct based on their position if any
    const sortChildren = (node) => {
        if (node.children.length === 2) {
           node.children.sort((a,b) => a.slot.slotNumber - b.slot.slotNumber);
        }
        node.children.forEach(sortChildren);
    }
    roots.forEach(sortChildren);
    
    return roots;
  }, [slots]);

  if (!rootNodes || rootNodes.length === 0) {
    return (
      <div className="text-center py-16">
        <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400 font-bold">Chưa có dữ liệu sơ đồ knockout</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-navy/40 backdrop-blur-md rounded-3xl p-8 overflow-x-auto border border-navy-light shadow-xl custom-scrollbar">
      <div className="min-w-max flex justify-center">
        {rootNodes.map(root => (
          <BracketTree key={root.slot.slotId} node={root} teams={teams} />
        ))}
      </div>
    </div>
  );
}
