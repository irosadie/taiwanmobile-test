import { getStoreResource, postStoreResource } from "@/server/store-api";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ path: string[] }> };
export async function GET(request: Request, context: Context) { return getStoreResource(request, (await context.params).path); }
export async function POST(request: Request, context: Context) { return postStoreResource(request, (await context.params).path); }
