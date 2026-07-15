-- AlterTable
ALTER TABLE `match_events` ADD COLUMN `time_source` ENUM('live', 'estimated') NOT NULL DEFAULT 'estimated';
