using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;

/// <summary>
/// Đại diện cho một vị trí trong nhánh đấu (Bracket) của giải đấu thể thao điện tử.
/// - Thuộc tính:
///  - TeamId: Khóa ngoại liên kết đến đội tuyển (Team) được xếp vào vị trí này (có thể null nếu chưa xác định)
///  - SourceSlotId: Khóa ngoại liên kết đến vị trí nguồn (BracketSlot)
///  từ vòng đấu trước để tự động tiến vào nếu đội thắng (có thể null nếu không áp dụng)
///  - MatchId: Khóa ngoại liên kết đến trận đấu (Match) mà vị trí này tham gia (có thể null nếu chưa xác định)
/// - SlotNumber: Số thứ tự của vị trí trong giai đoạn (bắt buộc)
/// - SlotName: Tên của vị trí (ví dụ: "Slot 1", "QF1", "SF2",...) (bắt buộc)
/// - Status: Trạng thái của vị trí (Empty, Waiting, Ready, Completed) (bắt buộc)
/// </summary>
public class BracketSlot : AuditableEntity
{
    public int? TeamId { get; set; }
    public int? SourceSlotId { get; set; } // Để auto-advance từ vòng trước
    public int? MatchId { get; set; }
    public int SlotNumber { get; set; }
    public string SlotName { get; set; } // e.g., "Slot 1", "QF1", etc.
    public string Status { get; set; } // Empty, Waiting, Ready, Completed
    public Team Team { get; set; }
    public BracketSlot SourceSlot { get; set; }
    public Match Match { get; set; }

    public BracketSlot() { }

    public BracketSlot(int slotNumber, string slotName,
    string? status = null, int? teamId = null, int? sourceSlotId = null)
    {
        SlotNumber = slotNumber;
        SlotName = slotName;
        Status = status;
        TeamId = teamId;
        SourceSlotId = sourceSlotId;
    }
}
