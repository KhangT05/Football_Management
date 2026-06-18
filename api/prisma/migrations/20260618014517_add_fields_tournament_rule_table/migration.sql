/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `tournament_rules` ADD COLUMN `evidence_json` JSON NULL,
    ADD COLUMN `import_note` TEXT NULL,
    ADD COLUMN `source` VARCHAR(191) NOT NULL DEFAULT 'manual',
    ADD COLUMN `source_file_url` VARCHAR(191) NULL,
    MODIFY `max_players_per_team` INTEGER NOT NULL DEFAULT 11,
    MODIFY `min_players_per_team` INTEGER NOT NULL DEFAULT 7;

-- CreateIndex
CREATE UNIQUE INDEX `teams_name_key` ON `teams`(`name`);
