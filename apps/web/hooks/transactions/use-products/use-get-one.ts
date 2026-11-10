"use client";
import { useQuery } from "@tanstack/react-query";
import type { ProductResponse } from "@repo/types";
import { axiosInstance } from "@/services/axios";
import { apiRouters } from "@/constants/api-routers";
import { queryKeys } from "@/constants/query-keys";
import { pathVariable } from "@/utils/path-variable";
export function useGetOne(id: number) { return useQuery({ queryKey: [queryKeys.products.detail, id], enabled: Number.isInteger(id) && id > 0, queryFn: async ({ signal }) => (await axiosInstance.get<ProductResponse>(pathVariable(apiRouters.products.getOne, { id }), { signal })).data }); }
