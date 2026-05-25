import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './modules/store/components/Navbar';
import StoreRoutes from './modules/store/routes/StoreRoutes';
import LoginPage from './modules/store/pages/LoginPage';
import { RegisterPage } from './modules/store/auth';

const App: FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<StoreRoutes />} />
      </Routes>
    </>
  );
};

export default App;
