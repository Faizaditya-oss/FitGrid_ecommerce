import { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import EmptyCart from '../../components/cart/EmptyCart';
import { CartContext } from '../../context/CartContext';
import { productService } from '../../services/productService';

const Cart = () => {
  const { cart: cartItems, updateQuantity, removeFromCart } = useContext(CartContext);

  const getProductStock = (productId) => {
    const product = productService.getProductById(productId);
    return product ? product.stock : 0;
  };

  const handleUpdateQuantity = (id, newQuantity, maxQuantity) => {
    if (newQuantity < 1) return;
    if (maxQuantity !== undefined && newQuantity > maxQuantity) return;
    updateQuantity(id, newQuantity);
  };

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const { subtotal, tax, shipping, discount } = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 1500000 ? 0 : 50000; // Free shipping above 1.5M
    const discount = 0; // Fixed for now

    return { subtotal, tax, shipping, discount };
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 max-w-7xl h-full flex flex-col justify-center min-h-[60vh]">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
      {/* Header */}
      <div className="mb-8 lg:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">Shopping Cart</h1>
        <p className="text-sm md:text-base text-slate-500">
          Review your selected items before proceeding to checkout.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Left Column - Cart Items */}
        <div className="w-full lg:flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
              Cart Items <span className="text-slate-400 text-lg font-normal ml-2">({cartItems.length})</span>
            </h2>
          </div>
          
          <div className="space-y-4 mb-8">
            {cartItems.map(item => {
              const currentTotalForProduct = cartItems
                .filter(i => i.productId === item.productId)
                .reduce((acc, i) => acc + i.quantity, 0);
              const maxAvailable = getProductStock(item.productId) - currentTotalForProduct + item.quantity;

              return (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  maxQuantity={maxAvailable}
                  onUpdateQuantity={handleUpdateQuantity} 
                  onRemove={handleRemove} 
                />
              );
            })}
          </div>

          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 px-6 py-3 rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0">
          <CartSummary 
            subtotal={subtotal} 
            shipping={shipping} 
            tax={tax} 
            discount={discount} 
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
