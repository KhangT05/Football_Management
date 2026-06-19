import { z } from "zod";

/**
 * Input cho draw group. Cố tình KHÔNG có field team_ids/assignments —
 * contract chỉ cho phép random toàn bộ approved team của season vào group
 * theo phase, không có đường nào để client tự chọn team vào group cụ thể.
 * Muốn override tay từng team thì dùng endpoint assignGroup() của
 * SeasonTeamController riêng (đã có sẵn), không lẫn vào draw API này.
 */
export const DrawGroupsSchema = z.object({
    teams_per_group: z.number().int().min(2),
});
export type DrawGroupsDto = z.infer<typeof DrawGroupsSchema>;

export interface DrawGroupsResultDto {
    group_id: number;
    team_id: number;
}