import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import { parseApiError } from '../utils/errorHelper';

export const userKeys = {
    detail: (id) => ['user', id],
};

/** Fetch full profile (bao gồm phone) — thay cho useEffect + setFetching thủ công */
export function useUserProfile(userId) {
    return useQuery({
        queryKey: userKeys.detail(userId),
        queryFn: async () => {
            const res = await userApi.getUserById(userId);
            return res?.data ?? res;
        },
        enabled: !!userId,
    });
}

export function useUpdateProfile(userId) {
    const setUser = useAuthStore((s) => s.setUser);
    const toast = useToastStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => {
            if (!userId) throw new Error('Thiếu userId — vui lòng đăng nhập lại.');
            return userApi.updateProfile(userId, data);
        },
        onSuccess: (res) => {
            const updated = res?.data ?? res;
            setUser((prev) => ({ ...prev, ...updated }));
            queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
            toast.success('Cập nhật thông tin thành công!');
        },
        onError: (err) => {
            toast.error(parseApiError(err, 'Có lỗi xảy ra khi cập nhật thông tin.'));
        },
    });
}

export function useChangePassword(userId) {
    return useMutation({
        mutationFn: (data) => {
            if (!userId) throw new Error('Thiếu userId — vui lòng đăng nhập lại.');
            return userApi.updatePassword(userId, data);
        },
    });
}

export function useUpdateAvatar(userId) {
    const setUser = useAuthStore((s) => s.setUser);
    const toast = useToastStore();

    return useMutation({
        mutationFn: (file) => userApi.updateAvatar(userId, file),
        onSuccess: (res) => {
            const updated = res?.data ?? res;
            setUser((prev) => ({ ...prev, avatar: updated.avatar, avatar_url: updated.avatar }));
            toast.success('Cập nhật ảnh đại diện thành công!');
        },
        onError: (err) => {
            toast.error(parseApiError(err, 'Lỗi khi tải lên ảnh đại diện.'));
        },
    });
}