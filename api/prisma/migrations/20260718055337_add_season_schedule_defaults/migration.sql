-- AlterTable
ALTER TABLE `seasons` ADD COLUMN `default_buffer_minutes` INTEGER NULL,
    ADD COLUMN `default_daily_end_time` VARCHAR(5) NULL,
    ADD COLUMN `default_daily_start_time` VARCHAR(5) NULL;

-- CreateTable
CREATE TABLE `SeasonDefaultVenue` (
    `season_id` INTEGER NOT NULL,
    `venue_id` INTEGER NOT NULL,

    PRIMARY KEY (`season_id`, `venue_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SeasonDefaultVenue` ADD CONSTRAINT `SeasonDefaultVenue_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `seasons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeasonDefaultVenue` ADD CONSTRAINT `SeasonDefaultVenue_venue_id_fkey` FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
