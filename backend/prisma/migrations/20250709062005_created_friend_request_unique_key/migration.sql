-- CreateTable
CREATE TABLE "FriendRequest" (
    "friend_request_id" SERIAL NOT NULL,
    "sender_consumer_id" INTEGER NOT NULL,
    "receiver_consumer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("friend_request_id")
);

-- CreateTable
CREATE TABLE "_friends" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_friends_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_friend_request_id_key" ON "FriendRequest"("friend_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_sender_consumer_id_receiver_consumer_id_key" ON "FriendRequest"("sender_consumer_id", "receiver_consumer_id");

-- CreateIndex
CREATE INDEX "_friends_B_index" ON "_friends"("B");

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_sender_consumer_id_fkey" FOREIGN KEY ("sender_consumer_id") REFERENCES "Consumer"("consumer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiver_consumer_id_fkey" FOREIGN KEY ("receiver_consumer_id") REFERENCES "Consumer"("consumer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "Consumer"("consumer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "Consumer"("consumer_id") ON DELETE CASCADE ON UPDATE CASCADE;
