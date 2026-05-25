// src/modules/store/components/CartItem.tsx
import { FC } from 'react';
import { CartItem } from '../types';

interface CartItemProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItemComponent: FC<CartItemProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
}) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity >= 1) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 py-4 px-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition">
      {/* Product Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-center gap-2">
        <h4 className="font-semibold text-slate-800 text-sm">{item.name}</h4>
        <p className="text-xs text-slate-500">${item.price.toFixed(2)} c/u</p>
      </div>

      {/* Quantity Input */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={item.quantity}
          onChange={handleQuantityChange}
          min="1"
          className="w-16 px-3 py-2 border border-slate-200 rounded-lg text-center text-sm font-semibold text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {/* Subtotal */}
      <div className="flex flex-col items-end justify-center gap-2 min-w-fit">
        <p className="font-bold text-slate-800 text-sm">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <button 
        onClick={() => onRemove(item.id)}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
        title="Eliminar del carrito"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default CartItemComponent;