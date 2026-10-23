-- AlterTable
ALTER TABLE "Upload" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "currency" "Currency";
