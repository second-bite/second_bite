/*
  Warnings:

  - You are about to drop the `Error` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Error";

-- CreateTable
CREATE TABLE "ErrorLog" (
    "error_id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 500,
    "error_source" "ErrorSource" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error_stack" TEXT,
    "route" TEXT,

    CONSTRAINT "ErrorLog_pkey" PRIMARY KEY ("error_id")
);
