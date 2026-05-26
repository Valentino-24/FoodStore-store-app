import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderById } from '../hooks/useOrders';

const OrderDetail: FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrderById(orderId);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-sky-500 border-slate-200"></div>
        <p className="text-slate-600 font-medium">Cargando detalles del pedido...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 text-center px-4">
        <svg className="w-16 h-16 text-rose-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-bold text-slate-800">Pedido no encontrado</h2>
        <p className="text-slate-500 mt-2">Hubo un problema al cargar los datos del pedido.</p>
        <button onClick={() => navigate('/store/orders')} className="mt-6 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium transition">
          Volver a Mis Pedidos
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'shipped':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      shipped: 'En Camino',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => navigate('/store/orders')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Mis Pedidos
        </button>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8 md:p-12 space-y-8">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Historial de Pedido</span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Detalle del Pedido #{order.id}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">
                {new Date(order.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Información de Envío</h3>
              <p className="text-slate-600"><span className="font-semibold text-slate-800">Dirección:</span> {order.shippingInfo.address}</p>
              <p className="text-slate-600"><span className="font-semibold text-slate-800">Ciudad:</span> {order.shippingInfo.city}</p>
              {order.shippingInfo.zipCode && (
                <p className="text-slate-600"><span className="font-semibold text-slate-800">Código Postal:</span> {order.shippingInfo.zipCode}</p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Detalles adicionales</h3>
              <p className="text-slate-600"><span className="font-semibold text-slate-800">Alias Dirección:</span> {order.shippingInfo.notes || 'Envío'}</p>
              <p className="text-slate-600"><span className="font-semibold text-slate-800">Forma de Pago:</span> Disponible en la factura</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-2">Productos Pedidos</h2>

            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.productId} className="py-4 flex justify-between items-center text-sm">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-850 text-slate-800">{item.name || `Producto #${item.productId}`}</p>
                    <p className="text-xs text-slate-500">Cantidad: {item.quantity} x ${item.price.toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-slate-800">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
            <span className="text-base font-bold text-slate-800">Monto Total</span>
            <span className="text-2xl font-extrabold text-sky-600">${order.total.toFixed(2)}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetail;