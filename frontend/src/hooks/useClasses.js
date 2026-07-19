import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { classApi } from '../api';
import useToastStore from '../store/toastStore';
import { parseApiError } from '../utils/errorHelper';

const CLASSES_KEY = 'classes';

/** Danh sách class có phân trang/tìm kiếm/sort — dùng cho trang quản trị. */
export function useClassesQuery(params) {
    return useQuery({
        queryKey: [CLASSES_KEY, params],
        queryFn: async () => {
            const res = await classApi.getAll(params);
            // Chuẩn hoá response: hỗ trợ cả { status, data } wrapper lẫn payload thô
            const payload = typeof res?.status === 'boolean' ? res.data : res;
            const items = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
            const meta = Array.isArray(payload) ? null : payload?.meta;
            return { items, meta };
        },
        placeholderData: keepPreviousData, // giữ data cũ khi đổi trang, tránh nháy UI
    });
}

export function useCreateClass() {
    const queryClient = useQueryClient();
    const toast = useToastStore();

    return useMutation({
        mutationFn: (data) => classApi.create(data),
        onSuccess: (_res, variables) => {
            queryClient.invalidateQueries({ queryKey: [CLASSES_KEY] });
            toast.success(`Đã tạo lớp học "${variables.name}"`);
        },
        onError: (err) => {
            toast.error(parseApiError(err, 'Không thể tạo lớp học.'));
        },
    });
}

export function useUpdateClass() {
    const queryClient = useQueryClient();
    const toast = useToastStore();

    return useMutation({
        mutationFn: ({ id, data }) => classApi.update(id, data),
        onSuccess: (_res, variables) => {
            queryClient.invalidateQueries({ queryKey: [CLASSES_KEY] });
            toast.success(`Đã cập nhật lớp học "${variables.data.name}"`);
        },
        onError: (err) => {
            toast.error(parseApiError(err, 'Không thể cập nhật lớp học.'));
        },
    });
}

export function useDeleteClass() {
    const queryClient = useQueryClient();
    const toast = useToastStore();

    return useMutation({
        mutationFn: (cls) => classApi.delete(cls.id),
        onSuccess: (_res, cls) => {
            queryClient.invalidateQueries({ queryKey: [CLASSES_KEY] });
            toast.success(`Đã xóa lớp học "${cls.name}".`);
        },
        onError: (err) => {
            toast.error(parseApiError(err, 'Không thể xóa lớp học.'));
        },
    });
}