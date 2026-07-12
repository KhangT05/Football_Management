/*
  Warnings:

  - A unique constraint covering the columns `[phase_id,name]` on the table `groups` will be added. If there are existing duplicate values, this will fail.
  - Made the column `leg` on table `matches` required. This step will fail if there are existing NULL values in that column.

*/

-- CreateIndex
CREATE UNIQUE INDEX `groups_phase_id_name_key` ON `groups`(`phase_id`, `name`);
