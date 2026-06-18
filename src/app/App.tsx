import { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../widgets/navbar/ui/Navbar';
import StoreRoutes from './routes/StoreRoutes';
import LoginPage from '../pages/login/ui/LoginPage';
import RegisterPage from '../pages/register/ui/RegisterPage';

const App: FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/store" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/store/*" element={<StoreRoutes />} />
      </Routes>
    </>
  );
};

export default App;