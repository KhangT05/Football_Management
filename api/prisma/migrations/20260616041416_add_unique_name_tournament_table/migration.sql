/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `tournaments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `venues` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tournaments_name_key` ON `tournaments`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `venues_name_key` ON `venues`(`name`);
