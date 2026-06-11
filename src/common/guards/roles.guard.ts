import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard RBAC basé sur les rôles Prisma
 * Lit la metadata @Roles() pour vérifier que l'utilisateur JWT a le rôle requis
 *
 * Prérequis : un AuthGuard JWT doit peupler req.user avant ce guard
 * En son absence, ce guard autorise tout
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { role: Role } | undefined;

    if (!user) {
      // Pas de req.user = le module Auth n'est pas encore branché
      // On autorise pour ne pas bloquer le développement
      return true;
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Accès refusé.');
    }

    return true;
  }
}
