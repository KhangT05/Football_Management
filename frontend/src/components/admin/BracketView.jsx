export default function BracketView({ slots, teams }) {
    if (!Array.isArray(slots) || slots.length === 0) return null;

    const teamName = (id) => id == null ? 'TBD' : (teams.find(t => t.id === id)?.name || `Team ${id}`);

    const rounds = [...new Set(slots.map(s => s.round))].sort((a, b) => a - b);
    const totalRounds = rounds.length;
    const roundLabel = (round) => {
        const remaining = totalRounds - round + 1;
        if (remaining === 1) return 'Chung kết';
        if (remaining === 2) return 'Bán kết';
        if (remaining === 3) return 'Tứ kết';
        return `Vòng ${round}`;
    };

    return (
        <div className="flex gap-8 overflow-x-auto pb-4">
            {rounds.map(round => {
                const roundSlots = slots.filter(s => s.round === round).sort((a, b) => a.slotNumber - b.slotNumber);
                return (
                    <div key={round} className="flex flex-col justify-around gap-6 min-w-[220px] shrink-0">
                        <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider text-center mb-1">
                            {roundLabel(round)}
                        </h5>
                        {roundSlots.map(slot => (
                            <div key={slot.slotId} className="bg-navy-dark border border-navy-light rounded-lg overflow-hidden text-sm">
                                <div className={`px-3 py-2 ${slot.seededHomeTeamId ? 'text-white' : 'text-gray-500'}`}>
                                    {teamName(slot.seededHomeTeamId)}
                                </div>
                                <div className="h-px bg-navy-light" />
                                <div className={`px-3 py-2 ${slot.seededAwayTeamId ? 'text-white' : 'text-gray-500'}`}>
                                    {teamName(slot.seededAwayTeamId)}
                                </div>
                                {slot.isBye && (
                                    <div className="px-3 py-1 text-[10px] text-amber-500 bg-navy border-t border-navy-light">BYE</div>
                                )}
                                {!slot.matchId && !slot.isBye && (
                                    <div className="px-3 py-1 text-[10px] text-gray-600 bg-navy border-t border-navy-light">Chờ đội</div>
                                )}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}