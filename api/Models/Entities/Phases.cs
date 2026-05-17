using DoAnTotNghiep.API.Common.Enums;
using DoAnTotNghiep.API.Models.Entities.Base;

namespace DoAnTotNghiep.API.Models.Entities;

public class Phase : AuditableEntity
{
    /// <summary>
    /// Tên Phases(ví dụ: Vòng bảng, Tứ kết, Bán kết, Chung kết,...)
    /// </summary>
    public string Name { get; set; }
    /// <summary>
    /// Thứ tự của Phases trong một Season 
    ///  (ví dụ: Vòng bảng = 1, Tứ kết = 2, Bán kết = 3, Chung kết = 4,...)
    ///  Phase nhỏ hơn chạy trước.
    /// </summary>
    public int Order { get; set; }
    /// <summary>
    /// Loại phase — quyết định logic tính điểm và generate bracket.
    /// League/Group: tính BXH, TeamStanding.
    /// Knockout/Playoff: generate BracketSlot.
    /// Final: có thể có quy tắc đặc biệt (ví dụ: không có lượt đi/lượt về).
    /// </summary>
    public PhaseType Type { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int SeasonId { get; set; }
    // Navigation property
    public Season Season { get; set; }
}