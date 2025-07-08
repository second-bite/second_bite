-- AlterTable
ALTER TABLE "Consumer" ADD COLUMN     "reservation_expiration" TIMESTAMP(3),
ADD COLUMN     "reserved_restaurant_id" INTEGER;
