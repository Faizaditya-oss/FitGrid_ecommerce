import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';

const ProductGrid = ({ products, onViewDetail, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
            <div className="aspect-[3/4] bg-slate-200" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-slate-200 rounded-full w-1/3" />
              <div className="h-4 bg-slate-200 rounded-full w-2/3" />
              <div className="h-3 bg-slate-200 rounded-full w-1/4" />
              <div className="h-6 bg-slate-200 rounded-full w-1/2 mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <PackageOpen className="w-16 h-16 mb-4 text-slate-300" />
        <h3 className="text-xl font-bold text-slate-600 mb-1">No products found</h3>
        <p className="text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onViewDetail={onViewDetail} />
      ))}
    </div>
  );
};

export default ProductGrid;
