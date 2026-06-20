// ============================================================
// DATE UTILS — timezone-safe
// ============================================================
/**
 * Tạo Date object tại midnight UTC+7 (Asia/Ho_Chi_Minh).
 * Dùng explicit offset thay vì new Date(string) để tránh
 * parser ambiguity (ISO string → UTC, local string → local TZ).
 *
 * MariaDB DATETIME không lưu timezone → luôn truyền vào giờ
 * nhất quán (UTC hoặc UTC+7). Chọn UTC+7 vì app ở VN.
 *
 * UTC+7 midnight = UTC 17:00 hôm trước
 */
function makeMatchDate(year, month, day, hour = 15) {
    // month là 1-based
    // Tạo theo UTC, offset -7h để ra "15:00 UTC = 22:00 UTC+7"
    // hoặc dùng 08:00 UTC = 15:00 UTC+7 (giờ đá bóng hợp lý)
    return new Date(Date.UTC(year, month - 1, day, hour - 7 < 0 ? hour + 17 : hour - 7, 0, 0));
    // Ví dụ: 15:00 UTC+7 = 08:00 UTC
}
/**
 * Thêm N ngày vào một Date (không mutation).
 */
function addDays(date, days) {
    return new Date(date.getTime() + days * 86_400_000);
}
/**
 * Thêm N ngày vào date, đồng thời offset thêm theo slotIndex
 * để các match trong cùng 1 vòng không trùng venue+time.
 *
 * Nếu có nhiều venue thì rotate venue thay vì chỉ offset ngày.
 * Seeder này dùng 1 venue → offset ngày là đủ.
 */
function matchDateForSlot(base, dayOffset, slotIndex) {
    // Mỗi slot cách nhau 1 ngày nếu cùng venue
    return addDays(base, dayOffset + slotIndex);
}
// ============================================================
// HELPERS (giữ nguyên từ bản gốc)
// ============================================================
function roundRobinPairs(teamIds) {
    const pairs = [];
    for (let i = 0; i < teamIds.length; i++) {
        for (let j = i + 1; j < teamIds.length; j++) {
            pairs.push([teamIds[i], teamIds[j]]);
        }
    }
    return pairs;
}
function randomScore() {
    const options = [
        [1, 0], [2, 0], [3, 0], [1, 1], [2, 1],
        [3, 1], [2, 2], [3, 2], [0, 1], [0, 2],
        [1, 2], [0, 3], [1, 3], [2, 3], [3, 3],
        [4, 1], [1, 4], [0, 0],
    ];
    return options[Math.floor(Math.random() * options.length)];
}
async function createMatchEvents(db, matchId, homeTeamId, awayTeamId, homeScore, awayScore, homePlayerIds, awayPlayerIds) {
    const goalMinutes = Array.from({ length: homeScore + awayScore }, () => Math.floor(Math.random() * 90) + 1).sort((a, b) => a - b);
    let hGoals = 0;
    let aGoals = 0;
    for (const minute of goalMinutes) {
        const isHome = hGoals < homeScore && (aGoals >= awayScore || Math.random() > 0.5);
        const teamId = isHome ? homeTeamId : awayTeamId;
        const players = isHome ? homePlayerIds : awayPlayerIds;
        const scorerId = players[Math.floor(Math.random() * players.length)];
        if (scorerId === undefined)
            continue;
        if (isHome)
            hGoals++;
        else
            aGoals++;
        await db.matchEvent.create({
            data: {
                match_id: matchId,
                player_id: scorerId,
                team_id: teamId,
                type: "goal",
                minute,
                period: minute <= 45 ? "first_half" : "second_half",
            },
        });
    }
    const numYellows = Math.floor(Math.random() * 4);
    for (let i = 0; i < numYellows; i++) {
        const isHome = Math.random() > 0.5;
        const teamId = isHome ? homeTeamId : awayTeamId;
        const players = isHome ? homePlayerIds : awayPlayerIds;
        const slice = players.length > 3 ? players.slice(3) : players;
        const playerId = slice[Math.floor(Math.random() * slice.length)];
        if (playerId === undefined)
            continue;
        await db.matchEvent.create({
            data: {
                match_id: matchId,
                player_id: playerId,
                team_id: teamId,
                type: "yellow_card",
                minute: Math.floor(Math.random() * 90) + 1,
                period: "second_half",
                card_color: "yellow",
            },
        });
    }
}
async function updateStanding(db, groupId, teamId, goalsFor, goalsAgainst, result) {
    const standing = await db.teamStanding.findUnique({
        where: { group_id_team_id: { group_id: groupId, team_id: teamId } },
    });
    if (!standing)
        return;
    await db.teamStanding.update({
        where: { id: standing.id },
        data: {
            matches_played: { increment: 1 },
            wins: result === "win" ? { increment: 1 } : undefined,
            draws: result === "draw" ? { increment: 1 } : undefined,
            losses: result === "loss" ? { increment: 1 } : undefined,
            goals_for: { increment: goalsFor },
            goals_against: { increment: goalsAgainst },
            points: {
                increment: result === "win" ? 3 : result === "draw" ? 1 : 0,
            },
        },
    });
}
async function updatePlayerStat(db, playerId, teamId, seasonId, goals, yellowCards) {
    const existing = await db.playerStatistic.findUnique({
        where: { player_id_team_id_season_id: { player_id: playerId, team_id: teamId, season_id: seasonId } },
    });
    if (existing) {
        await db.playerStatistic.update({
            where: { id: existing.id },
            data: {
                matches_played: { increment: 1 },
                goals_scored: { increment: goals },
                yellow_cards: { increment: yellowCards },
                accumulated_yellow_cards: { increment: yellowCards },
                minutes_played: { increment: 90 },
                is_suspended: existing.accumulated_yellow_cards + yellowCards >= 3,
            },
        });
    }
    else {
        await db.playerStatistic.create({
            data: {
                player_id: playerId,
                team_id: teamId,
                season_id: seasonId,
                matches_played: 1,
                goals_scored: goals,
                yellow_cards: yellowCards,
                accumulated_yellow_cards: yellowCards,
                minutes_played: 90,
                is_suspended: yellowCards >= 3,
            },
        });
    }
}
// ============================================================
// KNOCKOUT HELPER — tránh lặp code
// ============================================================
async function createKnockoutMatch(db, params) {
    const { phaseId, homeId, awayId, scheduledAt, seasonId, venueId, adminUserId } = params;
    const [hs, as_] = randomScore();
    const isExtraTime = hs === as_;
    const finalHomeWin = isExtraTime ? Math.random() > 0.5 : hs > as_;
    const winnerId = finalHomeWin ? homeId : awayId;
    const loserId = finalHomeWin ? awayId : homeId;
    const match = await db.match.create({
        data: {
            phase_id: phaseId,
            home_team_id: homeId,
            away_team_id: awayId,
            scheduled_at: scheduledAt,
            played_at: scheduledAt,
            home_score: hs,
            away_score: as_,
            status: "finished",
            season_id: seasonId,
            venue_id: venueId,
            is_published: true,
            user_id: adminUserId,
        },
    });
    await db.matchResult.create({
        data: {
            match_id: match.id,
            winner_team_id: winnerId,
            home_score: hs,
            away_score: as_,
            home_half_time_score: Math.floor(hs / 2),
            away_half_time_score: Math.floor(as_ / 2),
            home_final_score: hs,
            away_final_score: as_,
            home_penalty_score: isExtraTime ? (finalHomeWin ? 5 : 4) : null,
            away_penalty_score: isExtraTime ? (finalHomeWin ? 4 : 5) : null,
            result_type: isExtraTime ? "penalty" : "full_time",
            status: "official",
            duration: isExtraTime ? 120 : 90,
        },
    });
    return { matchId: match.id, winnerId, loserId, isExtraTime };
}
// ============================================================
// MAIN SEEDER
// ============================================================
export async function seedMatches(db, seasonId, phaseResult, teams, venueId, adminUserId) {
    console.log("[MatchSeeder] seeding group stage matches...");
    const { groupStagePhaseId, knockoutPhaseIds, groupIds } = phaseResult;
    const [groupAId, groupBId] = groupIds;
    const groupATeams = teams.slice(0, 4);
    const groupBTeams = teams.slice(4, 8);
    const groupConfig = [
        { groupId: groupAId, groupTeams: groupATeams, baseDate: makeMatchDate(2024, 3, 1) },
        { groupId: groupBId, groupTeams: groupBTeams, baseDate: makeMatchDate(2024, 3, 2) },
        // Group B bắt đầu lệch 1 ngày để không trùng venue+date với Group A
    ];
    const groupWinners = {};
    for (const { groupId, groupTeams, baseDate } of groupConfig) {
        const pairs = roundRobinPairs(groupTeams.map((t) => t.teamId));
        for (let pairIdx = 0; pairIdx < pairs.length; pairIdx++) {
            const [homeTeamId, awayTeamId] = pairs[pairIdx];
            // Mỗi cặp match cách nhau 3 ngày, đảm bảo không trùng venue+scheduled_at
            // Với venue đơn: mỗi match = 1 ngày riêng
            const scheduledAt = addDays(baseDate, pairIdx * 3);
            const homeScore = randomScore()[0];
            const awayScore = randomScore()[1];
            const homeTeam = groupTeams.find((t) => t.teamId === homeTeamId);
            const awayTeam = groupTeams.find((t) => t.teamId === awayTeamId);
            const match = await db.match.create({
                data: {
                    phase_id: groupStagePhaseId,
                    group_id: groupId,
                    home_team_id: homeTeamId,
                    away_team_id: awayTeamId,
                    scheduled_at: scheduledAt,
                    played_at: scheduledAt,
                    home_score: homeScore,
                    away_score: awayScore,
                    status: "finished",
                    season_id: seasonId,
                    venue_id: venueId,
                    is_published: true,
                    user_id: adminUserId,
                },
            });
            await createMatchEvents(db, match.id, homeTeamId, awayTeamId, homeScore, awayScore, homeTeam.playerIds, awayTeam.playerIds);
            const winnerId = homeScore > awayScore ? homeTeamId : awayScore > homeScore ? awayTeamId : null;
            await db.matchResult.create({
                data: {
                    match_id: match.id,
                    winner_team_id: winnerId,
                    home_score: homeScore,
                    away_score: awayScore,
                    home_half_time_score: Math.floor(homeScore / 2),
                    away_half_time_score: Math.floor(awayScore / 2),
                    home_final_score: homeScore,
                    away_final_score: awayScore,
                    result_type: "full_time",
                    status: "official",
                    duration: 90,
                },
            });
            if (homeScore > awayScore) {
                await updateStanding(db, groupId, homeTeamId, homeScore, awayScore, "win");
                await updateStanding(db, groupId, awayTeamId, awayScore, homeScore, "loss");
            }
            else if (homeScore < awayScore) {
                await updateStanding(db, groupId, awayTeamId, awayScore, homeScore, "win");
                await updateStanding(db, groupId, homeTeamId, homeScore, awayScore, "loss");
            }
            else {
                await updateStanding(db, groupId, homeTeamId, homeScore, awayScore, "draw");
                await updateStanding(db, groupId, awayTeamId, awayScore, homeScore, "draw");
            }
            const events = await db.matchEvent.findMany({ where: { match_id: match.id } });
            const allTeamPlayers = [
                ...homeTeam.playerIds.map((pid) => ({ playerId: pid, teamId: homeTeamId })),
                ...awayTeam.playerIds.map((pid) => ({ playerId: pid, teamId: awayTeamId })),
            ];
            for (const { playerId, teamId } of allTeamPlayers) {
                const goals = events.filter((e) => e.player_id === playerId && e.type === "goal").length;
                const yellows = events.filter((e) => e.player_id === playerId && e.type === "yellow_card").length;
                if (goals > 0 || yellows > 0) {
                    await updatePlayerStat(db, playerId, teamId, seasonId, goals, yellows);
                }
            }
        }
        const standings = await db.teamStanding.findMany({
            where: { group_id: groupId },
            orderBy: [{ points: "desc" }, { goals_for: "desc" }],
        });
        for (let i = 0; i < standings.length; i++) {
            await db.teamStanding.update({
                where: { id: standings[i].id },
                data: { position: i + 1 },
            });
        }
        groupWinners[groupId] = standings.slice(0, 2).map((s) => s.team_id);
        console.log(`  → Group #${groupId} top 2:`, groupWinners[groupId]);
    }
    // ============================================================
    // KNOCKOUT — mỗi match đặt ngày riêng biệt, không trùng venue
    // ============================================================
    console.log("[MatchSeeder] seeding knockout matches...");
    const groupAWinners = groupWinners[groupAId];
    const groupBWinners = groupWinners[groupBId];
    if (!groupAWinners || !groupBWinners) {
        throw new Error("Missing group winners — standings not computed correctly");
    }
    const [a1, a2] = groupAWinners;
    const [b1, b2] = groupBWinners;
    const qfPhaseId = knockoutPhaseIds["quarter_final"];
    const sfPhaseId = knockoutPhaseIds["semi_final"];
    const thirdPlacePhaseId = knockoutPhaseIds["third_place"];
    const finalPhaseId = knockoutPhaseIds["final"];
    if (!qfPhaseId || !sfPhaseId || !thirdPlacePhaseId || !finalPhaseId) {
        throw new Error("Missing one or more knockout phase IDs");
    }
    // Quarter finals — QF1 và QF2 đặt cách nhau 3 ngày (khác ngày = không trùng venue)
    const qfBaseDate = makeMatchDate(2024, 4, 20);
    const qfPairs = [[a1, b2], [b1, a2]];
    const sfTeams = [];
    for (let i = 0; i < qfPairs.length; i++) {
        const [homeId, awayId] = qfPairs[i];
        const scheduledAt = addDays(qfBaseDate, i * 3); // QF1: Apr 20, QF2: Apr 23
        const { winnerId } = await createKnockoutMatch(db, {
            phaseId: qfPhaseId,
            homeId,
            awayId,
            scheduledAt,
            seasonId,
            venueId,
            adminUserId,
        });
        sfTeams.push(winnerId);
    }
    // Semi finals — sau QF ít nhất 10 ngày, mỗi SF cách 3 ngày
    const sfBaseDate = makeMatchDate(2024, 5, 5);
    const finalists = [];
    const thirdPlaceTeams = [];
    for (let i = 0; i + 1 < sfTeams.length; i += 2) {
        const homeId = sfTeams[i];
        const awayId = sfTeams[i + 1];
        const scheduledAt = addDays(sfBaseDate, i * 3); // SF1: May 5, SF2: May 8
        const { winnerId, loserId } = await createKnockoutMatch(db, {
            phaseId: sfPhaseId,
            homeId,
            awayId,
            scheduledAt,
            seasonId,
            venueId,
            adminUserId,
        });
        finalists.push(winnerId);
        thirdPlaceTeams.push(loserId);
    }
    // Third place — Jun 25
    const thirdHome = thirdPlaceTeams[0];
    const thirdAway = thirdPlaceTeams[1];
    if (thirdHome !== undefined && thirdAway !== undefined) {
        const scheduledAt = makeMatchDate(2024, 6, 25);
        const [hs, as_] = randomScore();
        const winnerId = hs >= as_ ? thirdHome : thirdAway;
        const match = await db.match.create({
            data: {
                phase_id: thirdPlacePhaseId,
                home_team_id: thirdHome,
                away_team_id: thirdAway,
                scheduled_at: scheduledAt,
                played_at: scheduledAt,
                home_score: hs,
                away_score: as_,
                status: "finished",
                season_id: seasonId,
                venue_id: venueId,
                is_published: true,
                user_id: adminUserId,
            },
        });
        await db.matchResult.create({
            data: {
                match_id: match.id,
                winner_team_id: winnerId,
                home_score: hs,
                away_score: as_,
                home_half_time_score: Math.floor(hs / 2),
                away_half_time_score: Math.floor(as_ / 2),
                home_final_score: hs,
                away_final_score: as_,
                result_type: "full_time",
                status: "official",
                duration: 90,
            },
        });
        console.log(`  → 3rd place: Team #${thirdHome} vs #${thirdAway}, winner: #${winnerId}`);
    }
    // Final — Jun 30 (khác ngày third place → không trùng venue)
    const finalist0 = finalists[0];
    const finalist1 = finalists[1];
    if (finalist0 !== undefined && finalist1 !== undefined) {
        const scheduledAt = makeMatchDate(2024, 6, 30);
        const { winnerId: champion } = await createKnockoutMatch(db, {
            phaseId: finalPhaseId,
            homeId: finalist0,
            awayId: finalist1,
            scheduledAt,
            seasonId,
            venueId,
            adminUserId,
        });
        console.log(`  → CHAMPION: Team #${champion}`);
        await db.notification.create({
            data: {
                title: "🏆 Chúc mừng Vô Địch!",
                content: `Đội #${champion} đã vô địch Mùa Giải 2024!`,
                type: "match_result",
                source: "system",
                season_id: seasonId,
                target_team_id: champion,
                is_read: false,
            },
        });
    }
    console.log("[MatchSeeder] done.");
}
//# sourceMappingURL=matchSeeder.js.map