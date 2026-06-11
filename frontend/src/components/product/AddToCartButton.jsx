import { ShoppingBag } from 'lucide-react';

const AddToCartButton = ({ onAdd, onBuy, disabled }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-10">
      <button 
        onClick={onAdd}
        disabled={disabled}
        className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-sm ${
          disabled 
            ? 'bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 hover:-translate-y-1'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        Add to Cart
      </button>
      <button 
        onClick={onBuy}
        disabled={disabled}
        className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all ${
          disabled
            ? 'bg-slate-300 border-2 border-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-blue-600 border-2 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 hover:-translate-y-1 shadow-lg shadow-blue-600/30'
        }`}
      >
        Buy Now
      </button>
    </div>
  );
};

export default AddToCartButton;
