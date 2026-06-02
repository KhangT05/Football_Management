using Football_Management.API.Common.Enums;
using Football_Management.API.Models.Entities.Base;

namespace Football_Management.API.Models.Entities;

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
    public BracketSlotStatus? Status { get; set; } // Empty, Waiting, Ready, Completed
    public Team Team { get; set; }
    public BracketSlot SourceSlot { get; set; }
    public Match Match { get; set; }
    public int PhaseId { get; set; }      // THIẾU — slot không biết thuộc phase nào
    public Phase Phase { get; set; }

    public BracketSlot() { }
    public int? NextSlotId { get; set; }
    public BracketSlot NextSlot { get; set; }

    public BracketSlot(int slotNumber, string slotName,
    BracketSlotStatus? status = null, int? teamId = null)
    {
        SlotNumber = slotNumber;
        SlotName = slotName;
        Status = status;
        TeamId = teamId;
    }
}
