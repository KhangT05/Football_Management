/*
  Warnings:

  - You are about to drop the `userrole` table. If the table is not empty, all the data it contains will be lost.

*/

-- CreateTable
CREATE TABLE `User_Role` (
    `user_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `roleId` INTEGER NULL,

    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User_Role` ADD CONSTRAINT `User_Role_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Role` ADD CONSTRAINT `User_Role_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
