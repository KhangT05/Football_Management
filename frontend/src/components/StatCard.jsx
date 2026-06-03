export default function StatCard({ title, value, icon: Icon, colorClass }) {
    return(
        <div className="bg-navy border border-navy-light rounded-2xl p-6 shadow-lg shadow-black/20 hover:shadow-md transition-shadow flex items-center justify-between group">
            <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
                <p className="text-3xl font-black text-white group-hover:text-neon transition-colors">{value}</p>
            </div>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-navy-dark border ${colorClass} transition-transform group-hover:scale-110`}>
                <Icon className="w-7 h-7" />
            </div>
        </div>
    )
}