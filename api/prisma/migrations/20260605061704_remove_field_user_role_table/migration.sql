/*
  Warnings:

  - You are about to drop the column `roleId` on the `user_role` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_role` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_role` DROP FOREIGN KEY `User_Role_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `user_role` DROP FOREIGN KEY `User_Role_userId_fkey`;

-- DropIndex
DROP INDEX `User_Role_roleId_fkey` ON `user_role`;

-- DropIndex
DROP INDEX `User_Role_userId_fkey` ON `user_role`;

-- AlterTable
ALTER TABLE `user_role` DROP COLUMN `roleId`,
    DROP COLUMN `userId`;

-- AddForeignKey
ALTER TABLE `User_Role` ADD CONSTRAINT `User_Role_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Role` ADD CONSTRAINT `User_Role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
