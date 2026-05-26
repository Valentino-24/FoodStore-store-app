import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductById } from '../hooks/useProducts';
import { useStore } from '../hooks';

const ProductDetail: FC = () => {
  const { productId } = useParams<{ productId?: string }>();
  const navigate = useNavigate();
  const addToCart = useStore((state) => state.addToCart);

  const { data: product, isLoading, error } = useProductById(productId);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-sky-500 border-slate-200"></div>
        <p className="text-slate-600 font-medium">Cargando detalles de producto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 text-center px-4">
        <svg className="w-16 h-16 text-rose-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-bold text-slate-800">Producto no encontrado</h2>
        <p className="text-slate-500 mt-2">Hubo un problema al cargar los datos del producto.</p>
        <button onClick={() => navigate('/store')} className="mt-6 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium transition">
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1,
    });
    navigate('/store/cart');
  };

  const primaryCategory = product.categories?.find(c => c.es_principal);
  const secondaryCategories = product.categories?.filter(c => !c.es_principal);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/store')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al Catálogo
        </button>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">

          <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
            />
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-white/90 text-slate-800 text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-2xl shadow-md">
                  Sin Stock
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-6">

              {primaryCategory && (
                <div>
                  <span className="inline-block text-xs font-semibold px-4 py-2 rounded-full bg-sky-50 text-sky-600 uppercase tracking-wider border border-sky-100">
                    {primaryCategory.nombre}
                  </span>
                </div>
              )}

              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-sky-600 mt-2">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Descripción
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {product.description || 'Este exquisito plato está preparado con los ingredientes más frescos del día.'}
                </p>
              </div>

              {secondaryCategories && secondaryCategories.length > 0 && (
                <div className="border-t border-slate-100 pt-6 space-y-3">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Categorías Relacionadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {secondaryCategories.map((cat) => (
                      <span
                        key={cat.id}
                        className="text-xs bg-slate-50 text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-slate-200"
                      >
                        {cat.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.ingredients && product.ingredients.length > 0 && (
                <div className="border-t border-slate-100 pt-6 space-y-3">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Ingredientes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing) => (
                      <span
                        key={ing.id}
                        className="text-xs bg-emerald-50 text-emerald-700 font-medium px-3 py-1.5 rounded-lg border border-emerald-200 inline-flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {ing.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-6 mt-8 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Disponibilidad</span>
                <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {product.stock > 0 ? `${product.stock} unidades` : 'Sin unidades disponibles'}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;