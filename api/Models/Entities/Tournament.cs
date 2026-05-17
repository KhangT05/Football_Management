using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;
/// <summary>
/// Đại diện cho giải đấu (Tournament) trong hệ thống quản lý giải đấu.
/// - Thuộc tính:
///  - Name: Tên giải đấu (bắt buộc)
/// - Description: Mô tả chi tiết về giải đấu (tùy chọn)
/// - Logo: URL hoặc đường dẫn đến logo của giải đấu (tùy chọn)
/// - MaxTeams: Số lượng đội tối đa được phép tham gia giải đấu (bắt buộc)
/// - Seasons: Danh sách các mùa giải (Season) thuộc về giải đấu này (mối quan hệ 1-n)
/// - Kế thừa từ BaseEntities để có các thuộc tính chung như Id, CreatedAt, UpdatedAt, IsDeleted
/// - Cấu trúc này giúp quản lý thông tin giải đấu một cách hiệu quả, 
/// đồng thời hỗ trợ mở rộng trong tương lai nếu cần thêm các thuộc tính hoặc mối quan hệ
/// - Các phương thức khởi tạo giúp dễ dàng tạo mới đối tượng Tournament với các thuộc tính cần thiết,
///  đồng thời vẫn cho phép tùy chọn mô tả và logo khi cần thiết
/// </summary>
public class Tournament : AuditableEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Logo { get; set; }
    public int MaxTeams { get; set; }
    // Navigation property
    public ICollection<Season> Seasons { get; set; } = new List<Season>();

    public Tournament() { }

    public Tournament(string name, int maxTeams, string? description = null, string? logo = null)
    {
        Name = name;
        MaxTeams = maxTeams;
        Description = description;
        Logo = logo;
    }
}

