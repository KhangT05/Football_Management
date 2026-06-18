interface EvidenceJson {
    win_points?: unknown;
    draw_points?: unknown;
    lose_points?: unknown;
    tiebreaker_order?: unknown;
    [key: string]: unknown;
}
export declare function runRuleEngine(evidence: EvidenceJson): {
    tournament_id: number;
    points_per_win: number;
    points_per_draw: number;
    points_per_loss: number;
    forfeit_score: number;
    yellow_cards_suspension: number;
    max_players_per_team: number;
    min_players_per_team: number;
    teams_advance_per_group: number;
    tiebreaker_order: ("goal_diff" | "goals_scored" | "head_to_head" | "goals_conceded" | "yellow_cards" | "red_cards")[];
};
export {};
//# sourceMappingURL=rule-engine.d.ts.map