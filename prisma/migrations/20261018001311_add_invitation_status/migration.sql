/*
  Warnings:

  - The `status` column on the `invitations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `role` on table `invitations` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('pending', 'accepted', 'rejected', 'canceled');

-- AlterTable
ALTER TABLE "invitations" ALTER COLUMN "role" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "InvitationStatus" NOT NULL DEFAULT 'pending';
