using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;
/// <summary>
/// Đại diện cho mối quan hệ giữa một đội bóng và một cầu thủ, bao gồm thông tin về số áo, vị trí thi đấu, vai trò trong đội và trạng thái hiện tại của cầu thủ đó trong đội bóng.
/// - TeamId: Khóa ngoại liên kết đến bảng Team, xác định đội bóng mà cầu thủ này thuộc về.
/// - PlayerId: Khóa ngoại liên kết đến bảng Player, xác định cầu thủ cụ thể trong đội bóng.
/// - JerseyNumber: Số áo của cầu thủ khi thi đấu cho đội bóng, thường là duy nhất trong một đội để dễ dàng nhận diện trên sân
/// - Position: Vị trí thi đấu của cầu thủ trên sân (ví dụ: Thủ môn, Hậu vệ, Tiền vệ, Tiền đạo).
/// - Role: Vai trò của cầu thủ trong đội bóng (ví dụ: Cầu thủ thường, Đội trưởng, Phó đội trưởng).
/// - Status: Trạng thái hiện tại của cầu thủ trong đội bóng (ví dụ: Đang hoạt động, Chấn thương, Treo giò).
/// </summary>
public class TeamPlayer : AuditableEntity
{
    public int TeamId { get; set; }
    public int PlayerId { get; set; }
    public int JerseyNumber { get; set; }
    public string Position { get; set; } // Goalkeeper, Defender, Midfielder, Forward
    public string Role { get; set; } // Player, Captain, Vice-Captain
    public string Status { get; set; }

    public Team Team { get; set; }
    public Player Player { get; set; }

    public TeamPlayer() { }

    public TeamPlayer(int teamId, int playerId, int jerseyNumber, string position,
     string role = "Player", string status = "Active")
    {
        TeamId = teamId;
        PlayerId = playerId;
        JerseyNumber = jerseyNumber;
        Position = position;
        Role = role;
        Status = status;
    }
}
