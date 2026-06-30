/*
  Warnings:

  - A unique constraint covering the columns `[phase_id,group_id,leg,home_team_id,away_team_id]` on the table `matches` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `matches` DROP FOREIGN KEY `matches_venue_id_fkey`;

-- DropIndex
DROP INDEX `matches_venue_id_scheduled_at_key` ON `matches`;

-- AlterTable
ALTER TABLE `phases` ADD COLUMN `teams_per_group` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `matches_phase_id_group_id_leg_home_team_id_away_team_id_key` ON `matches`(`phase_id`, `group_id`, `leg`, `home_team_id`, `away_team_id`);
