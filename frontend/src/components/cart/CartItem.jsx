import { Trash2 } from 'lucide-react';
import QuantitySelector from './QuantitySelector';

const CartItem = ({ item, maxQuantity, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-5 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Image */}
      <div className="w-full sm:w-32 aspect-[4/5] sm:aspect-square rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-grow min-w-0">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{item.category}</p>
            <h3 className="text-base md:text-lg font-bold text-slate-900 truncate leading-snug">{item.name}</h3>
          </div>
          <button 
            onClick={() => onRemove(item.id)}
            className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
            title="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        
        {/* Variants */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-4">
          <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
            Size: <span className="font-semibold text-slate-900">{item.size}</span>
          </span>
          <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
            Color: <span className="font-semibold text-slate-900">{item.color}</span>
          </span>
        </div>
        
        {/* Price & Quantity */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <span className="text-lg font-bold text-slate-900">
            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
          </span>
          <QuantitySelector 
            quantity={item.quantity} 
            max={maxQuantity}
            onIncrease={() => {
              if (item.quantity < maxQuantity) {
                onUpdateQuantity(item.id, item.quantity + 1, maxQuantity);
              }
            }}
            onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1, maxQuantity)}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
