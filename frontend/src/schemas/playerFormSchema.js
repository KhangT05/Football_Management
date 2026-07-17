import { z } from 'zod';

// ── Dùng cho components/admin/PlayerFormModal.jsx ──────────────────────────
// (position dạng string: goalkeeper/defender/midfielder/forward)
const jerseyNumberField = z.coerce
    .number({ invalid_type_error: 'Số áo phải là số' })
    .int('Số áo phải là số nguyên')
    .min(1, 'Số áo tối thiểu là 1')
    .max(99, 'Số áo tối đa là 99');

const positionField = z.enum(['goalkeeper', 'defender', 'midfielder', 'forward'], {
    errorMap: () => ({ message: 'Vui lòng chọn vị trí' }),
});

const roleField = z.enum(['player', 'vice_captain', 'captain']).default('player');

export const addPlayerSchema = z.object({
    email: z.string().trim().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
    name: z.string().trim().min(1, 'Vui lòng nhập họ tên'),
    student_code: z.string().trim().optional().or(z.literal('')),
    date_of_birth: z.string().optional().or(z.literal('')),
    number: jerseyNumberField,
    position: positionField,
    role: roleField,
});

export const editPlayerSchema = z.object({
    // name/student_code bị disable trên UI (quản lý ở phần tài khoản) nhưng vẫn
    // giữ trong schema để defaultValues không bị strip bởi zodResolver.
    name: z.string().trim().optional().or(z.literal('')),
    student_code: z.string().trim().optional().or(z.literal('')),
    number: jerseyNumberField,
    position: positionField,
    role: roleField,
});

export const getAdminPlayerFormSchema = (mode) =>
    mode === 'add' ? addPlayerSchema : editPlayerSchema;

// ── Dùng cho components/myteam/PlayerFormModal.jsx (bản cũ, đơn giản hơn) ──
// (position dạng viết tắt: GK/DEF/MID/FW, có field goals ở mode edit)
export const legacyPlayerSchema = (mode) =>
    z.object({
        name: z.string().trim().min(1, 'Vui lòng nhập họ và tên'),
        number: jerseyNumberField,
        position: z.enum(['GK', 'DEF', 'MID', 'FW'], {
            errorMap: () => ({ message: 'Vui lòng chọn vị trí' }),
        }),
        goals:
            mode === 'edit'
                ? z.coerce.number().int('Bàn thắng phải là số nguyên').min(0, 'Không thể âm').default(0)
                : z.coerce.number().optional(),
    });