/*
  Warnings:

  - You are about to drop the column `created_by_id` on the `tournament_rules` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by_id` on the `tournament_rules` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_id` on the `tournament_rules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tournament_rules` DROP COLUMN `created_by_id`,
    DROP COLUMN `deleted_by_id`,
    DROP COLUMN `updated_by_id`;
