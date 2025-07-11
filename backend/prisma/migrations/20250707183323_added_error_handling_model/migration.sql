/*
  Warnings:

  - The values [latinaamerican] on the enum `Categories` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ErrorSource" AS ENUM ('frontend', 'backend');

-- AlterEnum
BEGIN;
CREATE TYPE "Categories_new" AS ENUM ('asian', 'bakery', 'barfood', 'bbq', 'breakfast', 'burgers', 'cafe', 'chinese', 'desserts', 'fastfood', 'french', 'greek', 'healthy', 'indian', 'italian', 'japanese', 'korean', 'latinamerican', 'mediterranean', 'mexican', 'middleeastern', 'pizza', 'salads', 'sandwiches', 'seafood', 'sushi', 'thai', 'vegan', 'vegetarian', 'vietnamese');
ALTER TABLE "Restaurant" ALTER COLUMN "categories" TYPE "Categories_new"[] USING ("categories"::text::"Categories_new"[]);
ALTER TYPE "Categories" RENAME TO "Categories_old";
ALTER TYPE "Categories_new" RENAME TO "Categories";
DROP TYPE "Categories_old";
COMMIT;

-- CreateTable
CREATE TABLE "Error" (
    "error_id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 500,
    "error_source" "ErrorSource" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error_stack" TEXT,
    "route" TEXT,

    CONSTRAINT "Error_pkey" PRIMARY KEY ("error_id")
);
