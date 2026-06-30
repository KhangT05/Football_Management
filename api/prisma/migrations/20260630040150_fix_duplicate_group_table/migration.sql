/*
  Warnings:

  - You are about to drop the column `is_active` on the `team_standings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[match_id,team_id]` on the table `match_jersey_assignments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `team_id` to the `match_jersey_assignments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bracket_slots` DROP FOREIGN KEY `bracket_slots_phase_id_fkey`;

-- DropForeignKey
ALTER TABLE `match_jersey_assignments` DROP FOREIGN KEY `match_jersey_assignments_match_id_fkey`;

-- DropForeignKey
ALTER TABLE `season_teams` DROP FOREIGN KEY `season_teams_group_id_fkey`;

-- DropIndex
DROP INDEX `match_jersey_assignments_match_id_key` ON `match_jersey_assignments`;

-- DropIndex
DROP INDEX `season_teams_group_id_fkey` ON `season_teams`;

-- AlterTable
ALTER TABLE `match_jersey_assignments` ADD COLUMN `team_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `team_standings` DROP COLUMN `is_active`,
    ADD COLUMN `season_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `match_jersey_assignments_match_id_team_id_key` ON `match_jersey_assignments`(`match_id`, `team_id`);

-- AddForeignKey
ALTER TABLE `bracket_slots` ADD CONSTRAINT `bracket_slots_phase_id_fkey` FOREIGN KEY (`phase_id`) REFERENCES `phases`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_jersey_assignments` ADD CONSTRAINT `match_jersey_assignments_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `season_teams` ADD CONSTRAINT `season_teams_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_events` ADD CONSTRAINT `match_events_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_events` ADD CONSTRAINT `match_events_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_events` ADD CONSTRAINT `match_events_sub_out_player_id_fkey` FOREIGN KEY (`sub_out_player_id`) REFERENCES `players`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_standings` ADD CONSTRAINT `team_standings_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `seasons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
