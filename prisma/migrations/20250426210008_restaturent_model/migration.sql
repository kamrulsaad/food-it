-- DropForeignKey
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
