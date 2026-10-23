-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "publicIds" TEXT[],
ADD COLUMN     "resourceTypes" TEXT[];

-- CreateTable
CREATE TABLE "HumanChat" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sent" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HumanChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIChat" (
    "id" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "sent" BOOLEAN NOT NULL,
    "HumanChatId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackgroundChat" (
    "id" TEXT NOT NULL,
    "response" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "AIChatId" TEXT NOT NULL,

    CONSTRAINT "BackgroundChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIAction" (
    "id" TEXT NOT NULL,
    "actions" TEXT[],
    "IsActionSuccessful" BOOLEAN NOT NULL,
    "SuccessfulActions" TEXT[],
    "FailedActions" TEXT[],
    "BChatId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIChat_HumanChatId_key" ON "AIChat"("HumanChatId");

-- CreateIndex
CREATE UNIQUE INDEX "BackgroundChat_AIChatId_key" ON "BackgroundChat"("AIChatId");

-- AddForeignKey
ALTER TABLE "AIChat" ADD CONSTRAINT "AIChat_HumanChatId_fkey" FOREIGN KEY ("HumanChatId") REFERENCES "HumanChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundChat" ADD CONSTRAINT "BackgroundChat_AIChatId_fkey" FOREIGN KEY ("AIChatId") REFERENCES "AIChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIAction" ADD CONSTRAINT "AIAction_BChatId_fkey" FOREIGN KEY ("BChatId") REFERENCES "BackgroundChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
