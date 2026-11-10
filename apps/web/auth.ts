// The simulation storefront and its catalog are intentionally public.
// Add credentials/session configuration here when authentication is introduced.
export const authConfig = { publicRoutes: ["/", "/products", "/api/proxy"] } as const;
