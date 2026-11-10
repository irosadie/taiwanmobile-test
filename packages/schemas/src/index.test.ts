import { describe, expect, it } from "vitest";
import { cartQuantitySchema, checkoutPayloadSchema, productSearchSchema } from "./index";
describe("shared input validation", () => {
  it("accepts positive integer quantities including multiples and bounds", () => {
    for (const value of [1, 3, 5, 99]) expect(cartQuantitySchema.parse(value)).toBe(value);
  });
  it("rejects empty, string, decimal, nonfinite, zero and out-of-range quantities", () => {
    for (const value of ["", "5", NaN, Infinity, 0, -1, 1.5, 100, null]) expect(cartQuantitySchema.safeParse(value).success).toBe(false);
  });
  it("trims search and bounds URL input", () => {
    expect(productSearchSchema.parse({search: " USB "})).toEqual({search:"USB"});
    expect(productSearchSchema.parse({})).toEqual({search:""});
    expect(productSearchSchema.safeParse({search:"a".repeat(201)}).success).toBe(false);
  });
  it("requires a non-empty cart with unique valid product IDs", () => {
    expect(checkoutPayloadSchema.parse({items:[{productId:1,quantity:5}]})).toEqual({items:[{productId:1,quantity:5}]});
    for (const items of [[], [{productId:1,quantity:0}], [{productId:0,quantity:1}], [{productId:1,quantity:1},{productId:1,quantity:2}]]) expect(checkoutPayloadSchema.safeParse({items}).success).toBe(false);
  });
});
