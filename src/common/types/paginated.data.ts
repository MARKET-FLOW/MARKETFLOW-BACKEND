export type PaginatedData<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
};