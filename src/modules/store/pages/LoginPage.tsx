import { FC, FormEvent, useState } from 'react';
import { useNavigate, useLocation, Location, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { storeApi } from '../api/storeApi';
import type { User } from '../types';

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginAction = useStore((state) => state.login);

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as { from?: Location })?.from?.pathname || '/store';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let userProfile: User;

      if (isRegister) {

        if (!fullName.trim()) {
          setError('El nombre completo es obligatorio.');
          setIsLoading(false);
          return;
        }

        userProfile = await storeApi.register({
          email,
          password,
          nombre: fullName
        });
      } else {

        userProfile = await storeApi.login({ email, password });
      }

      loginAction(userProfile);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Error de autenticación:', err);
      const errorObj = err as { response?: { data?: { detail?: string; message?: string } } };
      const detail = errorObj.response?.data?.detail || errorObj.response?.data?.message;
      setError(
        typeof detail === 'string'
          ? detail
          : 'Ocurrió un error. Por favor verifica los datos ingresados.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-slate-100 transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-200 mb-4 animate-pulse">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {isRegister ? 'Crear Cuenta' : '¡Bienvenido!'}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {isRegister
              ? 'Regístrate para comprar y seguir tus pedidos.'
              : 'Inicia sesión para gestionar tus compras.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white/50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                placeholder="Juan Pérez"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white/50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white/50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition hover:from-sky-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Procesando...
              </span>
            ) : (
              isRegister ? 'Registrarse' : 'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-sm font-medium text-sky-600 hover:text-sky-700 transition"
          >
            {isRegister
              ? '¿Ya tienes una cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate aquí'}
          </button>
          {!isRegister && (
            <p className="text-xs text-slate-400">
              También podés ir a la{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-500 hover:text-indigo-700 transition"
              >
                página de registro completa
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;