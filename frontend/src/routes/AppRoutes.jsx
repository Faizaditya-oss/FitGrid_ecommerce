import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/public/Home';
import AllProducts from '../pages/public/AllProducts';
import ProductDetail from '../pages/public/ProductDetail';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import FAQ from '../pages/public/FAQ';
import ShippingReturns from '../pages/public/ShippingReturns';
import SizeGuide from '../pages/public/SizeGuide';
import TrackOrder from '../pages/public/TrackOrder';
import ContactUs from '../pages/public/ContactUs';

// Placeholders for other pages
const Placeholder = ({ title }) => (
  <div className="container mx-auto px-4 py-16 text-center">
    <h2 className="text-3xl font-bold mb-4">{title}</h2>
    <p className="text-secondary">This page is under construction.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<AllProducts />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="shipping-returns" element={<ShippingReturns />} />
        <Route path="size-guide" element={<SizeGuide />} />
        <Route path="track-order" element={<TrackOrder />} />
        <Route path="contact" element={<ContactUs />} />
        {/* Add Protected Routes and Admin Routes here as needed */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
