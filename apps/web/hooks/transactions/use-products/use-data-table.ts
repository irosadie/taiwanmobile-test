"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { ProductResponse } from "@repo/types";
import { productSearchSchema, type ProductSearch } from "@repo/schemas";
import { axiosInstance } from "@/services/axios";
import { apiRouters } from "@/constants/api-routers";
import { queryKeys } from "@/constants/query-keys";
export function useDataTable(params: Partial<ProductSearch> = {}) {
  const parsed = productSearchSchema.safeParse(params);
  return useQuery({ queryKey: [queryKeys.products.index, params], queryFn: async ({ signal }) => {
    if (!parsed.success) throw new Error("搜尋文字過長");
    const response = await axiosInstance.get<ProductResponse[]>(apiRouters.products.index, { params: parsed.data, signal });
    return response.data;
  }, placeholderData: keepPreviousData, staleTime: 60000, retry: false });
}
