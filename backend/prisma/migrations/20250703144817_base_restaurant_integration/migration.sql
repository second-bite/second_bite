/*
  Warnings:

  - A unique constraint covering the columns `[restaurant_id]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('Asian', 'Bakery', 'BarFood', 'BBQ', 'Breakfast', 'Burgers', 'Cafe', 'Chinese', 'Desserts', 'FastFood', 'French', 'Greek', 'Healthy', 'Indian', 'Italian', 'Japanese', 'Korean', 'LatinAmerican', 'Mediterranean', 'Mexican', 'MiddleEastern', 'Pizza', 'Salads', 'Sandwiches', 'Seafood', 'Sushi', 'Thai', 'Vegan', 'Vegetarian', 'Vietnamese');

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "restaurant_id" INTEGER;

-- CreateTable
CREATE TABLE "Rating" (
    "rating_id" SERIAL NOT NULL,
    "num_stars" INTEGER NOT NULL,
    "msg" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurant_id" INTEGER NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("rating_id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "restaurant_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "descr" TEXT NOT NULL,
    "address_id" INTEGER NOT NULL,
    "categories" "Categories"[],
    "img_url" TEXT NOT NULL,
    "img_alt" TEXT NOT NULL,
    "avg_cost" DECIMAL(65,30) NOT NULL,
    "pickup_time" TEXT[],
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("restaurant_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_address_id_key" ON "Restaurant"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "Address_restaurant_id_key" ON "Address"("restaurant_id");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("restaurant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Owner"("owner_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("restaurant_id") ON DELETE SET NULL ON UPDATE CASCADE;
