-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "engineState" JSONB;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "adultConsent" BOOLEAN NOT NULL DEFAULT false;
