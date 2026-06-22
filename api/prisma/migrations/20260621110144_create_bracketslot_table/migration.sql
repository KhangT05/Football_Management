/*
  Warnings:

  - You are about to drop the column `next_match_id` on the `matches` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `matches` DROP FOREIGN KEY `matches_next_match_id_fkey`;

-- DropIndex
DROP INDEX `matches_next_match_id_fkey` ON `matches`;

-- AlterTable
ALTER TABLE `matches` DROP COLUMN `next_match_id`;

-- AlterTable
ALTER TABLE `phases` ADD COLUMN `legs` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `bracket_slots` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phase_id` INTEGER NOT NULL,
    `round` INTEGER NOT NULL,
    `slot_number` INTEGER NOT NULL,
    `match_id` INTEGER NULL,
    `source_a_slot_id` INTEGER NULL,
    `source_b_slot_id` INTEGER NULL,
    `seeded_home_team_id` INTEGER NULL,
    `seeded_away_team_id` INTEGER NULL,
    `is_bye` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `bracket_slots_match_id_key`(`match_id`),
    UNIQUE INDEX `bracket_slots_phase_id_round_slot_number_key`(`phase_id`, `round`, `slot_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bracket_slots` ADD CONSTRAINT `bracket_slots_phase_id_fkey` FOREIGN KEY (`phase_id`) REFERENCES `phases`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bracket_slots` ADD CONSTRAINT `bracket_slots_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bracket_slots` ADD CONSTRAINT `bracket_slots_source_a_slot_id_fkey` FOREIGN KEY (`source_a_slot_id`) REFERENCES `bracket_slots`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bracket_slots` ADD CONSTRAINT `bracket_slots_source_b_slot_id_fkey` FOREIGN KEY (`source_b_slot_id`) REFERENCES `bracket_slots`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
