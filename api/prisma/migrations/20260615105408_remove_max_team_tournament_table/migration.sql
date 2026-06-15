/*
  Warnings:

  - You are about to drop the column `max_teams` on the `tournaments` table. All the data in the column will be lost.
  - Added the required column `max_teams` to the `seasons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `seasons` ADD COLUMN `max_teams` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tournaments` DROP COLUMN `max_teams`;
