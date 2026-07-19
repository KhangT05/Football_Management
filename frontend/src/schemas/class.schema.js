import { z } from 'zod';

// Mirror của backend createClassSchema (dtos/class.schema.ts)
export const classFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Tên lớp học không được để trống')
        .max(100, 'Tên lớp học tối đa 100 ký tự'),
    is_active: z.boolean().default(true),
});

export const EMPTY_CLASS = { name: '', is_active: true };