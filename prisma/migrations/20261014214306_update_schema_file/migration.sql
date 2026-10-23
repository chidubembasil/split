/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('NAIRA', 'DOLLAR', 'POUNDS', 'EURO', 'CANADIAN_DOLLAR', 'CEDIS');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "profileId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL,
    "name" TEXT[],
    "description" TEXT[],
    "price" TEXT[],
    "currency" "Currency" NOT NULL,
    "filename" TEXT[],
    "fileType" TEXT[],
    "fileSize" TEXT[],
    "fileurl" TEXT[],
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profileId_key" ON "user"("profileId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
