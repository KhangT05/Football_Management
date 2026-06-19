import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";

export interface TeamSeedResult {
    teamId: number;
    teamName: string;
    seasonTeamId: number;
    playerIds: number[]; // Player.id[]
}

const TEAMS_DATA = [
    { name: "FC Rồng Vàng", coach: "Trần Văn Hùng" },
    { name: "CLB Sao Biển", coach: "Nguyễn Minh Tuấn" },
    { name: "FC Hùng Mạnh", coach: "Lê Văn Đức" },
    { name: "CLB Thần Tốc", coach: "Phạm Quốc Bảo" },
    { name: "FC Bất Bại", coach: "Hoàng Văn Nam" },
    { name: "CLB Chiến Thắng", coach: "Vũ Đình Sơn" },
    { name: "FC Bão Lửa", coach: "Đặng Minh Khoa" },
    { name: "CLB Thiên Lôi", coach: "Bùi Văn Tùng" },
] as const; // as const → tuple, mỗi phần tử là literal type, không bao giờ undefined khi index trong bounds

const POSITIONS = [
    "goalkeeper",
    "defender",
    "defender",
    "defender",
    "defender",
    "midfielder",
    "midfielder",
    "midfielder",
    "midfielder",
    "forward",
    "forward",
    "forward",
] as const;

// Tên mẫu tiếng Việt
const PLAYER_NAMES = [
    "Nguyễn Văn An", "Trần Thị Bình", "Lê Văn Cường", "Phạm Thị Dung",
    "Hoàng Văn Em", "Vũ Thị Phương", "Đặng Văn Giang", "Bùi Thị Hoa",
    "Đỗ Văn Inh", "Ngô Thị Kim", "Dương Văn Long", "Mai Thị Minh",
    "Lý Văn Năm", "Trương Thị Oanh", "Huỳnh Văn Phú", "Phan Thị Quỳnh",
    "Đinh Văn Rồng", "Cao Thị Sen", "Tô Văn Thắng", "Lưu Thị Uyên",
    "Kiều Văn Vinh", "Châu Thị Xuân", "Hồ Văn Yên", "Đào Thị Zung",
    "Mạc Văn Anh", "Từ Thị Bảo", "Tăng Văn Chi", "Văn Thị Diệu",
    "Nghiêm Văn Ến", "Sầm Thị Én", "Ông Văn Gà", "Hà Thị Hải",
    "Khúc Văn Ích", "Tề Thị Lan", "Lạc Văn Mạnh", "Tiêu Thị Nga",
    "Mao Văn Ổn", "Hứa Thị Phi", "Vu Văn Quân", "Rong Thị Sang",
    "Vàng Văn Thịnh", "Ưu Thị Ung", "Xu Văn Vỹ", "Yên Thị Xuyên",
    "Zi Văn Ý", "An Thị Bé", "Ba Văn Cao", "Chị Thị Dạy",
    "Em Văn Phú", "Kì Thị Lạ", "Mới Văn Nhỏ", "Nhất Thị Ổn",
    "Phúc Văn Quý", "Rõ Thị Sáng", "Tốt Văn Uy", "Vui Thị Xanh",
    "Yêu Văn Zin", "Ân Thị Bình", "Bất Văn Chiến", "Đạt Thị Đẹp",
    "Hiền Văn Giỏi", "Khỏe Thị Lành", "Mạnh Văn Ngay", "Nhân Thị Ổn",
    "Phước Văn Quang", "Rực Thị Sáng", "Tài Văn Uy", "Vững Thị Xây",
    "Yên Văn Trong", "Ổn Thị Bình", "Bền Văn Chí", "Đức Thị Độ",
    "Hòa Văn Giải", "Kiên Thị Lực", "Minh Văn Nhanh", "Nhờ Thị Ở",
    "Phúc Văn Quý", "Rộng Thị Sạch", "Thắng Văn Uy", "Vẻ Thị Xinh",
    "Yêu Văn Zay", "Ân Thị Ban", "Bền Văn Cao", "Chín Thị Dồi",
    "Em Văn Phúc", "Kha Thị Lắm", "Mau Văn Nhớ", "Nhớ Thị Ổn",
    "Phú Văn Quý", "Rợp Thị Sóng", "Tốt Văn Uy", "Vui Thị Xuân",
    "Yên Văn Dạy", "Ổn Thị Bền", "Bất Văn Chi", "Đại Thị Đồng",
] as const;

export async function seedTeams(
    db: PrismaClient,
    adminUserId: number,
    seasonId: number
): Promise<TeamSeedResult[]> {
    console.log("[TeamSeeder] seeding 8 teams...");

    const password = await bcrypt.hash("Leader@123", 10);
    const results: TeamSeedResult[] = [];
    let nameIdx = 0;

    for (let t = 0; t < TEAMS_DATA.length; t++) {
        // as const trên TEAMS_DATA → phần tử là readonly object literal, không undefined
        // nhưng TS vẫn widening index access → dùng non-null assertion
        const teamData = TEAMS_DATA[t]!;

        // 1. Team
        const team = await db.team.upsert({
            where: { name: teamData.name },
            update: {},
            create: {
                name: teamData.name,
                coach_name: teamData.coach,
                is_active: true,
                user_id: adminUserId,
            },
        });

        // 2. TeamLeader user
        const leaderEmail = `leader_team${t + 1}@seed.local`;
        const leaderUser = await db.user.upsert({
            where: { email: leaderEmail },
            update: {},
            create: {
                name: `Leader ${teamData.name}`,
                email: leaderEmail,
                password,
                is_active: true,
                email_verified: true,
                email_verified_at: new Date(),
            },
        });

        const existingLeader = await db.teamLeader.findFirst({
            where: { team_id: team.id, user_id: leaderUser.id },
        });
        if (!existingLeader) {
            await db.teamLeader.create({
                data: { team_id: team.id, user_id: leaderUser.id },
            });
        }

        // 3. Players (12 per team)
        const playerIds: number[] = [];

        for (let p = 0; p < POSITIONS.length; p++) {
            const position = POSITIONS[p]!; // index bound = POSITIONS.length, safe
            const playerEmail = `player_t${t + 1}_p${p + 1}@seed.local`;
            // modulo đảm bảo trong range, nhưng TS không biết → non-null assertion
            const playerName: string = PLAYER_NAMES[nameIdx % PLAYER_NAMES.length]!;
            nameIdx++;

            const playerUser = await db.user.upsert({
                where: { email: playerEmail },
                update: {},
                create: {
                    name: playerName,
                    email: playerEmail,
                    password,
                    is_active: true,
                    email_verified: true,
                    email_verified_at: new Date(),
                },
            });

            const player = await db.player.upsert({
                where: { user_id: playerUser.id },
                update: {},
                create: {
                    user_id: playerUser.id,
                    date_of_birth: new Date(
                        1990 + Math.floor(Math.random() * 10),
                        Math.floor(Math.random() * 12),
                        Math.floor(Math.random() * 28) + 1
                    ),
                    position,
                    height: 165 + Math.random() * 20,
                    weight: 60 + Math.random() * 20,
                    nationality: "Việt Nam",
                    is_active: true,
                },
            });

            // TeamPlayer
            const existingTp = await db.teamPlayer.findUnique({
                where: { team_id_player_id: { team_id: team.id, player_id: player.id } },
            });
            if (!existingTp) {
                await db.teamPlayer.create({
                    data: {
                        team_id: team.id,
                        player_id: player.id,
                        jersey_number: p + 1,
                        position,
                        role: p === 0 ? "captain" : p === 1 ? "vice_captain" : "player",
                        status: "active",
                        approval_status: "approved",
                        is_active: true,
                        user_id: adminUserId,
                    },
                });
            }

            playerIds.push(player.id);
        }

        // 4. SeasonTeam
        const seasonTeam = await db.seasonTeam.upsert({
            where: { season_id_team_id: { season_id: seasonId, team_id: team.id } },
            update: {},
            create: {
                season_id: seasonId,
                team_id: team.id,
                status: "active",
                is_active: true,
                user_id: leaderUser.id,
            },
        });

        // 5. Payment
        const existingPayment = await db.payment.findFirst({
            where: { season_team_id: seasonTeam.id },
        });
        if (!existingPayment) {
            await db.payment.create({
                data: {
                    season_team_id: seasonTeam.id,
                    amount: 5000000,
                    status: "confirmed",
                    transaction_ref: `TXN-${Date.now()}-${team.id}`,
                    paid_at: new Date("2024-02-10"),
                    confirmed_at: new Date("2024-02-11"),
                    confirmed_by: adminUserId,
                },
            });
        }

        // 6. SeasonTeamPlayers
        const teamPlayers = await db.teamPlayer.findMany({
            where: { team_id: team.id, approval_status: "approved" },
        });
        for (const tp of teamPlayers) {
            const exists = await db.seasonTeamPlayer.findUnique({
                where: {
                    season_team_id_team_player_id: {
                        season_team_id: seasonTeam.id,
                        team_player_id: tp.id,
                    },
                },
            });
            if (!exists) {
                await db.seasonTeamPlayer.create({
                    data: {
                        season_team_id: seasonTeam.id,
                        team_player_id: tp.id,
                        jersey_number: tp.jersey_number,
                        is_active: true,
                    },
                });
            }
        }

        results.push({
            teamId: team.id,
            teamName: team.name,
            seasonTeamId: seasonTeam.id,
            playerIds,
        });

        console.log(
            `  → Team "${team.name}" #${team.id} | SeasonTeam #${seasonTeam.id} | ${playerIds.length} players`
        );
    }

    return results;
}