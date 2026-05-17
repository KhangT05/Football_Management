namespace DoAnTotNghiep.API.Common.Enums;

public enum SeasonStatus
{
    Upcoming, //  Chưa bắt đầu — chờ start_date
    Registering, // Đang đăng ký — start_date - 30 ngày <= now < start_date
    Ongoing, // Đang diễn ra — start_date <= now < end_date
    Completed, // Đã kết thúc — now >= end_date
    Cancelled // Đã hủy — có thể do sự cố, thay đổi lịch trình,...
}
/// <summary>
/// Upcoming     → Registering  (admin mở đăng ký)
/// Registering  → Ongoing(admin đóng đăng ký, kick off giải)
/// Registering  → Cancelled(hủy trước khi bắt đầu)
/// Ongoing      → Finished(tất cả phase kết thúc)
/// Ongoing      → Cancelled(hủy giữa chừng)
/// Upcoming     → Cancelled(hủy trước khi mở đăng ký)
/// </summary>