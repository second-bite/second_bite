/*
  Warnings:

  - You are about to drop the column `address_id` on the `Restaurant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Restaurant_address_id_key";

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "address_id";
