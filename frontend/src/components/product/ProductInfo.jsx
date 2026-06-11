import { Star } from 'lucide-react';

const ProductInfo = ({ product }) => {
  return (
    <div className="mb-8">
      <p className="text-sm text-blue-600 font-semibold tracking-wider uppercase mb-2">{product.category}</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">{product.name}</h1>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 fill-slate-200'}`} />
          ))}
          <span className="text-sm font-medium text-slate-700 ml-1">{product.rating}</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
        <span className="text-sm text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">{product.reviews} Reviews</span>
      </div>

      <div className="mb-6">
        <span className="text-3xl font-extrabold text-slate-900">{product.price}</span>
      </div>

      <p className="text-slate-600 leading-relaxed mb-6">
        {product.description}
      </p>

      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm font-medium text-slate-700">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
      </div>
    </div>
  );
};

export default ProductInfo;
