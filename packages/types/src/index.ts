export interface ProductResponse { id: number; name: string; price: number; image: string; }
export interface CartItem { product: ProductResponse; quantity: number; }
export interface CartSummary { totalQuantity: number; totalPrice: number; }
export interface CheckoutResponse extends CartSummary { orderId: string; }
export interface ApiResponse<T> { data: T; }
