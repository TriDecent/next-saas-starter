-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('bug', 'ui_ux', 'general', 'feature_request');

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "type" "FeedbackStatus" NOT NULL,
    "message" VARCHAR(1000) NOT NULL,
    "pageUrl" TEXT NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);
