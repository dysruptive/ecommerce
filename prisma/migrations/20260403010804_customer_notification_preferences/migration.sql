/*
  Warnings:

  - You are about to drop the column `arkeselApiKey` on the `Tenant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inviteToken]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "notifyByEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyBySMS" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "arkeselApiKey",
ADD COLUMN     "inviteToken" TEXT,
ADD COLUMN     "inviteTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "onboardingDismissedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_inviteToken_key" ON "Tenant"("inviteToken");
