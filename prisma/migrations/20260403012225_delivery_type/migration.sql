-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('FIXED', 'COURIER');

-- AlterTable
ALTER TABLE "DeliveryZone" ADD COLUMN     "type" "DeliveryType" NOT NULL DEFAULT 'FIXED',
ALTER COLUMN "regions" DROP NOT NULL;
