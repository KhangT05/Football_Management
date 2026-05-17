using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;
/// <summary>
/// Đại diện cho người dùng trên hệ thống
/// Chứ các thông tin cơ bản
/// Khai báo entities User
/// </summary>
/// So sánh constructor:
/// - Constructor không tham số:
///     + Được sử dụng bởi Entity Framework để khởi tạo object khi đọc dữ liệu từ database.
///     + Tạo object rỗng, sau đó gán giá trị từng thuộc tính.
///     + Có thể dẫn đến trạng thái object không hợp lệ nếu thiếu dữ liệu.
/// 
/// - Constructor có tham số:
///     + Yêu cầu truyền đầy đủ dữ liệu khi khởi tạo object.
///     + Giúp đảm bảo object luôn hợp lệ ngay từ đầu.
///     + Có thể tích hợp validate dữ liệu.
/// 
/// => Thực tế nên sử dụng cả hai:
///    - Constructor không tham số cho EF.
///    - Constructor có tham số cho logic nghiệp vụ.
/// </summary>
public class User : BaseEntity
{
    /// <summary>
    /// thông tin tên user
    /// </summary>
    public string Name { get; set; }
    /// <summary>
    /// mật khẩu của user
    /// </summary>
    public string Password { get; set; }
    /// <summary>
    /// Email của user
    /// </summary>
    public string Email { get; set; }
    /// <summary>
    /// số diện thoại của users
    /// </summary>
    public string Phone { get; set; }
    /// <summary>
    /// constructor có tham số, nghĩa là khi tạo tham số thì bắt buộc phải truyền đầy đủ vào object đó
    /// </summary>
    /// <param name="name"></param>
    /// <param name="password"></param>
    /// <param name="email"></param>
    /// <param name="phone"></param>
    /// còn constructor không tham số thì có thể không bắt buộc phải truyền
    public ICollection<UserRole> UserRoles { get; set; }
    public User(string name, string password, string email, string phone)
    {
        Name = name;
        Password = password;
        Email = email;
        Phone = phone;
    }
}