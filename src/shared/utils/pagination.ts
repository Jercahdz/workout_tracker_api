export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const parsePagination = (query: {
  page?: unknown;
  limit?: unknown;
}): PaginationParams => {
  const page = Math.max(1, parseInt(String(query.page ?? 1)));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? 20))));
  return { page, limit };
};

export const buildPaginatedResponse = <T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(total / params.limit);
  return {
    data,
    meta: {
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
      hasNextPage: params.page < totalPages,
      hasPreviousPage: params.page > 1,
    },
  };
};