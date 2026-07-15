import { PrismaClient } from "../generated/prisma/client.js";
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
export declare function seedTournament(db: PrismaClient, organizerUserId: number, params: {
    name: string;
    description: string;
    ruleName?: string;
    ruleOverrides?: TournamentRuleOverrides;
}): Promise<TournamentSeedResult>;
export declare function seedWorldCupTournament(db: PrismaClient, organizerUserId: number): Promise<TournamentSeedResult>;
//# sourceMappingURL=tournamentSeeder.d.ts.map