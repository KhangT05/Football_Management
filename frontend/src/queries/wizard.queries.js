import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tournamentApi, tournamentRuleApi, seasonApi, groupApi } from '../api';
import { getFormatMeta } from '../schemas/wizard.constants';
import { toApiCustomStages } from '../schemas/wizard.mappers';

export const wizardKeys = {
    tournaments: () => ['tournaments', { active: true }],
    ruleTemplates: (tournamentId) => ['tournamentRules', tournamentId],
};

export function useTournamentsQuery(enabled) {
    return useQuery({
        queryKey: wizardKeys.tournaments(),
        queryFn: async () => {
            const res = await tournamentApi.getAll({ per_page: 100, is_active: true });
            return res.data?.data ?? res.data ?? [];
        },
        enabled,
        staleTime: 60_000,
    });
}

export function useRuleTemplatesQuery(tournamentId) {
    return useQuery({
        queryKey: wizardKeys.ruleTemplates(tournamentId ?? ''),
        queryFn: async () => {
            const res = await tournamentRuleApi.getByTournament(tournamentId);
            return res.data?.data ?? res.data ?? [];
        },
        enabled: !!tournamentId,
        staleTime: 30_000,
    });
}

// ---------------------------------------------------------------------------
// Submit orchestration
//
// Thay cho handleSubmit() cũ: 5 bước tuần tự (tournament -> rule -> season -> [status ->
// groups]), non-transactional ở BE (mỗi bước là 1 API call riêng) nên giữ nguyên chiến lược
// gốc — lỗi ở bước tạo group KHÔNG rollback tournament/rule/season đã tạo, chỉ trả warning.
// Nếu cần atomicity thật, đây là việc của BE (transaction/saga), không fix được ở FE.
// ---------------------------------------------------------------------------

export function useSubmitWizard(selectedRuleTemplate) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (w) => {
            // 1. Tournament
            let finalTournamentId = w.existingTournamentId;
            if (w.tournamentMode === 'new') {
                const tRes = await tournamentApi.create(w.tournamentNew);
                finalTournamentId = tRes.data?.id ?? tRes.id;
            }

            // 2. Rule — dùng nguyên template hoặc fork thành rule mới. Không bao giờ PATCH rule
            // template tại đây: rule dùng chung cho nhiều season, sửa tại chỗ ảnh hưởng các
            // season khác đang share rule đó — service tự chặn bằng CONFLICT nếu đã có match.
            const usingTemplateAsIs = w.ruleMode === 'template' && !!selectedRuleTemplate
                && JSON.stringify(w.rule) === JSON.stringify(selectedRuleTemplate.__formShape);

            let finalRuleId;
            let finalFormat;
            let finalCustomStages;

            if (usingTemplateAsIs) {
                finalRuleId = selectedRuleTemplate.id;
                finalFormat = selectedRuleTemplate.format;
                finalCustomStages = selectedRuleTemplate.custom_stages ?? null; // đã order-based từ BE
            } else {
                const apiCustomStages = w.rule.format === 'custom' ? toApiCustomStages(w.rule.custom_stages) : null;
                const rulePayload = {
                    ...w.rule,
                    name: w.rule.name.trim(),
                    tournament_id: finalTournamentId,
                    custom_stages: apiCustomStages,
                    round_robin_stages: w.rule.format === 'custom' ? 0 : w.rule.round_robin_stages,
                };
                const rRes = await tournamentRuleApi.create(rulePayload);
                finalRuleId = rRes.data?.id ?? rRes.id;
                finalFormat = w.rule.format;
                finalCustomStages = apiCustomStages;
            }

            const finalMeta = getFormatMeta(finalFormat);
            const finalIsCustom = finalFormat === 'custom';
            const firstCustomStage = finalIsCustom ? finalCustomStages?.[0] : null;

            const shouldCreateInitialGroups = finalIsCustom
                ? firstCustomStage?.type === 'round_robin'
                : finalMeta.hasGroupPhase;
            const initialGroupCount = finalIsCustom
                ? Number(firstCustomStage?.group_count || 0)
                : Number(w.groupCount);

            // 3. Season
            // BE: group_count = z.number().int().min(1).default(1) — field này là "số group
            // auto-generate lúc tạo season", KHÔNG phải tổng số group cuối cùng của giải. Knockout
            // thuần / custom-knockout-first vẫn hợp lệ dù không tạo group nào -> gửi 1, không
            // phải 0 (0 vi phạm .min(1) -> season creation fail toàn bộ cho mọi format knockout).
            const sRes = await seasonApi.create({
                ...w.season,
                start_date: w.season.start_date ? `${w.season.start_date}T00:00:00` : undefined,
                end_date: w.season.end_date ? `${w.season.end_date}T23:59:59` : undefined,
                registration_deadline: w.season.registration_deadline ? `${w.season.registration_deadline}T23:59:59` : undefined,
                is_active: true,
                group_count: shouldCreateInitialGroups ? (initialGroupCount || 1) : 1,
                tournament_id: finalTournamentId,
                tournament_rule_id: finalRuleId,
            });
            const finalSeasonId = sRes.data?.id ?? sRes.id;

            // 4. Generate groups nếu thể thức có vòng bảng ở stage đầu. Season mới mặc định
            // 'upcoming'; BE chỉ cho tạo/sửa group khi ở 'registration_open'/'ongoing' -> tự
            // chuyển status trước nếu user chọn "Mở đăng ký ngay". Không throw ra ngoài để không
            // rollback tournament/rule/season đã tạo thành công — chỉ trả warning.
            let warning = null;
            if (shouldCreateInitialGroups && initialGroupCount > 0) {
                if (w.season.is_registration_open) {
                    try {
                        await seasonApi.updateStatus(finalSeasonId, { status: 'registration_open' });
                    } catch {
                        warning = 'Mùa giải đã được tạo nhưng chưa thể tự động mở đăng ký. Vui lòng vào mùa giải để mở đăng ký và tạo bảng đấu thủ công.';
                    }
                }
                if (!warning) {
                    try {
                        await groupApi.createGroupsBulk(finalSeasonId, initialGroupCount);
                    } catch {
                        warning = 'Mùa giải đã được tạo nhưng chưa thể tự động tạo bảng đấu (season chưa ở trạng thái phù hợp). Vui lòng vào mùa giải để tạo bảng đấu thủ công.';
                    }
                }
            }

            return {
                warning,
                finalFormat,
                finalIsCustom,
                customStagesCount: finalCustomStages?.length ?? 0,
            };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] });
            queryClient.invalidateQueries({ queryKey: ['seasons'] });
        },
    });
}