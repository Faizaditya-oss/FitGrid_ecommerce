import { ShoppingBag, Star } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const ProductCard = ({ product, onViewDetail }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    
    const defaultSize = product.sizes ? product.sizes[0] : 'All Size';
    const defaultColor = 'Standard'; 

    let numericPrice = product.priceNum;
    if (!numericPrice && typeof product.price === 'string') {
      numericPrice = parseInt(product.price.replace(/[^\d]/g, ''), 10) || 0;
    } else if (!numericPrice) {
      numericPrice = product.price || 0;
    }

    const cartItem = {
      id: `${product.id}-${defaultSize}-${defaultColor}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      price: numericPrice,
      size: defaultSize,
      color: defaultColor,
      image: product.image,
      quantity: 1
    };

    addToCart(cartItem);
    alert('Added to cart!');
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
              New
            </span>
          )}
          {product.discount && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-slate-900/90 backdrop-blur-sm text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">{product.category}</p>
        <h3 className="font-bold text-slate-900 leading-snug mb-2 truncate">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 fill-slate-200'}`}
            />
          ))}
          <span className="text-xs text-slate-400 ml-1">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-extrabold text-slate-900 text-lg">{product.price}</span>
          {product.originalPrice && (
            <span className="text-slate-400 text-sm line-through">{product.originalPrice}</span>
          )}
        </div>

        {/* View Detail Button */}
        <button
          onClick={() => onViewDetail && onViewDetail(product)}
          className="mt-3 w-full border border-slate-200 text-slate-700 py-2 rounded-xl text-sm font-semibold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-200"
        >
          View Detail
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
