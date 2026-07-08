-- AlterTable
ALTER TABLE `tournament_rules` ADD COLUMN `bonus_per_assist` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `bonus_per_goal` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `tournament_rules` ADD CONSTRAINT `tournament_rules_tournament_id_fkey` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
