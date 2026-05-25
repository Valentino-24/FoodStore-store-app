import { FC, ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks';
import { useCreateOrder } from '../hooks/useOrders';
import { storeApi } from '../api/storeApi';
import { ShippingInfo, DeliveryAddress } from '../types';

const CheckoutPage: FC = () => {
  const navigate = useNavigate();
  const clearCart = useStore((state) => state.clearCart);
  const items = useStore((state) => state.items);
  const total = useStore((state) => state.total);
  const token = useStore((state) => state.token);
  const setAddresses = useStore((state) => state.setAddresses);
  const createOrder = useCreateOrder();

  const [formData, setFormData] = useState<ShippingInfo>({
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    notes: '',
  });

  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState('1'); // Default: 1 (Efectivo)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [error, setError] = useState('');

  // Load saved addresses on mount
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const addrs = await storeApi.getAddresses();
        setSavedAddresses(addrs);
        setAddresses(addrs);
        if (addrs.length > 0) {
          setSelectedAddressId(addrs[0].id || null);
        }
      } catch (err) {
        console.error('Error loading addresses:', err);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    if (token) {
      loadAddresses();
    }
  }, [token, setAddresses]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (items.length === 0) {
      setError('Tu carrito está vacío. Agrega productos antes de realizar un pedido.');
      setIsSubmitting(false);
      return;
    }

    try {
      let addressId: number | undefined;

      if (useExistingAddress && selectedAddressId) {
        // Use existing address
        addressId = selectedAddressId;
      } else {
        // Create new address
        if (!formData.address.trim() || !formData.city.trim() || !formData.zipCode.trim()) {
          setError('Por favor completa todos los campos requeridos de la dirección.');
          setIsSubmitting(false);
          return;
        }

        const addressRes = await storeApi.createAddress({
          alias: formData.notes || `Dirección ${new Date().toLocaleDateString()}`,
          direccion: formData.address,
          ciudad: formData.city,
          codigo_postal: formData.zipCode || undefined,
          es_principal: false,
        });
        addressId = addressRes.id;
      }

      // Create order
      const orderPayload = {
        forma_pago_id: Number(paymentMethodId),
        direccion_entrega_id: addressId,
        detalles: items.map((item) => ({
          producto_id: Number(item.id),
          cantidad: item.quantity,
        })),
      };

      await createOrder.mutateAsync(orderPayload);
      clearCart();
      navigate('/store/orders');
    } catch (err) {
      console.error('Error al realizar el pedido:', err);
      const errorObj = err as { response?: { data?: { detail?: string; message?: string } } };
      const detail = errorObj.response?.data?.detail || errorObj.response?.data?.message;
      setError(
        typeof detail === 'string'
          ? detail
          : 'Ocurrió un error al procesar el pedido. Verifica los datos o el stock.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
          Finalizar Compra
        </h1>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            
            {/* Address Selection */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">
                Información de Envío
              </h2>
              
              {!isLoadingAddresses && savedAddresses.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={useExistingAddress}
                        onChange={() => setUseExistingAddress(true)}
                        className="h-4 w-4 text-sky-600"
                      />
                      <span className="text-sm font-medium text-slate-700">Usar dirección guardada</span>
                    </label>
                  </div>
                  
                  {useExistingAddress && (
                    <select
                      value={selectedAddressId || ''}
                      onChange={(e) => setSelectedAddressId(Number(e.target.value) || null)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    >
                      <option value="">Selecciona una dirección</option>
                      {savedAddresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.alias} - {addr.direccion}, {addr.ciudad}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!useExistingAddress}
                        onChange={() => setUseExistingAddress(false)}
                        className="h-4 w-4 text-sky-600"
                      />
                      <span className="text-sm font-medium text-slate-700">Usar nueva dirección</span>
                    </label>
                  </div>
                </div>
              )}
              
              {!useExistingAddress && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Dirección Completa *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Calle, Número, Depto"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Ciudad / Provincia"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="e.g. 5000"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+54 9..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Notas / Alias (opcional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Ej. Departamento 4B, dejar en recepción..."
                      rows={3}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Selection */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">
                Método de Pago
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: '1', name: 'Efectivo', desc: 'Paga en mano al recibir' },
                  { id: '2', name: 'Tarjeta de Crédito', desc: 'Visa, MasterCard, American Express' },
                  { id: '3', name: 'Tarjeta de Débito', desc: 'Débito directo' },
                  { id: '4', name: 'Transferencia Bancaria', desc: 'Transferencia directa por CBU/Alias' },
                ].map((pm) => (
                  <label 
                    key={pm.id} 
                    className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition focus-within:ring-4 focus-within:ring-sky-100 ${
                      paymentMethodId === pm.id 
                        ? 'border-sky-500 bg-sky-50/30' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-800">{pm.name}</span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={paymentMethodId === pm.id}
                        onChange={(e) => setPaymentMethodId(e.target.value)}
                        className="h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500"
                      />
                    </div>
                    <span className="text-xs text-slate-500 mt-1">{pm.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || createOrder.isPending}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || createOrder.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando Pedido...
                </span>
              ) : (
                'Confirmar y Pagar Pedido'
              )}
            </button>
          </form>

          {/* Summary Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm sticky top-6">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">
                Resumen de Compra
              </h2>
              
              <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-800 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-slate-500">Cantidad: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-sm text-slate-800 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-6 mt-6 space-y-4">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Envío</span>
                  <span className="text-emerald-600 font-semibold">Gratis</span>
                </div>
                <div className="border-t border-slate-100 pt-4 flex justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;