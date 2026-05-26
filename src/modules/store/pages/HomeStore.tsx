import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useStore } from '../hooks';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

const HomeStore: FC = () => {
  const navigate = useNavigate();
  const addToCart = useStore((state) => state.addToCart);

  const { data: products, isLoading, error } = useProducts();

  const handleAddToCart = (product: Product): void => {
    addToCart({ ...product, quantity: 1 });
  };

  const handleProductDetail = (productId: string): void => {
    navigate(`/store/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-sky-500 border-slate-200"></div>
            <p className="text-slate-600 font-medium">Cargando catálogo...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center max-w-md mx-auto my-12">
            <svg className="w-12 h-12 text-rose-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-bold text-slate-800 text-lg">Error al cargar productos</h3>
            <p className="text-slate-500 text-sm mt-1">Por favor, comprueba tu conexión con el servidor.</p>
          </div>
        )}

        {!isLoading && !error && products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetail={() => handleProductDetail(product.id)}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && products && products.length === 0 && (
          <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center max-w-lg mx-auto shadow-sm">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="font-bold text-slate-800 text-lg">No encontramos productos</h3>
            <p className="text-slate-500 text-sm mt-1">Intenta ajustar tu búsqueda o escribir otra palabra clave.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeStore;