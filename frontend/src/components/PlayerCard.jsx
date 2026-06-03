export default function PlayerCard({ player }) {
    return(
        <div className="relative bg-navy border border-navy-light rounded-2xl p-6 overflow-hidden shadow-lg shadow-black/20 hover:shadow-md hover:border-blue-300 transition-all duration-300 group">
            <div className="absolute -bottom-6 -right-4 text-9xl font-black text-blue-50 group-hover:text-gray-400 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none italic z-0">
                {player.number}
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-navy-light flex items-center justify-center shadow-md group-hover:border-blue-100 transition-colors duration-300 mb-4 overflow-hidden">
                    <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon transition-colors text-center">{player.name}</h3>
                <p className="text-xs font-bold text-red-500 bg-red-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    {player.position}
                </p>
            </div>
        </div>
    )
}