import { FC } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetail: () => void;
}

const ProductCard: FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetail,
}) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden bg-slate-50 border-b border-slate-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl shadow-sm">
            {product.category}
          </span>
        )}
        <div className="absolute bottom-3 right-3 bg-sky-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md">
          ${product.price.toFixed(2)}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-1.5">
          <h3 className="font-bold text-slate-800 text-base group-hover:text-sky-600 transition line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description || 'Delicioso plato preparado con ingredientes de primera calidad.'}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${
            isOutOfStock ? 'text-rose-500' : 'text-emerald-600'
          }`}>
            {isOutOfStock ? 'Sin stock' : `Stock: ${product.stock}`}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onViewDetail}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl transition"
            >
              Detalle
            </button>
            <button
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className="text-xs font-bold bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white px-3.5 py-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-50 disabled:hover:text-sky-600"
            >
              + Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;