import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../../entities/user/model/userStore';

const ProtectedRoute: FC = () => {
  const user = useStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;