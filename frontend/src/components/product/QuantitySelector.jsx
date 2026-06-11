import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({ quantity, setQuantity, stock = 99 }) => {
  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increase = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  if (stock <= 0) {
    return (
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Quantity</h3>
        <div className="inline-block px-4 py-2 bg-red-100 text-red-600 font-bold rounded-lg shadow-sm border border-red-200">
          Sold Out
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quantity</h3>
        <span className="text-sm text-slate-500 font-medium">Stock: {stock}</span>
      </div>
      <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
        <button 
          onClick={decrease}
          disabled={quantity <= 1}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all text-slate-700"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
        <button 
          onClick={increase}
          disabled={quantity >= stock}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all text-slate-700"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
