import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtManager } from 'src/auth/auth_dependencies/jwt.manager';
import { UsersRepository } from 'src/users/users.repository';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtManager: JwtManager, private readonly userRepo: UsersRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Accès refusé : Token manquant ou mal formé',
      );
    }

    const token = authHeader.split(' ')[1];

    const payload = this.jwtManager.verifyAccessToken(
      token,
      process.env.JWT_SECRET ?? '',
    );

    if (!payload) {
      throw new UnauthorizedException(
        'Accès refusé : Session invalide ou expirée',
      );
    }

    const user = await this.userRepo.getUserByID(payload.userId)
    if (user.isError){
      throw new UnauthorizedException(user.error.getMessage());
    }

    request.user = user.data;

    return true;
  }
}
