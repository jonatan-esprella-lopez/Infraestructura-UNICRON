export interface PaginationQuery {
  limit?: number;
  page?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<TItem> {
  items: TItem[];
  limit: number;
  page: number;
  total: number;
}
