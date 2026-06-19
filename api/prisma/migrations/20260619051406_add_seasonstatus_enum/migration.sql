-- AlterTable
ALTER TABLE `season_teams` MODIFY `status` ENUM('approved', 'pending', 'active', 'eliminated', 'withdrawn') NOT NULL DEFAULT 'pending';
