/*
  Warnings:

  - The `status` column on the `invitations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `feedbacks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "invitation_status" AS ENUM ('pending', 'accepted', 'rejected', 'canceled');

-- CreateEnum
CREATE TYPE "feedback_type" AS ENUM ('bug', 'ui_ux', 'general', 'feature_request');

-- AlterTable
ALTER TABLE "feedbacks" DROP COLUMN "type",
ADD COLUMN     "type" "feedback_type" NOT NULL;

-- AlterTable
ALTER TABLE "invitations" DROP COLUMN "status",
ADD COLUMN     "status" "invitation_status" NOT NULL DEFAULT 'pending';

-- DropEnum
DROP TYPE "FeedbackType";

-- DropEnum
DROP TYPE "InvitationStatus";
