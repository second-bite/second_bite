/*
  Warnings:

  - You are about to drop the `_friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_A_fkey";

-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_B_fkey";

-- DropTable
DROP TABLE "_friends";

-- CreateTable
CREATE TABLE "Friendship" (
    "friendship_id" SERIAL NOT NULL,
    "consumer_id_a" INTEGER NOT NULL,
    "consumer_id_b" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("friendship_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_friendship_id_key" ON "Friendship"("friendship_id");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_consumer_id_a_consumer_id_b_key" ON "Friendship"("consumer_id_a", "consumer_id_b");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_consumer_id_a_fkey" FOREIGN KEY ("consumer_id_a") REFERENCES "Consumer"("consumer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_consumer_id_b_fkey" FOREIGN KEY ("consumer_id_b") REFERENCES "Consumer"("consumer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
