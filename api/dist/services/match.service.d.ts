import { MatchPeriod, PrismaClient } from '../generated/prisma/client.js';
import { ConfirmResultOutput } from '../types/matchResult.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { AddEventInput, FinalizeMatchInput, ManualScoreInput, RecordEventInput, ResolveAppealInput, EditEventInput, EditScoreInput } from '../types/match.type.js';
import { MatchResultService } from './matchresult.service.js';
export declare class MatchLifecycleService {
    private readonly prisma;
    private readonly matchResultService;
    constructor(prisma: PrismaClient, matchResultService: MatchResultService);
    startMatch(matchId: number): Promise<void>;
    transitionPeriod(matchId: number, period: MatchPeriod): Promise<void>;
    recordEvent(matchId: number, input: RecordEventInput): Promise<void>;
    private _deriveCardColor;
    private _applyScoreDelta;
    private _computeScoreFromEvents;
    finalizeMatch(matchId: number, input: FinalizeMatchInput | undefined, _scheduleOptions: OptionalScheduleOptions): Promise<void>;
    submitManualScore(matchId: number, input: ManualScoreInput, _scheduleOptions: OptionalScheduleOptions): Promise<void>;
    confirmOfficial(matchId: number, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutput>;
    handleGracePeriodTimeout(gracePeriodMinutes: number | undefined, scheduleOptions: OptionalScheduleOptions): Promise<{
        autoOfficiated: number[];
        flaggedForReview: number[];
    }>;
    forfeitMatch(matchId: number, forfeitingTeamId: number, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutput>;
    abandonMatch(matchId: number, minute: number, reason?: string): Promise<void>;
    fileAppeal(matchId: number, reason: string): Promise<void>;
    fileProtest(matchId: number, reason: string): Promise<void>;
    private _fileDispute;
    resolveAppeal(matchId: number, input: ResolveAppealInput): Promise<void>;
    private _assertCorrectionWindow;
    addEvent(matchId: number, input: AddEventInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    deleteEvent(matchId: number, eventId: number, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    editEvent(matchId: number, eventId: number, input: EditEventInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    editScore(matchId: number, input: EditScoreInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    private _recalculateResult;
}
//# sourceMappingURL=match.service.d.ts.map