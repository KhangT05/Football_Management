import { z } from 'zod';

// Dùng cho RegisterTeam bước 1 (tạo đội)
export const registerTeamInfoSchema = z.object({
    name: z.string().trim().min(1, 'Vui lòng nhập tên đội bóng'),
    coach_name: z.string().trim().optional().or(z.literal('')),
    description: z.string().trim().optional().or(z.literal('')),
    jersey_color: z.string().default('#ffffff'),
    season_id: z.string().optional().or(z.literal('')),
});

// Dùng cho RegisterTeam bước 2 — roster thủ công (useFieldArray)
export const rosterPlayersSchema = z.object({
    players: z
        .array(
            z.object({
                email: z.string().trim().email('Email không hợp lệ').or(z.literal('')),
                name: z.string().trim(),
                number: z.union([z.string(), z.number()]).optional(),
                position: z.enum(['goalkeeper', 'defender', 'midfielder', 'forward']),
            })
        )
        .min(1),
});

// Dùng cho EditTeamModal (MyTeam — chủ team tự sửa)
export const editTeamSchema = z.object({
    name: z.string().trim().min(1, 'Vui lòng nhập tên đội bóng'),
    coach_name: z.string().trim().optional().or(z.literal('')),
    phone: z.string().trim().optional().or(z.literal('')),
    description: z.string().trim().optional().or(z.literal('')),
    color_hex: z.string().optional(),
});

// Dùng cho TeamFormModal (Admin — CRUD đầy đủ)
export const adminTeamSchema = z.object({
    name: z.string().trim().min(1, 'Vui lòng nhập tên đội bóng'),
    coach_name: z.string().trim().optional().or(z.literal('')),
    description: z.string().trim().optional().or(z.literal('')),
    jersey_color: z.string().optional(),
    is_active: z.boolean().default(true),
});