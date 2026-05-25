// src/modules/store/api/storeApi.ts
import axiosInstance from './axiosConfig';
import { 
  Product, 
  Order, 
  ApiResponse,
  Category,
  Ingredient,
  User,
  DeliveryAddress
} from '../types';

interface ProductFilters {
  categoria_id?: number;
  busqueda?: string;
}

// ==================== MAPPERS ====================

/**
 * Transform product fields from Spanish (backend) to English (frontend)
 */
const mapProduct = (p: any): Product => ({
  id: String(p.id),
  name: p.nombre,
  description: p.descripcion || '',
  price: Number(p.precio_base),
  image: p.imagenes || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
  stock: Number(p.stock_cantidad || 0),
  category: p.categorias?.find((c: any) => c.es_principal)?.nombre || '',
  categories: p.categorias?.map((c: any) => ({
    id: c.id,
    nombre: c.nombre,
  })) || [],
  ingredients: p.ingredientes?.map((i: any) => ({
    id: i.id,
    nombre: i.nombre,
  })) || [],
  createdAt: p.created_at || new Date().toISOString(),
});

/**
 * Map Spanish status codes from backend to English enum states
 */
const mapStatus = (statusCodigo: string): 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' => {
  const mapping: Record<string, 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'> = {
    PENDIENTE: 'pending',
    CONFIRMADO: 'confirmed',
    EN_PREP: 'confirmed',
    EN_CAMINO: 'shipped',
    ENTREGADO: 'delivered',
    CANCELADO: 'cancelled',
  };
  return mapping[statusCodigo] || 'pending';
};

/**
 * Transform order fields from Spanish (backend) to English (frontend)
 */
const mapOrder = (o: any): Order => ({
  id: String(o.id),
  userId: String(o.usuario_id),
  total: Number(o.total),
  status: mapStatus(o.estado_actual?.codigo || 'PENDIENTE'),
  createdAt: o.fecha_pedido,
  updatedAt: o.fecha_actualizado || o.fecha_pedido,
  items: (o.detalles || []).map((d: any) => ({
    productId: String(d.producto_id),
    quantity: d.cantidad,
    price: Number(d.precio_unitario),
    name: d.nombre_producto || 'Producto',
  })),
  shippingInfo: {
    address: o.direccion?.direccion || 'No especificada',
    city: o.direccion?.ciudad || '',
    zipCode: o.direccion?.codigo_postal || '',
    phone: o.telefono || '',
    notes: o.direccion?.alias || '',
  },
});

/**
 * Map user from backend format
 */
const mapUser = (u: any): User => ({
  id: u.id,
  email: u.email,
  full_name: u.full_name || u.nombre_completo || '',
  roles: u.roles?.map((r: any) => r.nombre || r) || [],
  created_at: u.created_at,
});

// ==================== API CALLS ====================

export const storeApi = {
  // ========== PRODUCTOS ==========
  getProducts: async (filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> => {
    const params: any = {};
    if (filters.busqueda) {
      params.busqueda = filters.busqueda;
    }
    if (filters.categoria_id) {
      params.categoria_id = filters.categoria_id;
    }
    const response = await axiosInstance.get<{ items: any[] }>('/productos', { params });
    return {
      success: true,
      data: response.data.items?.map(mapProduct) || [],
    };
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.get<any>(`/productos/${id}`);
    return {
      success: true,
      data: mapProduct(response.data),
    };
  },

  // ========== CATEGORÍAS ==========
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await axiosInstance.get<{ items: any[] }>('/categorias');
    return {
      success: true,
      data: response.data.items?.map((c: any) => ({
        id: c.id,
        nombre: c.nombre,
        descripcion: c.descripcion || '',
      })) || [],
    };
  },

  getCategoryById: async (id: number): Promise<ApiResponse<Category>> => {
    const response = await axiosInstance.get<any>(`/categorias/${id}`);
    return {
      success: true,
      data: {
        id: response.data.id,
        nombre: response.data.nombre,
        descripcion: response.data.descripcion || '',
      },
    };
  },

  // ========== INGREDIENTES ==========
  getIngredients: async (): Promise<ApiResponse<Ingredient[]>> => {
    const response = await axiosInstance.get<any[]>('/ingredientes');
    return {
      success: true,
      data: response.data?.map((i: any) => ({
        id: i.id,
        nombre: i.nombre,
        descripcion: i.descripcion || '',
      })) || [],
    };
  },

  getIngredientById: async (id: number): Promise<ApiResponse<Ingredient>> => {
    const response = await axiosInstance.get<any>(`/ingredientes/${id}`);
    return {
      success: true,
      data: {
        id: response.data.id,
        nombre: response.data.nombre,
        descripcion: response.data.descripcion || '',
      },
    };
  },

  // ========== PEDIDOS ==========
  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    const response = await axiosInstance.get<any[]>('/pedidos');
    return {
      success: true,
      data: response.data?.map(mapOrder) || [],
    };
  },

  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await axiosInstance.get<any>(`/pedidos/${id}`);
    return {
      success: true,
      data: mapOrder(response.data),
    };
  },

  createOrder: async (orderData: {
    forma_pago_id: number;
    direccion_entrega_id?: number;
    detalles: { producto_id: number; cantidad: number }[];
  }): Promise<ApiResponse<Order>> => {
    const response = await axiosInstance.post<any>('/pedidos', orderData);
    return {
      success: true,
      data: mapOrder(response.data),
    };
  },

  // ========== DIRECCIONES ==========
  createAddress: async (addressData: {
    alias: string;
    direccion: string;
    ciudad: string;
    codigo_postal?: string;
    es_principal?: boolean;
  }): Promise<DeliveryAddress> => {
    const response = await axiosInstance.post<any>('/direcciones', addressData);
    return {
      id: response.data.id,
      alias: response.data.alias,
      direccion: response.data.direccion,
      ciudad: response.data.ciudad,
      codigo_postal: response.data.codigo_postal,
      es_principal: response.data.es_principal,
    };
  },

  getAddresses: async (): Promise<DeliveryAddress[]> => {
    const response = await axiosInstance.get<any[]>('/direcciones');
    return response.data?.map((a: any) => ({
      id: a.id,
      alias: a.alias,
      direccion: a.direccion,
      ciudad: a.ciudad,
      codigo_postal: a.codigo_postal,
      es_principal: a.es_principal,
    })) || [];
  },

  deleteAddress: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/direcciones/${id}`);
  },

  // ========== AUTENTICACIÓN ==========
  login: async (credentials: { email: string; password: string }): Promise<User> => {
    const response = await axiosInstance.post<any>('/auth/login', credentials);
    return mapUser(response.data.usuario);
  },

  register: async (userData: {
    email: string;
    password: string;
    nombre: string;
  }): Promise<User> => {
    const response = await axiosInstance.post<any>('/auth/register', userData);
    return mapUser(response.data.usuario);
  },

  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<any>('/auth/me');
    return mapUser(response.data);
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },
};