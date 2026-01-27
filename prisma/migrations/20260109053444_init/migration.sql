-- CreateEnum
CREATE TYPE "TicketDeliveryMethod" AS ENUM ('DIGITAL_PHOTO', 'DIGITAL_DOWNLOAD', 'PRINTED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('CAR', 'MOTORCYCLE', 'BICYCLE');

-- CreateTable
CREATE TABLE "parking_tickets" (
    "id" TEXT NOT NULL,
    "qr_token" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "vehicle_type" "VehicleType" NOT NULL,
    "entry_timestamp" TIMESTAMP(3) NOT NULL,
    "exit_timestamp" TIMESTAMP(3),
    "calculated_fee" DECIMAL(10,2),
    "status" "TicketStatus" NOT NULL DEFAULT 'ACTIVE',
    "delivery_method" "TicketDeliveryMethod" NOT NULL DEFAULT 'UNKNOWN',
    "qr_downloaded_at" TIMESTAMP(3),
    "printed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parking_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_config" (
    "id" TEXT NOT NULL,
    "vehicle_type" "VehicleType" NOT NULL,
    "price_per_hour" DECIMAL(10,2) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "performed_by" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parking_tickets_qr_token_key" ON "parking_tickets"("qr_token");

-- CreateIndex
CREATE INDEX "parking_tickets_delivery_method_idx" ON "parking_tickets"("delivery_method");

-- CreateIndex
CREATE INDEX "parking_tickets_entry_timestamp_idx" ON "parking_tickets"("entry_timestamp");

-- CreateIndex
CREATE INDEX "parking_tickets_plate_number_idx" ON "parking_tickets"("plate_number");

-- CreateIndex
CREATE INDEX "parking_tickets_qr_token_idx" ON "parking_tickets"("qr_token");

-- CreateIndex
CREATE INDEX "parking_tickets_status_idx" ON "parking_tickets"("status");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_config_vehicle_type_key" ON "pricing_config"("vehicle_type");

-- CreateIndex
CREATE INDEX "audit_logs_entity_id_idx" ON "audit_logs"("entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_idx" ON "audit_logs"("entity_type");

-- CreateIndex
CREATE INDEX "audit_logs_performed_by_idx" ON "audit_logs"("performed_by");
