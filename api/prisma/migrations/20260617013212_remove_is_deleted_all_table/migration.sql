/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `match_results` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `season_team_players` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `season_teams` table. All the data in the column will be lost.
  - You are about to drop the column `registered_date` on the `season_teams` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `team_leaders` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `team_players` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `team_standings` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `tournament_rules` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `venues` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `match_results` DROP COLUMN `is_deleted`;

-- AlterTable
ALTER TABLE `matches` DROP COLUMN `is_deleted`;

-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `is_deleted`;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `is_deleted`;

-- AlterTable
ALTER TABLE `players` DROP COLUMN `is_deleted`;

-- AlterTable
ALTER TABLE `season_team_players` DROP COLUMN `is_deleted`;

-- AlterTable
ALTER TABLE `season_teams` DROP COLUMN `is_deleted`,
    DROP COLUMN `registered_date`;

-- AlterTable
ALTER TABLE `team_leaders` DROP COLUMN `is_deleted`;

-- AlterTable
ALTER TABLE `team_players` DROP COLUMN `is_deleted`;

-- AlterTable
ALTER TABLE `team_standings` DROP COLUMN `is_deleted`;

-- AlterTable
ALTER TABLE `teams` DROP COLUMN `is_deleted`;

-- AlterTable
ALTER TABLE `tournament_rules` DROP COLUMN `is_deleted`;

-- AlterTable
ALTER TABLE `venues` DROP COLUMN `is_deleted`;
