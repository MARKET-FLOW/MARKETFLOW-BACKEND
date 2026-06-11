import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty()
  totalItems!: number;

  @ApiProperty()
  itemCount!: number;

  @ApiProperty()
  itemsPerPage!: number;

  @ApiProperty()
  totalPages!: number;

  @ApiProperty()
  currentPage!: number;
}

export class PaginatedData<T> {
  // Le champ items n'est pas décoré ici car il dépendra du type générique T.
  // Swagger le gérera dans le contrôleur ou via un décorateur custom si besoin.
  items: T[];

  @ApiProperty({ type: () => PaginationMeta })
  meta: PaginationMeta;

  constructor(items: T[], totalItems: number, page: number, limit: number) {
    this.items = items;
    this.meta = {
      totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }
}
