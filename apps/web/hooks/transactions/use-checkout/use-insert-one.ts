"use client";
import { useMutation } from "@tanstack/react-query";
import type { CheckoutResponse } from "@repo/types";
import { checkoutPayloadSchema, type CheckoutPayload } from "@repo/schemas";
import { axiosInstance } from "@/services/axios";
import { apiRouters } from "@/constants/api-routers";
import { queryKeys } from "@/constants/query-keys";
export function useInsertOne() { return useMutation({ mutationKey: [queryKeys.checkout.create], mutationFn: async (payload: CheckoutPayload) => (await axiosInstance.post<CheckoutResponse>(apiRouters.checkout.create, checkoutPayloadSchema.parse(payload))).data, retry: false }); }
