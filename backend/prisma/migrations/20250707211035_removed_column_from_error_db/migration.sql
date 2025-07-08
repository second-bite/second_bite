/*
  Warnings:

  - You are about to drop the column `error_stack` on the `ErrorLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ErrorLog" DROP COLUMN "error_stack";
