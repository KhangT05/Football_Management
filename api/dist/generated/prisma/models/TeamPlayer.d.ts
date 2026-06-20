import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model TeamPlayer
 *
 */
export type TeamPlayerModel = runtime.Types.Result.DefaultSelection<Prisma.$TeamPlayerPayload>;
export type AggregateTeamPlayer = {
    _count: TeamPlayerCountAggregateOutputType | null;
    _avg: TeamPlayerAvgAggregateOutputType | null;
    _sum: TeamPlayerSumAggregateOutputType | null;
    _min: TeamPlayerMinAggregateOutputType | null;
    _max: TeamPlayerMaxAggregateOutputType | null;
};
export type TeamPlayerAvgAggregateOutputType = {
    id: number | null;
    team_id: number | null;
    player_id: number | null;
    jersey_number: number | null;
    user_id: number | null;
};
export type TeamPlayerSumAggregateOutputType = {
    id: number | null;
    team_id: number | null;
    player_id: number | null;
    jersey_number: number | null;
    user_id: number | null;
};
export type TeamPlayerMinAggregateOutputType = {
    id: number | null;
    team_id: number | null;
    player_id: number | null;
    jersey_number: number | null;
    position: $Enums.PlayerPosition | null;
    role: $Enums.PlayerRole | null;
    status: $Enums.PlayerStatus | null;
    approval_status: $Enums.ApprovalStatus | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    user_id: number | null;
};
export type TeamPlayerMaxAggregateOutputType = {
    id: number | null;
    team_id: number | null;
    player_id: number | null;
    jersey_number: number | null;
    position: $Enums.PlayerPosition | null;
    role: $Enums.PlayerRole | null;
    status: $Enums.PlayerStatus | null;
    approval_status: $Enums.ApprovalStatus | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at: Date | null;
    user_id: number | null;
};
export type TeamPlayerCountAggregateOutputType = {
    id: number;
    team_id: number;
    player_id: number;
    jersey_number: number;
    position: number;
    role: number;
    status: number;
    approval_status: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    user_id: number;
    _all: number;
};
export type TeamPlayerAvgAggregateInputType = {
    id?: true;
    team_id?: true;
    player_id?: true;
    jersey_number?: true;
    user_id?: true;
};
export type TeamPlayerSumAggregateInputType = {
    id?: true;
    team_id?: true;
    player_id?: true;
    jersey_number?: true;
    user_id?: true;
};
export type TeamPlayerMinAggregateInputType = {
    id?: true;
    team_id?: true;
    player_id?: true;
    jersey_number?: true;
    position?: true;
    role?: true;
    status?: true;
    approval_status?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    user_id?: true;
};
export type TeamPlayerMaxAggregateInputType = {
    id?: true;
    team_id?: true;
    player_id?: true;
    jersey_number?: true;
    position?: true;
    role?: true;
    status?: true;
    approval_status?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    user_id?: true;
};
export type TeamPlayerCountAggregateInputType = {
    id?: true;
    team_id?: true;
    player_id?: true;
    jersey_number?: true;
    position?: true;
    role?: true;
    status?: true;
    approval_status?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    deleted_at?: true;
    user_id?: true;
    _all?: true;
};
export type TeamPlayerAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which TeamPlayer to aggregate.
     */
    where?: Prisma.TeamPlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamPlayers to fetch.
     */
    orderBy?: Prisma.TeamPlayerOrderByWithRelationInput | Prisma.TeamPlayerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.TeamPlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamPlayers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamPlayers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned TeamPlayers
    **/
    _count?: true | TeamPlayerCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: TeamPlayerAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: TeamPlayerSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: TeamPlayerMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: TeamPlayerMaxAggregateInputType;
};
export type GetTeamPlayerAggregateType<T extends TeamPlayerAggregateArgs> = {
    [P in keyof T & keyof AggregateTeamPlayer]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTeamPlayer[P]> : Prisma.GetScalarType<T[P], AggregateTeamPlayer[P]>;
};
export type TeamPlayerGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamPlayerWhereInput;
    orderBy?: Prisma.TeamPlayerOrderByWithAggregationInput | Prisma.TeamPlayerOrderByWithAggregationInput[];
    by: Prisma.TeamPlayerScalarFieldEnum[] | Prisma.TeamPlayerScalarFieldEnum;
    having?: Prisma.TeamPlayerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TeamPlayerCountAggregateInputType | true;
    _avg?: TeamPlayerAvgAggregateInputType;
    _sum?: TeamPlayerSumAggregateInputType;
    _min?: TeamPlayerMinAggregateInputType;
    _max?: TeamPlayerMaxAggregateInputType;
};
export type TeamPlayerGroupByOutputType = {
    id: number;
    team_id: number;
    player_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role: $Enums.PlayerRole;
    status: $Enums.PlayerStatus;
    approval_status: $Enums.ApprovalStatus;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    user_id: number | null;
    _count: TeamPlayerCountAggregateOutputType | null;
    _avg: TeamPlayerAvgAggregateOutputType | null;
    _sum: TeamPlayerSumAggregateOutputType | null;
    _min: TeamPlayerMinAggregateOutputType | null;
    _max: TeamPlayerMaxAggregateOutputType | null;
};
export type GetTeamPlayerGroupByPayload<T extends TeamPlayerGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TeamPlayerGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TeamPlayerGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TeamPlayerGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TeamPlayerGroupByOutputType[P]>;
}>>;
export type TeamPlayerWhereInput = {
    AND?: Prisma.TeamPlayerWhereInput | Prisma.TeamPlayerWhereInput[];
    OR?: Prisma.TeamPlayerWhereInput[];
    NOT?: Prisma.TeamPlayerWhereInput | Prisma.TeamPlayerWhereInput[];
    id?: Prisma.IntFilter<"TeamPlayer"> | number;
    team_id?: Prisma.IntFilter<"TeamPlayer"> | number;
    player_id?: Prisma.IntFilter<"TeamPlayer"> | number;
    jersey_number?: Prisma.IntFilter<"TeamPlayer"> | number;
    position?: Prisma.EnumPlayerPositionFilter<"TeamPlayer"> | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFilter<"TeamPlayer"> | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFilter<"TeamPlayer"> | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFilter<"TeamPlayer"> | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFilter<"TeamPlayer"> | boolean;
    created_at?: Prisma.DateTimeFilter<"TeamPlayer"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"TeamPlayer"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"TeamPlayer"> | Date | string | null;
    user_id?: Prisma.IntNullableFilter<"TeamPlayer"> | number | null;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    player?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type TeamPlayerOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approval_status?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    team?: Prisma.TeamOrderByWithRelationInput;
    player?: Prisma.PlayerOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type TeamPlayerWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    team_id_jersey_number?: Prisma.TeamPlayerTeam_idJersey_numberCompoundUniqueInput;
    team_id_player_id?: Prisma.TeamPlayerTeam_idPlayer_idCompoundUniqueInput;
    AND?: Prisma.TeamPlayerWhereInput | Prisma.TeamPlayerWhereInput[];
    OR?: Prisma.TeamPlayerWhereInput[];
    NOT?: Prisma.TeamPlayerWhereInput | Prisma.TeamPlayerWhereInput[];
    team_id?: Prisma.IntFilter<"TeamPlayer"> | number;
    player_id?: Prisma.IntFilter<"TeamPlayer"> | number;
    jersey_number?: Prisma.IntFilter<"TeamPlayer"> | number;
    position?: Prisma.EnumPlayerPositionFilter<"TeamPlayer"> | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFilter<"TeamPlayer"> | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFilter<"TeamPlayer"> | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFilter<"TeamPlayer"> | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFilter<"TeamPlayer"> | boolean;
    created_at?: Prisma.DateTimeFilter<"TeamPlayer"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"TeamPlayer"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"TeamPlayer"> | Date | string | null;
    user_id?: Prisma.IntNullableFilter<"TeamPlayer"> | number | null;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    player?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id" | "team_id_jersey_number" | "team_id_player_id">;
export type TeamPlayerOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approval_status?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TeamPlayerCountOrderByAggregateInput;
    _avg?: Prisma.TeamPlayerAvgOrderByAggregateInput;
    _max?: Prisma.TeamPlayerMaxOrderByAggregateInput;
    _min?: Prisma.TeamPlayerMinOrderByAggregateInput;
    _sum?: Prisma.TeamPlayerSumOrderByAggregateInput;
};
export type TeamPlayerScalarWhereWithAggregatesInput = {
    AND?: Prisma.TeamPlayerScalarWhereWithAggregatesInput | Prisma.TeamPlayerScalarWhereWithAggregatesInput[];
    OR?: Prisma.TeamPlayerScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TeamPlayerScalarWhereWithAggregatesInput | Prisma.TeamPlayerScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"TeamPlayer"> | number;
    team_id?: Prisma.IntWithAggregatesFilter<"TeamPlayer"> | number;
    player_id?: Prisma.IntWithAggregatesFilter<"TeamPlayer"> | number;
    jersey_number?: Prisma.IntWithAggregatesFilter<"TeamPlayer"> | number;
    position?: Prisma.EnumPlayerPositionWithAggregatesFilter<"TeamPlayer"> | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleWithAggregatesFilter<"TeamPlayer"> | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusWithAggregatesFilter<"TeamPlayer"> | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusWithAggregatesFilter<"TeamPlayer"> | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolWithAggregatesFilter<"TeamPlayer"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"TeamPlayer"> | Date | string;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"TeamPlayer"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"TeamPlayer"> | Date | string | null;
    user_id?: Prisma.IntNullableWithAggregatesFilter<"TeamPlayer"> | number | null;
};
export type TeamPlayerCreateInput = {
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role?: $Enums.PlayerRole;
    status?: $Enums.PlayerStatus;
    approval_status?: $Enums.ApprovalStatus;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team: Prisma.TeamCreateNestedOneWithoutTeam_playersInput;
    player: Prisma.PlayerCreateNestedOneWithoutTeam_playersInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamPlayersInput;
};
export type TeamPlayerUncheckedCreateInput = {
    id?: number;
    team_id: number;
    player_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role?: $Enums.PlayerRole;
    status?: $Enums.PlayerStatus;
    approval_status?: $Enums.ApprovalStatus;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
};
export type TeamPlayerUpdateInput = {
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFieldUpdateOperationsInput | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team?: Prisma.TeamUpdateOneRequiredWithoutTeam_playersNestedInput;
    player?: Prisma.PlayerUpdateOneRequiredWithoutTeam_playersNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamPlayersNestedInput;
};
export type TeamPlayerUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFieldUpdateOperationsInput | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type TeamPlayerCreateManyInput = {
    id?: number;
    team_id: number;
    player_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role?: $Enums.PlayerRole;
    status?: $Enums.PlayerStatus;
    approval_status?: $Enums.ApprovalStatus;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
};
export type TeamPlayerUpdateManyMutationInput = {
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFieldUpdateOperationsInput | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TeamPlayerUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFieldUpdateOperationsInput | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type TeamPlayerListRelationFilter = {
    every?: Prisma.TeamPlayerWhereInput;
    some?: Prisma.TeamPlayerWhereInput;
    none?: Prisma.TeamPlayerWhereInput;
};
export type TeamPlayerOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TeamPlayerTeam_idJersey_numberCompoundUniqueInput = {
    team_id: number;
    jersey_number: number;
};
export type TeamPlayerTeam_idPlayer_idCompoundUniqueInput = {
    team_id: number;
    player_id: number;
};
export type TeamPlayerCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approval_status?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TeamPlayerAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TeamPlayerMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approval_status?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TeamPlayerMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approval_status?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TeamPlayerSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    team_id?: Prisma.SortOrder;
    player_id?: Prisma.SortOrder;
    jersey_number?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type TeamPlayerCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutUserInput, Prisma.TeamPlayerUncheckedCreateWithoutUserInput> | Prisma.TeamPlayerCreateWithoutUserInput[] | Prisma.TeamPlayerUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutUserInput | Prisma.TeamPlayerCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TeamPlayerCreateManyUserInputEnvelope;
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
};
export type TeamPlayerUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutUserInput, Prisma.TeamPlayerUncheckedCreateWithoutUserInput> | Prisma.TeamPlayerCreateWithoutUserInput[] | Prisma.TeamPlayerUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutUserInput | Prisma.TeamPlayerCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TeamPlayerCreateManyUserInputEnvelope;
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
};
export type TeamPlayerUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutUserInput, Prisma.TeamPlayerUncheckedCreateWithoutUserInput> | Prisma.TeamPlayerCreateWithoutUserInput[] | Prisma.TeamPlayerUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutUserInput | Prisma.TeamPlayerCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TeamPlayerUpsertWithWhereUniqueWithoutUserInput | Prisma.TeamPlayerUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TeamPlayerCreateManyUserInputEnvelope;
    set?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    delete?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    update?: Prisma.TeamPlayerUpdateWithWhereUniqueWithoutUserInput | Prisma.TeamPlayerUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TeamPlayerUpdateManyWithWhereWithoutUserInput | Prisma.TeamPlayerUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
};
export type TeamPlayerUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutUserInput, Prisma.TeamPlayerUncheckedCreateWithoutUserInput> | Prisma.TeamPlayerCreateWithoutUserInput[] | Prisma.TeamPlayerUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutUserInput | Prisma.TeamPlayerCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TeamPlayerUpsertWithWhereUniqueWithoutUserInput | Prisma.TeamPlayerUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TeamPlayerCreateManyUserInputEnvelope;
    set?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    delete?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    update?: Prisma.TeamPlayerUpdateWithWhereUniqueWithoutUserInput | Prisma.TeamPlayerUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TeamPlayerUpdateManyWithWhereWithoutUserInput | Prisma.TeamPlayerUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
};
export type TeamPlayerCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutTeamInput, Prisma.TeamPlayerUncheckedCreateWithoutTeamInput> | Prisma.TeamPlayerCreateWithoutTeamInput[] | Prisma.TeamPlayerUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutTeamInput | Prisma.TeamPlayerCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.TeamPlayerCreateManyTeamInputEnvelope;
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
};
export type TeamPlayerUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutTeamInput, Prisma.TeamPlayerUncheckedCreateWithoutTeamInput> | Prisma.TeamPlayerCreateWithoutTeamInput[] | Prisma.TeamPlayerUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutTeamInput | Prisma.TeamPlayerCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.TeamPlayerCreateManyTeamInputEnvelope;
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
};
export type TeamPlayerUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutTeamInput, Prisma.TeamPlayerUncheckedCreateWithoutTeamInput> | Prisma.TeamPlayerCreateWithoutTeamInput[] | Prisma.TeamPlayerUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutTeamInput | Prisma.TeamPlayerCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.TeamPlayerUpsertWithWhereUniqueWithoutTeamInput | Prisma.TeamPlayerUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.TeamPlayerCreateManyTeamInputEnvelope;
    set?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    delete?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    update?: Prisma.TeamPlayerUpdateWithWhereUniqueWithoutTeamInput | Prisma.TeamPlayerUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.TeamPlayerUpdateManyWithWhereWithoutTeamInput | Prisma.TeamPlayerUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
};
export type TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutTeamInput, Prisma.TeamPlayerUncheckedCreateWithoutTeamInput> | Prisma.TeamPlayerCreateWithoutTeamInput[] | Prisma.TeamPlayerUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutTeamInput | Prisma.TeamPlayerCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.TeamPlayerUpsertWithWhereUniqueWithoutTeamInput | Prisma.TeamPlayerUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.TeamPlayerCreateManyTeamInputEnvelope;
    set?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    delete?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    update?: Prisma.TeamPlayerUpdateWithWhereUniqueWithoutTeamInput | Prisma.TeamPlayerUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.TeamPlayerUpdateManyWithWhereWithoutTeamInput | Prisma.TeamPlayerUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
};
export type TeamPlayerCreateNestedManyWithoutPlayerInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutPlayerInput, Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput> | Prisma.TeamPlayerCreateWithoutPlayerInput[] | Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput | Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput[];
    createMany?: Prisma.TeamPlayerCreateManyPlayerInputEnvelope;
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
};
export type TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutPlayerInput, Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput> | Prisma.TeamPlayerCreateWithoutPlayerInput[] | Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput | Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput[];
    createMany?: Prisma.TeamPlayerCreateManyPlayerInputEnvelope;
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
};
export type TeamPlayerUpdateManyWithoutPlayerNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutPlayerInput, Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput> | Prisma.TeamPlayerCreateWithoutPlayerInput[] | Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput | Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput[];
    upsert?: Prisma.TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput | Prisma.TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput[];
    createMany?: Prisma.TeamPlayerCreateManyPlayerInputEnvelope;
    set?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    delete?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    update?: Prisma.TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput | Prisma.TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput[];
    updateMany?: Prisma.TeamPlayerUpdateManyWithWhereWithoutPlayerInput | Prisma.TeamPlayerUpdateManyWithWhereWithoutPlayerInput[];
    deleteMany?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
};
export type TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutPlayerInput, Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput> | Prisma.TeamPlayerCreateWithoutPlayerInput[] | Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput | Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput[];
    upsert?: Prisma.TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput | Prisma.TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput[];
    createMany?: Prisma.TeamPlayerCreateManyPlayerInputEnvelope;
    set?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    delete?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    update?: Prisma.TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput | Prisma.TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput[];
    updateMany?: Prisma.TeamPlayerUpdateManyWithWhereWithoutPlayerInput | Prisma.TeamPlayerUpdateManyWithWhereWithoutPlayerInput[];
    deleteMany?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
};
export type EnumPlayerRoleFieldUpdateOperationsInput = {
    set?: $Enums.PlayerRole;
};
export type EnumPlayerStatusFieldUpdateOperationsInput = {
    set?: $Enums.PlayerStatus;
};
export type EnumApprovalStatusFieldUpdateOperationsInput = {
    set?: $Enums.ApprovalStatus;
};
export type TeamPlayerCreateWithoutUserInput = {
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role?: $Enums.PlayerRole;
    status?: $Enums.PlayerStatus;
    approval_status?: $Enums.ApprovalStatus;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team: Prisma.TeamCreateNestedOneWithoutTeam_playersInput;
    player: Prisma.PlayerCreateNestedOneWithoutTeam_playersInput;
};
export type TeamPlayerUncheckedCreateWithoutUserInput = {
    id?: number;
    team_id: number;
    player_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role?: $Enums.PlayerRole;
    status?: $Enums.PlayerStatus;
    approval_status?: $Enums.ApprovalStatus;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type TeamPlayerCreateOrConnectWithoutUserInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamPlayerCreateWithoutUserInput, Prisma.TeamPlayerUncheckedCreateWithoutUserInput>;
};
export type TeamPlayerCreateManyUserInputEnvelope = {
    data: Prisma.TeamPlayerCreateManyUserInput | Prisma.TeamPlayerCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type TeamPlayerUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamPlayerUpdateWithoutUserInput, Prisma.TeamPlayerUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TeamPlayerCreateWithoutUserInput, Prisma.TeamPlayerUncheckedCreateWithoutUserInput>;
};
export type TeamPlayerUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamPlayerUpdateWithoutUserInput, Prisma.TeamPlayerUncheckedUpdateWithoutUserInput>;
};
export type TeamPlayerUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.TeamPlayerScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamPlayerUpdateManyMutationInput, Prisma.TeamPlayerUncheckedUpdateManyWithoutUserInput>;
};
export type TeamPlayerScalarWhereInput = {
    AND?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
    OR?: Prisma.TeamPlayerScalarWhereInput[];
    NOT?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
    id?: Prisma.IntFilter<"TeamPlayer"> | number;
    team_id?: Prisma.IntFilter<"TeamPlayer"> | number;
    player_id?: Prisma.IntFilter<"TeamPlayer"> | number;
    jersey_number?: Prisma.IntFilter<"TeamPlayer"> | number;
    position?: Prisma.EnumPlayerPositionFilter<"TeamPlayer"> | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFilter<"TeamPlayer"> | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFilter<"TeamPlayer"> | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFilter<"TeamPlayer"> | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFilter<"TeamPlayer"> | boolean;
    created_at?: Prisma.DateTimeFilter<"TeamPlayer"> | Date | string;
    updated_at?: Prisma.DateTimeNullableFilter<"TeamPlayer"> | Date | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"TeamPlayer"> | Date | string | null;
    user_id?: Prisma.IntNullableFilter<"TeamPlayer"> | number | null;
};
export type TeamPlayerCreateWithoutTeamInput = {
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role?: $Enums.PlayerRole;
    status?: $Enums.PlayerStatus;
    approval_status?: $Enums.ApprovalStatus;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    player: Prisma.PlayerCreateNestedOneWithoutTeam_playersInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamPlayersInput;
};
export type TeamPlayerUncheckedCreateWithoutTeamInput = {
    id?: number;
    player_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role?: $Enums.PlayerRole;
    status?: $Enums.PlayerStatus;
    approval_status?: $Enums.ApprovalStatus;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
};
export type TeamPlayerCreateOrConnectWithoutTeamInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamPlayerCreateWithoutTeamInput, Prisma.TeamPlayerUncheckedCreateWithoutTeamInput>;
};
export type TeamPlayerCreateManyTeamInputEnvelope = {
    data: Prisma.TeamPlayerCreateManyTeamInput | Prisma.TeamPlayerCreateManyTeamInput[];
    skipDuplicates?: boolean;
};
export type TeamPlayerUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamPlayerUpdateWithoutTeamInput, Prisma.TeamPlayerUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.TeamPlayerCreateWithoutTeamInput, Prisma.TeamPlayerUncheckedCreateWithoutTeamInput>;
};
export type TeamPlayerUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamPlayerUpdateWithoutTeamInput, Prisma.TeamPlayerUncheckedUpdateWithoutTeamInput>;
};
export type TeamPlayerUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.TeamPlayerScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamPlayerUpdateManyMutationInput, Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamInput>;
};
export type TeamPlayerCreateWithoutPlayerInput = {
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role?: $Enums.PlayerRole;
    status?: $Enums.PlayerStatus;
    approval_status?: $Enums.ApprovalStatus;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    team: Prisma.TeamCreateNestedOneWithoutTeam_playersInput;
    user?: Prisma.UserCreateNestedOneWithoutTeamPlayersInput;
};
export type TeamPlayerUncheckedCreateWithoutPlayerInput = {
    id?: number;
    team_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role?: $Enums.PlayerRole;
    status?: $Enums.PlayerStatus;
    approval_status?: $Enums.ApprovalStatus;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
};
export type TeamPlayerCreateOrConnectWithoutPlayerInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamPlayerCreateWithoutPlayerInput, Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput>;
};
export type TeamPlayerCreateManyPlayerInputEnvelope = {
    data: Prisma.TeamPlayerCreateManyPlayerInput | Prisma.TeamPlayerCreateManyPlayerInput[];
    skipDuplicates?: boolean;
};
export type TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamPlayerUpdateWithoutPlayerInput, Prisma.TeamPlayerUncheckedUpdateWithoutPlayerInput>;
    create: Prisma.XOR<Prisma.TeamPlayerCreateWithoutPlayerInput, Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput>;
};
export type TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamPlayerUpdateWithoutPlayerInput, Prisma.TeamPlayerUncheckedUpdateWithoutPlayerInput>;
};
export type TeamPlayerUpdateManyWithWhereWithoutPlayerInput = {
    where: Prisma.TeamPlayerScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamPlayerUpdateManyMutationInput, Prisma.TeamPlayerUncheckedUpdateManyWithoutPlayerInput>;
};
export type TeamPlayerCreateManyUserInput = {
    id?: number;
    team_id: number;
    player_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role?: $Enums.PlayerRole;
    status?: $Enums.PlayerStatus;
    approval_status?: $Enums.ApprovalStatus;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
};
export type TeamPlayerUpdateWithoutUserInput = {
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFieldUpdateOperationsInput | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team?: Prisma.TeamUpdateOneRequiredWithoutTeam_playersNestedInput;
    player?: Prisma.PlayerUpdateOneRequiredWithoutTeam_playersNestedInput;
};
export type TeamPlayerUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFieldUpdateOperationsInput | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TeamPlayerUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFieldUpdateOperationsInput | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TeamPlayerCreateManyTeamInput = {
    id?: number;
    player_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role?: $Enums.PlayerRole;
    status?: $Enums.PlayerStatus;
    approval_status?: $Enums.ApprovalStatus;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
};
export type TeamPlayerUpdateWithoutTeamInput = {
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFieldUpdateOperationsInput | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    player?: Prisma.PlayerUpdateOneRequiredWithoutTeam_playersNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamPlayersNestedInput;
};
export type TeamPlayerUncheckedUpdateWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFieldUpdateOperationsInput | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type TeamPlayerUncheckedUpdateManyWithoutTeamInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    player_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFieldUpdateOperationsInput | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type TeamPlayerCreateManyPlayerInput = {
    id?: number;
    team_id: number;
    jersey_number: number;
    position: $Enums.PlayerPosition;
    role?: $Enums.PlayerRole;
    status?: $Enums.PlayerStatus;
    approval_status?: $Enums.ApprovalStatus;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string | null;
    deleted_at?: Date | string | null;
    user_id?: number | null;
};
export type TeamPlayerUpdateWithoutPlayerInput = {
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFieldUpdateOperationsInput | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    team?: Prisma.TeamUpdateOneRequiredWithoutTeam_playersNestedInput;
    user?: Prisma.UserUpdateOneWithoutTeamPlayersNestedInput;
};
export type TeamPlayerUncheckedUpdateWithoutPlayerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFieldUpdateOperationsInput | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type TeamPlayerUncheckedUpdateManyWithoutPlayerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    team_id?: Prisma.IntFieldUpdateOperationsInput | number;
    jersey_number?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumPlayerPositionFieldUpdateOperationsInput | $Enums.PlayerPosition;
    role?: Prisma.EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole;
    status?: Prisma.EnumPlayerStatusFieldUpdateOperationsInput | $Enums.PlayerStatus;
    approval_status?: Prisma.EnumApprovalStatusFieldUpdateOperationsInput | $Enums.ApprovalStatus;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_id?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type TeamPlayerSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    team_id?: boolean;
    player_id?: boolean;
    jersey_number?: boolean;
    position?: boolean;
    role?: boolean;
    status?: boolean;
    approval_status?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    user_id?: boolean;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.TeamPlayer$userArgs<ExtArgs>;
}, ExtArgs["result"]["teamPlayer"]>;
export type TeamPlayerSelectScalar = {
    id?: boolean;
    team_id?: boolean;
    player_id?: boolean;
    jersey_number?: boolean;
    position?: boolean;
    role?: boolean;
    status?: boolean;
    approval_status?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    deleted_at?: boolean;
    user_id?: boolean;
};
export type TeamPlayerOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "team_id" | "player_id" | "jersey_number" | "position" | "role" | "status" | "approval_status" | "is_active" | "created_at" | "updated_at" | "deleted_at" | "user_id", ExtArgs["result"]["teamPlayer"]>;
export type TeamPlayerInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.TeamPlayer$userArgs<ExtArgs>;
};
export type $TeamPlayerPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TeamPlayer";
    objects: {
        team: Prisma.$TeamPayload<ExtArgs>;
        player: Prisma.$PlayerPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        team_id: number;
        player_id: number;
        jersey_number: number;
        position: $Enums.PlayerPosition;
        role: $Enums.PlayerRole;
        status: $Enums.PlayerStatus;
        approval_status: $Enums.ApprovalStatus;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
        user_id: number | null;
    }, ExtArgs["result"]["teamPlayer"]>;
    composites: {};
};
export type TeamPlayerGetPayload<S extends boolean | null | undefined | TeamPlayerDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload, S>;
export type TeamPlayerCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TeamPlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TeamPlayerCountAggregateInputType | true;
};
export interface TeamPlayerDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TeamPlayer'];
        meta: {
            name: 'TeamPlayer';
        };
    };
    /**
     * Find zero or one TeamPlayer that matches the filter.
     * @param {TeamPlayerFindUniqueArgs} args - Arguments to find a TeamPlayer
     * @example
     * // Get one TeamPlayer
     * const teamPlayer = await prisma.teamPlayer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamPlayerFindUniqueArgs>(args: Prisma.SelectSubset<T, TeamPlayerFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one TeamPlayer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamPlayerFindUniqueOrThrowArgs} args - Arguments to find a TeamPlayer
     * @example
     * // Get one TeamPlayer
     * const teamPlayer = await prisma.teamPlayer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamPlayerFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TeamPlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first TeamPlayer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerFindFirstArgs} args - Arguments to find a TeamPlayer
     * @example
     * // Get one TeamPlayer
     * const teamPlayer = await prisma.teamPlayer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamPlayerFindFirstArgs>(args?: Prisma.SelectSubset<T, TeamPlayerFindFirstArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first TeamPlayer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerFindFirstOrThrowArgs} args - Arguments to find a TeamPlayer
     * @example
     * // Get one TeamPlayer
     * const teamPlayer = await prisma.teamPlayer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamPlayerFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TeamPlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more TeamPlayers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TeamPlayers
     * const teamPlayers = await prisma.teamPlayer.findMany()
     *
     * // Get first 10 TeamPlayers
     * const teamPlayers = await prisma.teamPlayer.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const teamPlayerWithIdOnly = await prisma.teamPlayer.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TeamPlayerFindManyArgs>(args?: Prisma.SelectSubset<T, TeamPlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a TeamPlayer.
     * @param {TeamPlayerCreateArgs} args - Arguments to create a TeamPlayer.
     * @example
     * // Create one TeamPlayer
     * const TeamPlayer = await prisma.teamPlayer.create({
     *   data: {
     *     // ... data to create a TeamPlayer
     *   }
     * })
     *
     */
    create<T extends TeamPlayerCreateArgs>(args: Prisma.SelectSubset<T, TeamPlayerCreateArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many TeamPlayers.
     * @param {TeamPlayerCreateManyArgs} args - Arguments to create many TeamPlayers.
     * @example
     * // Create many TeamPlayers
     * const teamPlayer = await prisma.teamPlayer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TeamPlayerCreateManyArgs>(args?: Prisma.SelectSubset<T, TeamPlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a TeamPlayer.
     * @param {TeamPlayerDeleteArgs} args - Arguments to delete one TeamPlayer.
     * @example
     * // Delete one TeamPlayer
     * const TeamPlayer = await prisma.teamPlayer.delete({
     *   where: {
     *     // ... filter to delete one TeamPlayer
     *   }
     * })
     *
     */
    delete<T extends TeamPlayerDeleteArgs>(args: Prisma.SelectSubset<T, TeamPlayerDeleteArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one TeamPlayer.
     * @param {TeamPlayerUpdateArgs} args - Arguments to update one TeamPlayer.
     * @example
     * // Update one TeamPlayer
     * const teamPlayer = await prisma.teamPlayer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TeamPlayerUpdateArgs>(args: Prisma.SelectSubset<T, TeamPlayerUpdateArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more TeamPlayers.
     * @param {TeamPlayerDeleteManyArgs} args - Arguments to filter TeamPlayers to delete.
     * @example
     * // Delete a few TeamPlayers
     * const { count } = await prisma.teamPlayer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TeamPlayerDeleteManyArgs>(args?: Prisma.SelectSubset<T, TeamPlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more TeamPlayers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TeamPlayers
     * const teamPlayer = await prisma.teamPlayer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TeamPlayerUpdateManyArgs>(args: Prisma.SelectSubset<T, TeamPlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one TeamPlayer.
     * @param {TeamPlayerUpsertArgs} args - Arguments to update or create a TeamPlayer.
     * @example
     * // Update or create a TeamPlayer
     * const teamPlayer = await prisma.teamPlayer.upsert({
     *   create: {
     *     // ... data to create a TeamPlayer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TeamPlayer we want to update
     *   }
     * })
     */
    upsert<T extends TeamPlayerUpsertArgs>(args: Prisma.SelectSubset<T, TeamPlayerUpsertArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of TeamPlayers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerCountArgs} args - Arguments to filter TeamPlayers to count.
     * @example
     * // Count the number of TeamPlayers
     * const count = await prisma.teamPlayer.count({
     *   where: {
     *     // ... the filter for the TeamPlayers we want to count
     *   }
     * })
    **/
    count<T extends TeamPlayerCountArgs>(args?: Prisma.Subset<T, TeamPlayerCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TeamPlayerCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a TeamPlayer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TeamPlayerAggregateArgs>(args: Prisma.Subset<T, TeamPlayerAggregateArgs>): Prisma.PrismaPromise<GetTeamPlayerAggregateType<T>>;
    /**
     * Group by TeamPlayer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerGroupByArgs} args - Group by arguments.
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
    groupBy<T extends TeamPlayerGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TeamPlayerGroupByArgs['orderBy'];
    } : {
        orderBy?: TeamPlayerGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TeamPlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the TeamPlayer model
     */
    readonly fields: TeamPlayerFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for TeamPlayer.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__TeamPlayerClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    team<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    player<T extends Prisma.PlayerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PlayerDefaultArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.TeamPlayer$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamPlayer$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the TeamPlayer model
 */
export interface TeamPlayerFieldRefs {
    readonly id: Prisma.FieldRef<"TeamPlayer", 'Int'>;
    readonly team_id: Prisma.FieldRef<"TeamPlayer", 'Int'>;
    readonly player_id: Prisma.FieldRef<"TeamPlayer", 'Int'>;
    readonly jersey_number: Prisma.FieldRef<"TeamPlayer", 'Int'>;
    readonly position: Prisma.FieldRef<"TeamPlayer", 'PlayerPosition'>;
    readonly role: Prisma.FieldRef<"TeamPlayer", 'PlayerRole'>;
    readonly status: Prisma.FieldRef<"TeamPlayer", 'PlayerStatus'>;
    readonly approval_status: Prisma.FieldRef<"TeamPlayer", 'ApprovalStatus'>;
    readonly is_active: Prisma.FieldRef<"TeamPlayer", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"TeamPlayer", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"TeamPlayer", 'DateTime'>;
    readonly deleted_at: Prisma.FieldRef<"TeamPlayer", 'DateTime'>;
    readonly user_id: Prisma.FieldRef<"TeamPlayer", 'Int'>;
}
/**
 * TeamPlayer findUnique
 */
export type TeamPlayerFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    /**
     * Filter, which TeamPlayer to fetch.
     */
    where: Prisma.TeamPlayerWhereUniqueInput;
};
/**
 * TeamPlayer findUniqueOrThrow
 */
export type TeamPlayerFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    /**
     * Filter, which TeamPlayer to fetch.
     */
    where: Prisma.TeamPlayerWhereUniqueInput;
};
/**
 * TeamPlayer findFirst
 */
export type TeamPlayerFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    /**
     * Filter, which TeamPlayer to fetch.
     */
    where?: Prisma.TeamPlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamPlayers to fetch.
     */
    orderBy?: Prisma.TeamPlayerOrderByWithRelationInput | Prisma.TeamPlayerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TeamPlayers.
     */
    cursor?: Prisma.TeamPlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamPlayers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamPlayers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TeamPlayers.
     */
    distinct?: Prisma.TeamPlayerScalarFieldEnum | Prisma.TeamPlayerScalarFieldEnum[];
};
/**
 * TeamPlayer findFirstOrThrow
 */
export type TeamPlayerFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    /**
     * Filter, which TeamPlayer to fetch.
     */
    where?: Prisma.TeamPlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamPlayers to fetch.
     */
    orderBy?: Prisma.TeamPlayerOrderByWithRelationInput | Prisma.TeamPlayerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TeamPlayers.
     */
    cursor?: Prisma.TeamPlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamPlayers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamPlayers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TeamPlayers.
     */
    distinct?: Prisma.TeamPlayerScalarFieldEnum | Prisma.TeamPlayerScalarFieldEnum[];
};
/**
 * TeamPlayer findMany
 */
export type TeamPlayerFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    /**
     * Filter, which TeamPlayers to fetch.
     */
    where?: Prisma.TeamPlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TeamPlayers to fetch.
     */
    orderBy?: Prisma.TeamPlayerOrderByWithRelationInput | Prisma.TeamPlayerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing TeamPlayers.
     */
    cursor?: Prisma.TeamPlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TeamPlayers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TeamPlayers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TeamPlayers.
     */
    distinct?: Prisma.TeamPlayerScalarFieldEnum | Prisma.TeamPlayerScalarFieldEnum[];
};
/**
 * TeamPlayer create
 */
export type TeamPlayerCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    /**
     * The data needed to create a TeamPlayer.
     */
    data: Prisma.XOR<Prisma.TeamPlayerCreateInput, Prisma.TeamPlayerUncheckedCreateInput>;
};
/**
 * TeamPlayer createMany
 */
export type TeamPlayerCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many TeamPlayers.
     */
    data: Prisma.TeamPlayerCreateManyInput | Prisma.TeamPlayerCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * TeamPlayer update
 */
export type TeamPlayerUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    /**
     * The data needed to update a TeamPlayer.
     */
    data: Prisma.XOR<Prisma.TeamPlayerUpdateInput, Prisma.TeamPlayerUncheckedUpdateInput>;
    /**
     * Choose, which TeamPlayer to update.
     */
    where: Prisma.TeamPlayerWhereUniqueInput;
};
/**
 * TeamPlayer updateMany
 */
export type TeamPlayerUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update TeamPlayers.
     */
    data: Prisma.XOR<Prisma.TeamPlayerUpdateManyMutationInput, Prisma.TeamPlayerUncheckedUpdateManyInput>;
    /**
     * Filter which TeamPlayers to update
     */
    where?: Prisma.TeamPlayerWhereInput;
    /**
     * Limit how many TeamPlayers to update.
     */
    limit?: number;
};
/**
 * TeamPlayer upsert
 */
export type TeamPlayerUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    /**
     * The filter to search for the TeamPlayer to update in case it exists.
     */
    where: Prisma.TeamPlayerWhereUniqueInput;
    /**
     * In case the TeamPlayer found by the `where` argument doesn't exist, create a new TeamPlayer with this data.
     */
    create: Prisma.XOR<Prisma.TeamPlayerCreateInput, Prisma.TeamPlayerUncheckedCreateInput>;
    /**
     * In case the TeamPlayer was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.TeamPlayerUpdateInput, Prisma.TeamPlayerUncheckedUpdateInput>;
};
/**
 * TeamPlayer delete
 */
export type TeamPlayerDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    /**
     * Filter which TeamPlayer to delete.
     */
    where: Prisma.TeamPlayerWhereUniqueInput;
};
/**
 * TeamPlayer deleteMany
 */
export type TeamPlayerDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which TeamPlayers to delete
     */
    where?: Prisma.TeamPlayerWhereInput;
    /**
     * Limit how many TeamPlayers to delete.
     */
    limit?: number;
};
/**
 * TeamPlayer.user
 */
export type TeamPlayer$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
/**
 * TeamPlayer without action
 */
export type TeamPlayerDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
};
//# sourceMappingURL=TeamPlayer.d.ts.map