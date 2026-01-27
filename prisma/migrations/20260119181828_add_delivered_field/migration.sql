-- AlterTable
ALTER TABLE "parking_tickets" ADD COLUMN     "delivered" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "parking_tickets_delivered_idx" ON "parking_tickets"("delivered");
