import { z } from 'zod';

export const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Tên không được bỏ trống.')
        .max(100, 'Tên tối đa 100 ký tự.'),
    phone: z
        .string()
        .trim()
        .regex(/^(\+84|0)\d{9,10}$/, 'Số điện thoại không hợp lệ.')
        .or(z.literal('')),
});

export const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại.'),
        newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự.'),
        confirmPassword: z.string().min(6, 'Vui lòng xác nhận mật khẩu mới.'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu mới và xác nhận không khớp.',
        path: ['confirmPassword'],
    })
    .refine((data) => data.newPassword !== data.currentPassword, {
        message: 'Mật khẩu mới phải khác mật khẩu hiện tại.',
        path: ['newPassword'],
    });