/*
  Warnings:

  - Made the column `imageUrl` on table `cities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `menu_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `logo` on table `restaurants` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cities" ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "menu_items" ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "restaurants" ALTER COLUMN "logo" SET NOT NULL;
