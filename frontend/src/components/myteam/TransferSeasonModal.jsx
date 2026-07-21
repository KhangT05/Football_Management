import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    ArrowRightLeft, X, CheckSquare, Square, ChevronRight, ArrowLeft, Loader2, CalendarCheck, Ban
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { seasonTeamApi } from '../../api/seasonTeamApi';
import { useTeamPlayers } from '../../queries/useMyTeamQueries';

function SeasonStatusBadge() {
    return (
        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
            <CalendarCheck className="w-3 h-3" /> Đang mở đăng ký
        </span>
    );
}

function DisabledReasonChip({ reason }) {
    if (!reason) return null;
    return (
        <p className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border mt-2 bg-red-500/10 text-red-400 border-red-500/30">
            <Ban className="w-3.5 h-3.5 shrink-0" /> <span>{reason}</span>
        </p>
    );
}

export default function TransferSeasonModal({ teamId, activeSeasonTeamId, onClose, onTransfer }) {
    const [step, setStep] = useState(1);
    const [selectedSeasonId, setSelectedSeasonId] = useState(null);
    const [selectedPlayerIds, setSelectedPlayerIds] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch eligible seasons
    const { data: seasons = [], isLoading: isLoadingSeasons } = useQuery({
        queryKey: ['team-registration-eligibility', teamId],
        queryFn: async () => {
            const res = await seasonTeamApi.getRegistrationEligibility(teamId);
            return res?.data ?? res ?? [];
        },
    });

    // Fetch current roster
    const { data: rosterRes, isLoading: isLoadingPlayers } = useTeamPlayers(activeSeasonTeamId, 1, 100);
    const currentRoster = useMemo(() => {
        return (rosterRes?.data ?? []).filter(p => p.approval_status === 'approved');
    }, [rosterRes]);

    const openSeasons = useMemo(() => seasons.filter(s => s.season_status === 'registration_open'), [seasons]);

    const toggleSelectAll = () => {
        if (selectedPlayerIds.size === currentRoster.length) {
            setSelectedPlayerIds(new Set());
        } else {
            setSelectedPlayerIds(new Set(currentRoster.map(p => p.player_id)));
        }
    };

    const toggleSelect = (id) => {
        const next = new Set(selectedPlayerIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedPlayerIds(next);
    };

    const handleNext = () => {
        if (!selectedSeasonId) return;
        // Pre-select all players by default when moving to step 2
        if (selectedPlayerIds.size === 0) {
            setSelectedPlayerIds(new Set(currentRoster.map(p => p.player_id)));
        }
        setStep(2);
    };

    const handleSubmit = async () => {
        if (!selectedSeasonId) return;
        setIsSubmitting(true);
        try {
            await onTransfer({
                season_id: selectedSeasonId,
                carry_player_ids: Array.from(selectedPlayerIds),
                add_players: [],
            });
            onClose();
        } catch (error) {
            console.error('Lỗi khi chuyển giải:', error);
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white border border-gray-200 rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh] animate-scale-in overflow-hidden"
            >
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        {step === 2 && (
                            <button onClick={() => setStep(1)} className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors hover:bg-gray-100 rounded-xl">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                                Chuyển đăng ký mùa giải
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {step === 1 ? 'Bước 1: Chọn mùa giải mới muốn tham gia' : 'Bước 2: Chọn cầu thủ muốn giữ lại'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 transition-colors bg-gray-100 rounded-xl">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            {isLoadingSeasons ? (
                                <div className="flex items-center justify-center p-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                </div>
                            ) : openSeasons.length === 0 ? (
                                <div className="text-center p-12 text-gray-500 border border-gray-200 rounded-xl bg-gray-50/50">
                                    <p>Không có mùa giải nào đang mở đăng ký.</p>
                                </div>
                            ) : (
                                openSeasons.map(s => {
                                    const disabledReason = s.already_registered
                                        ? 'Đội đã đăng ký giải này'
                                        : s.conflict
                                            ? `Cầu thủ ${s.conflict.playerName} đang thuộc đội ${s.conflict.teamName}, đội này đã đăng ký giải này`
                                            : null;
                                    
                                    const isSelected = selectedSeasonId === s.season_id;

                                    return (
                                        <div 
                                            key={s.season_id}
                                            onClick={() => !disabledReason && setSelectedSeasonId(s.season_id)}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                                disabledReason 
                                                    ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                                                    : isSelected
                                                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                                                        : 'bg-white border-gray-200 hover:border-gray-400 shadow-sm'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <SeasonStatusBadge />
                                                    </div>
                                                    <p className={`font-bold text-lg truncate ${disabledReason ? 'text-gray-500' : 'text-gray-900'}`}>{s.name}</p>
                                                    {s.tournament && (
                                                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                            {s.tournament.logo && <img src={s.tournament.logo} alt="" className="w-4 h-4 rounded-full object-cover" />}
                                                            {s.tournament.name}
                                                        </p>
                                                    )}
                                                    <DisabledReasonChip reason={disabledReason} />
                                                </div>
                                                {!disabledReason && (
                                                    <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 bg-white mt-1">
                                                        {isSelected && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="border border-gray-200 rounded-xl bg-gray-50/50 overflow-hidden">
                            {isLoadingPlayers ? (
                                <div className="flex items-center justify-center p-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                </div>
                            ) : currentRoster.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    Đội hình hiện tại chưa có cầu thủ nào.
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-gray-100 border-b border-gray-200">
                                        <tr>
                                            <th className="p-3 w-10 text-center">
                                                <button type="button" onClick={toggleSelectAll} className="text-gray-500 hover:text-blue-600 transition-colors">
                                                    {selectedPlayerIds.size === currentRoster.length ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                                                </button>
                                            </th>
                                            <th className="p-3 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Tên cầu thủ</th>
                                            <th className="p-3 font-bold text-gray-500 uppercase tracking-wider text-[10px] w-24">Số áo</th>
                                            <th className="p-3 font-bold text-gray-500 uppercase tracking-wider text-[10px] w-40">Vị trí</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {currentRoster.map(p => {
                                            const isSelected = selectedPlayerIds.has(p.player_id);
                                            return (
                                                <tr key={p.player_id} 
                                                    onClick={() => toggleSelect(p.player_id)}
                                                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                                                >
                                                    <td className="p-3 text-center">
                                                        <div className="text-gray-500">
                                                            {isSelected ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 font-medium text-gray-900">{p.player.user?.name || 'Cầu thủ'}</td>
                                                    <td className="p-3 text-gray-900">{p.jersey_number}</td>
                                                    <td className="p-3 text-gray-900">{p.position}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                        Hủy
                    </button>
                    {step === 1 ? (
                        <button
                            disabled={!selectedSeasonId}
                            onClick={handleNext}
                            className="px-5 py-2.5 rounded-xl text-sm font-black text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            Tiếp tục <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className="px-5 py-2.5 rounded-xl text-sm font-black text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Đang chuyển...</>
                            ) : (
                                `Chuyển sang giải mới (${selectedPlayerIds.size} cầu thủ)`
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
