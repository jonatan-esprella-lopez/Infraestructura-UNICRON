import { useMemo, useState } from 'react';

export function usePagination(total: number, initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  return useMemo(
    () => ({
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      setPage,
      setPageSize,
    }),
    [page, pageSize, total],
  );
}
