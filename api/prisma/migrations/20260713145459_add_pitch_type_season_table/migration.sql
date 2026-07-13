-- AlterTable
ALTER TABLE `seasons` ADD COLUMN `pitch_type` ENUM('san_5', 'san_7', 'san_11') NOT NULL DEFAULT 'san_5';
