using Football_Management.API.Common.Enums;
using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Models.Entities;
/// <summary>
/// Đại diện cho mối quan hệ giữa giải đấu (Season) và đội tuyển (Team) trong hệ thống quản lý giải đấu thể thao điện tử.
/// - Thuộc tính:
///  - SeasonId: Khóa ngoại liên kết đến mùa giải (Season) mà đội tuyển tham gia (bắt buộc)
///  - TeamId: Khóa ngoại liên kết đến đội tuyển (Team) tham gia giải đấu (bắt buộc)
///  - RegisteredDate: Ngày đăng ký tham gia giải đấu (bắt buộc)
///  - Status: Trạng thái tham gia của đội tuyển (Active, Eliminated, Withdrawn) (bắt buộc)
///  - GroupId: Khóa ngoại tùy chọn cho vòng bảng (nếu giải đấu có vòng bảng)
/// - Quan hệ:
///  - Season: Liên kết đến mùa giải (Season) mà đội tuyển tham gia 
/// (nhiều-nhiều thông qua SeasonTeam)
///  - Team: Liên kết đến đội tuyển (Team) tham gia giải đấu (nhiều-nhiều thông qua SeasonTeam)
/// </summary>
public class SeasonTeam : AuditableEntity
{
    public int SeasonId { get; set; }
    public int TeamId { get; set; }
    public DateTime RegisteredDate { get; set; }
    public SeasonTeamEnums Status { get; set; } // Active, Eliminated, Withdrawn

    public Season Season { get; set; }
    public Team Team { get; set; }
    public int? GroupId { get; set; }     // THIẾU — không biết đội ở bảng nào
    public Group Group { get; set; }

    public SeasonTeam() { }

    public SeasonTeam(int seasonId, int teamId, DateTime registeredDate,
     SeasonTeamEnums status = SeasonTeamEnums.Pending)
    {
        SeasonId = seasonId;
        TeamId = teamId;
        RegisteredDate = registeredDate;
        Status = status;
    }
}
