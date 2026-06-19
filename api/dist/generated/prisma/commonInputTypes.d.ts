import type * as runtime from "@prisma/client/runtime/client";
import * as $Enums from "./enums.js";
import type * as Prisma from "./internal/prismaNamespace.js";
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | null;
    notIn?: Date[] | string[] | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | null;
    notIn?: Date[] | string[] | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type JsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>, Required<JsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>;
export type JsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string;
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue;
    lte?: runtime.InputJsonValue;
    gt?: runtime.InputJsonValue;
    gte?: runtime.InputJsonValue;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type JsonWithAggregatesFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>, Required<JsonWithAggregatesFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;
export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string;
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue;
    lte?: runtime.InputJsonValue;
    gt?: runtime.InputJsonValue;
    gte?: runtime.InputJsonValue;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedJsonFilter<$PrismaModel>;
    _max?: Prisma.NestedJsonFilter<$PrismaModel>;
};
export type EnumPhaseTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseType | Prisma.EnumPhaseTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.PhaseType[];
    notIn?: $Enums.PhaseType[];
    not?: Prisma.NestedEnumPhaseTypeFilter<$PrismaModel> | $Enums.PhaseType;
};
export type EnumPhaseFormatFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseFormat | Prisma.EnumPhaseFormatFieldRefInput<$PrismaModel>;
    in?: $Enums.PhaseFormat[];
    notIn?: $Enums.PhaseFormat[];
    not?: Prisma.NestedEnumPhaseFormatFilter<$PrismaModel> | $Enums.PhaseFormat;
};
export type EnumPhaseStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseStatus | Prisma.EnumPhaseStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PhaseStatus[];
    notIn?: $Enums.PhaseStatus[];
    not?: Prisma.NestedEnumPhaseStatusFilter<$PrismaModel> | $Enums.PhaseStatus;
};
export type EnumPhaseTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseType | Prisma.EnumPhaseTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.PhaseType[];
    notIn?: $Enums.PhaseType[];
    not?: Prisma.NestedEnumPhaseTypeWithAggregatesFilter<$PrismaModel> | $Enums.PhaseType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPhaseTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPhaseTypeFilter<$PrismaModel>;
};
export type EnumPhaseFormatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseFormat | Prisma.EnumPhaseFormatFieldRefInput<$PrismaModel>;
    in?: $Enums.PhaseFormat[];
    notIn?: $Enums.PhaseFormat[];
    not?: Prisma.NestedEnumPhaseFormatWithAggregatesFilter<$PrismaModel> | $Enums.PhaseFormat;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPhaseFormatFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPhaseFormatFilter<$PrismaModel>;
};
export type EnumPhaseStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseStatus | Prisma.EnumPhaseStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PhaseStatus[];
    notIn?: $Enums.PhaseStatus[];
    not?: Prisma.NestedEnumPhaseStatusWithAggregatesFilter<$PrismaModel> | $Enums.PhaseStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPhaseStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPhaseStatusFilter<$PrismaModel>;
};
export type EnumSeasonStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SeasonStatus | Prisma.EnumSeasonStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SeasonStatus[];
    notIn?: $Enums.SeasonStatus[];
    not?: Prisma.NestedEnumSeasonStatusFilter<$PrismaModel> | $Enums.SeasonStatus;
};
export type DecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type EnumSeasonStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SeasonStatus | Prisma.EnumSeasonStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SeasonStatus[];
    notIn?: $Enums.SeasonStatus[];
    not?: Prisma.NestedEnumSeasonStatusWithAggregatesFilter<$PrismaModel> | $Enums.SeasonStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSeasonStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSeasonStatusFilter<$PrismaModel>;
};
export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type EnumPlayerPositionFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerPosition | Prisma.EnumPlayerPositionFieldRefInput<$PrismaModel>;
    in?: $Enums.PlayerPosition[];
    notIn?: $Enums.PlayerPosition[];
    not?: Prisma.NestedEnumPlayerPositionFilter<$PrismaModel> | $Enums.PlayerPosition;
};
export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type EnumPlayerPositionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerPosition | Prisma.EnumPlayerPositionFieldRefInput<$PrismaModel>;
    in?: $Enums.PlayerPosition[];
    notIn?: $Enums.PlayerPosition[];
    not?: Prisma.NestedEnumPlayerPositionWithAggregatesFilter<$PrismaModel> | $Enums.PlayerPosition;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPlayerPositionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPlayerPositionFilter<$PrismaModel>;
};
export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type EnumPlayerRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerRole | Prisma.EnumPlayerRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.PlayerRole[];
    notIn?: $Enums.PlayerRole[];
    not?: Prisma.NestedEnumPlayerRoleFilter<$PrismaModel> | $Enums.PlayerRole;
};
export type EnumPlayerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerStatus | Prisma.EnumPlayerStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PlayerStatus[];
    notIn?: $Enums.PlayerStatus[];
    not?: Prisma.NestedEnumPlayerStatusFilter<$PrismaModel> | $Enums.PlayerStatus;
};
export type EnumApprovalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApprovalStatus | Prisma.EnumApprovalStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ApprovalStatus[];
    notIn?: $Enums.ApprovalStatus[];
    not?: Prisma.NestedEnumApprovalStatusFilter<$PrismaModel> | $Enums.ApprovalStatus;
};
export type EnumPlayerRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerRole | Prisma.EnumPlayerRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.PlayerRole[];
    notIn?: $Enums.PlayerRole[];
    not?: Prisma.NestedEnumPlayerRoleWithAggregatesFilter<$PrismaModel> | $Enums.PlayerRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPlayerRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPlayerRoleFilter<$PrismaModel>;
};
export type EnumPlayerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerStatus | Prisma.EnumPlayerStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PlayerStatus[];
    notIn?: $Enums.PlayerStatus[];
    not?: Prisma.NestedEnumPlayerStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlayerStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPlayerStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPlayerStatusFilter<$PrismaModel>;
};
export type EnumApprovalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApprovalStatus | Prisma.EnumApprovalStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ApprovalStatus[];
    notIn?: $Enums.ApprovalStatus[];
    not?: Prisma.NestedEnumApprovalStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApprovalStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumApprovalStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumApprovalStatusFilter<$PrismaModel>;
};
export type EnumSeasonTeamStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SeasonTeamStatus | Prisma.EnumSeasonTeamStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SeasonTeamStatus[];
    notIn?: $Enums.SeasonTeamStatus[];
    not?: Prisma.NestedEnumSeasonTeamStatusFilter<$PrismaModel> | $Enums.SeasonTeamStatus;
};
export type EnumSeasonTeamStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SeasonTeamStatus | Prisma.EnumSeasonTeamStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SeasonTeamStatus[];
    notIn?: $Enums.SeasonTeamStatus[];
    not?: Prisma.NestedEnumSeasonTeamStatusWithAggregatesFilter<$PrismaModel> | $Enums.SeasonTeamStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSeasonTeamStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSeasonTeamStatusFilter<$PrismaModel>;
};
export type EnumMatchStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchStatus | Prisma.EnumMatchStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchStatus[];
    notIn?: $Enums.MatchStatus[];
    not?: Prisma.NestedEnumMatchStatusFilter<$PrismaModel> | $Enums.MatchStatus;
};
export type EnumMatchStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchStatus | Prisma.EnumMatchStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchStatus[];
    notIn?: $Enums.MatchStatus[];
    not?: Prisma.NestedEnumMatchStatusWithAggregatesFilter<$PrismaModel> | $Enums.MatchStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMatchStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMatchStatusFilter<$PrismaModel>;
};
export type EnumMatchEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchEventType | Prisma.EnumMatchEventTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchEventType[];
    notIn?: $Enums.MatchEventType[];
    not?: Prisma.NestedEnumMatchEventTypeFilter<$PrismaModel> | $Enums.MatchEventType;
};
export type EnumMatchPeriodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchPeriod | Prisma.EnumMatchPeriodFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MatchPeriod[] | null;
    notIn?: $Enums.MatchPeriod[] | null;
    not?: Prisma.NestedEnumMatchPeriodNullableFilter<$PrismaModel> | $Enums.MatchPeriod | null;
};
export type EnumCardColorNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.CardColor | Prisma.EnumCardColorFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CardColor[] | null;
    notIn?: $Enums.CardColor[] | null;
    not?: Prisma.NestedEnumCardColorNullableFilter<$PrismaModel> | $Enums.CardColor | null;
};
export type EnumMatchEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchEventType | Prisma.EnumMatchEventTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchEventType[];
    notIn?: $Enums.MatchEventType[];
    not?: Prisma.NestedEnumMatchEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.MatchEventType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMatchEventTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMatchEventTypeFilter<$PrismaModel>;
};
export type EnumMatchPeriodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchPeriod | Prisma.EnumMatchPeriodFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MatchPeriod[] | null;
    notIn?: $Enums.MatchPeriod[] | null;
    not?: Prisma.NestedEnumMatchPeriodNullableWithAggregatesFilter<$PrismaModel> | $Enums.MatchPeriod | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMatchPeriodNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMatchPeriodNullableFilter<$PrismaModel>;
};
export type EnumCardColorNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CardColor | Prisma.EnumCardColorFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CardColor[] | null;
    notIn?: $Enums.CardColor[] | null;
    not?: Prisma.NestedEnumCardColorNullableWithAggregatesFilter<$PrismaModel> | $Enums.CardColor | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCardColorNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCardColorNullableFilter<$PrismaModel>;
};
export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[];
    notIn?: $Enums.NotificationType[];
    not?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType;
};
export type EnumNotificationSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationSource | Prisma.EnumNotificationSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationSource[];
    notIn?: $Enums.NotificationSource[];
    not?: Prisma.NestedEnumNotificationSourceFilter<$PrismaModel> | $Enums.NotificationSource;
};
export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[];
    notIn?: $Enums.NotificationType[];
    not?: Prisma.NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
};
export type EnumNotificationSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationSource | Prisma.EnumNotificationSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationSource[];
    notIn?: $Enums.NotificationSource[];
    not?: Prisma.NestedEnumNotificationSourceWithAggregatesFilter<$PrismaModel> | $Enums.NotificationSource;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationSourceFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationSourceFilter<$PrismaModel>;
};
export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | Prisma.EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentStatus[];
    notIn?: $Enums.PaymentStatus[];
    not?: Prisma.NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus;
};
export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | Prisma.EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentStatus[];
    notIn?: $Enums.PaymentStatus[];
    not?: Prisma.NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPaymentStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPaymentStatusFilter<$PrismaModel>;
};
export type EnumMatchResultTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResultType | Prisma.EnumMatchResultTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchResultType[];
    notIn?: $Enums.MatchResultType[];
    not?: Prisma.NestedEnumMatchResultTypeFilter<$PrismaModel> | $Enums.MatchResultType;
};
export type EnumMatchResultStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResultStatus | Prisma.EnumMatchResultStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchResultStatus[];
    notIn?: $Enums.MatchResultStatus[];
    not?: Prisma.NestedEnumMatchResultStatusFilter<$PrismaModel> | $Enums.MatchResultStatus;
};
export type EnumMatchResultTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResultType | Prisma.EnumMatchResultTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchResultType[];
    notIn?: $Enums.MatchResultType[];
    not?: Prisma.NestedEnumMatchResultTypeWithAggregatesFilter<$PrismaModel> | $Enums.MatchResultType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMatchResultTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMatchResultTypeFilter<$PrismaModel>;
};
export type EnumMatchResultStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResultStatus | Prisma.EnumMatchResultStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchResultStatus[];
    notIn?: $Enums.MatchResultStatus[];
    not?: Prisma.NestedEnumMatchResultStatusWithAggregatesFilter<$PrismaModel> | $Enums.MatchResultStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMatchResultStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMatchResultStatusFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | null;
    notIn?: Date[] | string[] | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    search?: string;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | null;
    notIn?: Date[] | string[] | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type NestedJsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>, Required<NestedJsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>;
export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string;
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue;
    lte?: runtime.InputJsonValue;
    gt?: runtime.InputJsonValue;
    gte?: runtime.InputJsonValue;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type NestedEnumPhaseTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseType | Prisma.EnumPhaseTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.PhaseType[];
    notIn?: $Enums.PhaseType[];
    not?: Prisma.NestedEnumPhaseTypeFilter<$PrismaModel> | $Enums.PhaseType;
};
export type NestedEnumPhaseFormatFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseFormat | Prisma.EnumPhaseFormatFieldRefInput<$PrismaModel>;
    in?: $Enums.PhaseFormat[];
    notIn?: $Enums.PhaseFormat[];
    not?: Prisma.NestedEnumPhaseFormatFilter<$PrismaModel> | $Enums.PhaseFormat;
};
export type NestedEnumPhaseStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseStatus | Prisma.EnumPhaseStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PhaseStatus[];
    notIn?: $Enums.PhaseStatus[];
    not?: Prisma.NestedEnumPhaseStatusFilter<$PrismaModel> | $Enums.PhaseStatus;
};
export type NestedEnumPhaseTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseType | Prisma.EnumPhaseTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.PhaseType[];
    notIn?: $Enums.PhaseType[];
    not?: Prisma.NestedEnumPhaseTypeWithAggregatesFilter<$PrismaModel> | $Enums.PhaseType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPhaseTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPhaseTypeFilter<$PrismaModel>;
};
export type NestedEnumPhaseFormatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseFormat | Prisma.EnumPhaseFormatFieldRefInput<$PrismaModel>;
    in?: $Enums.PhaseFormat[];
    notIn?: $Enums.PhaseFormat[];
    not?: Prisma.NestedEnumPhaseFormatWithAggregatesFilter<$PrismaModel> | $Enums.PhaseFormat;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPhaseFormatFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPhaseFormatFilter<$PrismaModel>;
};
export type NestedEnumPhaseStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseStatus | Prisma.EnumPhaseStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PhaseStatus[];
    notIn?: $Enums.PhaseStatus[];
    not?: Prisma.NestedEnumPhaseStatusWithAggregatesFilter<$PrismaModel> | $Enums.PhaseStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPhaseStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPhaseStatusFilter<$PrismaModel>;
};
export type NestedEnumSeasonStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SeasonStatus | Prisma.EnumSeasonStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SeasonStatus[];
    notIn?: $Enums.SeasonStatus[];
    not?: Prisma.NestedEnumSeasonStatusFilter<$PrismaModel> | $Enums.SeasonStatus;
};
export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type NestedEnumSeasonStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SeasonStatus | Prisma.EnumSeasonStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SeasonStatus[];
    notIn?: $Enums.SeasonStatus[];
    not?: Prisma.NestedEnumSeasonStatusWithAggregatesFilter<$PrismaModel> | $Enums.SeasonStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSeasonStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSeasonStatusFilter<$PrismaModel>;
};
export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[];
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type NestedEnumPlayerPositionFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerPosition | Prisma.EnumPlayerPositionFieldRefInput<$PrismaModel>;
    in?: $Enums.PlayerPosition[];
    notIn?: $Enums.PlayerPosition[];
    not?: Prisma.NestedEnumPlayerPositionFilter<$PrismaModel> | $Enums.PlayerPosition;
};
export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type NestedEnumPlayerPositionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerPosition | Prisma.EnumPlayerPositionFieldRefInput<$PrismaModel>;
    in?: $Enums.PlayerPosition[];
    notIn?: $Enums.PlayerPosition[];
    not?: Prisma.NestedEnumPlayerPositionWithAggregatesFilter<$PrismaModel> | $Enums.PlayerPosition;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPlayerPositionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPlayerPositionFilter<$PrismaModel>;
};
export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type NestedEnumPlayerRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerRole | Prisma.EnumPlayerRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.PlayerRole[];
    notIn?: $Enums.PlayerRole[];
    not?: Prisma.NestedEnumPlayerRoleFilter<$PrismaModel> | $Enums.PlayerRole;
};
export type NestedEnumPlayerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerStatus | Prisma.EnumPlayerStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PlayerStatus[];
    notIn?: $Enums.PlayerStatus[];
    not?: Prisma.NestedEnumPlayerStatusFilter<$PrismaModel> | $Enums.PlayerStatus;
};
export type NestedEnumApprovalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApprovalStatus | Prisma.EnumApprovalStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ApprovalStatus[];
    notIn?: $Enums.ApprovalStatus[];
    not?: Prisma.NestedEnumApprovalStatusFilter<$PrismaModel> | $Enums.ApprovalStatus;
};
export type NestedEnumPlayerRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerRole | Prisma.EnumPlayerRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.PlayerRole[];
    notIn?: $Enums.PlayerRole[];
    not?: Prisma.NestedEnumPlayerRoleWithAggregatesFilter<$PrismaModel> | $Enums.PlayerRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPlayerRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPlayerRoleFilter<$PrismaModel>;
};
export type NestedEnumPlayerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerStatus | Prisma.EnumPlayerStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PlayerStatus[];
    notIn?: $Enums.PlayerStatus[];
    not?: Prisma.NestedEnumPlayerStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlayerStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPlayerStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPlayerStatusFilter<$PrismaModel>;
};
export type NestedEnumApprovalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApprovalStatus | Prisma.EnumApprovalStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ApprovalStatus[];
    notIn?: $Enums.ApprovalStatus[];
    not?: Prisma.NestedEnumApprovalStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApprovalStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumApprovalStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumApprovalStatusFilter<$PrismaModel>;
};
export type NestedEnumSeasonTeamStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SeasonTeamStatus | Prisma.EnumSeasonTeamStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SeasonTeamStatus[];
    notIn?: $Enums.SeasonTeamStatus[];
    not?: Prisma.NestedEnumSeasonTeamStatusFilter<$PrismaModel> | $Enums.SeasonTeamStatus;
};
export type NestedEnumSeasonTeamStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SeasonTeamStatus | Prisma.EnumSeasonTeamStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SeasonTeamStatus[];
    notIn?: $Enums.SeasonTeamStatus[];
    not?: Prisma.NestedEnumSeasonTeamStatusWithAggregatesFilter<$PrismaModel> | $Enums.SeasonTeamStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSeasonTeamStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSeasonTeamStatusFilter<$PrismaModel>;
};
export type NestedEnumMatchStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchStatus | Prisma.EnumMatchStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchStatus[];
    notIn?: $Enums.MatchStatus[];
    not?: Prisma.NestedEnumMatchStatusFilter<$PrismaModel> | $Enums.MatchStatus;
};
export type NestedEnumMatchStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchStatus | Prisma.EnumMatchStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchStatus[];
    notIn?: $Enums.MatchStatus[];
    not?: Prisma.NestedEnumMatchStatusWithAggregatesFilter<$PrismaModel> | $Enums.MatchStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMatchStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMatchStatusFilter<$PrismaModel>;
};
export type NestedEnumMatchEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchEventType | Prisma.EnumMatchEventTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchEventType[];
    notIn?: $Enums.MatchEventType[];
    not?: Prisma.NestedEnumMatchEventTypeFilter<$PrismaModel> | $Enums.MatchEventType;
};
export type NestedEnumMatchPeriodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchPeriod | Prisma.EnumMatchPeriodFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MatchPeriod[] | null;
    notIn?: $Enums.MatchPeriod[] | null;
    not?: Prisma.NestedEnumMatchPeriodNullableFilter<$PrismaModel> | $Enums.MatchPeriod | null;
};
export type NestedEnumCardColorNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.CardColor | Prisma.EnumCardColorFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CardColor[] | null;
    notIn?: $Enums.CardColor[] | null;
    not?: Prisma.NestedEnumCardColorNullableFilter<$PrismaModel> | $Enums.CardColor | null;
};
export type NestedEnumMatchEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchEventType | Prisma.EnumMatchEventTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchEventType[];
    notIn?: $Enums.MatchEventType[];
    not?: Prisma.NestedEnumMatchEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.MatchEventType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMatchEventTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMatchEventTypeFilter<$PrismaModel>;
};
export type NestedEnumMatchPeriodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchPeriod | Prisma.EnumMatchPeriodFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MatchPeriod[] | null;
    notIn?: $Enums.MatchPeriod[] | null;
    not?: Prisma.NestedEnumMatchPeriodNullableWithAggregatesFilter<$PrismaModel> | $Enums.MatchPeriod | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMatchPeriodNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMatchPeriodNullableFilter<$PrismaModel>;
};
export type NestedEnumCardColorNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CardColor | Prisma.EnumCardColorFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CardColor[] | null;
    notIn?: $Enums.CardColor[] | null;
    not?: Prisma.NestedEnumCardColorNullableWithAggregatesFilter<$PrismaModel> | $Enums.CardColor | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCardColorNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCardColorNullableFilter<$PrismaModel>;
};
export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[];
    notIn?: $Enums.NotificationType[];
    not?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType;
};
export type NestedEnumNotificationSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationSource | Prisma.EnumNotificationSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationSource[];
    notIn?: $Enums.NotificationSource[];
    not?: Prisma.NestedEnumNotificationSourceFilter<$PrismaModel> | $Enums.NotificationSource;
};
export type NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[];
    notIn?: $Enums.NotificationType[];
    not?: Prisma.NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
};
export type NestedEnumNotificationSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationSource | Prisma.EnumNotificationSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationSource[];
    notIn?: $Enums.NotificationSource[];
    not?: Prisma.NestedEnumNotificationSourceWithAggregatesFilter<$PrismaModel> | $Enums.NotificationSource;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationSourceFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationSourceFilter<$PrismaModel>;
};
export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | Prisma.EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentStatus[];
    notIn?: $Enums.PaymentStatus[];
    not?: Prisma.NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus;
};
export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | Prisma.EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentStatus[];
    notIn?: $Enums.PaymentStatus[];
    not?: Prisma.NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPaymentStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPaymentStatusFilter<$PrismaModel>;
};
export type NestedEnumMatchResultTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResultType | Prisma.EnumMatchResultTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchResultType[];
    notIn?: $Enums.MatchResultType[];
    not?: Prisma.NestedEnumMatchResultTypeFilter<$PrismaModel> | $Enums.MatchResultType;
};
export type NestedEnumMatchResultStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResultStatus | Prisma.EnumMatchResultStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchResultStatus[];
    notIn?: $Enums.MatchResultStatus[];
    not?: Prisma.NestedEnumMatchResultStatusFilter<$PrismaModel> | $Enums.MatchResultStatus;
};
export type NestedEnumMatchResultTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResultType | Prisma.EnumMatchResultTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchResultType[];
    notIn?: $Enums.MatchResultType[];
    not?: Prisma.NestedEnumMatchResultTypeWithAggregatesFilter<$PrismaModel> | $Enums.MatchResultType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMatchResultTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMatchResultTypeFilter<$PrismaModel>;
};
export type NestedEnumMatchResultStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResultStatus | Prisma.EnumMatchResultStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MatchResultStatus[];
    notIn?: $Enums.MatchResultStatus[];
    not?: Prisma.NestedEnumMatchResultStatusWithAggregatesFilter<$PrismaModel> | $Enums.MatchResultStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMatchResultStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMatchResultStatusFilter<$PrismaModel>;
};
//# sourceMappingURL=commonInputTypes.d.ts.map