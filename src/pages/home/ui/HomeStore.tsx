import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../../entities/product/model/useProducts';
import { useCategories } from '../../../entities/category/model/useCategories';
import { useStore } from '../../../entities/user/model/userStore';
import { Product } from '../../../shared/types';
import ProductCard from '../../../entities/product/ui/ProductCard';

const HomeStore: FC = () => {
  const navigate = useNavigate();
  const addToCart = useStore((state) => state.addToCart);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: products = [], isLoading: productsLoading, error } = useProducts({
    busqueda: searchTerm,
    categoria_id: selectedCategoryId,
  });

  const isLoading = productsLoading || categoriesLoading;

  const handleAddToCart = (product: Product): void => {
    addToCart({ ...product, quantity: 1 });
  };

  const handleProductDetail = (productId: string): void => {
    navigate(`/store/products/${productId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategoryId(value ? Number(value) : undefined);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Search and Filter Section */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Buscar Productos
              </label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Escribe el nombre del producto..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-1 sm:max-w-xs">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Categoría
              </label>
              <select
                value={selectedCategoryId || ''}
                onChange={handleCategoryChange}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition text-slate-800 font-medium"
              >
                <option value="">Todas las Categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedCategoryId) && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filtros activos:</span>
              {searchTerm && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-medium">
                  Búsqueda: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 hover:text-sky-900"
                  >
                    ✕
                  </button>
                </div>
              )}
              {selectedCategoryId && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                  {categories.find(c => c.id === selectedCategoryId)?.nombre}
                  <button
                    onClick={() => setSelectedCategoryId(undefined)}
                    className="ml-1 hover:text-indigo-900"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

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
            <p className="text-slate-500 text-sm mt-1">Intenta ajustar tu búsqueda o categoría seleccionada.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategoryId(undefined);
              }}
              className="mt-6 px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-medium transition"
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeStore;