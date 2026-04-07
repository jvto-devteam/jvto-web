// hooks/useCmsData.ts - Custom hook for CMS data management

import { useState, useCallback } from "react";

interface UseCmsDataOptions {
  endpoint: string;
  limit?: number;
}

export function useCmsData<T extends { id: any }>(
  options: UseCmsDataOptions
) {
  const { endpoint, limit = 10 } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit,
    pages: 1,
  });

  const fetch = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${endpoint}?page=${page}&limit=${limit}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await res.json();
        setData(result.data || []);
        setPagination(result.pagination || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, limit]
  );

  const create = useCallback(
    async (item: Omit<T, "id">) => {
      try {
        setError(null);
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });

        if (!res.ok) {
          throw new Error("Failed to create item");
        }

        await fetch(pagination.page);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return false;
      }
    },
    [endpoint, pagination.page]
  );

  const update = useCallback(
    async (id: any, item: Partial<T>) => {
      try {
        setError(null);
        const res = await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, id }),
        });

        if (!res.ok) {
          throw new Error("Failed to update item");
        }

        await fetch(pagination.page);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return false;
      }
    },
    [endpoint, pagination.page]
  );

  const delete_ = useCallback(
    async (id: any) => {
      try {
        setError(null);
        const res = await fetch(`${endpoint}?id=${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete item");
        }

        await fetch(pagination.page);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return false;
      }
    },
    [endpoint, pagination.page]
  );

  return {
    data,
    loading,
    error,
    pagination,
    fetch,
    create,
    update,
    delete: delete_,
  };
}
