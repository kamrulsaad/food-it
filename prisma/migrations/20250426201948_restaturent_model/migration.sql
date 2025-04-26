/*
  Warnings:

  - Added the required column `city` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `restaurants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;
