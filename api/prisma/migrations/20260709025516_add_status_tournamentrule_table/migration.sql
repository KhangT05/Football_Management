-- AlterTable
ALTER TABLE `seasons` ADD COLUMN `group_count` INTEGER NULL;

-- AlterTable
ALTER TABLE `tournament_rules` ADD COLUMN `format` ENUM('round_robin', 'knockout', 'round_robin_knockout', 'multi_round_robin_knockout') NOT NULL DEFAULT 'round_robin_knockout',
    ADD COLUMN `round_robin_stages` INTEGER NOT NULL DEFAULT 1;
