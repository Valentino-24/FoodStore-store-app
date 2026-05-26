import { FC } from 'react';
import { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onView: () => void;
}

const OrderCard: FC<OrderCardProps> = ({ order, onView }) => {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    shipped: 'En Envío',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };

  const statusColor = statusColors[order.status] || statusColors.pending;
  const statusLabel = statusLabels[order.status] || 'Desconocido';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-slate-200 transition">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">
            Pedido #{order.id}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {new Date(order.createdAt).toLocaleDateString('es-AR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      <div className="space-y-3 mb-4 pb-4 border-t border-slate-100 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Cantidad de artículos:</span>
          <span className="font-semibold text-slate-900">{order.items.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Dirección:</span>
          <span className="font-semibold text-slate-900">{order.shippingInfo.city}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="font-semibold text-slate-700">Total:</span>
          <span className="font-bold text-sky-600">${order.total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onView}
        className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:from-sky-600 hover:to-indigo-700 transition"
      >
        Ver Detalle Completo
      </button>
    </div>
  );
};

export default OrderCard;