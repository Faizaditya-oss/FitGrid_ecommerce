import ProductCard from './ProductCard';

const RelatedProducts = ({ products, onViewDetail }) => {
  return (
    <section className="mt-24 mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center uppercase tracking-tight">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onViewDetail={onViewDetail} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
