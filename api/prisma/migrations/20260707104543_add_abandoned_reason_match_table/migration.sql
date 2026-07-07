-- AlterTable
ALTER TABLE `matches` ADD COLUMN `abandoned_reason` VARCHAR(191) NULL,
    ADD COLUMN `grace_period_retry_count` INTEGER NOT NULL DEFAULT 0;
