import { NextResponse } from "next/server";
import { checkoutPayloadSchema, productSearchSchema } from "@repo/schemas";
import type { CheckoutResponse } from "@repo/types";
import { products } from "./catalog";
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export async function getStoreResource(request: Request, path: string[]) {
  if (path[0] !== "products" || path.length > 2) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (path.length === 2) {
    const product = products.find(item => String(item.id) === path[1]);
    return product ? NextResponse.json({ data: product }) : NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  const parsed = productSearchSchema.safeParse({ search: new URL(request.url).searchParams.get("search") ?? "" });
  if (!parsed.success) return NextResponse.json({ error: "Invalid search" }, { status: 400 });
  if (!parsed.data.search) await delay(1500);
  return NextResponse.json({ data: products.filter(item => item.name.toLocaleLowerCase().includes(parsed.data.search.toLocaleLowerCase())) });
}
export async function postStoreResource(request: Request, path: string[]) {
  if (path.join("/") !== "checkout") return NextResponse.json({ error: "Not found" }, { status: 404 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const payload = checkoutPayloadSchema.safeParse(input);
  if (!payload.success) return NextResponse.json({ error: "Invalid checkout", issues: payload.error.issues }, { status: 400 });
  let totalQuantity = 0; let totalPrice = 0;
  for (const item of payload.data.items) {
    const product = products.find(product => product.id === item.productId);
    if (!product) return NextResponse.json({ error: "Unknown product" }, { status: 400 });
    totalQuantity += item.quantity; totalPrice += product.price * item.quantity;
  }
  await delay(2000);
  const result: CheckoutResponse = { orderId: crypto.randomUUID(), totalQuantity, totalPrice };
  return NextResponse.json({ data: result });
}
