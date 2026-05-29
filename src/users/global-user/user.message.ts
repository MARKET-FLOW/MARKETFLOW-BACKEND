import { Prisma } from '@prisma/client';

export enum UserMessages {
  USER_NOT_FOUND = 'Utilisateur non trouvé',
}

export type UserWithStore = Prisma.UserGetPayload<{ include: { store: true } }>;
