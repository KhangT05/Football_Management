-- AlterTable
ALTER TABLE `matches` ADD COLUMN `finalize_away_half_time` INTEGER NULL,
    ADD COLUMN `finalize_away_penalty` INTEGER NULL,
    ADD COLUMN `finalize_home_half_time` INTEGER NULL,
    ADD COLUMN `finalize_home_penalty` INTEGER NULL,
    ADD COLUMN `finalize_result_type` ENUM('full_time', 'extra_time', 'penalty', 'forfeit', 'walkover') NULL,
    ADD COLUMN `manual_away_score` INTEGER NULL,
    ADD COLUMN `manual_home_score` INTEGER NULL,
    ADD COLUMN `pending_official_at` DATETIME(3) NULL,
    MODIFY `status` ENUM('scheduled', 'ongoing', 'finished', 'cancelled', 'forfeited', 'postponed', 'bye', 'abandoned', 'pending_official', 'needs_review') NOT NULL DEFAULT 'scheduled';
