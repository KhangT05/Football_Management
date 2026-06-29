/*
  Warnings:

  - You are about to drop the column `vnp_transaction_no` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `payments` DROP COLUMN `vnp_transaction_no`,
    ADD COLUMN `paid_at` DATETIME(3) NULL,
    ADD COLUMN `transaction_ref` VARCHAR(191) NULL;
