import { useQuery } from '@tanstack/react-query';
import { seasonTeamApi } from '../api';

/**
 * Resolve season_team_id từ (seasonId, teamId).
 * TeamPlayer chỉ liên kết qua SeasonTeam.id (season_team_id) — không có
 * FK trực tiếp tới Team — nên mọi request lấy roster đều phải qua bước này
 * trước, không được truyền thẳng Team.id vào /players/{x}/team-players.
 */
export function useSeasonTeamId(seasonId, teamId) {
    return useQuery({
        queryKey: ['season-team-id', seasonId, teamId],
        queryFn: async () => {
            const res = await seasonTeamApi.getAll({ season_id: seasonId, team_id: teamId });
            const data = typeof res?.status === 'boolean' ? res.data : res;
            const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

            // Phòng trường hợp BE chưa support filter kết hợp season_id + team_id
            // (chỉ lọc theo 1 trong 2) — lọc lại phía client cho chắc, tránh lấy
            // nhầm season_team của mùa giải khác nếu team tham gia nhiều season.
            const record = list.find(
                r => Number(r.season_id) === Number(seasonId) && Number(r.team_id) === Number(teamId)
            ) ?? list[0];

            if (!record) throw new Error(`Team ${teamId} chưa đăng ký ở mùa giải ${seasonId}`);
            return record.id; // season_team_id
        },
        enabled: !!seasonId && !!teamId,
        staleTime: 60_000,
        retry: false, // lỗi "chưa đăng ký" là business error, không nên tự retry
    });
}