// data/match.queries.ts
import { Prisma } from '../generated/prisma/client.js';

// ═══════════════════════════════════════════════════════════════
// ATOMIC SELECTS — compose lên trên, không dùng trực tiếp
// ═══════════════════════════════════════════════════════════════

const venueSelect = {
    select: { id: true, name: true, address: true },
} satisfies Prisma.VenueDefaultArgs;

const teamSelect = {
    select: { id: true, name: true, logo: true },
} satisfies Prisma.TeamDefaultArgs;

const phaseSelect = {
    select: { id: true, name: true, format: true },
} satisfies Prisma.PhaseDefaultArgs;

const matchResultSelect = {
    select: {
        id: true,
        winner_team_id: true,
        home_extra_time_score: true,
        away_extra_time_score: true,
        home_penalty_score: true,
        away_penalty_score: true,
        home_final_score: true,
        away_final_score: true,
        result_type: true,
        status: true,
        notes: true,
    },
} satisfies Prisma.MatchResultDefaultArgs;

const tournamentRuleSuspensionSelect = {
    select: { yellow_cards_suspension: true, forfeit_score: true },
} satisfies Prisma.TournamentRuleDefaultArgs;

// phase + tournamentRule — dùng cho confirm/forfeit cần business rule
const phaseWithRuleSelect = {
    select: {
        format: true,
        season: {
            select: {
                id: true,
                tournament: {
                    select: {
                        tournamentRule: tournamentRuleSuspensionSelect,
                    },
                },
            },
        },
    },
} satisfies Prisma.PhaseDefaultArgs;

// ═══════════════════════════════════════════════════════════════
// COMPOSED SELECTS — 1 use-case = 1 select object
// ═══════════════════════════════════════════════════════════════

// ── 1. List / schedule view ───────────────────────────────────
// GET /matches, calendar, bracket display
// Cần: teams, venue, score, status — KHÔNG cần events/result detail
export const matchListSelect = {
    id: true,
    status: true,
    round: true,
    leg: true,
    scheduled_at: true,
    played_at: true,
    home_score: true,
    away_score: true,
    current_period: true,
    is_published: true,
    referee: true,
    phase_id: true,
    group_id: true,
    home_team_id: true,
    away_team_id: true,
    home_team: teamSelect,
    away_team: teamSelect,
    venue: venueSelect,
    phase: phaseSelect,
    matchResult: {
        select: {
            result_type: true,
            status: true,
            home_final_score: true,
            away_final_score: true,
        },
    },
} satisfies Prisma.MatchSelect;

// ── 2. Detail / live view ─────────────────────────────────────
// GET /matches/:id — referee app, spectator, live score polling
// Cần: full matchResult + events
export const matchDetailSelect = {
    ...matchListSelect,
    postponed_from: true,
    postponed_reason: true,
    abandoned_minute: true,
    replay_of_match_id: true,
    matchResult: matchResultSelect,
    events: {
        select: {
            id: true,
            type: true,
            minute: true,
            added_minute: true,
            period: true,
            team_id: true,
            player_id: true,
            card_color: true,
            note: true,
        },
        orderBy: [{ minute: 'asc' }, { id: 'asc' }],
    },
} satisfies Prisma.MatchSelect;

// ── 3. Confirm result (internal — MatchResultService) ─────────
// confirmResult() cần: status guard, phase.format, tournamentRule, matchResult existence check
export const matchForConfirmSelect = {
    id: true,
    status: true,
    home_team_id: true,
    away_team_id: true,
    group_id: true,
    phase_id: true,
    phase: phaseWithRuleSelect,
    matchResult: { select: { id: true } },
} satisfies Prisma.MatchSelect;

// ── 4. Finalize (internal — MatchLifecycleService) ───────────
// finalizeMatch() cần: status, phase.format, home_team_id để compute score from events
export const matchForFinalizeSelect = {
    id: true,
    status: true,
    home_team_id: true,
    group_id: true,
    phase: {
        select: { format: true },
    },
} satisfies Prisma.MatchSelect;

// ── 5. Forfeit (internal — MatchLifecycleService) ────────────
// forfeitMatch() cần: status, team ids, forfeit_score từ tournamentRule
export const matchForForfeitSelect = {
    id: true,
    status: true,
    home_team_id: true,
    away_team_id: true,
    phase: phaseWithRuleSelect,
} satisfies Prisma.MatchSelect;

// ── 6. Admin / management ─────────────────────────────────────
// Admin panel: full audit fields + appeal info + article links
export const Select = {
    ...matchDetailSelect,
    is_active: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
    user_id: true,
    matchResult: {
        select: {
            ...matchResultSelect.select,
            appeal_reason: true,
            appeal_note: true,
            duration: true,
            is_active: true,
            created_at: true,
            updated_at: true,
        },
    },
} satisfies Prisma.MatchSelect;

// ═══════════════════════════════════════════════════════════════
// PAYLOAD TYPES — derive từ select, không khai báo tay
// ═══════════════════════════════════════════════════════════════

export type MatchList = Prisma.MatchGetPayload<{ select: typeof matchListSelect }>;
export type MatchDetail = Prisma.MatchGetPayload<{ select: typeof matchDetailSelect }>;

// Internal types — service dùng, không expose ra ngoài
export type MatchForConfirm = Prisma.MatchGetPayload<{ select: typeof matchForConfirmSelect }>;
export type MatchForFinalize = Prisma.MatchGetPayload<{ select: typeof matchForFinalizeSelect }>;
export type MatchForForfeit = Prisma.MatchGetPayload<{ select: typeof matchForForfeitSelect }>;