import { FC, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks';
import { storeApi } from '../api/storeApi';

const Navbar: FC = () => {
  const items = useStore((state) => state.items);
  const user = useStore((state) => state.user);
  const logoutAction = useStore((state) => state.logout);
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      await storeApi.logout();
    } catch (err) {
      console.error('Error al cerrar sesión en el servidor:', err);
    } finally {
      logoutAction();
      setIsLoggingOut(false);
      navigate('/login');
    }
  };

  const isActive = (path: string) => {
    if (path === '/store') {
      return location.pathname === '/store' || location.pathname === '/store/';
    }
    return location.pathname.includes(path);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brand */}
          <Link to="/store" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-100 group-hover:scale-105 transition">
              <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-slate-800 tracking-tight">
              Food<span className="text-sky-500">Store</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/store"
              className={`text-sm font-semibold transition px-1 py-2 border-b-2 ${
                isActive('/store') && !isActive('/cart') && !isActive('/orders')
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Catálogo
            </Link>
            
            {user && (
              <Link
                to="/store/orders"
                className={`text-sm font-semibold transition px-1 py-2 border-b-2 ${
                  isActive('/orders')
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                Mis Pedidos
              </Link>
            )}

            <div className="h-6 w-[1px] bg-slate-200"></div>

            {/* Shopping Cart Icon with Badge */}
            <Link
              to="/store/cart"
              className={`relative p-2.5 rounded-full transition flex-shrink-0 ${
                isActive('/cart')
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0l2-9m-2 9h2m0 0h2" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile & Auth Button */}
            {user ? (
              <div className="flex items-center gap-3 ml-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-600">
                    ¡Hola, {user.full_name?.split(' ')[0] || 'Usuario'}!
                  </span>
                  <span className="text-[11px] text-slate-400">{user.email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoggingOut ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saliendo...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Salir
                    </>
                  )}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:shadow-lg transition shadow-sky-100"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;