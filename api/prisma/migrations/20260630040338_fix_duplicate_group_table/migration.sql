-- AddForeignKey
ALTER TABLE `match_jersey_assignments` ADD CONSTRAINT `match_jersey_assignments_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
