import { Network, Repeat, LayoutGrid, GitBranch, Combine } from "lucide-react";

export default function TournamentFormats() {
    const formats = [
        {
            title: "Loại trực tiếp",
            icon: <Network className="w-6 h-6" />,
            image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop",
            description: "Đội thua sẽ bị loại, đội thắng tiếp tục vào vòng trong."
        },
        {
            title: "Đấu vòng tròn",
            icon: <Repeat className="w-6 h-6" />,
            image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=600&auto=format&fit=crop",
            description: "Các đội thi đấu với nhau để tích lũy điểm số trên bảng xếp hạng."
        },
        {
            title: "Chia bảng đấu",
            icon: <LayoutGrid className="w-6 h-6" />,
            image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=600&auto=format&fit=crop",
            description: "Thi đấu vòng bảng để chọn ra các đội xuất sắc nhất tiến vào vòng loại trực tiếp."
        },
        {
            title: "Nhánh thắng - Nhánh thua",
            icon: <GitBranch className="w-6 h-6" />,
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
            description: "Đội thua vẫn có cơ hội thứ hai ở nhánh dưới để giành quyền vào chung kết."
        },
        {
            title: "Thể thức hỗn hợp",
            icon: <Combine className="w-6 h-6" />,
            image: "https://images.unsplash.com/photo-1551280857-2b9ebf241ac6?q=80&w=600&auto=format&fit=crop",
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-7 relative z-10 items-stretch">
                {formats.map((format, idx) => (
                    <div
                        key={idx}
                        className="group animate-slide-up"
                        style={{ animationDelay: `${idx * 90}ms` }}
                    >
                        {/* Card */}
                        <div className="relative h-full flex flex-col rounded-3xl bg-navy-light/40 backdrop-blur-xl border border-navy-light/60 overflow-hidden shadow-lg shadow-black/10 hover:border-cyan-400/50 hover:shadow-[0_20px_40px_rgba(34,211,238,0.15)] transition-all duration-500 hover:-translate-y-2 transform-gpu">

                            {/* Image banner */}
                            <div className="relative h-32 sm:h-36 overflow-hidden shrink-0 bg-navy-dark">
                                <img
                                    src={format.image}
                                    alt={format.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out transform-gpu opacity-90 group-hover:opacity-100"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                            </div>

                            {/* Icon badge, bridging the image and the text body */}
                            <div className="relative px-6 -mt-7">
                                <div className="w-14 h-14 rounded-2xl bg-navy-light backdrop-blur-xl border border-navy-light/50 flex items-center justify-center text-cyan-400 shadow-xl shadow-black/20 group-hover:bg-cyan-400 group-hover:text-navy-dark group-hover:border-cyan-400 group-hover:shadow-[0_10px_25px_rgba(34,211,238,0.45)] transition-all duration-500 transform-gpu">
                                    {format.icon}
                                </div>
                            </div>

                            {/* Always-visible content */}
                            <div className="flex-1 flex flex-col p-6 pt-5">
                                <h3 className="text-lg font-black text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                                    {format.title}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {format.description}
                                </p>
                            </div>

                            {/* Accent underline, grows in on hover */}
                            <div className="h-0.5 w-0 group-hover:w-full bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-500 ease-out"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}