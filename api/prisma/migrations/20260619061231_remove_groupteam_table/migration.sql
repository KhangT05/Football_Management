/*
  Warnings:

  - You are about to drop the `group_teams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `group_teams` DROP FOREIGN KEY `group_teams_group_id_fkey`;

-- DropForeignKey
ALTER TABLE `group_teams` DROP FOREIGN KEY `group_teams_team_id_fkey`;

-- DropTable
DROP TABLE `group_teams`;
