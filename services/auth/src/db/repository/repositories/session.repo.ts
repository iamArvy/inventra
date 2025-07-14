import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma, Session } from 'generated/prisma';

@Injectable()
export class SessionRepo {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SessionCreateInput): Promise<Session> {
    return this.prisma.session.create({ data });
  }

  findById(id: string): Promise<Session | null> {
    return this.prisma.session.findUnique({ where: { id } });
  }

  findByUserId(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({ where: { userId } });
  }

  findByUserIdAndDevice(
    userId: string,
    userAgent: string,
    ipAddress: string,
  ): Promise<Session | null> {
    return this.prisma.session.findFirst({
      where: {
        userId,
        userAgent,
        ipAddress,
      },
    });
  }

  findUserActiveSessions(userId: string): Promise<Session[]> {
    const now = new Date();
    return this.prisma.session.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: now } },
    });
  }

  async updateRefreshToken(
    id: string,
    hashedRefreshToken: string | null,
  ): Promise<any> {
    return this.prisma.session.update({
      where: { id },
      data: { hashedRefreshToken, expiresAt: new Date(Date.now() + 604800000) },
    });
  }

  async update(id: string, data: Prisma.SessionUpdateInput): Promise<any> {
    return this.prisma.session.update({
      where: { id },
      data,
    });
  }

  async endAllUserSessions(userId: string) {
    const now = new Date();
    return this.prisma.session.updateMany({
      where: { userId, revokedAt: null, expiresAt: { gt: now } },
      data: { revokedAt: now },
    });
  }
}
