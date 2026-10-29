/*
  Warnings:

  - Changed the type of `type` on the `feedbacks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('bug', 'ui_ux', 'general', 'feature_request');

-- AlterTable
ALTER TABLE "feedbacks" DROP COLUMN "type",
ADD COLUMN     "type" "FeedbackType" NOT NULL;

-- DropEnum
DROP TYPE "FeedbackStatus";
