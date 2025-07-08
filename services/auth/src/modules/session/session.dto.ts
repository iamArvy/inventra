import { Session } from 'generated/prisma';

export class SessionDto {
  userAgent: string;
  ipAddress: string;
  createdAt: Date;

  constructor(session: Session) {
    Object.assign(this, session);
  }
}

export class SessionList {
  sessions: SessionDto[];
}
