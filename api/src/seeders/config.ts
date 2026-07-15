// prisma/seed/config.ts
//
// NEW FILE — khai báo tường minh 3 giải đấu x 4-5 mùa/giải, mỗi mùa gán 1
// "archetype" (kiểu trạng thái) khác nhau để dữ liệu edge-case được RẢI RÁC
// qua nhiều mùa thay vì dồn vào 1 chỗ, đồng thời MỖI giải đều có ít nhất 1
// mùa "finished" hoàn thiện sạch sẽ (đúng yêu cầu). Quy mô đội đa dạng:
// nhỏ (8), vừa (16), lớn (32) — teamsPerGroup luôn = 4 nên groupCount tương
// ứng là 2 / 4 / 8 (đều là luỹ thừa của 2 nên bracket knockout luôn hợp lệ).
import { SeasonStatus } from "../generated/prisma/client.js";
import type { TournamentRuleOverrides } from "./tournamentSeeder.js";

export type SeasonArchetype = "upcoming" | "registration_open" | "ongoing" | "finished" | "cancelled";

export interface SeasonDef {
    key: string; // hậu tố tên mùa, vd "2023-24"
    archetype: SeasonArchetype;
    teamCount: 8 | 16 | 32;
    groupCount: 2 | 4 | 8;
}

export interface TournamentDef {
    key: string;
    name: string;
    description: string;
    teamPoolOffset: number; // offset vào CITY_POOL mở rộng — mỗi giải dùng 1 dải đội riêng
    teamPoolSize: number; // = teamCount lớn nhất trong các mùa của giải (roster dùng chung, mùa nhỏ lấy subset)
    ruleOverrides: TournamentRuleOverrides;
    seasons: SeasonDef[];
}

export const TOURNAMENTS: TournamentDef[] = [
    {
        key: "vpc",
        name: "Vietnam Premier Cup",
        description: "Giải bóng đá phong trào cấp thành phố, thể thức vòng bảng -> loại trực tiếp.",
        teamPoolOffset: 0,
        teamPoolSize: 32,
        ruleOverrides: {
            points_per_win: 3,
            points_per_draw: 1,
            points_per_loss: 0,
            fine_per_yellow_card: 100_000,
            fine_per_red_card: 300_000,
            bonus_per_goal: 50_000,
            yellow_cards_suspension: 2,
            suspension_match_count: 1,
        },
        seasons: [
            { key: "2023", archetype: "finished", teamCount: 8, groupCount: 2 },
            { key: "2024", archetype: "ongoing", teamCount: 16, groupCount: 4 },
            { key: "2025", archetype: "registration_open", teamCount: 16, groupCount: 4 },
            { key: "2026", archetype: "upcoming", teamCount: 32, groupCount: 8 },
        ],
    },
    {
        key: "svc",
        name: "Giải Vô địch Bóng đá Sinh viên",
        description: "Giải đấu thường niên dành cho các đội bóng sinh viên, thể thức vòng bảng -> loại trực tiếp.",
        teamPoolOffset: 32,
        teamPoolSize: 16,
        ruleOverrides: {
            points_per_win: 3,
            points_per_draw: 1,
            points_per_loss: 0,
            fine_per_yellow_card: 0, // giải sinh viên không phạt tiền thẻ
            fine_per_red_card: 0,
            bonus_per_goal: 0,
            yellow_cards_suspension: 3,
            suspension_match_count: 1,
            max_players_per_team: 20,
            min_players_per_team: 14,
        },
        seasons: [
            { key: "mua-1", archetype: "finished", teamCount: 16, groupCount: 4 },
            { key: "mua-2", archetype: "ongoing", teamCount: 8, groupCount: 2 },
            { key: "mua-3", archetype: "registration_open", teamCount: 8, groupCount: 2 },
            { key: "mua-4", archetype: "upcoming", teamCount: 16, groupCount: 4 },
        ],
    },
    {
        key: "amateur",
        name: "Cúp Phong trào Toàn quốc",
        description: "Sân chơi phong trào quy mô toàn quốc cho các CLB nghiệp dư.",
        teamPoolOffset: 48,
        teamPoolSize: 32,
        ruleOverrides: {
            points_per_win: 2, // giải phong trào tính điểm kiểu cũ (2-1-0) — cố ý khác 2 giải trên
            points_per_draw: 1,
            points_per_loss: 0,
            fine_per_yellow_card: 50_000,
            fine_per_red_card: 150_000,
            bonus_per_goal: 0,
            yellow_cards_suspension: 2,
            suspension_match_count: 2,
        },
        seasons: [
            { key: "2022", archetype: "finished", teamCount: 32, groupCount: 8 },
            { key: "2023", archetype: "ongoing", teamCount: 16, groupCount: 4 },
            { key: "2024", archetype: "registration_open", teamCount: 8, groupCount: 2 },
            { key: "2025", archetype: "upcoming", teamCount: 8, groupCount: 2 },
            { key: "2025-mua-phu", archetype: "cancelled", teamCount: 16, groupCount: 4 },
        ],
    },
];

export function seasonStatusOf(archetype: SeasonArchetype): SeasonStatus {
    switch (archetype) {
        case "upcoming":
            return SeasonStatus.upcoming;
        case "registration_open":
            return SeasonStatus.registration_open;
        case "ongoing":
            return SeasonStatus.ongoing;
        case "finished":
            return SeasonStatus.finished;
        case "cancelled":
            return SeasonStatus.cancelled;
    }
}