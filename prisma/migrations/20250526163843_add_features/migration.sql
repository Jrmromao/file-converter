/*
  Warnings:

  - Added the required column `subscriberId` to the `feature_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feature_requests" ADD COLUMN     "subscriberId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "feature_requests" ADD CONSTRAINT "feature_requests_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "subscribers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
