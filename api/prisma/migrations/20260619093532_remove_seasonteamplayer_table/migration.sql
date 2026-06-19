/*
  Warnings:

  - You are about to drop the `season_team_players` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `season_team_players` DROP FOREIGN KEY `season_team_players_season_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `season_team_players` DROP FOREIGN KEY `season_team_players_team_player_id_fkey`;

-- DropTable
DROP TABLE `season_team_players`;
