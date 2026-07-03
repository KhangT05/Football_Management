/*
  Warnings:

  - You are about to drop the column `replay_of_match_id` on the `matches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `matches` DROP COLUMN `replay_of_match_id`;

-- AlterTable
ALTER TABLE `seasons` ADD COLUMN `cancel_reason` VARCHAR(191) NULL;
