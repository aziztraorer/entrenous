/*
  Warnings:

  - Added the required column `firstName` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "categories" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "firstName" VARCHAR(100) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(100) NOT NULL;
