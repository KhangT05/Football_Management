/*
  Warnings:

  - You are about to drop the `csrf_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refresh_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `csrf_tokens` DROP FOREIGN KEY `csrf_tokens_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `refresh_tokens_user_id_fkey`;

-- DropTable
DROP TABLE `csrf_tokens`;

-- DropTable
DROP TABLE `refresh_tokens`;
