/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `team_players` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `team_players` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `team_players` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[season_team_id,jersey_number]` on the table `team_players` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[season_team_id,player_id]` on the table `team_players` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `season_team_id` to the `team_players` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `team_players` DROP FOREIGN KEY `team_players_team_id_fkey`;

-- DropIndex
DROP INDEX `team_players_team_id_jersey_number_key` ON `team_players`;

-- DropIndex
DROP INDEX `team_players_team_id_player_id_key` ON `team_players`;

-- AlterTable
ALTER TABLE `team_players` DROP COLUMN `deleted_at`,
    DROP COLUMN `is_active`,
    DROP COLUMN `team_id`,
    ADD COLUMN `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `season_team_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `team_player_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `season_team_id` INTEGER NOT NULL,
    `player_id` INTEGER NOT NULL,
    `jersey_number` INTEGER NOT NULL,
    `position` ENUM('goalkeeper', 'defender', 'midfielder', 'forward') NOT NULL,
    `role` ENUM('player', 'captain', 'vice_captain') NOT NULL,
    `joined_at` DATETIME(3) NOT NULL,
    `left_at` DATETIME(3) NOT NULL,
    `left_reason` ENUM('transferred', 'dropped', 'disqualified', 'season_ended', 'injured') NULL,

    INDEX `team_player_history_player_id_idx`(`player_id`),
    INDEX `team_player_history_season_team_id_idx`(`season_team_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `team_players_season_team_id_jersey_number_key` ON `team_players`(`season_team_id`, `jersey_number`);

-- CreateIndex
CREATE UNIQUE INDEX `team_players_season_team_id_player_id_key` ON `team_players`(`season_team_id`, `player_id`);

-- AddForeignKey
ALTER TABLE `team_players` ADD CONSTRAINT `team_players_season_team_id_fkey` FOREIGN KEY (`season_team_id`) REFERENCES `season_teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_player_history` ADD CONSTRAINT `team_player_history_season_team_id_fkey` FOREIGN KEY (`season_team_id`) REFERENCES `season_teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_player_history` ADD CONSTRAINT `team_player_history_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
