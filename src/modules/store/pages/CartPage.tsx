import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks';

const CartPage: FC = () => {
  const navigate = useNavigate();
  const items = useStore((state) => state.items);
  const total = useStore((state) => state.total);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);

  const handleRemoveItem = (id: string): void => {
    removeFromCart(id);
  };

  const handleUpdateQuantity = (id: string, quantity: number): void => {
    if (quantity > 0) {
      updateCartQuantity(id, quantity);
    }
  };

  const handleCheckout = (): void => {
    if (items.length > 0) {
      navigate('/store/checkout');
    }
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
          <div>
            <p className="text-sky-500 text-xs font-semibold uppercase tracking-wider">Tu pedido</p>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Carrito de Compras</h1>
          </div>
          {items.length > 0 && (
            <span className="inline-flex items-center px-4 py-2 rounded-2xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm shrink-0">
              {cartCount} artículo{cartCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center max-w-lg mx-auto shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-400 mb-6 border border-slate-100">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0l2-9m-2 9h2m0 0h2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Tu carrito está vacío</h2>
            <p className="text-slate-500 text-sm mt-2">¿Aún no te has decidido? Explora nuestro exquisito menú.</p>
            <button 
              onClick={() => navigate('/store')}
              className="mt-8 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition hover:from-sky-600 hover:to-indigo-700"
            >
              Ver el Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm gap-4 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    {/* Item Info */}
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h3>
                      {item.category && (
                        <p className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">{item.category}</p>
                      )}
                      <p className="text-xs font-semibold text-sky-600 mt-1">${item.price.toFixed(2)} c/u</p>
                    </div>
                  </div>

                  {/* Quantity & Total Section */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity Picker */}
                    <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden shrink-0">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-3.5 py-2 text-slate-500 hover:text-slate-900 transition hover:bg-slate-100 font-bold"
                      >
                        −
                      </button>
                      <span className="px-3 py-2 text-sm text-slate-85 text-slate-800 font-semibold text-center min-w-[2.5rem]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-3.5 py-2 text-slate-500 hover:text-slate-900 transition hover:bg-slate-100 font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[5rem] shrink-0 font-bold text-slate-800 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Eliminar artículo"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                Resumen de Compra
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Productos ({cartCount})</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Envío</span>
                  <span className="text-emerald-600 font-semibold">Gratis</span>
                </div>
                <div className="border-b border-slate-100 pb-4"></div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition hover:from-sky-600 hover:to-indigo-700 mt-8"
              >
                Proceder al Pago
              </button>

              <button
                onClick={() => navigate('/store')}
                className="w-full rounded-2xl bg-slate-50 hover:bg-slate-100 py-4 text-sm font-semibold text-slate-600 transition mt-3"
              >
                Continuar Comprando
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;