-- CreateTable
CREATE TABLE "Consumer" (
    "consumer_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Consumer_pkey" PRIMARY KEY ("consumer_id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "owner_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("owner_id")
);

-- CreateTable
CREATE TABLE "Address" (
    "street_address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address_id" SERIAL NOT NULL,
    "consumer_id" INTEGER,
    "owner_id" INTEGER,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("address_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Consumer_consumer_id_key" ON "Consumer"("consumer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Consumer_username_key" ON "Consumer"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_username_key" ON "Owner"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Address_consumer_id_key" ON "Address"("consumer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Address_owner_id_key" ON "Address"("owner_id");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "Consumer"("consumer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Owner"("owner_id") ON DELETE SET NULL ON UPDATE CASCADE;
