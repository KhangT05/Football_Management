export const myTeamKeys = {
    all: ['myTeams'],
    list: (userId) => [...myTeamKeys.all, 'list', userId],
    detail: (teamId) => [...myTeamKeys.all, teamId, 'detail'],
    players: (teamId) => [...myTeamKeys.all, teamId, 'players'],
    matches: (teamId, seasonId) => [...myTeamKeys.all, teamId, 'matches', seasonId],
    eligibility: (teamId) => [...myTeamKeys.all, teamId, 'eligibility'],
    stats: (teamId, granularity) => [...myTeamKeys.all, teamId, 'stats', granularity],
    playerPerf: (playerId) => [...myTeamKeys.all, 'player-perf', playerId],
};

export const adminTeamKeys = {
    all: ['admin-teams'],
    list: (params) => [...adminTeamKeys.all, 'list', params],
    players: (teamId) => [...adminTeamKeys.all, teamId, 'players'],
};