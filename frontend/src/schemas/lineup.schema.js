import { z } from 'zod';

export const PITCH_POSITIONS = ['goalkeeper', 'defender', 'midfielder', 'forward'];
export const LINEUP_SLOTS = ['none', 'starter', 'substitute'];

export const playerSlotSchema = z.object({
    player_id: z.number().int().positive(),
    name: z.string(),
    jersey_number: z.number().int().min(1).max(99),
    position: z.enum(PITCH_POSITIONS),
    lineup_type: z.enum(LINEUP_SLOTS).default('none'),
    is_captain: z.boolean().default(false),
});

export const buildLineupFormSchema = (limit) =>
    z.object({ players: z.array(playerSlotSchema) }).superRefine((data, ctx) => {
        const starters = data.players.filter(p => p.lineup_type === 'starter');
        const subs = data.players.filter(p => p.lineup_type === 'substitute');
        const captains = data.players.filter(p => p.is_captain);

        if (starters.length !== limit.max_players_per_team)
            ctx.addIssue({
                code: z.ZodIssueCode.custom, path: ['players'],
                message: `Cần đúng ${limit.max_players_per_team} cầu thủ đá chính (hiện tại: ${starters.length})`
            });

        const gk = starters.filter(p => p.position === 'goalkeeper').length;
        if (gk !== 1)
            ctx.addIssue({
                code: z.ZodIssueCode.custom, path: ['players'],
                message: `Cần đúng 1 thủ môn đá chính (hiện tại: ${gk})`
            });

        if (starters.length + subs.length > limit.max_squad_size)
            ctx.addIssue({
                code: z.ZodIssueCode.custom, path: ['players'],
                message: `Tổng quân số vượt quá ${limit.max_squad_size}`
            });

        if (captains.length !== 1)
            ctx.addIssue({
                code: z.ZodIssueCode.custom, path: ['players'],
                message: captains.length === 0 ? 'Vui lòng chọn đội trưởng' : 'Chỉ được 1 đội trưởng'
            });
    });