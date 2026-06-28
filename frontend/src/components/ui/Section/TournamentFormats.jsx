import { Network, Repeat, LayoutGrid, GitBranch, Combine, ListOrdered } from "lucide-react";

export default function TournamentFormats() {
    const formats = [
        {
            title: "Loại trực tiếp",
            icon: <Network className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop", // Stadium
        },
        {
            title: "Đấu vòng tròn",
            icon: <Repeat className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=600&auto=format&fit=crop", // Basketball
        },
        {
            title: "Chia bảng đấu",
            icon: <LayoutGrid className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=600&auto=format&fit=crop", // Football
        },
        {
            title: "Nhánh thắng - Nhánh thua",
            icon: <GitBranch className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop", // Esports
        },
        {
            title: "Thể thức hỗn hợp",
            icon: <Combine className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1551280857-2b9ebf241ac6?q=80&w=600&auto=format&fit=crop", // Mixed
        }
    ];

    return (
        <div className="mt-32 mb-10">
            <div className="text-center space-y-4 mb-16">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-12 bg-gray-500"></div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                        Hỗ trợ nhiều thể thức thi đấu
                    </h2>
                </div>
                <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed text-sm md:text-base">
                    Nền tảng giúp người dùng tạo ra các giải đấu có thể thức giống như với các giải đấu nổi tiếng thế giới như Champions League, World Cup, Laliga...
                    <span className="inline-flex items-center justify-center px-2 py-0.5 ml-2 text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-full align-middle">
                        Nổi bật
                    </span>
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {formats.map((format, idx) => (
                    <div key={idx} className="group flex flex-col items-center gap-6 cursor-pointer">
                        {/* Image Container */}
                        <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-navy shadow-lg border border-navy-light/50 group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all duration-300">
                            <div className="absolute inset-0 bg-navy-dark/40 group-hover:bg-transparent transition-colors z-10 duration-300"></div>
                            <img 
                                src={format.image} 
                                alt={format.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                        </div>

                        {/* Icon & Title */}
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                                {format.icon}
                            </div>
                            <h3 className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors duration-300">
                                {format.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
