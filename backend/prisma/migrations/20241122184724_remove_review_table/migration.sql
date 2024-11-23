/*
  Warnings:

  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DriverToReview` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `comment` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Driver` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_DriverToReview` DROP FOREIGN KEY `_DriverToReview_A_fkey`;

-- DropForeignKey
ALTER TABLE `_DriverToReview` DROP FOREIGN KEY `_DriverToReview_B_fkey`;

-- AlterTable
ALTER TABLE `Driver` ADD COLUMN `comment` VARCHAR(191) NOT NULL,
    ADD COLUMN `rating` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Review`;

-- DropTable
DROP TABLE `_DriverToReview`;
