import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../entities/user/model/userStore';
import { storeApi } from '../../../shared/api/storeApi';

const UserProfile: FC = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const addresses = useStore((state) => state.addresses);
  const setAddresses = useStore((state) => state.setAddresses);
  const removeAddress = useStore((state) => state.removeAddress);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    alias: '',
    direccion: '',
    ciudad: '',
    codigo_postal: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadAddresses = async () => {
      try {
        setIsLoading(true);
        const addrs = await storeApi.getAddresses();
        setAddresses(addrs);
      } catch (err) {
        console.error('Error loading addresses:', err);
        setError('Error al cargar direcciones');
      } finally {
        setIsLoading(false);
      }
    };

    loadAddresses();
  }, [user, navigate, setAddresses]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.alias || !formData.direccion || !formData.ciudad) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setIsLoading(true);
      await storeApi.createAddress({
        alias: formData.alias,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        codigo_postal: formData.codigo_postal || undefined,
        es_principal: false,
      });

      // Reload addresses
      const updatedAddrs = await storeApi.getAddresses();
      setAddresses(updatedAddrs);

      setSuccess('Dirección agregada exitosamente');
      setFormData({ alias: '', direccion: '', ciudad: '', codigo_postal: '' });
      setShowAddForm(false);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error creating address:', err);
      const errorObj = err as { response?: { data?: { detail?: string; message?: string } } };
      const detail = errorObj.response?.data?.detail || errorObj.response?.data?.message;
      setError(
        typeof detail === 'string'
          ? detail
          : 'Error al crear la dirección'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
      return;
    }

    try {
      setIsDeletingId(id);
      await storeApi.deleteAddress(id);
      removeAddress(id);
      setSuccess('Dirección eliminada exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Error al eliminar la dirección');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/store')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Catálogo
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sky-500 text-xs font-semibold uppercase tracking-wider">Tu Cuenta</p>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Perfil de Usuario</h1>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-sm transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12 mb-8">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">
            Información de Perfil
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Nombre Completo
              </label>
              <p className="text-slate-800 font-semibold">{user.full_name}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <p className="text-slate-800 font-semibold">{user.email}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                ID de Usuario
              </label>
              <p className="text-slate-800 font-semibold">#{user.id}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Miembro desde
              </label>
              <p className="text-slate-800 font-semibold">
                {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12">
          <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Direcciones de Envío</h2>
              <p className="text-sm text-slate-500 mt-1">Administra tus direcciones de entrega</p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-50 text-sky-600 hover:bg-sky-100 font-semibold text-sm transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Dirección
              </button>
            )}
          </div>

          {/* Add Address Form */}
          {showAddForm && (
            <form onSubmit={handleAddAddress} className="mb-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Alias *
                  </label>
                  <input
                    type="text"
                    value={formData.alias}
                    onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                    placeholder="Ej: Casa, Oficina"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    placeholder="Ciudad / Provincia"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Dirección Completa *
                  </label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Calle, Número, Apartamento, etc."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Código Postal (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.codigo_postal}
                    onChange={(e) => setFormData({ ...formData, codigo_postal: e.target.value })}
                    placeholder="e.g. 5000"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 transition disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Guardar Dirección'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ alias: '', direccion: '', ciudad: '', codigo_postal: '' });
                  }}
                  className="flex-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2.5 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Addresses List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-sky-500 border-slate-200"></div>
            </div>
          ) : addresses && addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition flex items-start justify-between group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-800">{addr.alias}</h3>
                      {addr.es_principal && (
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-sky-100 text-sky-700 text-xs font-bold">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm mb-1">{addr.direccion}</p>
                    <p className="text-slate-500 text-xs">{addr.ciudad}, {addr.codigo_postal}</p>
                  </div>

                  <button
                    onClick={() => addr.id && handleDeleteAddress(addr.id)}
                    disabled={isDeletingId === addr.id}
                    className="ml-4 p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                    title="Eliminar dirección"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-slate-500">Aún no tienes direcciones guardadas. ¡Agrega una!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
