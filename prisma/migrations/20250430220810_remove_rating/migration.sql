/*
  Warnings:

  - You are about to drop the `ratings` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `cityId` on table `restaurants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `closingTime` on table `restaurants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coverPhoto` on table `restaurants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryTime` on table `restaurants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `openingTime` on table `restaurants` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_userId_fkey";

-- DropForeignKey
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_cityId_fkey";

-- AlterTable
ALTER TABLE "restaurants" ALTER COLUMN "cityId" SET NOT NULL,
ALTER COLUMN "closingTime" SET NOT NULL,
ALTER COLUMN "coverPhoto" SET NOT NULL,
ALTER COLUMN "deliveryTime" SET NOT NULL,
ALTER COLUMN "openingTime" SET NOT NULL;

-- DropTable
DROP TABLE "ratings";

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
