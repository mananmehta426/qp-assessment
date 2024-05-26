/*
  Warnings:

  - Made the column `description` on table `GroceryItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GroceryItem" ALTER COLUMN "description" SET NOT NULL;
