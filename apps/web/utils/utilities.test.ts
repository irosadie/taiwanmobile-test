import { afterEach, describe, expect, it, vi } from "vitest";
import { debounce } from "./debounce";
import { pathVariable } from "./path-variable";
import { formatCurrency } from "./format-currency";
afterEach(() => vi.useRealTimers());
describe("storefront utility contracts", () => {
  it("debounces to only the latest input after 300ms", () => {
    vi.useFakeTimers(); const callback = vi.fn(); const run = debounce(callback,300);
    run("ear"); vi.advanceTimersByTime(200); run("earphones"); vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled(); vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledExactlyOnceWith("earphones");
    run("cancel"); run.cancel(); vi.advanceTimersByTime(300); expect(callback).toHaveBeenCalledTimes(1);
  });
  it("encodes path variables and fails visibly when missing", () => {
    expect(pathVariable("/products/:id",{id:5})).toBe("/products/5");
    expect(pathVariable("/products/:id",{id:"a/b"})).toBe("/products/a%2Fb");
    expect(() => pathVariable("/products/:id",{})).toThrow("Missing path variable");
  });
  it("formats NTD totals consistently", () => {
    expect(formatCurrency(8695)).toBe("NT$ 8,695"); expect(formatCurrency(0)).toBe("NT$ 0");
  });
});
