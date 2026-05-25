// CATEGORÍAS
export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  es_principal?: boolean;
}

// INGREDIENTES
export interface Ingredient {
  id: number;
  nombre: string;
  descripcion?: string;
}

// PRODUCTO
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  stock: number;
  createdAt: string;
  categories?: Category[];
  ingredients?: Ingredient[];
}

// CARRITO
export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

// USUARIO
export interface User {
  id: number;
  email: string;
  full_name: string;
  roles?: string[];
  created_at?: string;
}

// DIRECCIÓN DE ENTREGA
export interface DeliveryAddress {
  id?: number;
  alias: string;
  direccion: string;
  ciudad: string;
  codigo_postal?: string;
  es_principal?: boolean;
}

// FORMA DE PAGO
export interface PaymentMethod {
  id: number;
  nombre: string;
}

// PEDIDO
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  shippingInfo: ShippingInfo;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDTO {
  items: OrderItem[];
  total: number;
  shippingInfo: ShippingInfo;
}

// RESPUESTAS DE API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}