import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model PlayerStatistic
 *
 */
export type PlayerStatisticModel = runtime.Types.Result.DefaultSelection<Prisma.$PlayerStatisticPayload>;
export type AggregatePlayerStatistic = {
    _count: PlayerStatisticCountAggregateOutputType | null;
    _avg: PlayerStatisticAvgAggregateOutputType | null;
    _sum: PlayerStatisticSumAggregateOutputType | null;
    _min: PlayerStatisticMinAggregateOutputType | null;
    _max: PlayerStatisticMaxAggregateOutputType | null;
};
export type PlayerStatisticAvgAggregateOutputType = {
    id: number | null;
    player_id: number | null;
    team_id: number | null;
    season_id: number | null;
    matches_played: number | null;
    goals_scored: number | null;
    assists: number | null;
    yellow_cards: number | null;
    red_cards: number | null;
    minutes_played: number | null;
    accumulated_yellow_cards: number | null;
    yellow_cards_since_reset: number | null;
    suspension_matches_remaining: number | null;
    total_fine_owed: runtime.Decimal | null;
};
export type PlayerStatisticSumAggregateOutputType = {
    id: number | null;
    player_id: number | null;
    team_id: number | null;
    season_id: number | null;
    matches_played: number | null;
    goals_scored: number | null;
    assists: number | null;
    yellow_cards: number | null;
    red_cards: number | null;
    minutes_played: number | null;
    accumulated_yellow_cards: number | null;
    yellow_cards_since_reset: number | null;
    suspension_matches_remaining: number | null;
    total_fine_owed: runtime.Decimal | null;
};
export type PlayerStatisticMinAggregateOutputType = {
    id: number | null;
    player_id: number | null;
    team_id: number | null;
    season_id: number | null;
    matches_played: number | null;
    goals_scored: number | null;
    assists: number | null;
    yellow_cards: number | null;
    red_cards: number | null;
    minutes_played: number | null;
    accumulated_yellow_cards: number | null;
    yellow_cards_since_reset: number | null;
    suspension_matches_remaining: number | null;
    is_suspended: boolean | null;
    total_fine_owed: runtime.Decimal | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type PlayerStatisticMaxAggregateOutputType = {
    id: number | null;
    player_id: number | null;
    team_id: number | null;
    season_id: number | null;
    matches_played: number | null;
    goals_scored: number | null;
    assists: number | null;
    yellow_cards: number | null;
    red_cards: number | null;
    minutes_played: number | null;
    accumulated_yellow_cards: number | null;
    yellow_cards_since_reset: number | null;
    suspension_matches_remaining: number | null;
    is_suspended: boolean | null;
    total_fine_owed: runtime.Decimal | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type PlayerStatisticCountAggregateOutputType = {
    id: number;
    player_id: number;
    team_id: number;
    season_id: number;
    matches_played: number;
    goals_scored: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
    minutes_played: number;
    accumulated_yellow_cards: number;
    yellow_cards_since_reset: number;
    suspension_matches_remaining: number;
    is_suspended: number;
    total_fine_owed: number;
    created_at: number;
    updated_at: number;
    _all: number;
};
export type PlayerStatisticAvgAggregateInputType = {
    id?: true;
    player_id?: true;
    team_id?: true;
    season_id?: true;
    matches_played?: true;
    goals_scored?: true;
    assists?: true;
    yellow_cards?: true;
    red_cards?: true;
    minutes_played?: true;
    accumulated_yellow_cards?: true;
    yellow_cards_since_reset?: true;
    suspension_matches_remaining?: true;
    total_fine_owed?: true;
};
export type PlayerStatisticSumAggregateInputType = {
    id?: true;
    player_id?: true;
    team_id?: true;
    season_id?: true;
    matches_played?: true;
    goals_scored?: true;
    assists?: true;
    yellow_cards?: true;
    red_cards?: true;
    minutes_played?: true;
    accumulated_yellow_cards?: true;
    yellow_cards_since_reset?: true;
    suspension_matches_remaining?: true;
    total_fine_owed?: true;
};
export type PlayerStatisticMinAggregateInputType = {
    id?: true;
    player_id?: true;
    team_id?: true;
    season_id?: true;
    matches_played?: true;
    goals_scored?: true;
    assists?: true;
    yellow_cards?: true;
    red_cards?: true;
    minutes_played?: true;
    accumulated_yellow_cards?: true;
    yellow_cards_since_reset?: true;
    suspension_matches_remaining?: true;
    is_suspended?: true;
    total_fine_owed?: true;
    created_at?: true;
    updated_at?: true;
};
export type PlayerStatisticMaxAggregateInputType = {
    id?: true;
    player_id?: true;
    team_id?: true;
    season_id?: true;
    matches_played?: true;
    goals_scored?: true;
    assists?: true;
    yellow_cards?: true;
    red_cards?: true;
    minutes_played?: true;
    accumulated_yellow_cards?: true;
    yellow_cards_since_reset?: true;
    suspension_matches_remaining?: true;
    is_suspended?: true;
    total_fine_owed?: true;
    created_at?: true;
    updated_at?: true;
};
export type PlayerStatisticCountAggregateInputType = {
    id?: true;
    player_id?: true;
    team_id?: true;
    season_id?: true;
    matches_played?: true;
    goals_scored?: true;
    assists?: true;
    yellow_cards?: true;
    red_cards?: true;
    minutes_played?: true;
    accumulated_yellow_cards?: true;
    yellow_cards_since_reset?: true;
    suspension_matches_remaining?: true;
    is_suspended?: true;
    total_fine_owed?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
};
export type PlayerStatisticAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PlayerStatistic to aggregate.
     */
    where?: Prisma.PlayerStatisticWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PlayerStatistics to fetch.
     */
    orderBy?: Prisma.PlayerStatisticOrderByWithRelationInput | Prisma.PlayerStatisticOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.PlayerStatisticWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PlayerStatistics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PlayerStatistics.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PlayerStatistics
    **/
    _count?: true | PlayerStatisticCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: PlayerStatisticAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: PlayerStatisticSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: PlayerStatisticMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: PlayerStatisticMaxAggregateInputType;
};
export type GetPlayerStatisticAggregateType<T extends PlayerStatisticAggregateArgs> = {
    [P in keyof T & keyof AggregatePlayerStatistic]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePlayerStatistic[P]> : Prisma.GetScalarType<T[P], AggregatePlayerStatistic[P]>;
};
export type PlayerStatisticGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlayerStatisticWhereInput;
    orderBy?: Prisma.PlayerStatisticOrderByWithAggregationInput | Prisma.PlayerStatisticOrderByWithAggregationInput[];
    by: Prisma.PlayerStatisticScalarFieldEnum[] | Prisma.PlayerStatisticScalarFieldEnum;
    having?: Prisma.PlayerStatisticScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PlayerStatisticCountAggregateInputType | true;
    _avg?: PlayerStatisticAvgAggregateInputType;
    _sum?: PlayerStatisticSumAggregateInputType;
    _min?: PlayerStatisticMinAggregateInputType;
    _max?: PlayerStatisticMaxAggregateInputType;
};
export type PlayerStatisticGroupByOutputType = {
    id: number;
    player_id: number;
    team_id: number;
    season_id: number;
    matches_played: number;
    goals_scored: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
    minutes_played: number;
    accumulated_yellow_cards: number;
    yellow_cards_since_reset: number;
    suspension_matches_remaining: number;
    is_suspended: boolean;
    total_fine_owed: runtime.Decimal;
    created_at: Date;
    updated_at: Date | null;
    _count: PlayerStatisticCountAggregateOutputType | null;
    _avg: PlayerStatisticAvgAggregateOutputType | null;
    _sum: PlayerStatisticSumAggregateOutputType | null;
    _min: PlayerStatisticMinAggregateOutputType | null;
    _max: PlayerStatisticMaxAggregateOutputType | null;
};
export type GetPlayerStatisticGroupByPayload<T extends PlayerStatisticGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PlayerStatisticGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PlayerStatisticGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PlayerStatisticGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PlayerStatisticGroupByOutputType[P]>;
}>>;
export type PlayerStatisticWhereInput = {
    AND?: Prisma.PlayerStatisticWhereInput | Prisma.PlayerStatisticWhereInput[];
    OR?: Prisma.PlayerStatisticWhereInput[];
    NOT?: Prisma.PlayerStatisticWhereInput | Prisma.PlayerStatisticWhereInput[];
    id?: Prisma.IntFilter<"PlayerStatistic"> | number;
    player_id?: Prisma.IntFilter<"PlayerStatistic"> | number;
    team_id?: Prisma.IntFilter<"PlayerStatistic"> | number;
    season_id?: Prisma.IntFilter<"PlayerStatistic"> | number;
    matches_played?: Prisma.IntFilter<"PlayerStatistic"> | number;
    goals_scored?: Prisma.IntFilter<"PlayerStatistic"> | number;
    assists?: Prisma.IntFilter<"PlayerStatistic"> | number;
    yellow_cards?: Prisma.IntFilter<"PlayerStatistic"> | number;
    red_cards?: Prisma.IntFilter<"PlayerStatistic"> | number;
    minutes_played?: Prisma.IntFilter<"PlayerStatistic"> | number;
    accumulated_yellow_cards?: Prisma.IntFilter<"PlayerStatistic"> | number;
    yellow_cards_since_reset?: Prisma.IntFilter<"PlayerStatistic"> | number;
    suspension_matches_remaining?: Prisma.IntFilter<"PlayerStatistic"> | number;
    is_suspended?: Prisma.BoolFilter<"PlayerStatistic"> | boolean;
    total_fine_owed?: Prisma.DecimalFilter<"PlayerStatistic"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFilter<"PlayerStatistic"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"PlayerStatistic"> | Date | string | null;
    player?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    season?: Prisma.XOR<Prisma.SeasonScalarRelationFilter, Prisma.SeasonWhereInput>;
};
export type PlayerStatisticOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    matches_played?: Prisma.SortOrder;
    goals_scored?: Prisma.SortOrder;
    assists?: Prisma.SortOrder;
    yellow_cards?: Prisma.SortOrder;
    red_cards?: Prisma.SortOrder;
    minutes_played?: Prisma.SortOrder;
    accumulated_yellow_cards?: Prisma.SortOrder;
    yellow_cards_since_reset?: Prisma.SortOrder;
    suspension_matches_remaining?: Prisma.SortOrder;
    is_suspended?: Prisma.SortOrder;
    total_fine_owed?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    player?: Prisma.PlayerOrderByWithRelationInput;
    team?: Prisma.TeamOrderByWithRelationInput;
    season?: Prisma.SeasonOrderByWithRelationInput;
};
export type PlayerStatisticWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    player_id_team_id_season_id?: Prisma.PlayerStatisticPlayer_idTeam_idSeason_idCompoundUniqueInput;
    AND?: Prisma.PlayerStatisticWhereInput | Prisma.PlayerStatisticWhereInput[];
    OR?: Prisma.PlayerStatisticWhereInput[];
    NOT?: Prisma.PlayerStatisticWhereInput | Prisma.PlayerStatisticWhereInput[];
    player_id?: Prisma.IntFilter<"PlayerStatistic"> | number;
    team_id?: Prisma.IntFilter<"PlayerStatistic"> | number;
    season_id?: Prisma.IntFilter<"PlayerStatistic"> | number;
    matches_played?: Prisma.IntFilter<"PlayerStatistic"> | number;
    goals_scored?: Prisma.IntFilter<"PlayerStatistic"> | number;
    assists?: Prisma.IntFilter<"PlayerStatistic"> | number;
    yellow_cards?: Prisma.IntFilter<"PlayerStatistic"> | number;
    red_cards?: Prisma.IntFilter<"PlayerStatistic"> | number;
    minutes_played?: Prisma.IntFilter<"PlayerStatistic"> | number;
    accumulated_yellow_cards?: Prisma.IntFilter<"PlayerStatistic"> | number;
    yellow_cards_since_reset?: Prisma.IntFilter<"PlayerStatistic"> | number;
    suspension_matches_remaining?: Prisma.IntFilter<"PlayerStatistic"> | number;
    is_suspended?: Prisma.BoolFilter<"PlayerStatistic"> | boolean;
    total_fine_owed?: Prisma.DecimalFilter<"PlayerStatistic"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFilter<"PlayerStatistic"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"PlayerStatistic"> | Date | string | null;
    player?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    season?: Prisma.XOR<Prisma.SeasonScalarRelationFilter, Prisma.SeasonWhereInput>;
}, "id" | "player_id_team_id_season_id">;
export type PlayerStatisticOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    matches_played?: Prisma.SortOrder;
    goals_scored?: Prisma.SortOrder;
    assists?: Prisma.SortOrder;
    yellow_cards?: Prisma.SortOrder;
    red_cards?: Prisma.SortOrder;
    minutes_played?: Prisma.SortOrder;
    accumulated_yellow_cards?: Prisma.SortOrder;
    yellow_cards_since_reset?: Prisma.SortOrder;
    suspension_matches_remaining?: Prisma.SortOrder;
    is_suspended?: Prisma.SortOrder;
    total_fine_owed?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.PlayerStatisticCountOrderByAggregateInput;
    _avg?: Prisma.PlayerStatisticAvgOrderByAggregateInput;
    _max?: Prisma.PlayerStatisticMaxOrderByAggregateInput;
    _min?: Prisma.PlayerStatisticMinOrderByAggregateInput;
    _sum?: Prisma.PlayerStatisticSumOrderByAggregateInput;
};
export type PlayerStatisticScalarWhereWithAggregatesInput = {
    AND?: Prisma.PlayerStatisticScalarWhereWithAggregatesInput | Prisma.PlayerStatisticScalarWhereWithAggregatesInput[];
    OR?: Prisma.PlayerStatisticScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PlayerStatisticScalarWhereWithAggregatesInput | Prisma.PlayerStatisticScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"PlayerStatistic"> | number;
    player_id?: Prisma.IntWithAggregatesFilter<"PlayerStatistic"> | number;
    team_id?: Prisma.IntWithAggregatesFilter<"PlayerStatistic"> | number;
    season_id?: Prisma.IntWithAggregatesFilter<"PlayerStatistic"> | number;
    matches_played?: Prisma.IntWithAggregatesFilter<"PlayerStatistic"> | number;
    goals_scored?: Prisma.IntWithAggregatesFilter<"PlayerStatistic"> | number;
    assists?: Prisma.IntWithAggregatesFilter<"PlayerStatistic"> | number;
    yellow_cards?: Prisma.IntWithAggregatesFilter<"PlayerStatistic"> | number;
    red_cards?: Prisma.IntWithAggregatesFilter<"PlayerStatistic"> | number;
    minutes_played?: Prisma.IntWithAggregatesFilter<"PlayerStatistic"> | number;
    accumulated_yellow_cards?: Prisma.IntWithAggregatesFilter<"PlayerStatistic"> | number;
    yellow_cards_since_reset?: Prisma.IntWithAggregatesFilter<"PlayerStatistic"> | number;
    suspension_matches_remaining?: Prisma.IntWithAggregatesFilter<"PlayerStatistic"> | number;
    is_suspended?: Prisma.BoolWithAggregatesFilter<"PlayerStatistic"> | boolean;
    total_fine_owed?: Prisma.DecimalWithAggregatesFilter<"PlayerStatistic"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"PlayerStatistic"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"PlayerStatistic"> | Date | string | null;
};
export type PlayerStatisticCreateInput = {
    matches_played?: number;
    goals_scored?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes_played?: number;
    accumulated_yellow_cards?: number;
    yellow_cards_since_reset?: number;
    suspension_matches_remaining?: number;
    is_suspended?: boolean;
    total_fine_owed?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    player: Prisma.PlayerCreateNestedOneWithoutPlayerStatisticsInput;
    team: Prisma.TeamCreateNestedOneWithoutPlayerStatisticsInput;
    season: Prisma.SeasonCreateNestedOneWithoutPlayerStatisticsInput;
};
export type PlayerStatisticUncheckedCreateInput = {
    id?: number;
    player_id: number;
    team_id: number;
    season_id: number;
    matches_played?: number;
    goals_scored?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes_played?: number;
    accumulated_yellow_cards?: number;
    yellow_cards_since_reset?: number;
    suspension_matches_remaining?: number;
    is_suspended?: boolean;
    total_fine_owed?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    updated_at?: Date | string | null;
};
export type PlayerStatisticUpdateInput = {
    matches_played?: Prisma.IntFieldUpdateOperationsInput | number;
    goals_scored?: Prisma.IntFieldUpdateOperationsInput | number;
    assists?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    red_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    minutes_played?: Prisma.IntFieldUpdateOperationsInput | number;
    accumulated_yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_since_reset?: Prisma.IntFieldUpdateOperationsInput | number;
    suspension_matches_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    is_suspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_fine_owed?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    player?: Prisma.PlayerUpdateOneRequiredWithoutPlayerStatisticsNestedInput;
    team?: Prisma.TeamUpdateOneRequiredWithoutPlayerStatisticsNestedInput;
    season?: Prisma.SeasonUpdateOneRequiredWithoutPlayerStatisticsNestedInput;
};
export type PlayerStatisticUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    matches_played?: Prisma.IntFieldUpdateOperationsInput | number;
    goals_scored?: Prisma.IntFieldUpdateOperationsInput | number;
    assists?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    red_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    minutes_played?: Prisma.IntFieldUpdateOperationsInput | number;
    accumulated_yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_since_reset?: Prisma.IntFieldUpdateOperationsInput | number;
    suspension_matches_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    is_suspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_fine_owed?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PlayerStatisticCreateManyInput = {
    id?: number;
    player_id: number;
    team_id: number;
    season_id: number;
    matches_played?: number;
    goals_scored?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes_played?: number;
    accumulated_yellow_cards?: number;
    yellow_cards_since_reset?: number;
    suspension_matches_remaining?: number;
    is_suspended?: boolean;
    total_fine_owed?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    updated_at?: Date | string | null;
};
export type PlayerStatisticUpdateManyMutationInput = {
    matches_played?: Prisma.IntFieldUpdateOperationsInput | number;
    goals_scored?: Prisma.IntFieldUpdateOperationsInput | number;
    assists?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    red_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    minutes_played?: Prisma.IntFieldUpdateOperationsInput | number;
    accumulated_yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_since_reset?: Prisma.IntFieldUpdateOperationsInput | number;
    suspension_matches_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    is_suspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_fine_owed?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PlayerStatisticUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    matches_played?: Prisma.IntFieldUpdateOperationsInput | number;
    goals_scored?: Prisma.IntFieldUpdateOperationsInput | number;
    assists?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    red_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    minutes_played?: Prisma.IntFieldUpdateOperationsInput | number;
    accumulated_yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_since_reset?: Prisma.IntFieldUpdateOperationsInput | number;
    suspension_matches_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    is_suspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_fine_owed?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PlayerStatisticListRelationFilter = {
    every?: Prisma.PlayerStatisticWhereInput;
    some?: Prisma.PlayerStatisticWhereInput;
    none?: Prisma.PlayerStatisticWhereInput;
};
export type PlayerStatisticOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PlayerStatisticPlayer_idTeam_idSeason_idCompoundUniqueInput = {
    player_id: number;
    team_id: number;
    season_id: number;
};
export type PlayerStatisticCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    matches_played?: Prisma.SortOrder;
    goals_scored?: Prisma.SortOrder;
    assists?: Prisma.SortOrder;
    yellow_cards?: Prisma.SortOrder;
    red_cards?: Prisma.SortOrder;
    minutes_played?: Prisma.SortOrder;
    accumulated_yellow_cards?: Prisma.SortOrder;
    yellow_cards_since_reset?: Prisma.SortOrder;
    suspension_matches_remaining?: Prisma.SortOrder;
    is_suspended?: Prisma.SortOrder;
    total_fine_owed?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type PlayerStatisticAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    matches_played?: Prisma.SortOrder;
    goals_scored?: Prisma.SortOrder;
    assists?: Prisma.SortOrder;
    yellow_cards?: Prisma.SortOrder;
    red_cards?: Prisma.SortOrder;
    minutes_played?: Prisma.SortOrder;
    accumulated_yellow_cards?: Prisma.SortOrder;
    yellow_cards_since_reset?: Prisma.SortOrder;
    suspension_matches_remaining?: Prisma.SortOrder;
    total_fine_owed?: Prisma.SortOrder;
};
export type PlayerStatisticMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    matches_played?: Prisma.SortOrder;
    goals_scored?: Prisma.SortOrder;
    assists?: Prisma.SortOrder;
    yellow_cards?: Prisma.SortOrder;
    red_cards?: Prisma.SortOrder;
    minutes_played?: Prisma.SortOrder;
    accumulated_yellow_cards?: Prisma.SortOrder;
    yellow_cards_since_reset?: Prisma.SortOrder;
    suspension_matches_remaining?: Prisma.SortOrder;
    is_suspended?: Prisma.SortOrder;
    total_fine_owed?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type PlayerStatisticMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    matches_played?: Prisma.SortOrder;
    goals_scored?: Prisma.SortOrder;
    assists?: Prisma.SortOrder;
    yellow_cards?: Prisma.SortOrder;
    red_cards?: Prisma.SortOrder;
    minutes_played?: Prisma.SortOrder;
    accumulated_yellow_cards?: Prisma.SortOrder;
    yellow_cards_since_reset?: Prisma.SortOrder;
    suspension_matches_remaining?: Prisma.SortOrder;
    is_suspended?: Prisma.SortOrder;
    total_fine_owed?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type PlayerStatisticSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    season_id?: Prisma.SortOrder;
    matches_played?: Prisma.SortOrder;
    goals_scored?: Prisma.SortOrder;
    assists?: Prisma.SortOrder;
    yellow_cards?: Prisma.SortOrder;
    red_cards?: Prisma.SortOrder;
    minutes_played?: Prisma.SortOrder;
    accumulated_yellow_cards?: Prisma.SortOrder;
    yellow_cards_since_reset?: Prisma.SortOrder;
    suspension_matches_remaining?: Prisma.SortOrder;
    total_fine_owed?: Prisma.SortOrder;
};
export type PlayerStatisticCreateNestedManyWithoutSeasonInput = {
    create?: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutSeasonInput, Prisma.PlayerStatisticUncheckedCreateWithoutSeasonInput> | Prisma.PlayerStatisticCreateWithoutSeasonInput[] | Prisma.PlayerStatisticUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.PlayerStatisticCreateOrConnectWithoutSeasonInput | Prisma.PlayerStatisticCreateOrConnectWithoutSeasonInput[];
    createMany?: Prisma.PlayerStatisticCreateManySeasonInputEnvelope;
    connect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
};
export type PlayerStatisticUncheckedCreateNestedManyWithoutSeasonInput = {
    create?: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutSeasonInput, Prisma.PlayerStatisticUncheckedCreateWithoutSeasonInput> | Prisma.PlayerStatisticCreateWithoutSeasonInput[] | Prisma.PlayerStatisticUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.PlayerStatisticCreateOrConnectWithoutSeasonInput | Prisma.PlayerStatisticCreateOrConnectWithoutSeasonInput[];
    createMany?: Prisma.PlayerStatisticCreateManySeasonInputEnvelope;
    connect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
};
export type PlayerStatisticUpdateManyWithoutSeasonNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutSeasonInput, Prisma.PlayerStatisticUncheckedCreateWithoutSeasonInput> | Prisma.PlayerStatisticCreateWithoutSeasonInput[] | Prisma.PlayerStatisticUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.PlayerStatisticCreateOrConnectWithoutSeasonInput | Prisma.PlayerStatisticCreateOrConnectWithoutSeasonInput[];
    upsert?: Prisma.PlayerStatisticUpsertWithWhereUniqueWithoutSeasonInput | Prisma.PlayerStatisticUpsertWithWhereUniqueWithoutSeasonInput[];
    createMany?: Prisma.PlayerStatisticCreateManySeasonInputEnvelope;
    set?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    disconnect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    delete?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    connect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    update?: Prisma.PlayerStatisticUpdateWithWhereUniqueWithoutSeasonInput | Prisma.PlayerStatisticUpdateWithWhereUniqueWithoutSeasonInput[];
    updateMany?: Prisma.PlayerStatisticUpdateManyWithWhereWithoutSeasonInput | Prisma.PlayerStatisticUpdateManyWithWhereWithoutSeasonInput[];
    deleteMany?: Prisma.PlayerStatisticScalarWhereInput | Prisma.PlayerStatisticScalarWhereInput[];
};
export type PlayerStatisticUncheckedUpdateManyWithoutSeasonNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutSeasonInput, Prisma.PlayerStatisticUncheckedCreateWithoutSeasonInput> | Prisma.PlayerStatisticCreateWithoutSeasonInput[] | Prisma.PlayerStatisticUncheckedCreateWithoutSeasonInput[];
    connectOrCreate?: Prisma.PlayerStatisticCreateOrConnectWithoutSeasonInput | Prisma.PlayerStatisticCreateOrConnectWithoutSeasonInput[];
    upsert?: Prisma.PlayerStatisticUpsertWithWhereUniqueWithoutSeasonInput | Prisma.PlayerStatisticUpsertWithWhereUniqueWithoutSeasonInput[];
    createMany?: Prisma.PlayerStatisticCreateManySeasonInputEnvelope;
    set?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    disconnect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    delete?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    connect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    update?: Prisma.PlayerStatisticUpdateWithWhereUniqueWithoutSeasonInput | Prisma.PlayerStatisticUpdateWithWhereUniqueWithoutSeasonInput[];
    updateMany?: Prisma.PlayerStatisticUpdateManyWithWhereWithoutSeasonInput | Prisma.PlayerStatisticUpdateManyWithWhereWithoutSeasonInput[];
    deleteMany?: Prisma.PlayerStatisticScalarWhereInput | Prisma.PlayerStatisticScalarWhereInput[];
};
export type PlayerStatisticCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutTeamInput, Prisma.PlayerStatisticUncheckedCreateWithoutTeamInput> | Prisma.PlayerStatisticCreateWithoutTeamInput[] | Prisma.PlayerStatisticUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.PlayerStatisticCreateOrConnectWithoutTeamInput | Prisma.PlayerStatisticCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.PlayerStatisticCreateManyTeamInputEnvelope;
    connect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
};
export type PlayerStatisticUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutTeamInput, Prisma.PlayerStatisticUncheckedCreateWithoutTeamInput> | Prisma.PlayerStatisticCreateWithoutTeamInput[] | Prisma.PlayerStatisticUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.PlayerStatisticCreateOrConnectWithoutTeamInput | Prisma.PlayerStatisticCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.PlayerStatisticCreateManyTeamInputEnvelope;
    connect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
};
export type PlayerStatisticUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutTeamInput, Prisma.PlayerStatisticUncheckedCreateWithoutTeamInput> | Prisma.PlayerStatisticCreateWithoutTeamInput[] | Prisma.PlayerStatisticUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.PlayerStatisticCreateOrConnectWithoutTeamInput | Prisma.PlayerStatisticCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.PlayerStatisticUpsertWithWhereUniqueWithoutTeamInput | Prisma.PlayerStatisticUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.PlayerStatisticCreateManyTeamInputEnvelope;
    set?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    disconnect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    delete?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    connect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    update?: Prisma.PlayerStatisticUpdateWithWhereUniqueWithoutTeamInput | Prisma.PlayerStatisticUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.PlayerStatisticUpdateManyWithWhereWithoutTeamInput | Prisma.PlayerStatisticUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.PlayerStatisticScalarWhereInput | Prisma.PlayerStatisticScalarWhereInput[];
};
export type PlayerStatisticUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutTeamInput, Prisma.PlayerStatisticUncheckedCreateWithoutTeamInput> | Prisma.PlayerStatisticCreateWithoutTeamInput[] | Prisma.PlayerStatisticUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.PlayerStatisticCreateOrConnectWithoutTeamInput | Prisma.PlayerStatisticCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.PlayerStatisticUpsertWithWhereUniqueWithoutTeamInput | Prisma.PlayerStatisticUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.PlayerStatisticCreateManyTeamInputEnvelope;
    set?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    disconnect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    delete?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    connect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    update?: Prisma.PlayerStatisticUpdateWithWhereUniqueWithoutTeamInput | Prisma.PlayerStatisticUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.PlayerStatisticUpdateManyWithWhereWithoutTeamInput | Prisma.PlayerStatisticUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.PlayerStatisticScalarWhereInput | Prisma.PlayerStatisticScalarWhereInput[];
};
export type PlayerStatisticCreateNestedManyWithoutPlayerInput = {
    create?: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutPlayerInput, Prisma.PlayerStatisticUncheckedCreateWithoutPlayerInput> | Prisma.PlayerStatisticCreateWithoutPlayerInput[] | Prisma.PlayerStatisticUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.PlayerStatisticCreateOrConnectWithoutPlayerInput | Prisma.PlayerStatisticCreateOrConnectWithoutPlayerInput[];
    createMany?: Prisma.PlayerStatisticCreateManyPlayerInputEnvelope;
    connect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
};
export type PlayerStatisticUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutPlayerInput, Prisma.PlayerStatisticUncheckedCreateWithoutPlayerInput> | Prisma.PlayerStatisticCreateWithoutPlayerInput[] | Prisma.PlayerStatisticUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.PlayerStatisticCreateOrConnectWithoutPlayerInput | Prisma.PlayerStatisticCreateOrConnectWithoutPlayerInput[];
    createMany?: Prisma.PlayerStatisticCreateManyPlayerInputEnvelope;
    connect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
};
export type PlayerStatisticUpdateManyWithoutPlayerNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutPlayerInput, Prisma.PlayerStatisticUncheckedCreateWithoutPlayerInput> | Prisma.PlayerStatisticCreateWithoutPlayerInput[] | Prisma.PlayerStatisticUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.PlayerStatisticCreateOrConnectWithoutPlayerInput | Prisma.PlayerStatisticCreateOrConnectWithoutPlayerInput[];
    upsert?: Prisma.PlayerStatisticUpsertWithWhereUniqueWithoutPlayerInput | Prisma.PlayerStatisticUpsertWithWhereUniqueWithoutPlayerInput[];
    createMany?: Prisma.PlayerStatisticCreateManyPlayerInputEnvelope;
    set?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    disconnect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    delete?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    connect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    update?: Prisma.PlayerStatisticUpdateWithWhereUniqueWithoutPlayerInput | Prisma.PlayerStatisticUpdateWithWhereUniqueWithoutPlayerInput[];
    updateMany?: Prisma.PlayerStatisticUpdateManyWithWhereWithoutPlayerInput | Prisma.PlayerStatisticUpdateManyWithWhereWithoutPlayerInput[];
    deleteMany?: Prisma.PlayerStatisticScalarWhereInput | Prisma.PlayerStatisticScalarWhereInput[];
};
export type PlayerStatisticUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutPlayerInput, Prisma.PlayerStatisticUncheckedCreateWithoutPlayerInput> | Prisma.PlayerStatisticCreateWithoutPlayerInput[] | Prisma.PlayerStatisticUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.PlayerStatisticCreateOrConnectWithoutPlayerInput | Prisma.PlayerStatisticCreateOrConnectWithoutPlayerInput[];
    upsert?: Prisma.PlayerStatisticUpsertWithWhereUniqueWithoutPlayerInput | Prisma.PlayerStatisticUpsertWithWhereUniqueWithoutPlayerInput[];
    createMany?: Prisma.PlayerStatisticCreateManyPlayerInputEnvelope;
    set?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    disconnect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    delete?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    connect?: Prisma.PlayerStatisticWhereUniqueInput | Prisma.PlayerStatisticWhereUniqueInput[];
    update?: Prisma.PlayerStatisticUpdateWithWhereUniqueWithoutPlayerInput | Prisma.PlayerStatisticUpdateWithWhereUniqueWithoutPlayerInput[];
    updateMany?: Prisma.PlayerStatisticUpdateManyWithWhereWithoutPlayerInput | Prisma.PlayerStatisticUpdateManyWithWhereWithoutPlayerInput[];
    deleteMany?: Prisma.PlayerStatisticScalarWhereInput | Prisma.PlayerStatisticScalarWhereInput[];
};
export type PlayerStatisticCreateWithoutSeasonInput = {
    matches_played?: number;
    goals_scored?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes_played?: number;
    accumulated_yellow_cards?: number;
    yellow_cards_since_reset?: number;
    suspension_matches_remaining?: number;
    is_suspended?: boolean;
    total_fine_owed?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    player: Prisma.PlayerCreateNestedOneWithoutPlayerStatisticsInput;
    team: Prisma.TeamCreateNestedOneWithoutPlayerStatisticsInput;
};
export type PlayerStatisticUncheckedCreateWithoutSeasonInput = {
    id?: number;
    player_id: number;
    team_id: number;
    matches_played?: number;
    goals_scored?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes_played?: number;
    accumulated_yellow_cards?: number;
    yellow_cards_since_reset?: number;
    suspension_matches_remaining?: number;
    is_suspended?: boolean;
    total_fine_owed?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    updated_at?: Date | string | null;
};
export type PlayerStatisticCreateOrConnectWithoutSeasonInput = {
    where: Prisma.PlayerStatisticWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutSeasonInput, Prisma.PlayerStatisticUncheckedCreateWithoutSeasonInput>;
};
export type PlayerStatisticCreateManySeasonInputEnvelope = {
    data: Prisma.PlayerStatisticCreateManySeasonInput | Prisma.PlayerStatisticCreateManySeasonInput[];
    skipDuplicates?: boolean;
};
export type PlayerStatisticUpsertWithWhereUniqueWithoutSeasonInput = {
    where: Prisma.PlayerStatisticWhereUniqueInput;
    update: Prisma.XOR<Prisma.PlayerStatisticUpdateWithoutSeasonInput, Prisma.PlayerStatisticUncheckedUpdateWithoutSeasonInput>;
    create: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutSeasonInput, Prisma.PlayerStatisticUncheckedCreateWithoutSeasonInput>;
};
export type PlayerStatisticUpdateWithWhereUniqueWithoutSeasonInput = {
    where: Prisma.PlayerStatisticWhereUniqueInput;
    data: Prisma.XOR<Prisma.PlayerStatisticUpdateWithoutSeasonInput, Prisma.PlayerStatisticUncheckedUpdateWithoutSeasonInput>;
};
export type PlayerStatisticUpdateManyWithWhereWithoutSeasonInput = {
    where: Prisma.PlayerStatisticScalarWhereInput;
    data: Prisma.XOR<Prisma.PlayerStatisticUpdateManyMutationInput, Prisma.PlayerStatisticUncheckedUpdateManyWithoutSeasonInput>;
};
export type PlayerStatisticScalarWhereInput = {
    AND?: Prisma.PlayerStatisticScalarWhereInput | Prisma.PlayerStatisticScalarWhereInput[];
    OR?: Prisma.PlayerStatisticScalarWhereInput[];
    NOT?: Prisma.PlayerStatisticScalarWhereInput | Prisma.PlayerStatisticScalarWhereInput[];
    id?: Prisma.IntFilter<"PlayerStatistic"> | number;
    player_id?: Prisma.IntFilter<"PlayerStatistic"> | number;
    team_id?: Prisma.IntFilter<"PlayerStatistic"> | number;
    season_id?: Prisma.IntFilter<"PlayerStatistic"> | number;
    matches_played?: Prisma.IntFilter<"PlayerStatistic"> | number;
    goals_scored?: Prisma.IntFilter<"PlayerStatistic"> | number;
    assists?: Prisma.IntFilter<"PlayerStatistic"> | number;
    yellow_cards?: Prisma.IntFilter<"PlayerStatistic"> | number;
    red_cards?: Prisma.IntFilter<"PlayerStatistic"> | number;
    minutes_played?: Prisma.IntFilter<"PlayerStatistic"> | number;
    accumulated_yellow_cards?: Prisma.IntFilter<"PlayerStatistic"> | number;
    yellow_cards_since_reset?: Prisma.IntFilter<"PlayerStatistic"> | number;
    suspension_matches_remaining?: Prisma.IntFilter<"PlayerStatistic"> | number;
    is_suspended?: Prisma.BoolFilter<"PlayerStatistic"> | boolean;
    total_fine_owed?: Prisma.DecimalFilter<"PlayerStatistic"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFilter<"PlayerStatistic"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"PlayerStatistic"> | Date | string | null;
};
export type PlayerStatisticCreateWithoutTeamInput = {
    matches_played?: number;
    goals_scored?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes_played?: number;
    accumulated_yellow_cards?: number;
    yellow_cards_since_reset?: number;
    suspension_matches_remaining?: number;
    is_suspended?: boolean;
    total_fine_owed?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    player: Prisma.PlayerCreateNestedOneWithoutPlayerStatisticsInput;
    season: Prisma.SeasonCreateNestedOneWithoutPlayerStatisticsInput;
};
export type PlayerStatisticUncheckedCreateWithoutTeamInput = {
    id?: number;
    player_id: number;
    season_id: number;
    matches_played?: number;
    goals_scored?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes_played?: number;
    accumulated_yellow_cards?: number;
    yellow_cards_since_reset?: number;
    suspension_matches_remaining?: number;
    is_suspended?: boolean;
    total_fine_owed?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    updated_at?: Date | string | null;
};
export type PlayerStatisticCreateOrConnectWithoutTeamInput = {
    where: Prisma.PlayerStatisticWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutTeamInput, Prisma.PlayerStatisticUncheckedCreateWithoutTeamInput>;
};
export type PlayerStatisticCreateManyTeamInputEnvelope = {
    data: Prisma.PlayerStatisticCreateManyTeamInput | Prisma.PlayerStatisticCreateManyTeamInput[];
    skipDuplicates?: boolean;
};
export type PlayerStatisticUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.PlayerStatisticWhereUniqueInput;
    update: Prisma.XOR<Prisma.PlayerStatisticUpdateWithoutTeamInput, Prisma.PlayerStatisticUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutTeamInput, Prisma.PlayerStatisticUncheckedCreateWithoutTeamInput>;
};
export type PlayerStatisticUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.PlayerStatisticWhereUniqueInput;
    data: Prisma.XOR<Prisma.PlayerStatisticUpdateWithoutTeamInput, Prisma.PlayerStatisticUncheckedUpdateWithoutTeamInput>;
};
export type PlayerStatisticUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.PlayerStatisticScalarWhereInput;
    data: Prisma.XOR<Prisma.PlayerStatisticUpdateManyMutationInput, Prisma.PlayerStatisticUncheckedUpdateManyWithoutTeamInput>;
};
export type PlayerStatisticCreateWithoutPlayerInput = {
    matches_played?: number;
    goals_scored?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes_played?: number;
    accumulated_yellow_cards?: number;
    yellow_cards_since_reset?: number;
    suspension_matches_remaining?: number;
    is_suspended?: boolean;
    total_fine_owed?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    team: Prisma.TeamCreateNestedOneWithoutPlayerStatisticsInput;
    season: Prisma.SeasonCreateNestedOneWithoutPlayerStatisticsInput;
};
export type PlayerStatisticUncheckedCreateWithoutPlayerInput = {
    id?: number;
    team_id: number;
    season_id: number;
    matches_played?: number;
    goals_scored?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes_played?: number;
    accumulated_yellow_cards?: number;
    yellow_cards_since_reset?: number;
    suspension_matches_remaining?: number;
    is_suspended?: boolean;
    total_fine_owed?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    updated_at?: Date | string | null;
};
export type PlayerStatisticCreateOrConnectWithoutPlayerInput = {
    where: Prisma.PlayerStatisticWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutPlayerInput, Prisma.PlayerStatisticUncheckedCreateWithoutPlayerInput>;
};
export type PlayerStatisticCreateManyPlayerInputEnvelope = {
    data: Prisma.PlayerStatisticCreateManyPlayerInput | Prisma.PlayerStatisticCreateManyPlayerInput[];
    skipDuplicates?: boolean;
};
export type PlayerStatisticUpsertWithWhereUniqueWithoutPlayerInput = {
    where: Prisma.PlayerStatisticWhereUniqueInput;
    update: Prisma.XOR<Prisma.PlayerStatisticUpdateWithoutPlayerInput, Prisma.PlayerStatisticUncheckedUpdateWithoutPlayerInput>;
    create: Prisma.XOR<Prisma.PlayerStatisticCreateWithoutPlayerInput, Prisma.PlayerStatisticUncheckedCreateWithoutPlayerInput>;
};
export type PlayerStatisticUpdateWithWhereUniqueWithoutPlayerInput = {
    where: Prisma.PlayerStatisticWhereUniqueInput;
    data: Prisma.XOR<Prisma.PlayerStatisticUpdateWithoutPlayerInput, Prisma.PlayerStatisticUncheckedUpdateWithoutPlayerInput>;
};
export type PlayerStatisticUpdateManyWithWhereWithoutPlayerInput = {
    where: Prisma.PlayerStatisticScalarWhereInput;
    data: Prisma.XOR<Prisma.PlayerStatisticUpdateManyMutationInput, Prisma.PlayerStatisticUncheckedUpdateManyWithoutPlayerInput>;
};
export type PlayerStatisticCreateManySeasonInput = {
    id?: number;
    player_id: number;
    team_id: number;
    matches_played?: number;
    goals_scored?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes_played?: number;
    accumulated_yellow_cards?: number;
    yellow_cards_since_reset?: number;
    suspension_matches_remaining?: number;
    is_suspended?: boolean;
    total_fine_owed?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    updated_at?: Date | string | null;
};
export type PlayerStatisticUpdateWithoutSeasonInput = {
    matches_played?: Prisma.IntFieldUpdateOperationsInput | number;
    goals_scored?: Prisma.IntFieldUpdateOperationsInput | number;
    assists?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    red_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    minutes_played?: Prisma.IntFieldUpdateOperationsInput | number;
    accumulated_yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_since_reset?: Prisma.IntFieldUpdateOperationsInput | number;
    suspension_matches_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    is_suspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_fine_owed?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    player?: Prisma.PlayerUpdateOneRequiredWithoutPlayerStatisticsNestedInput;
    team?: Prisma.TeamUpdateOneRequiredWithoutPlayerStatisticsNestedInput;
};
export type PlayerStatisticUncheckedUpdateWithoutSeasonInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    matches_played?: Prisma.IntFieldUpdateOperationsInput | number;
    goals_scored?: Prisma.IntFieldUpdateOperationsInput | number;
    assists?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    red_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    minutes_played?: Prisma.IntFieldUpdateOperationsInput | number;
    accumulated_yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_since_reset?: Prisma.IntFieldUpdateOperationsInput | number;
    suspension_matches_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    is_suspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_fine_owed?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PlayerStatisticUncheckedUpdateManyWithoutSeasonInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    matches_played?: Prisma.IntFieldUpdateOperationsInput | number;
    goals_scored?: Prisma.IntFieldUpdateOperationsInput | number;
    assists?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    red_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    minutes_played?: Prisma.IntFieldUpdateOperationsInput | number;
    accumulated_yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_since_reset?: Prisma.IntFieldUpdateOperationsInput | number;
    suspension_matches_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    is_suspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_fine_owed?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PlayerStatisticCreateManyTeamInput = {
    id?: number;
    player_id: number;
    season_id: number;
    matches_played?: number;
    goals_scored?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes_played?: number;
    accumulated_yellow_cards?: number;
    yellow_cards_since_reset?: number;
    suspension_matches_remaining?: number;
    is_suspended?: boolean;
    total_fine_owed?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    updated_at?: Date | string | null;
};
export type PlayerStatisticUpdateWithoutTeamInput = {
    matches_played?: Prisma.IntFieldUpdateOperationsInput | number;
    goals_scored?: Prisma.IntFieldUpdateOperationsInput | number;
    assists?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    red_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    minutes_played?: Prisma.IntFieldUpdateOperationsInput | number;
    accumulated_yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_since_reset?: Prisma.IntFieldUpdateOperationsInput | number;
    suspension_matches_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    is_suspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_fine_owed?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    player?: Prisma.PlayerUpdateOneRequiredWithoutPlayerStatisticsNestedInput;
    season?: Prisma.SeasonUpdateOneRequiredWithoutPlayerStatisticsNestedInput;
};
export type PlayerStatisticUncheckedUpdateWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    matches_played?: Prisma.IntFieldUpdateOperationsInput | number;
    goals_scored?: Prisma.IntFieldUpdateOperationsInput | number;
    assists?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    red_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    minutes_played?: Prisma.IntFieldUpdateOperationsInput | number;
    accumulated_yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_since_reset?: Prisma.IntFieldUpdateOperationsInput | number;
    suspension_matches_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    is_suspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_fine_owed?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PlayerStatisticUncheckedUpdateManyWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    matches_played?: Prisma.IntFieldUpdateOperationsInput | number;
    goals_scored?: Prisma.IntFieldUpdateOperationsInput | number;
    assists?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    red_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    minutes_played?: Prisma.IntFieldUpdateOperationsInput | number;
    accumulated_yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_since_reset?: Prisma.IntFieldUpdateOperationsInput | number;
    suspension_matches_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    is_suspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_fine_owed?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PlayerStatisticCreateManyPlayerInput = {
    id?: number;
    team_id: number;
    season_id: number;
    matches_played?: number;
    goals_scored?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes_played?: number;
    accumulated_yellow_cards?: number;
    yellow_cards_since_reset?: number;
    suspension_matches_remaining?: number;
    is_suspended?: boolean;
    total_fine_owed?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    updated_at?: Date | string | null;
};
export type PlayerStatisticUpdateWithoutPlayerInput = {
    matches_played?: Prisma.IntFieldUpdateOperationsInput | number;
    goals_scored?: Prisma.IntFieldUpdateOperationsInput | number;
    assists?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    red_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    minutes_played?: Prisma.IntFieldUpdateOperationsInput | number;
    accumulated_yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_since_reset?: Prisma.IntFieldUpdateOperationsInput | number;
    suspension_matches_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    is_suspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_fine_owed?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team?: Prisma.TeamUpdateOneRequiredWithoutPlayerStatisticsNestedInput;
    season?: Prisma.SeasonUpdateOneRequiredWithoutPlayerStatisticsNestedInput;
};
export type PlayerStatisticUncheckedUpdateWithoutPlayerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    matches_played?: Prisma.IntFieldUpdateOperationsInput | number;
    goals_scored?: Prisma.IntFieldUpdateOperationsInput | number;
    assists?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    red_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    minutes_played?: Prisma.IntFieldUpdateOperationsInput | number;
    accumulated_yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_since_reset?: Prisma.IntFieldUpdateOperationsInput | number;
    suspension_matches_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    is_suspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_fine_owed?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PlayerStatisticUncheckedUpdateManyWithoutPlayerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    season_id?: Prisma.IntFieldUpdateOperationsInput | number;
    matches_played?: Prisma.IntFieldUpdateOperationsInput | number;
    goals_scored?: Prisma.IntFieldUpdateOperationsInput | number;
    assists?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    red_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    minutes_played?: Prisma.IntFieldUpdateOperationsInput | number;
    accumulated_yellow_cards?: Prisma.IntFieldUpdateOperationsInput | number;
    yellow_cards_since_reset?: Prisma.IntFieldUpdateOperationsInput | number;
    suspension_matches_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    is_suspended?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_fine_owed?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PlayerStatisticSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    player_id?: boolean;
    team_id?: boolean;
    season_id?: boolean;
    matches_played?: boolean;
    goals_scored?: boolean;
    assists?: boolean;
    yellow_cards?: boolean;
    red_cards?: boolean;
    minutes_played?: boolean;
    accumulated_yellow_cards?: boolean;
    yellow_cards_since_reset?: boolean;
    suspension_matches_remaining?: boolean;
    is_suspended?: boolean;
    total_fine_owed?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    season?: boolean | Prisma.SeasonDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["playerStatistic"]>;
export type PlayerStatisticSelectScalar = {
    id?: boolean;
    player_id?: boolean;
    team_id?: boolean;
    season_id?: boolean;
    matches_played?: boolean;
    goals_scored?: boolean;
    assists?: boolean;
    yellow_cards?: boolean;
    red_cards?: boolean;
    minutes_played?: boolean;
    accumulated_yellow_cards?: boolean;
    yellow_cards_since_reset?: boolean;
    suspension_matches_remaining?: boolean;
    is_suspended?: boolean;
    total_fine_owed?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
};
export type PlayerStatisticOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "player_id" | "team_id" | "season_id" | "matches_played" | "goals_scored" | "assists" | "yellow_cards" | "red_cards" | "minutes_played" | "accumulated_yellow_cards" | "yellow_cards_since_reset" | "suspension_matches_remaining" | "is_suspended" | "total_fine_owed" | "created_at" | "updated_at", ExtArgs["result"]["playerStatistic"]>;
export type PlayerStatisticInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    season?: boolean | Prisma.SeasonDefaultArgs<ExtArgs>;
};
export type $PlayerStatisticPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PlayerStatistic";
    objects: {
        player: Prisma.$PlayerPayload<ExtArgs>;
        team: Prisma.$TeamPayload<ExtArgs>;
        season: Prisma.$SeasonPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        player_id: number;
        team_id: number;
        season_id: number;
        matches_played: number;
        goals_scored: number;
        assists: number;
        yellow_cards: number;
        red_cards: number;
        minutes_played: number;
        accumulated_yellow_cards: number;
        yellow_cards_since_reset: number;
        suspension_matches_remaining: number;
        is_suspended: boolean;
        total_fine_owed: runtime.Decimal;
        created_at: Date;
        updated_at: Date | null;
    }, ExtArgs["result"]["playerStatistic"]>;
    composites: {};
};
export type PlayerStatisticGetPayload<S extends boolean | null | undefined | PlayerStatisticDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PlayerStatisticPayload, S>;
export type PlayerStatisticCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PlayerStatisticFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PlayerStatisticCountAggregateInputType | true;
};
export interface PlayerStatisticDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PlayerStatistic'];
        meta: {
            name: 'PlayerStatistic';
        };
    };
    /**
     * Find zero or one PlayerStatistic that matches the filter.
     * @param {PlayerStatisticFindUniqueArgs} args - Arguments to find a PlayerStatistic
     * @example
     * // Get one PlayerStatistic
     * const playerStatistic = await prisma.playerStatistic.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayerStatisticFindUniqueArgs>(args: Prisma.SelectSubset<T, PlayerStatisticFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PlayerStatisticClient<runtime.Types.Result.GetResult<Prisma.$PlayerStatisticPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one PlayerStatistic that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlayerStatisticFindUniqueOrThrowArgs} args - Arguments to find a PlayerStatistic
     * @example
     * // Get one PlayerStatistic
     * const playerStatistic = await prisma.playerStatistic.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayerStatisticFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PlayerStatisticFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlayerStatisticClient<runtime.Types.Result.GetResult<Prisma.$PlayerStatisticPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PlayerStatistic that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerStatisticFindFirstArgs} args - Arguments to find a PlayerStatistic
     * @example
     * // Get one PlayerStatistic
     * const playerStatistic = await prisma.playerStatistic.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayerStatisticFindFirstArgs>(args?: Prisma.SelectSubset<T, PlayerStatisticFindFirstArgs<ExtArgs>>): Prisma.Prisma__PlayerStatisticClient<runtime.Types.Result.GetResult<Prisma.$PlayerStatisticPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PlayerStatistic that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerStatisticFindFirstOrThrowArgs} args - Arguments to find a PlayerStatistic
     * @example
     * // Get one PlayerStatistic
     * const playerStatistic = await prisma.playerStatistic.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayerStatisticFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PlayerStatisticFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlayerStatisticClient<runtime.Types.Result.GetResult<Prisma.$PlayerStatisticPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more PlayerStatistics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerStatisticFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlayerStatistics
     * const playerStatistics = await prisma.playerStatistic.findMany()
     *
     * // Get first 10 PlayerStatistics
     * const playerStatistics = await prisma.playerStatistic.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const playerStatisticWithIdOnly = await prisma.playerStatistic.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PlayerStatisticFindManyArgs>(args?: Prisma.SelectSubset<T, PlayerStatisticFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlayerStatisticPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a PlayerStatistic.
     * @param {PlayerStatisticCreateArgs} args - Arguments to create a PlayerStatistic.
     * @example
     * // Create one PlayerStatistic
     * const PlayerStatistic = await prisma.playerStatistic.create({
     *   data: {
     *     // ... data to create a PlayerStatistic
     *   }
     * })
     *
     */
    create<T extends PlayerStatisticCreateArgs>(args: Prisma.SelectSubset<T, PlayerStatisticCreateArgs<ExtArgs>>): Prisma.Prisma__PlayerStatisticClient<runtime.Types.Result.GetResult<Prisma.$PlayerStatisticPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many PlayerStatistics.
     * @param {PlayerStatisticCreateManyArgs} args - Arguments to create many PlayerStatistics.
     * @example
     * // Create many PlayerStatistics
     * const playerStatistic = await prisma.playerStatistic.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PlayerStatisticCreateManyArgs>(args?: Prisma.SelectSubset<T, PlayerStatisticCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a PlayerStatistic.
     * @param {PlayerStatisticDeleteArgs} args - Arguments to delete one PlayerStatistic.
     * @example
     * // Delete one PlayerStatistic
     * const PlayerStatistic = await prisma.playerStatistic.delete({
     *   where: {
     *     // ... filter to delete one PlayerStatistic
     *   }
     * })
     *
     */
    delete<T extends PlayerStatisticDeleteArgs>(args: Prisma.SelectSubset<T, PlayerStatisticDeleteArgs<ExtArgs>>): Prisma.Prisma__PlayerStatisticClient<runtime.Types.Result.GetResult<Prisma.$PlayerStatisticPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one PlayerStatistic.
     * @param {PlayerStatisticUpdateArgs} args - Arguments to update one PlayerStatistic.
     * @example
     * // Update one PlayerStatistic
     * const playerStatistic = await prisma.playerStatistic.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PlayerStatisticUpdateArgs>(args: Prisma.SelectSubset<T, PlayerStatisticUpdateArgs<ExtArgs>>): Prisma.Prisma__PlayerStatisticClient<runtime.Types.Result.GetResult<Prisma.$PlayerStatisticPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more PlayerStatistics.
     * @param {PlayerStatisticDeleteManyArgs} args - Arguments to filter PlayerStatistics to delete.
     * @example
     * // Delete a few PlayerStatistics
     * const { count } = await prisma.playerStatistic.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PlayerStatisticDeleteManyArgs>(args?: Prisma.SelectSubset<T, PlayerStatisticDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PlayerStatistics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerStatisticUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlayerStatistics
     * const playerStatistic = await prisma.playerStatistic.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PlayerStatisticUpdateManyArgs>(args: Prisma.SelectSubset<T, PlayerStatisticUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one PlayerStatistic.
     * @param {PlayerStatisticUpsertArgs} args - Arguments to update or create a PlayerStatistic.
     * @example
     * // Update or create a PlayerStatistic
     * const playerStatistic = await prisma.playerStatistic.upsert({
     *   create: {
     *     // ... data to create a PlayerStatistic
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlayerStatistic we want to update
     *   }
     * })
     */
    upsert<T extends PlayerStatisticUpsertArgs>(args: Prisma.SelectSubset<T, PlayerStatisticUpsertArgs<ExtArgs>>): Prisma.Prisma__PlayerStatisticClient<runtime.Types.Result.GetResult<Prisma.$PlayerStatisticPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of PlayerStatistics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerStatisticCountArgs} args - Arguments to filter PlayerStatistics to count.
     * @example
     * // Count the number of PlayerStatistics
     * const count = await prisma.playerStatistic.count({
     *   where: {
     *     // ... the filter for the PlayerStatistics we want to count
     *   }
     * })
    **/
    count<T extends PlayerStatisticCountArgs>(args?: Prisma.Subset<T, PlayerStatisticCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PlayerStatisticCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a PlayerStatistic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerStatisticAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlayerStatisticAggregateArgs>(args: Prisma.Subset<T, PlayerStatisticAggregateArgs>): Prisma.PrismaPromise<GetPlayerStatisticAggregateType<T>>;
    /**
     * Group by PlayerStatistic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerStatisticGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends PlayerStatisticGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PlayerStatisticGroupByArgs['orderBy'];
    } : {
        orderBy?: PlayerStatisticGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PlayerStatisticGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerStatisticGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the PlayerStatistic model
     */
    readonly fields: PlayerStatisticFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for PlayerStatistic.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__PlayerStatisticClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    player<T extends Prisma.PlayerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PlayerDefaultArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    team<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    season<T extends Prisma.SeasonDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SeasonDefaultArgs<ExtArgs>>): Prisma.Prisma__SeasonClient<runtime.Types.Result.GetResult<Prisma.$SeasonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the PlayerStatistic model
 */
export interface PlayerStatisticFieldRefs {
    readonly id: Prisma.FieldRef<"PlayerStatistic", 'Int'>;
    readonly player_id: Prisma.FieldRef<"PlayerStatistic", 'Int'>;
    readonly team_id: Prisma.FieldRef<"PlayerStatistic", 'Int'>;
    readonly season_id: Prisma.FieldRef<"PlayerStatistic", 'Int'>;
    readonly matches_played: Prisma.FieldRef<"PlayerStatistic", 'Int'>;
    readonly goals_scored: Prisma.FieldRef<"PlayerStatistic", 'Int'>;
    readonly assists: Prisma.FieldRef<"PlayerStatistic", 'Int'>;
    readonly yellow_cards: Prisma.FieldRef<"PlayerStatistic", 'Int'>;
    readonly red_cards: Prisma.FieldRef<"PlayerStatistic", 'Int'>;
    readonly minutes_played: Prisma.FieldRef<"PlayerStatistic", 'Int'>;
    readonly accumulated_yellow_cards: Prisma.FieldRef<"PlayerStatistic", 'Int'>;
    readonly yellow_cards_since_reset: Prisma.FieldRef<"PlayerStatistic", 'Int'>;
    readonly suspension_matches_remaining: Prisma.FieldRef<"PlayerStatistic", 'Int'>;
    readonly is_suspended: Prisma.FieldRef<"PlayerStatistic", 'Boolean'>;
    readonly total_fine_owed: Prisma.FieldRef<"PlayerStatistic", 'Decimal'>;
    readonly created_at: Prisma.FieldRef<"PlayerStatistic", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"PlayerStatistic", 'DateTime'>;
}
/**
 * PlayerStatistic findUnique
 */
export type PlayerStatisticFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerStatistic
     */
    select?: Prisma.PlayerStatisticSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlayerStatistic
     */
    omit?: Prisma.PlayerStatisticOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerStatisticInclude<ExtArgs> | null;
    /**
     * Filter, which PlayerStatistic to fetch.
     */
    where: Prisma.PlayerStatisticWhereUniqueInput;
};
/**
 * PlayerStatistic findUniqueOrThrow
 */
export type PlayerStatisticFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerStatistic
     */
    select?: Prisma.PlayerStatisticSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlayerStatistic
     */
    omit?: Prisma.PlayerStatisticOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerStatisticInclude<ExtArgs> | null;
    /**
     * Filter, which PlayerStatistic to fetch.
     */
    where: Prisma.PlayerStatisticWhereUniqueInput;
};
/**
 * PlayerStatistic findFirst
 */
export type PlayerStatisticFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerStatistic
     */
    select?: Prisma.PlayerStatisticSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlayerStatistic
     */
    omit?: Prisma.PlayerStatisticOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerStatisticInclude<ExtArgs> | null;
    /**
     * Filter, which PlayerStatistic to fetch.
     */
    where?: Prisma.PlayerStatisticWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PlayerStatistics to fetch.
     */
    orderBy?: Prisma.PlayerStatisticOrderByWithRelationInput | Prisma.PlayerStatisticOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PlayerStatistics.
     */
    cursor?: Prisma.PlayerStatisticWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PlayerStatistics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PlayerStatistics.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PlayerStatistics.
     */
    distinct?: Prisma.PlayerStatisticScalarFieldEnum | Prisma.PlayerStatisticScalarFieldEnum[];
};
/**
 * PlayerStatistic findFirstOrThrow
 */
export type PlayerStatisticFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerStatistic
     */
    select?: Prisma.PlayerStatisticSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlayerStatistic
     */
    omit?: Prisma.PlayerStatisticOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerStatisticInclude<ExtArgs> | null;
    /**
     * Filter, which PlayerStatistic to fetch.
     */
    where?: Prisma.PlayerStatisticWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PlayerStatistics to fetch.
     */
    orderBy?: Prisma.PlayerStatisticOrderByWithRelationInput | Prisma.PlayerStatisticOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PlayerStatistics.
     */
    cursor?: Prisma.PlayerStatisticWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PlayerStatistics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PlayerStatistics.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PlayerStatistics.
     */
    distinct?: Prisma.PlayerStatisticScalarFieldEnum | Prisma.PlayerStatisticScalarFieldEnum[];
};
/**
 * PlayerStatistic findMany
 */
export type PlayerStatisticFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerStatistic
     */
    select?: Prisma.PlayerStatisticSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlayerStatistic
     */
    omit?: Prisma.PlayerStatisticOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerStatisticInclude<ExtArgs> | null;
    /**
     * Filter, which PlayerStatistics to fetch.
     */
    where?: Prisma.PlayerStatisticWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PlayerStatistics to fetch.
     */
    orderBy?: Prisma.PlayerStatisticOrderByWithRelationInput | Prisma.PlayerStatisticOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PlayerStatistics.
     */
    cursor?: Prisma.PlayerStatisticWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PlayerStatistics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PlayerStatistics.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PlayerStatistics.
     */
    distinct?: Prisma.PlayerStatisticScalarFieldEnum | Prisma.PlayerStatisticScalarFieldEnum[];
};
/**
 * PlayerStatistic create
 */
export type PlayerStatisticCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerStatistic
     */
    select?: Prisma.PlayerStatisticSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlayerStatistic
     */
    omit?: Prisma.PlayerStatisticOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerStatisticInclude<ExtArgs> | null;
    /**
     * The data needed to create a PlayerStatistic.
     */
    data: Prisma.XOR<Prisma.PlayerStatisticCreateInput, Prisma.PlayerStatisticUncheckedCreateInput>;
};
/**
 * PlayerStatistic createMany
 */
export type PlayerStatisticCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlayerStatistics.
     */
    data: Prisma.PlayerStatisticCreateManyInput | Prisma.PlayerStatisticCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * PlayerStatistic update
 */
export type PlayerStatisticUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerStatistic
     */
    select?: Prisma.PlayerStatisticSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlayerStatistic
     */
    omit?: Prisma.PlayerStatisticOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerStatisticInclude<ExtArgs> | null;
    /**
     * The data needed to update a PlayerStatistic.
     */
    data: Prisma.XOR<Prisma.PlayerStatisticUpdateInput, Prisma.PlayerStatisticUncheckedUpdateInput>;
    /**
     * Choose, which PlayerStatistic to update.
     */
    where: Prisma.PlayerStatisticWhereUniqueInput;
};
/**
 * PlayerStatistic updateMany
 */
export type PlayerStatisticUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update PlayerStatistics.
     */
    data: Prisma.XOR<Prisma.PlayerStatisticUpdateManyMutationInput, Prisma.PlayerStatisticUncheckedUpdateManyInput>;
    /**
     * Filter which PlayerStatistics to update
     */
    where?: Prisma.PlayerStatisticWhereInput;
    /**
     * Limit how many PlayerStatistics to update.
     */
    limit?: number;
};
/**
 * PlayerStatistic upsert
 */
export type PlayerStatisticUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerStatistic
     */
    select?: Prisma.PlayerStatisticSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlayerStatistic
     */
    omit?: Prisma.PlayerStatisticOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerStatisticInclude<ExtArgs> | null;
    /**
     * The filter to search for the PlayerStatistic to update in case it exists.
     */
    where: Prisma.PlayerStatisticWhereUniqueInput;
    /**
     * In case the PlayerStatistic found by the `where` argument doesn't exist, create a new PlayerStatistic with this data.
     */
    create: Prisma.XOR<Prisma.PlayerStatisticCreateInput, Prisma.PlayerStatisticUncheckedCreateInput>;
    /**
     * In case the PlayerStatistic was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.PlayerStatisticUpdateInput, Prisma.PlayerStatisticUncheckedUpdateInput>;
};
/**
 * PlayerStatistic delete
 */
export type PlayerStatisticDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerStatistic
     */
    select?: Prisma.PlayerStatisticSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlayerStatistic
     */
    omit?: Prisma.PlayerStatisticOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerStatisticInclude<ExtArgs> | null;
    /**
     * Filter which PlayerStatistic to delete.
     */
    where: Prisma.PlayerStatisticWhereUniqueInput;
};
/**
 * PlayerStatistic deleteMany
 */
export type PlayerStatisticDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PlayerStatistics to delete
     */
    where?: Prisma.PlayerStatisticWhereInput;
    /**
     * Limit how many PlayerStatistics to delete.
     */
    limit?: number;
};
/**
 * PlayerStatistic without action
 */
export type PlayerStatisticDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerStatistic
     */
    select?: Prisma.PlayerStatisticSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PlayerStatistic
     */
    omit?: Prisma.PlayerStatisticOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PlayerStatisticInclude<ExtArgs> | null;
};
//# sourceMappingURL=PlayerStatistic.d.ts.map