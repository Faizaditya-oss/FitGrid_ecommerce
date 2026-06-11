import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <ShoppingBag className="w-10 h-10 text-slate-300" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">Your cart is empty</h2>
      <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
        Looks like you haven't added any products yet. Discover our latest collection and find something you love.
      </p>
      <Link 
        to="/products"
        className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-slate-800 transition-colors inline-block shadow-sm hover:shadow-md"
      >
        Start Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
