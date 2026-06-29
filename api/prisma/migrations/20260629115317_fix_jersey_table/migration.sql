/*
  Warnings:

  - You are about to drop the column `jersey_number` on the `match_lineups` table. All the data in the column will be lost.
  - You are about to drop the `team_jerseys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `team_jerseys` DROP FOREIGN KEY `team_jerseys_team_id_fkey`;

-- AlterTable
ALTER TABLE `match_lineups` DROP COLUMN `jersey_number`;

-- DropTable
DROP TABLE `team_jerseys`;

-- CreateTable
CREATE TABLE `match_jersey_assignments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `match_id` INTEGER NOT NULL,
    `season_jersey_id` INTEGER NOT NULL,

    UNIQUE INDEX `match_jersey_assignments_match_id_key`(`match_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `match_jersey_assignments` ADD CONSTRAINT `match_jersey_assignments_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_jersey_assignments` ADD CONSTRAINT `match_jersey_assignments_season_jersey_id_fkey` FOREIGN KEY (`season_jersey_id`) REFERENCES `season_team_jerseys`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
