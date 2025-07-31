/*
  Warnings:

  - The primary key for the `Favorite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `favorite_id` on the `Favorite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[consumer_id,restaurant_id]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_pkey",
DROP COLUMN "favorite_id";

-- CreateTable
CREATE TABLE "Message" (
    "message_id" SERIAL NOT NULL,
    "sender_consumer_id" INTEGER NOT NULL,
    "receiver_consumer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("message_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_message_id_key" ON "Message"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_consumer_id_restaurant_id_key" ON "Favorite"("consumer_id", "restaurant_id");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_consumer_id_fkey" FOREIGN KEY ("sender_consumer_id") REFERENCES "Consumer"("consumer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiver_consumer_id_fkey" FOREIGN KEY ("receiver_consumer_id") REFERENCES "Consumer"("consumer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
