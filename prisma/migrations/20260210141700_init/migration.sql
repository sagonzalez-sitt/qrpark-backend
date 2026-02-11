/*
  Warnings:

  - The values [COMPLETED] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('ACTIVE', 'PAID', 'CANCELLED');
ALTER TABLE "public"."parking_tickets" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "parking_tickets" ALTER COLUMN "status" TYPE "TicketStatus_new" USING ("status"::text::"TicketStatus_new");
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "public"."TicketStatus_old";
ALTER TABLE "parking_tickets" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;
