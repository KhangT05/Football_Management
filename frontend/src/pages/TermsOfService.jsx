import { FileText, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="min-h-screen relative p-4 py-12 overflow-x-hidden">
      {/* Background with Dark Tint Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518605368461-1ee7e1611b81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
      >
        <div 
          className="absolute inset-0 backdrop-blur-sm transition-colors duration-500" 
          style={{ backgroundColor: 'var(--color-bg-base)', opacity: 0.90 }}
        ></div>
      </div>

      {/* Decorative linear glowing orbs */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-neon/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 font-semibold px-4 py-2 mb-8 rounded-xl border backdrop-blur-md shadow-lg transition-all hover:opacity-80"
          style={{ 
            backgroundColor: 'var(--color-bg-elevated)', 
            borderColor: 'var(--color-border)', 
            color: 'var(--color-text-primary)' 
          }}
        >
           <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>

        <div className="bg-navy border border-navy-light rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div 
            className="h-1.5 w-full"
            style={{ background: 'linear-gradient(to right, var(--color-accent), var(--color-text-muted))' }}
          ></div>
          
          <div className="p-8 sm:p-12">
            <div className="flex items-center gap-4 mb-10 border-b border-navy-light pb-6">
              <div className="w-14 h-14 bg-navy-light rounded-2xl border border-neon/30 flex items-center justify-center shadow-[0_0_15px_var(--color-accent-glow)] shrink-0">
                <FileText className="w-7 h-7 text-neon" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider">Điều Khoản Sử Dụng</h1>
                <p className="text-sm font-medium text-gray-400 mt-1">Cập nhật lần cuối: Tháng 7, 2026</p>
              </div>
            </div>

            <div className="space-y-8 text-gray-300 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">1</span>
                  Chấp nhận điều khoản
                </h2>
                <p>
                  Bằng việc truy cập và sử dụng hệ thống quản lý Giải bóng đá sinh viên Khoa Công nghệ Thông tin, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định tại đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng hệ thống của chúng tôi.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">2</span>
                  Tài khoản người dùng
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Bạn chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình.</li>
                  <li>Không được chia sẻ tài khoản cho người khác hoặc sử dụng tài khoản của người khác.</li>
                  <li>Cung cấp thông tin chính xác, cập nhật và đầy đủ trong quá trình đăng ký.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">3</span>
                  Trách nhiệm đội bóng và thành viên
                </h2>
                <p>
                  Các đội bóng và sinh viên tham gia hệ thống phải tuân thủ nghiêm ngặt điều lệ giải, tôn trọng trọng tài, đối thủ và ban tổ chức. Mọi hành vi vi phạm có thể dẫn đến việc khóa tài khoản hoặc truất quyền thi đấu theo quy định của ban tổ chức giải đấu.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">4</span>
                  Bản quyền và Nội dung
                </h2>
                <p>
                  Mọi nội dung, hình ảnh, mã nguồn và thiết kế trên hệ thống đều thuộc bản quyền của Ban tổ chức Khoa Công nghệ Thông tin. Bạn không được phép sao chép, chỉnh sửa hoặc phân phối nội dung mà không có sự cho phép bằng văn bản.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
