/*
  Warnings:

  - A unique constraint covering the columns `[student_code]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `seasons` ADD COLUMN `max_teams_per_class` INTEGER NULL;

-- AlterTable
ALTER TABLE `teams` ADD COLUMN `class_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `class_id` INTEGER NULL,
    ADD COLUMN `student_code` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `classes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `classes_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_student_code_key` ON `users`(`student_code`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
