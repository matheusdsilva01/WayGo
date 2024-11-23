/*
  Warnings:

  - You are about to alter the column `value` on the `Driver` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Driver` MODIFY `value` DOUBLE NOT NULL;
