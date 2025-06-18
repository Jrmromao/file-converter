/*
  Warnings:

  - You are about to drop the `feature_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscribers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "feature_requests" DROP CONSTRAINT "feature_requests_subscriberId_fkey";

-- DropTable
DROP TABLE "feature_requests";

-- DropTable
DROP TABLE "features";

-- DropTable
DROP TABLE "subscribers";

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "interests" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");
