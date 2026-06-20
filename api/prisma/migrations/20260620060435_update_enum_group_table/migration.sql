/*
  Warnings:

  - A unique constraint covering the columns `[venue_id,scheduled_at]` on the table `matches` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `groups` ADD COLUMN `scheduleGeneratedAt` DATETIME(3) NULL,
    ADD COLUMN `status` ENUM('DRAFT', 'LOCKED', 'SCHEDULED', 'SCHEDULE_FAILED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `phases` ADD COLUMN `min_rest_days_per_team` INTEGER NOT NULL DEFAULT 3;

-- CreateIndex
CREATE UNIQUE INDEX `matches_venue_id_scheduled_at_key` ON `matches`(`venue_id`, `scheduled_at`);
