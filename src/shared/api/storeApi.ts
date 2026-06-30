import axiosInstance from './apiClient';
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

const mapProduct = (p: any): Product => {
  const firstImage = (p.imagenes_url && p.imagenes_url.length > 0)
    ? p.imagenes_url[0]
    : null;
  const imageUrl = (typeof firstImage === 'string')
    ? firstImage
    : (firstImage?.url || firstImage?.secure_url || p.imagenes || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60');

  return {
    id: String(p.id),
    name: p.nombre,
    description: p.descripcion || '',
    price: Number(p.precio_base),
    image: imageUrl,
    stock: Number(p.stock_cantidad || 0),
    disponible: p.disponible !== false,
    category: p.categorias?.find((c: any) => c.es_principal)?.nombre || '',
    categories: p.categorias?.map((c: any) => ({
      id: c.id,
      nombre: c.nombre,
    })) || [],
    ingredients: p.ingredientes?.map((i: any) => ({
      id: i.id,
      nombre: i.nombre,
      es_alergeno: i.es_alergeno,
    })) || [],
    createdAt: p.created_at || new Date().toISOString(),
  };
};

const mapStatus = (statusCodigo: string): 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' => {
  const mapping: Record<string, 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'> = {
    PENDIENTE: 'pending',
    CONFIRMADO: 'confirmed',
    EN_PREP: 'shipped',
    ENTREGADO: 'delivered',
    CANCELADO: 'cancelled',
  };
  return mapping[statusCodigo] || 'pending';
};

const mapOrder = (o: any, addresses?: DeliveryAddress[]): Order => {
  const addr = addresses?.find((a: any) => a.id === o.direccion_entrega_id);
  return {
    id: String(o.id),
    userId: String(o.usuario_id),
    total: Number(o.total),
    status: mapStatus(o.estado_actual?.codigo || 'PENDIENTE'),
    createdAt: o.fecha_pedido,
    updatedAt: o.fecha_actualizado || o.fecha_pedido,
    paymentMethodName: o.forma_pago?.nombre || 'No especificado',
    items: (o.detalles || []).map((d: any) => ({
      productId: String(d.producto_id),
      quantity: d.cantidad,
      price: Number(d.precio_unitario),
      name: d.nombre_producto || 'Producto',
    })),
    shippingInfo: {
      address: addr?.direccion || o.direccion?.direccion || 'No especificada',
      city: addr?.ciudad || o.direccion?.ciudad || '',
      zipCode: addr?.codigo_postal || o.direccion?.codigo_postal || '',
      phone: o.telefono || '',
      notes: addr?.alias || o.direccion?.alias || '',
    },
  };
};

const mapUser = (u: any): User => ({
  id: u.id,
  email: u.email,
  full_name: u.full_name || u.nombre_completo || '',
  roles: u.roles?.map((r: any) => r.nombre || r) || [],
  created_at: u.created_at,
});

export const storeApi = {

  getProducts: async (filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> => {
    const params: any = {};
    if (filters.busqueda) {
      params.busqueda = filters.busqueda;
    }
    if (filters.categoria_id) {
      params.categoria_id = filters.categoria_id;
    }
    const response = await axiosInstance.get<{ items: any[] }>('/productos', { params });
    const mappedItems = response.data.items?.map(mapProduct) || [];
    return {
      success: true,
      data: mappedItems.filter((p) => p.disponible !== false),
    };
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.get<any>(`/productos/${id}`);
    return {
      success: true,
      data: mapProduct(response.data),
    };
  },

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

  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    let addresses: DeliveryAddress[] = [];
    try {
      const addrResponse = await axiosInstance.get<any[]>('/direcciones');
      addresses = addrResponse.data || [];
    } catch (err) {
      console.error('Error fetching addresses in getOrders:', err);
    }
    const response = await axiosInstance.get<any[]>('/pedidos');
    return {
      success: true,
      data: response.data?.map((o: any) => mapOrder(o, addresses)) || [],
    };
  },

  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await axiosInstance.get<any>(`/pedidos/${id}`);
    const orderData = response.data;
    let addresses: DeliveryAddress[] = [];
    if (orderData.direccion_entrega_id) {
      try {
        const addrResponse = await axiosInstance.get<any[]>('/direcciones');
        addresses = addrResponse.data || [];
      } catch (err) {
        console.error('Error fetching address in getOrderById:', err);
      }
    }
    return {
      success: true,
      data: mapOrder(orderData, addresses),
    };
  },

  createOrder: async (orderData: {
    forma_pago_id: number;
    direccion_entrega_id?: number;
    detalles: { producto_id: number; cantidad: number }[];
  }): Promise<ApiResponse<Order>> => {
    const response = await axiosInstance.post<any>('/pedidos', orderData);
    let addresses: DeliveryAddress[] = [];
    if (orderData.direccion_entrega_id) {
      try {
        const addrResponse = await axiosInstance.get<any[]>('/direcciones');
        addresses = addrResponse.data || [];
      } catch (err) {
        console.error('Error fetching address in createOrder:', err);
      }
    }
    return {
      success: true,
      data: mapOrder(response.data, addresses),
    };
  },

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

  login: async (credentials: { email: string; password: string }): Promise<{ user: User; token: string }> => {
    const response = await axiosInstance.post<any>('/auth/login', credentials);
    const token = response.data.access_token || response.data.token || '';
    return {
      user: mapUser(response.data.usuario || response.data),
      token,
    };
  },

  register: async (userData: {
    email: string;
    password: string;
    nombre: string;
  }): Promise<{ user: User; token: string }> => {
    const response = await axiosInstance.post<any>('/auth/register', userData);
    const token = response.data.access_token || response.data.token || '';
    return {
      user: mapUser(response.data.usuario || response.data),
      token,
    };
  },

  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<any>('/auth/me');
    return mapUser(response.data);
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  getPaymentMethods: async (): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>('/formas-pago');
    return response.data || [];
  },

  createMercadoPagoPreference: async (orderId: string): Promise<{ init_point: string; preferenceId: string }> => {
    const response = await axiosInstance.post<any>(`/pagos/preferencia?pedido_id=${orderId}`, {});
    return {
      init_point: response.data.init_point,
      preferenceId: response.data.preference_id,
    };
  },
};