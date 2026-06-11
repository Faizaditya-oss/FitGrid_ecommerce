import { Link } from 'react-router-dom';

const CartSummary = ({ subtotal, shipping, tax, discount }) => {
  const total = subtotal + shipping + tax - discount;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm sticky top-28">
      <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Order Summary</h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-slate-600 text-sm md:text-base">
          <span>Subtotal</span>
          <span className="font-medium text-slate-900">Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between text-slate-600 text-sm md:text-base">
          <span>Shipping Fee</span>
          <span className="font-medium text-slate-900">
            {shipping === 0 ? 'Free' : `Rp ${shipping.toLocaleString('id-ID')}`}
          </span>
        </div>
        <div className="flex justify-between text-slate-600 text-sm md:text-base">
          <span>Tax (10%)</span>
          <span className="font-medium text-slate-900">Rp {tax.toLocaleString('id-ID')}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 text-sm md:text-base">
            <span>Discount</span>
            <span className="font-semibold">-Rp {discount.toLocaleString('id-ID')}</span>
          </div>
        )}
      </div>
      
      <div className="border-t border-slate-100 pt-5 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-slate-900">Grand Total</span>
          <span className="text-xl md:text-2xl font-extrabold text-slate-900">Rp {total.toLocaleString('id-ID')}</span>
        </div>
      </div>
      
      <Link to="/checkout" className="block text-center w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 mb-4">
        Proceed to Checkout
      </Link>
      
      <p className="text-xs text-center text-slate-400 font-medium tracking-wide uppercase">
        Secure checkout powered by FitGrid
      </p>
    </div>
  );
};

export default CartSummary;
