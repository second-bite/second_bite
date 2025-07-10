-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');

-- CreateTable
CREATE TABLE "Order" (
    "order_id" SERIAL NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "is_first_order" BOOLEAN NOT NULL,
    "order_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurant_id" INTEGER NOT NULL,
    "consumer_id" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "PageVisit" (
    "visit_id" SERIAL NOT NULL,
    "is_first_visit" BOOLEAN NOT NULL,
    "visit_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurant_id" INTEGER NOT NULL,
    "consumer_id" INTEGER NOT NULL,

    CONSTRAINT "PageVisit_pkey" PRIMARY KEY ("visit_id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("restaurant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "Consumer"("consumer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageVisit" ADD CONSTRAINT "PageVisit_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("restaurant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageVisit" ADD CONSTRAINT "PageVisit_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "Consumer"("consumer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
