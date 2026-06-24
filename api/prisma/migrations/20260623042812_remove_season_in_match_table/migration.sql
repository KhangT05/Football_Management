/*
  Warnings:

  - You are about to drop the column `season_id` on the `matches` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `matches` DROP FOREIGN KEY `matches_season_id_fkey`;

-- DropIndex
DROP INDEX `matches_season_id_fkey` ON `matches`;

-- AlterTable
ALTER TABLE `matches` DROP COLUMN `season_id`;
