/*
  Warnings:

  - You are about to drop the `AIAction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AIChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BackgroundChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HumanChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AIAction" DROP CONSTRAINT "AIAction_BChatId_fkey";

-- DropForeignKey
ALTER TABLE "AIChat" DROP CONSTRAINT "AIChat_HumanChatId_fkey";

-- DropForeignKey
ALTER TABLE "BackgroundChat" DROP CONSTRAINT "BackgroundChat_AIChatId_fkey";

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "publicId" TEXT;

-- DropTable
DROP TABLE "AIAction";

-- DropTable
DROP TABLE "AIChat";

-- DropTable
DROP TABLE "BackgroundChat";

-- DropTable
DROP TABLE "HumanChat";
