namespace DoAnTotNghiep.API.Common;
/// <summary>
/// Cấu hình tập trung độ dài tối đa (MaxLength) cho các trường string trong toàn bộ hệ thống.
///
/// Mục đích:
/// - Tránh hard-code số "ma" (magic numbers) như 50, 100, 255 rải rác trong code.
/// - Đảm bảo tính nhất quán giữa Database (EF Core) và Validation (FluentValidation).
/// - Dễ dàng thay đổi, bảo trì và mở rộng khi hệ thống phát triển.
/// - Tăng khả năng đọc hiểu code theo ngữ nghĩa nghiệp vụ (business meaning).
///
/// Nguyên tắc sử dụng:
/// - Sử dụng theo từng nhóm domain (Name, Id, Contact, Content, System).
/// - Không dùng trực tiếp số literal trong HasMaxLength().
/// - Ưu tiên dùng đúng constant theo ngữ cảnh field.
/// - Có thể override ở từng entity nếu có yêu cầu đặc biệt.
///
/// Ví dụ:
/// builder.Property(x => x.Name)
///        .HasMaxLength(MaxLength.Name.Person);
///
/// builder.Property(x => x.Email)
///        .HasMaxLength(MaxLength.Contact.Email);
///
/// Lưu ý:
/// - Đây là quy ước (convention), không bắt buộc tuyệt đối.
/// - Một số field đặc biệt (VD: FileName, JSON, metadata) có thể cần cấu hình riêng.
/// - Khi thay đổi giá trị tại đây → cần tạo migration để cập nhật database.
///
/// Lợi ích:
/// - Clean code, dễ đọc, dễ maintain
/// - Đồng bộ giữa các layer (Entity, Validation, DTO)
/// - Giảm bug do sai lệch độ dài dữ liệu
/// </summary>
public static class MaxLength
{
    /// <summary>
    /// Nhóm độ dài cho các trường liên quan đến tên (Name).
    /// Áp dụng cho tên người, đội, giải đấu, hoặc tên hiển thị.
    /// </summary>
    public static class Name
    {
        public const int Default = 100; // Độ dài chung cho tên
        public const int Short = 50;  // Tên ngắn, nickname
    }
    /// <summary>
    /// Nhóm độ dài cho thông tin liên hệ.
    /// </summary>
    public static class Contact
    {
        public const int Email = 100;
        public const int Phone = 15;
        public const int Address = 255;
    }

    /// <summary>
    /// Nhóm độ dài cho nội dung văn bản.
    /// Dùng cho mô tả, tiêu đề, nội dung chi tiết.
    /// </summary>
    public static class Content
    {
        public const int Title = 200;
        public const int Summary = 500;
        public const int Description = 1000;
        public const int Note = 500;  // Ghi chú ngắn
        public const int FullContent = 4000; // Nội dung dài (article, blog)
    }

    /// <summary>
    /// Nhóm độ dài cho các trường hệ thống/kỹ thuật.
    /// </summary>
    public static class System
    {
        public const int Url = 500;
        public const int FilePath = 500;
        public const int Password = 255;  // Hash password (bcrypt, etc.)
        public const int Token = 500;
        public const int Role = 50;
        public const int Status = 50;   // Enum dạng string
    }
}