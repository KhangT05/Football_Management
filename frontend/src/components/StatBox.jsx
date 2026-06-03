export default function StatBox({ label, value, icon: Icon }) {
    return(
        <div className="bg-navy border border-navy-light rounded-2xl p-4 md:p-6 flex items-center justify-between shadow-lg shadow-black/20 hover:shadow-md transition-shadow">
            <div>
                <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider mb-1">{label}</p>
                <p className="text-2xl md:text-4xl font-black text-white">{value}</p>
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border border-blue-100 bg-blue-50 text-neon">
                <Icon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
        </div>
    )
}