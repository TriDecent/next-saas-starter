/*
  Warnings:

  - You are about to drop the column `createdAt` on the `invitations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invitations" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
