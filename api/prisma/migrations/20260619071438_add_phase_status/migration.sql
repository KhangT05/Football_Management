-- AlterTable
ALTER TABLE `phases` ADD COLUMN `status` ENUM('draft', 'in_progress', 'locked') NOT NULL DEFAULT 'draft';
