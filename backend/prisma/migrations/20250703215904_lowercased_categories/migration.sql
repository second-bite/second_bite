/*
  Warnings:

  - The values [Asian,Bakery,BarFood,BBQ,Breakfast,Burgers,Cafe,Chinese,Desserts,FastFood,French,Greek,Healthy,Indian,Italian,Japanese,Korean,LatinAmerican,Mediterranean,Mexican,MiddleEastern,Pizza,Salads,Sandwiches,Seafood,Sushi,Thai,Vegan,Vegetarian,Vietnamese] on the enum `Categories` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Categories_new" AS ENUM ('asian', 'bakery', 'barfood', 'bbq', 'breakfast', 'burgers', 'cafe', 'chinese', 'desserts', 'fastfood', 'french', 'greek', 'healthy', 'indian', 'italian', 'japanese', 'korean', 'latinaamerican', 'mediterranean', 'mexican', 'middleeastern', 'pizza', 'salads', 'sandwiches', 'seafood', 'sushi', 'thai', 'vegan', 'vegetarian', 'vietnamese');
ALTER TABLE "Restaurant" ALTER COLUMN "categories" TYPE "Categories_new"[] USING ("categories"::text::"Categories_new"[]);
ALTER TYPE "Categories" RENAME TO "Categories_old";
ALTER TYPE "Categories_new" RENAME TO "Categories";
DROP TYPE "Categories_old";
COMMIT;
