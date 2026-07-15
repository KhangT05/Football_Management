import { PrismaClient, Prisma, SeasonFormat } from "../generated/prisma/client.js";

export interface TournamentSeedResult {
  tournamentId: number;
  tournamentRuleId: number;
}

export interface TournamentRuleOverrides {
  points_per_win?: number;
  points_per_draw?: number;
  points_per_loss?: number;
  max_players_per_team?: number;
  min_players_per_team?: number;
  teams_advance_per_group?: number;
  yellow_cards_suspension?: number;
  suspension_match_count?: number;
  forfeit_score?: number;
  fine_per_yellow_card?: number;
  fine_per_red_card?: number;
  bonus_per_goal?: number;
  bonus_per_assist?: number;
}

// FIX (multi-tournament): bản gốc hardcode tên "FIFA World Cup" nên chỉ seed
// được đúng 1 tournament. Giờ nhận name/description/organizerUserId +
// ruleOverrides tường minh — mỗi giải có thể có luật tính điểm/phạt/thưởng
// khác nhau (đúng thực tế: giải phong trào thường phạt/thưởng khác giải
// chuyên nghiệp). Vẫn giữ idempotency qua upsert theo Tournament.name.
export async function seedTournament(
  db: PrismaClient,
  organizerUserId: number,
  params: {
    name: string;
    description: string;
    ruleName?: string;
    ruleOverrides?: TournamentRuleOverrides;
  }
): Promise<TournamentSeedResult> {
  const { name, description, ruleName = "Default Rule", ruleOverrides = {} } = params;

  const tournament = await db.tournament.upsert({
    where: { name },
    update: {},
    create: {
      name,
      description,
      user_id: organizerUserId,
    },
  });

  const existingRule = await db.tournamentRule.findFirst({
    where: { tournament_id: tournament.id },
  });

  const rule =
    existingRule ??
    (await db.tournamentRule.create({
      data: {
        name: ruleName,
        tournament_id: tournament.id,
        user_id: organizerUserId,
        format: SeasonFormat.round_robin_knockout,
        round_robin_stages: 1,
        points_per_win: ruleOverrides.points_per_win ?? 3,
        points_per_draw: ruleOverrides.points_per_draw ?? 1,
        points_per_loss: ruleOverrides.points_per_loss ?? 0,
        max_players_per_team: ruleOverrides.max_players_per_team ?? 26,
        min_players_per_team: ruleOverrides.min_players_per_team ?? 18,
        teams_advance_per_group: ruleOverrides.teams_advance_per_group ?? 2,
        yellow_cards_suspension: ruleOverrides.yellow_cards_suspension ?? 2,
        suspension_match_count: ruleOverrides.suspension_match_count ?? 1,
        forfeit_score: ruleOverrides.forfeit_score ?? 3,
        fine_per_yellow_card: new Prisma.Decimal(ruleOverrides.fine_per_yellow_card ?? 0),
        fine_per_red_card: new Prisma.Decimal(ruleOverrides.fine_per_red_card ?? 0),
        bonus_per_goal: new Prisma.Decimal(ruleOverrides.bonus_per_goal ?? 0),
        bonus_per_assist: new Prisma.Decimal(ruleOverrides.bonus_per_assist ?? 0),
        tiebreaker_order: ["goal_diff", "goals_scored", "head_to_head"],
      },
    }));

  console.log(`[TournamentSeeder] Tournament #${tournament.id} (${name}), Rule #${rule.id}`);
  return { tournamentId: tournament.id, tournamentRuleId: rule.id };
}

// Giữ lại tên hàm cũ để không phá code cũ nào còn import trực tiếp —
// tương đương seedTournament với tên/mô tả World Cup mặc định.
export async function seedWorldCupTournament(
  db: PrismaClient,
  organizerUserId: number
): Promise<TournamentSeedResult> {
  return seedTournament(db, organizerUserId, {
    name: "FIFA World Cup",
    description: "Dữ liệu demo mô phỏng thể thức World Cup: 8 bảng x 4 đội -> knockout.",
  });
}