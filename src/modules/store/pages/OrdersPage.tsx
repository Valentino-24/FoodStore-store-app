import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';

const OrdersPage: FC = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useOrders();

  const handleViewOrder = (orderId: string): void => {
    navigate(`/store/orders/${orderId}`);
  };

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
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 mb-8">
          <p className="text-sky-500 text-xs font-semibold uppercase tracking-wider">Historial</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mis Pedidos</h1>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-sky-500 border-slate-200"></div>
            <p className="text-slate-600 font-medium">Cargando tus pedidos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center max-w-md mx-auto my-12">
            <svg className="w-12 h-12 text-rose-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-bold text-slate-800 text-lg">Error al cargar pedidos</h3>
            <p className="text-slate-500 text-sm mt-1">Por favor comprueba tu conexión con el backend.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!orders || orders.length === 0) && (
          <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center max-w-lg mx-auto shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-400 mb-6 border border-slate-100">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Aún no tienes pedidos</h2>
            <p className="text-slate-500 text-sm mt-2">¿Listo para probar nuestras delicias? Agrega productos y confirma tu pedido.</p>
            <button
              onClick={() => navigate('/store')}
              className="mt-8 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition hover:from-sky-600 hover:to-indigo-700"
            >
              Ir al Catálogo
            </button>
          </div>
        )}

        {/* Orders Cards Grid */}
        {!isLoading && !error && orders && orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pedido</span>
                      <h3 className="font-extrabold text-slate-800 text-sm">#{order.id}</h3>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl border ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="space-y-3.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fecha</span>
                      <span className="font-medium text-slate-700">
                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Artículos</span>
                      <span className="font-medium text-slate-700">{order.items.length}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                      <span className="text-slate-500 font-medium">Total</span>
                      <span className="font-extrabold text-slate-900 text-base">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleViewOrder(order.id)}
                  className="w-full mt-6 rounded-2xl bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 font-semibold py-3 text-sm transition"
                >
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;