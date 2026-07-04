-- DropForeignKey
ALTER TABLE `season_teams` DROP FOREIGN KEY `season_teams_group_id_fkey`;

-- DropIndex
DROP INDEX `season_teams_group_id_fkey` ON `season_teams`;

-- AddForeignKey
ALTER TABLE `season_teams` ADD CONSTRAINT `season_teams_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
