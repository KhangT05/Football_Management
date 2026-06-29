import { Network, Repeat, LayoutGrid, GitBranch, Combine, ListOrdered } from "lucide-react";

export default function TournamentFormats() {
    const formats = [
        {
            title: "Loại trực tiếp",
            icon: <Network className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop", // Stadium
            description: "Đội thua sẽ bị loại, đội thắng tiếp tục vào vòng trong."
        },
        {
            title: "Đấu vòng tròn",
            icon: <Repeat className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=600&auto=format&fit=crop", // Basketball
            description: "Các đội thi đấu với nhau để tích lũy điểm số trên bảng xếp hạng."
        },
        {
            title: "Chia bảng đấu",
            icon: <LayoutGrid className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=600&auto=format&fit=crop", // Football
            description: "Thi đấu vòng bảng để chọn ra các đội xuất sắc nhất tiến vào vòng loại trực tiếp."
        },
        {
            title: "Nhánh thắng - Nhánh thua",
            icon: <GitBranch className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop", // Esports
            description: "Đội thua vẫn có cơ hội thứ hai ở nhánh dưới để giành quyền vào chung kết."
        },
        {
            title: "Thể thức hỗn hợp",
            icon: <Combine className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1551280857-2b9ebf241ac6?q=80&w=600&auto=format&fit=crop", // Mixed
            description: "Tự do kết hợp các thể thức thi đấu phù hợp với giải đấu của riêng bạn."
        }
    ];

    return (
        <div className="mt-32 mb-10 relative">
            {/* Background glowing blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[300px] bg-linear-to-r from-blue-600/10 to-cyan-400/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="text-center space-y-4 mb-16 relative z-10 animate-fade-in">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-12 bg-linear-to-r from-transparent to-blue-500/50"></div>
                    <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-neon tracking-tight">
                        Hỗ trợ đa dạng thể thức thi đấu
                    </h2>
                    <div className="h-px w-12 bg-linear-to-l from-transparent to-blue-500/50"></div>
                </div>
                <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed text-sm md:text-base">
                    Nền tảng giúp người dùng tạo ra các giải đấu có thể thức chuyên nghiệp chuẩn quốc tế như Champions League, World Cup, Laliga...
                    <span className="inline-flex items-center justify-center px-2 py-0.5 ml-2 text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 rounded-full align-middle animate-pulse">
                        Nổi bật
                    </span>
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 relative z-10">
                {formats.map((format, idx) => (
                    <div 
                        key={idx} 
                        className="group cursor-pointer animate-slide-up"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        {/* Card Container */}
                        <div className="relative w-full aspect-4/5 overflow-hidden rounded-4xl bg-navy shadow-xl border border-navy-light/50 group-hover:border-cyan-400/50 group-hover:shadow-[0_15px_40px_rgba(34,211,238,0.2)] transition-all duration-500 group-hover:-translate-y-3 transform-gpu">
                            
                            {/* Overlay Gradient */}
                            {/* Invert to bright overlay on hover so black text is perfectly readable */}
                            <div className="absolute inset-0 bg-linear-to-t from-navy-dark/90 via-navy-dark/30 to-transparent z-10 transition-all duration-500 group-hover:bg-white/90 group-hover:backdrop-blur-md"></div>
                            
                            {/* Background Image */}
                            <img 
                                src={format.image} 
                                alt={format.title} 
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out transform-gpu group-hover:opacity-30"
                                loading="lazy"
                            />

                            {/* Content */}
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
                                {/* Floating Icon */}
                                <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 shadow-2xl group-hover:scale-110 group-hover:bg-cyan-400 group-hover:border-cyan-500 group-hover:text-black group-hover:shadow-[0_10px_30px_rgba(34,211,238,0.6)] transition-all duration-500 mb-6 group-hover:-translate-y-4 transform-gpu">
                                    {format.icon}
                                </div>
                                
                                {/* Title */}
                                <h3 className="text-base font-black text-center text-gray-200 group-hover:text-black transition-all duration-500 drop-shadow-lg group-hover:drop-shadow-none group-hover:-translate-y-2 transform-gpu px-2">
                                    {format.title}
                                </h3>
                                
                                {/* Decoration line */}
                                <div className="w-8 h-1 bg-blue-500/0 rounded-full mt-4 group-hover:bg-black transition-all duration-500 transform-gpu scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-2"></div>
                                
                                {/* Hover Description */}
                                <p className="absolute bottom-6 left-4 right-4 text-sm text-center text-blue-50 font-semibold opacity-0 group-hover:opacity-100 group-hover:text-gray-800 transition-all duration-500 translate-y-4 group-hover:translate-y-0 drop-shadow-xl group-hover:drop-shadow-none leading-relaxed">
                                    {format.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
