/*
  Warnings:

  - Added the required column `tournament_rule_id` to the `seasons` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tournament_rules` DROP FOREIGN KEY `tournament_rules_tournament_id_fkey`;

-- DropIndex
DROP INDEX `tournament_rules_tournament_id_key` ON `tournament_rules`;

-- AlterTable
ALTER TABLE `phases` ADD COLUMN `teams_advance_per_group` INTEGER NULL;

-- AlterTable
ALTER TABLE `player_statistics` ADD COLUMN `suspension_matches_remaining` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `total_fine_owed` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `yellow_cards_since_reset` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `seasons`
ADD COLUMN `tournament_rule_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `tournament_rules` ADD COLUMN `fine_per_red_card` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `fine_per_yellow_card` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT 'Default Rule',
    ADD COLUMN `suspension_match_count` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `seasons` ADD CONSTRAINT `seasons_tournament_rule_id_fkey` FOREIGN KEY (`tournament_rule_id`) REFERENCES `tournament_rules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
