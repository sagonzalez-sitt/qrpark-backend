import { registration_sessions, RegistrationSessionStatus } from '../../../../generated/prisma/client';

export class RegistrationSessionEntity implements registration_sessions {
  id: string;
  session_token: string;
  status: RegistrationSessionStatus;
  ticket_id: string | null;
  created_at: Date;
  expires_at: Date;
  completed_at: Date | null;
}
