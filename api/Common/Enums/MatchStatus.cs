namespace Football_Management.API.Common.Enums;

public enum MatchStatus
{
    Scheduled,    // đã lên lịch, chưa đá
    Ongoing,      // đang diễn ra
    Completed,    // đã kết thúc
    Postponed,    // hoãn
    Cancelled     // hủy
}
