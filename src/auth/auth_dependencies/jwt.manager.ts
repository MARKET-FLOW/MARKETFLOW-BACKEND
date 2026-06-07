import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { UUID } from 'node:crypto';

@Injectable()
export class JwtManager {
  constructor(private readonly jwt: JwtService) {}

  generateAccessToken(
    refTokId: UUID,
    userId: UUID,
    role: Role,
    secret: string,
    expiresIn: JwtSignOptions['expiresIn'],
  ): string {
    return this.jwt.sign(
      {
        refTokId,
        userId,
        role,
      },
      {
        secret: secret,
        expiresIn: expiresIn,
      },
    );
  }

  generateRefreshToken(
    sessHash: string,
    secret: string,
    expiresIn: JwtSignOptions['expiresIn'],
  ): string {
    return this.jwt.sign(
      { sessHash },
      { secret: secret, expiresIn: expiresIn },
    );
  }

  verifyAccessToken(
    token: string,
    secret: string,
  ): { refTokId: UUID; userId: UUID; role: Role } | null {
    try {
      return this.jwt.verify(token, { secret: secret });
    } catch {
      return null;
    }
  }

  verifyRefreshToken(
    token: string,
    secret: string,
  ): { sessHash: string } | null {
    try {
      return this.jwt.verify(token, { secret: secret }) as {
        sessHash: string;
      };
    } catch {
      return null;
    }
  }
}
