import { useMemo, useState } from "react";

export function usePagination<T>(items: T[], pageSize = 8) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return {
    page: currentPage,
    setPage,
    totalPages,
    paginated,
    pageSize,
    totalItems: items.length,
    startItem: items.length === 0 ? 0 : (currentPage - 1) * pageSize + 1,
    endItem: Math.min(currentPage * pageSize, items.length),
  };
}
