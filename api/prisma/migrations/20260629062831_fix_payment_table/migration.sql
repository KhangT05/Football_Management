/*
  Warnings:

  - You are about to drop the column `is_active` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paid_at` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_ref` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `payments` DROP COLUMN `is_active`,
    DROP COLUMN `paid_at`,
    DROP COLUMN `transaction_ref`,
    ADD COLUMN `refund_amount` DECIMAL(65, 30) NULL,
    ADD COLUMN `refunded_at` DATETIME(3) NULL,
    ADD COLUMN `refunded_by` INTEGER NULL,
    ADD COLUMN `vnp_transaction_no` VARCHAR(191) NULL,
    MODIFY `status` ENUM('pending', 'confirmed', 'rejected', 'refund_pending', 'refunded') NOT NULL DEFAULT 'pending';
