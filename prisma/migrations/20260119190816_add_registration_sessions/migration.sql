-- CreateEnum
CREATE TYPE "RegistrationSessionStatus" AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED');

-- CreateTable
CREATE TABLE "registration_sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "status" "RegistrationSessionStatus" NOT NULL DEFAULT 'PENDING',
    "ticket_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "registration_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registration_sessions_session_token_key" ON "registration_sessions"("session_token");

-- CreateIndex
CREATE INDEX "registration_sessions_session_token_idx" ON "registration_sessions"("session_token");

-- CreateIndex
CREATE INDEX "registration_sessions_status_idx" ON "registration_sessions"("status");

-- CreateIndex
CREATE INDEX "registration_sessions_expires_at_idx" ON "registration_sessions"("expires_at");
