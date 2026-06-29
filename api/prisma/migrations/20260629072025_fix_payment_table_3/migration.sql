/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transaction_ref]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vnp_transaction_no]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_season_team_id_fkey`;

-- DropIndex
DROP INDEX `payments_season_team_id_fkey` ON `payments`;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `deleted_at`,
    ADD COLUMN `vnp_transaction_no` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `payments_transaction_ref_key` ON `payments`(`transaction_ref`);

-- CreateIndex
CREATE UNIQUE INDEX `payments_vnp_transaction_no_key` ON `payments`(`vnp_transaction_no`);

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_season_team_id_fkey` FOREIGN KEY (`season_team_id`) REFERENCES `season_teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
