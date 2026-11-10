import { afterEach, describe, expect, it, vi } from "vitest";
import { getStoreResource, postStoreResource } from "./store-api";
afterEach(() => vi.useRealTimers());
const checkout = (body: unknown) => new Request("http://localhost/api/proxy/checkout", {method:"POST", headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
describe("simulation API", () => {
  it("returns original eight products after loading latency", async () => {
    vi.useFakeTimers(); const pending = getStoreResource(new Request("http://localhost/api/proxy/products"),["products"]);
    await vi.advanceTimersByTimeAsync(1500); const response = await pending;
    const body = await response.json(); expect(body.data).toHaveLength(8);
    expect(body.data[0]).toMatchObject({id:1,name:"無線藍牙耳機",price:2999});
  });
  it("searches case-insensitively and handles empty matches", async () => {
    expect((await (await getStoreResource(new Request("http://localhost/api/proxy/products?search=usb"),["products"])).json()).data).toEqual([{id:7,name:"USB隨身碟",price:599,image:"usb.jpg"}]);
    expect((await (await getStoreResource(new Request("http://localhost/api/proxy/products?search=missing"),["products"])).json()).data).toEqual([]);
  });
  it("returns one product and rejects missing resources", async () => {
    expect((await (await getStoreResource(new Request("http://localhost/api/proxy/products/4"),["products","4"])).json()).data.price).toBe(899);
    expect((await getStoreResource(new Request("http://localhost"),["products","99"])).status).toBe(404);
    expect((await getStoreResource(new Request("http://localhost"),["unknown"])).status).toBe(404);
  });
  it("computes checkout totals from server-owned prices after 2000ms", async () => {
    vi.useFakeTimers(); const pending = postStoreResource(checkout({items:[{productId:1,quantity:2},{productId:4,quantity:3}],totalPrice:1}),["checkout"]);
    await vi.advanceTimersByTimeAsync(2000); const response = await pending;
    expect(response.status).toBe(200); expect((await response.json()).data).toMatchObject({orderId:expect.any(String),totalQuantity:5,totalPrice:8695});
  });
  it("rejects malformed/empty/invalid checkout before processing", async () => {
    for (const payload of [{items:[]},{items:[{productId:1,quantity:0}]},{items:[{productId:999,quantity:1}]}]) expect((await postStoreResource(checkout(payload),["checkout"])).status).toBe(400);
    expect((await postStoreResource(new Request("http://localhost",{method:"POST",body:"{"}),["checkout"])).status).toBe(400);
  });
});
