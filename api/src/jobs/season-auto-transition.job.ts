import { PrismaClient, SeasonStatus } from '../generated/prisma/client.js';
import { createLogger } from '../libs/logger.js';

const logger = createLogger('season-auto-transition');

export async function runSeasonAutoTransition(prisma: PrismaClient): Promise<void> {
    const now = new Date();

    // ─── 1. Status transitions ───────────────────────────────────────
    const transitions: Array<{
        from: SeasonStatus;
        to: SeasonStatus;
        condition: Record<string, unknown>;
    }> = [
            { from: 'registration_open', to: 'ongoing', condition: { start_date: { lte: now } } },
            { from: 'ongoing', to: 'finished', condition: { end_date: { lte: now } } },
        ];

    for (const { from, to, condition } of transitions) {
        try {
            const result = await prisma.season.updateMany({
                where: { status: from, is_active: true, is_deleted: false, ...condition },
                data: {
                    status: to,
                    ...(to === 'finished' && { is_active: false }),
                },
            });
            if (result.count > 0) {
                logger.info({ from, to, count: result.count }, 'Season auto-transition');
            }
        } catch (err) {
            logger.error({ from, to, err }, 'Season auto-transition failed');
        }
    }

    // ─── 4. Stale-cleanup: upcoming seasons >= 15 ngày, chưa set dates ──
    try {
        const cutoff = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
        const result = await prisma.season.updateMany({
            where: {
                status: 'upcoming',
                is_active: true,
                created_at: { lte: cutoff },
                start_date: null,
                end_date: null,
                registration_deadline: null,
            },
            data: { is_active: false, is_deleted: true, deleted_at: now },
        });
        if (result.count > 0) {
            logger.info({ count: result.count, cutoff }, 'Season stale-cleanup');
        }
    } catch (err) {
        logger.error({ err }, 'Season stale-cleanup failed');
    }
}