import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
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
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-neon/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

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
                <ShieldCheck className="w-7 h-7 text-neon" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider">Chính Sách Bảo Mật</h1>
                <p className="text-sm font-medium text-gray-400 mt-1">Bảo vệ dữ liệu cá nhân của bạn</p>
              </div>
            </div>

            <div className="space-y-8 text-gray-300 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-neon pl-4">Thu thập thông tin</h2>
                <p>
                  Hệ thống quản lý Giải bóng đá IT thu thập các thông tin cơ bản của sinh viên và các thành viên đội bóng bao gồm: họ tên, mã số sinh viên, địa chỉ email liên lạc và thông tin tham gia giải đấu. Các thông tin này được cung cấp trực tiếp bởi người dùng thông qua quá trình đăng ký và xác thực tài khoản.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-4">Mục đích sử dụng</h2>
                <p>Thông tin của bạn được thu thập nhằm mục đích:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Xác thực danh tính sinh viên để cấp quyền truy cập hệ thống.</li>
                  <li>Tổ chức, quản lý hồ sơ đội bóng, đội hình thi đấu hợp lệ.</li>
                  <li>Liên lạc thông báo quan trọng liên quan đến lịch thi đấu, kết quả và tin tức giải.</li>
                  <li>Nâng cấp, bảo trì và cải thiện hiệu suất hệ thống.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-emerald-500 pl-4">Bảo mật dữ liệu</h2>
                <p>
                  Mật khẩu và thông tin cá nhân của bạn được lưu trữ trên hệ thống cơ sở dữ liệu nội bộ một cách an toàn và được mã hóa tiêu chuẩn. Chúng tôi cam kết <strong>không bán, trao đổi hoặc chia sẻ</strong> thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-purple-500 pl-4">Quyền lợi của người dùng</h2>
                <p>
                  Người dùng có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình trên hệ thống. Nếu bạn phát hiện thông tin tài khoản bị rò rỉ, vui lòng liên hệ ngay với Ban quản trị để kịp thời xử lý.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
