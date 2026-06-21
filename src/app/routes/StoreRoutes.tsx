import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeStore from '../../pages/home/ui/HomeStore';
import CartPage from '../../pages/cart/ui/CartPage';
import OrdersPage from '../../pages/orders/ui/OrdersPage';
import OrderDetail from '../../pages/order-detail/ui/OrderDetail';
import CheckoutPage from '../../pages/checkout/ui/CheckoutPage';
import ProductDetail from '../../pages/product-detail/ui/ProductDetail';
import UserProfile from '../../pages/profile/ui/UserProfile';
import ProtectedRoute from './ProtectedRoute';
import { useWebSocket } from '../../shared/hooks/useWebSocket';

const StoreRoutes: FC = () => {
  useWebSocket();

  return (
    <Routes>
      <Route path="" element={<HomeStore />} />
      <Route path="products/:productId" element={<ProductDetail />} />

      <Route element={<ProtectedRoute />}>
        <Route path="profile" element={<UserProfile />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:orderId" element={<OrderDetail />} />
      </Route>
    </Routes>
  );
};

export default StoreRoutes;