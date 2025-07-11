/*
  Warnings:

  - You are about to drop the column `user_id` on the `Rating` table. All the data in the column will be lost.
  - Added the required column `consumer_id` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "user_id",
ADD COLUMN     "consumer_id" INTEGER NOT NULL;
