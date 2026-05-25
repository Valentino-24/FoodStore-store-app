// src/modules/store/routes/StoreRoutes.tsx
import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeStore from '../pages/HomeStore';
import CartPage from '../pages/CartPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetail from '../pages/OrderDetail';
import CheckoutPage from '../pages/CheckoutPage';
import ProductDetail from '../pages/ProductDetail';
import ProtectedRoute from './ProtectedRoute';

const StoreRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeStore />} />
      <Route path="products/:productId" element={<ProductDetail />} />

      <Route element={<ProtectedRoute />}>
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:orderId" element={<OrderDetail />} />
      </Route>
    </Routes>
  );
};

export default StoreRoutes;