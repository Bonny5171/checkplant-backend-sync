/*
  Warnings:

  - You are about to drop the `Plants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Plants";

-- CreateTable
CREATE TABLE "Notes" (
    "id" SERIAL NOT NULL,
    "note" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);
