import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({ quantity, max, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-2 py-1.5 w-max shadow-sm">
      <button 
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-slate-50"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <span className="w-6 text-center font-semibold text-slate-900 text-sm">
        {quantity}
      </span>
      
      <button 
        type="button"
        onClick={onIncrease}
        disabled={max !== undefined && quantity >= max}
        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-slate-50"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuantitySelector;
