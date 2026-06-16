/*
  Warnings:

  - You are about to drop the `season_rules` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `seasons` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `season_rules` DROP FOREIGN KEY `season_rules_season_id_fkey`;

-- DropForeignKey
ALTER TABLE `season_rules` DROP FOREIGN KEY `season_rules_user_id_fkey`;

-- AlterTable
ALTER TABLE `seasons` ADD COLUMN `registration_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `season_rules`;

-- CreateTable
CREATE TABLE `tournament_rules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tournament_id` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_by_id` INTEGER NULL,
    `updated_by_id` INTEGER NULL,
    `deleted_by_id` INTEGER NULL,
    `points_per_win` INTEGER NOT NULL DEFAULT 3,
    `points_per_draw` INTEGER NOT NULL DEFAULT 1,
    `points_per_loss` INTEGER NOT NULL DEFAULT 0,
    `forfeit_score` INTEGER NOT NULL DEFAULT 3,
    `yellow_cards_suspension` INTEGER NOT NULL DEFAULT 3,
    `max_players_per_team` INTEGER NOT NULL DEFAULT 25,
    `min_players_per_team` INTEGER NOT NULL DEFAULT 11,
    `teams_advance_per_group` INTEGER NOT NULL DEFAULT 2,
    `tiebreaker_order` JSON NOT NULL,
    `user_id` INTEGER NULL,

    UNIQUE INDEX `tournament_rules_tournament_id_key`(`tournament_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `seasons_name_key` ON `seasons`(`name`);

-- AddForeignKey
ALTER TABLE `tournament_rules` ADD CONSTRAINT `tournament_rules_tournament_id_fkey` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tournament_rules` ADD CONSTRAINT `tournament_rules_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
