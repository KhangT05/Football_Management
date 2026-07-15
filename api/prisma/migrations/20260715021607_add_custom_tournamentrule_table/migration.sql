-- AlterTable
ALTER TABLE `tournament_rules` ADD COLUMN `custom_stages` JSON NULL,
    MODIFY `format` ENUM('round_robin', 'knockout', 'round_robin_knockout', 'multi_round_robin_knockout', 'custom') NOT NULL DEFAULT 'round_robin_knockout';
