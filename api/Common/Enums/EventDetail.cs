namespace Football_Management.API.Common.Enums;

public enum EventDetail
{
    OwnGoal,        // phản lưới nhà
    PenaltyGoal,    // penalty trong hiệp chính
    FreeKickGoal,   // đá phạt trực tiếp
    HeaderGoal,     // đánh đầu

    // Bổ sung cho RedCard
    DirectRed,      // thẻ đỏ trực tiếp
    DoubleYellow    // 2 thẻ vàng → thẻ đỏ
}