import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategorieDto } from './dto/create-categories.dto';
import { UpdateCategorieDto } from './dto/update-categories.dto';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(storeId: string, dto: CreateCategorieDto) {
    return this.prisma.category.create({
      data: {
        storeId,
        name: dto.name,
        parentId: dto.parentId ?? null,
      },
    });
  }

  findAll(storeId: string) {
    return this.prisma.category.findMany({
      where: { storeId, deletedAt: null },
      include: { children: { where: { deletedAt: null } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(storeId: string, id: string) {
    return this.prisma.category.findFirst({
      where: { id, storeId, deletedAt: null },
      include: { children: { where: { deletedAt: null } }, parent: true },
    });
  }

  update(id: string, dto: UpdateCategorieDto) {
    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.parentId !== undefined && { parentId: dto.parentId }),
      },
    });
  }

  softDelete(id: string) {
    return this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}