/*
  Warnings:

  - You are about to drop the column `away_half_time_score` on the `match_results` table. All the data in the column will be lost.
  - You are about to drop the column `away_score` on the `match_results` table. All the data in the column will be lost.
  - You are about to drop the column `home_half_time_score` on the `match_results` table. All the data in the column will be lost.
  - You are about to drop the column `home_score` on the `match_results` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `match_results` DROP COLUMN `away_half_time_score`,
    DROP COLUMN `away_score`,
    DROP COLUMN `home_half_time_score`,
    DROP COLUMN `home_score`;
