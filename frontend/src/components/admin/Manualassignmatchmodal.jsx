import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { manualAssignFormSchema } from '../../schemas/schedule.schema';
import {
    useSeasonGroups, useRoundsSummary, useUnscheduledMatches,
    useAvailableSlots, useManualAssignMatch,
} from '../../queries/useschedule.queries';
import useToastStore from '../../store/toastStore';
import { getFriendlyErrorMessage } from '../../utils/errorHelper';

const MIN_TEAMS_PER_GROUP_READY = 2;

/**
 * Wizard: Bảng đấu -> Vòng đấu -> Trận cụ thể (home vs away) -> Slot trống.
 * Đây là luồng còn thiếu trong hệ thống cũ: GenerateScheduleModal chỉ cho
 * chọn round/group để generate CẢ ROUND-ROBIN cùng lúc; RescheduleModal chỉ
 * sửa 1 match NHƯNG nhập datetime tự do, không biết slot nào thật sự trống.
 * Modal này ghép cả 2: chọn đúng 1 cặp đấu, và chỉ được chọn trong danh sách
 * slot đã tính sẵn (tôn trọng venue buffer / rest-days / roster conflict).
 *
 * scheduleWindow: { venueIds, dailyStartTime, dailyEndTime, bufferMinutes,
 * excludedDates } — TÁI DÙNG đúng config admin đã nhập ở GenerateScheduleModal,
 * truyền xuống qua props để không hỏi lại.
 */
export default function ManualAssignMatchModal({ seasonId, scheduleWindow, onClose }) {
    const toast = useToastStore();

    const { data: groups = [], isLoading: loadingGroups } = useSeasonGroups(seasonId);
    const readyGroups = useMemo(
        () => groups.filter((g) => (g.season_teams?.length || 0) >= MIN_TEAMS_PER_GROUP_READY),
        [groups],
    );

    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: { groupId: '', round: '', matchId: '', venueId: '', scheduledAt: '' },
    });

    const groupId = watch('groupId') ? Number(watch('groupId')) : null;
    const round = watch('round') ? Number(watch('round')) : null;
    const matchId = watch('matchId') ? Number(watch('matchId')) : null;
    const venueId = watch('venueId') ? Number(watch('venueId')) : null;
    const scheduledAt = watch('scheduledAt');

    const { data: roundSummaries = [] } = useRoundsSummary(seasonId, groupId ? [groupId] : undefined);
    const { data: unscheduledMatches = [], isFetching: loadingMatches } =
        useUnscheduledMatches(seasonId, groupId, round);
    const { data: slots = [], isFetching: loadingSlots } =
        useAvailableSlots(seasonId, matchId, matchId ? scheduleWindow : undefined);

    const assignMutation = useManualAssignMatch(seasonId);

    // Reset bước con khi bước cha đổi — tránh giữ lựa chọn cũ không còn hợp lệ
    // (vd đổi bảng nhưng vẫn còn round/match/slot của bảng trước).
    useEffect(() => { setValue('round', ''); setValue('matchId', ''); }, [groupId, setValue]);
    useEffect(() => { setValue('matchId', ''); }, [round, setValue]);
    useEffect(() => { setValue('venueId', ''); setValue('scheduledAt', ''); }, [matchId, setValue]);

    const onSubmit = async (raw) => {
        const parsed = manualAssignFormSchema.safeParse({
            matchId: matchId ?? undefined,
            venueId: venueId ?? undefined,
            scheduledAt: raw.scheduledAt,
        });
        if (!parsed.success) {
            toast.warning(parsed.error.errors[0]?.message ?? 'Thiếu thông tin, vui lòng chọn đủ các bước.');
            return;
        }
        try {
            await assignMutation.mutateAsync(parsed.data);
            toast.success('Đã gán trận vào khung giờ đã chọn.');
            onClose();
        } catch (err) {
            toast.error(getFriendlyErrorMessage(
                err, 'Không gán được — slot có thể vừa bị chiếm, thử chọn slot khác.',
            ));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-navy border border-navy-light rounded-3xl w-full max-w-lg shadow-2xl animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 bg-navy-dark border-b border-navy-light shrink-0">
                    <h3 className="font-black text-white uppercase tracking-wider">Gán thủ công 1 trận vào 1 khung giờ</h3>
                    <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                    {/* Bước 1: bảng đấu */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bảng đấu</label>
                        {loadingGroups ? (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tải...
                            </div>
                        ) : (
                            <select
                                {...register('groupId')}
                                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:border-neon outline-none"
                            >
                                <option value="">— Chọn bảng —</option>
                                {readyGroups.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name} ({g.season_teams?.length ?? 0} đội)
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Bước 2: vòng đấu */}
                    {groupId && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vòng đấu</label>
                            <div className="flex flex-wrap gap-2">
                                {roundSummaries.map((r) => (
                                    <button
                                        key={r.round}
                                        type="button"
                                        onClick={() => setValue('round', String(r.round))}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-black border transition-all ${round === r.round
                                            ? 'bg-neon/10 border-neon text-neon'
                                            : 'bg-navy-dark border-navy-light text-gray-400'
                                            }`}
                                    >
                                        Vòng {r.round} ({r.unscheduled}/{r.total} chưa xếp)
                                    </button>
                                ))}
                                {roundSummaries.length === 0 && (
                                    <p className="text-xs text-gray-500 italic">Bảng này chưa có vòng đấu nào.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bước 3: đúng 1 cặp đấu trong bảng+vòng — đây là phần trước đây
              KHÔNG có (trước chỉ generate cả round cho cả bảng >=3 đội). */}
                    {groupId && round && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trận đấu</label>
                            {loadingMatches ? (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tải...
                                </div>
                            ) : unscheduledMatches.length === 0 ? (
                                <p className="text-xs text-gray-500 italic">Vòng này không còn trận nào chưa xếp lịch.</p>
                            ) : (
                                <select
                                    {...register('matchId')}
                                    className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-xl text-white font-bold focus:border-neon outline-none"
                                >
                                    <option value="">— Chọn trận —</option>
                                    {unscheduledMatches.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.homeTeamName} vs {m.awayTeamName}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    {/* Bước 4: slot trống THẬT SỰ cho đúng trận này — tôn trọng buffer /
              rest-days / roster conflict, không phải nhập tay mù. */}
                    {matchId && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Khung giờ trống</label>
                            {loadingSlots ? (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tính slot khả dụng...
                                </div>
                            ) : slots.length === 0 ? (
                                <p className="text-xs text-amber-300 italic bg-amber-950/40 p-3 rounded-lg border border-amber-500/30">
                                    Không còn slot nào hợp lệ trong khung ngày/giờ hiện tại cho 2 đội này
                                    (vi phạm rest-days, hoặc trùng lịch cầu thủ dùng chung roster).
                                    Thử nới rộng khung giờ/ngày hoặc thêm sân ở bước tạo lịch.
                                </p>
                            ) : (
                                <div className="max-h-48 overflow-y-auto space-y-1.5 p-1">
                                    {slots.map((s) => {
                                        const isSelected = venueId === s.venueId && scheduledAt === s.scheduledAt;
                                        return (
                                            <button
                                                key={`${s.venueId}-${s.scheduledAt}`}
                                                type="button"
                                                onClick={() => {
                                                    setValue('venueId', String(s.venueId));
                                                    setValue('scheduledAt', s.scheduledAt);
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all ${isSelected
                                                    ? 'bg-neon/10 border-neon text-neon'
                                                    : 'bg-navy-dark border-navy-light text-gray-300 hover:border-gray-500'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(s.scheduledAt).toLocaleString('vi-VN', {
                                                        dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh',
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs">
                                                    <MapPin className="w-3.5 h-3.5" /> {s.venueName}
                                                </span>
                                                {isSelected && <CheckCircle2 className="w-4 h-4" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3 border-t border-navy-light">
                        <button
                            type="button" onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-navy-light text-gray-400 hover:text-white font-bold text-sm transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={!venueId || !scheduledAt || assignMutation.isPending}
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {assignMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Gán trận
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}