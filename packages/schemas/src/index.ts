import { z } from "zod";
export const cartQuantitySchema = z.number().int().min(1).max(99);
export const productSearchSchema = z.object({ search: z.string().trim().max(200).default("") });
export const checkoutPayloadSchema = z.object({ items: z.array(z.object({ productId: z.number().int().positive(), quantity: cartQuantitySchema })).min(1).max(8) }).superRefine((payload, ctx) => {
  if (new Set(payload.items.map(item => item.productId)).size !== payload.items.length) ctx.addIssue({code: "custom", message: "Duplicate products are not allowed"});
});
export type ProductSearch = z.infer<typeof productSearchSchema>;
export type CartQuantity = z.infer<typeof cartQuantitySchema>;
export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
