// ─── Selects ──────────────────────────────────────────────────────────────────

import { Prisma } from "../generated/prisma/client.js";

export const TEAM_STANDING_SELECT = {
    id: true,
    group_id: true,
    team_id: true,
    position: true,
    matches_played: true,
    wins: true,
    draws: true,
    losses: true,
    goals_for: true,
    goals_against: true,
    points: true,
} satisfies Prisma.TeamStandingSelect;

export const PLAYER_STATISTIC_SELECT = {
    id: true,
    player_id: true,
    team_id: true,
    season_id: true,
    matches_played: true,
    goals_scored: true,
    yellow_cards: true,
    red_cards: true,
    accumulated_yellow_cards: true,
    is_suspended: true,
} satisfies Prisma.PlayerStatisticSelect;

// ─── Types ────────────────────────────────────────────────────────────────────

export type TeamStandingRow = Prisma.TeamStandingGetPayload<{ select: typeof TEAM_STANDING_SELECT }>;
export type PlayerStatisticRow = Prisma.PlayerStatisticGetPayload<{ select: typeof PLAYER_STATISTIC_SELECT }>;

export type StandingAccum = {
    teamId: number;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    yellowCards: number;
    redCards: number;
    points: number;
};

export type H2HRecord = {
    goalsFor: number;
    goalsAgainst: number;
    points: number;
};
