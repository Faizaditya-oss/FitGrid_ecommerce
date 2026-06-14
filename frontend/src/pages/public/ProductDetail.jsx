import { useState, useMemo, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGallery from '../../components/product/ProductGallery';
import ProductInfo from '../../components/product/ProductInfo';
import ProductVariant from '../../components/product/ProductVariant';
import QuantitySelector from '../../components/product/QuantitySelector';
import AddToCartButton from '../../components/product/AddToCartButton';
import RelatedProducts from '../../components/product/RelatedProducts';
import { CartContext } from '../../context/CartContext';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useContext(CartContext);
  
  const [productData, setProductData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await productService.getProductById(id);
        if (data) {
          setProductData(data);
          
          // Fetch all products for related products section
          const all = await productService.getProducts();
          const related = all.filter(p => p.category === data.category && p.id !== data.id).slice(0, 4);
          if (related.length < 4) {
            const more = all.filter(p => p.id !== data.id && !related.find(r => r.id === p.id)).slice(0, 4 - related.length);
            related.push(...more);
          }
          setRelatedProducts(related);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const product = useMemo(() => {
    if (!productData) return null;
    
    // Parse dynamic arrays from string or use fallback if empty
    let images = productData.image ? [productData.image] : [];
    let colors = productData.color ? productData.color.split(',').map(c => c.trim()) : ["Standard"];

    return {
      ...productData,
      description: productData.description || `Experience ultimate comfort with our ${productData.name}. Made from premium materials, it features a perfect fit and elegant design for your everyday wear.`,
      stock: (productData.stock !== undefined && productData.stock !== null) ? Number(productData.stock) : 10,
      images,
      colors,
      rating: 4.8, // Dummy rating per requirements
      reviews: 24, // Dummy reviews per requirements
      details: {
        bahan: "Premium Quality Material",
        spesifikasi: "Standard fit, comfortable design",
        infoTambahan: "Machine wash cold, tumble dry low."
      }
    };
  }, [productData]);

  // State for product selections
  const [selectedSize, setSelectedSize] = useState("All Size");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");

  // Calculate available stock based on what's already in the cart
  const itemsInCart = (cart || []).filter(item => item.productId === product?.id).reduce((acc, item) => acc + item.quantity, 0);
  const availableStock = Math.max(0, (product?.stock || 0) - itemsInCart);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : "All Size");
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : "");
      setActiveImage(product.images && product.images.length > 0 ? product.images[0] : "");
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (quantity > availableStock && availableStock > 0) {
      setQuantity(availableStock);
    } else if (availableStock === 0) {
      setQuantity(1); // visually reset, though disabled
    }
  }, [availableStock, quantity]);

  const colorImageMap = useMemo(() => {
    if (!product) return {};
    const map = {};
    if (product.colors && product.images) {
      product.colors.forEach((c, idx) => {
        map[c] = product.images[idx] || product.images[0];
      });
    }
    return map;
  }, [product]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (colorImageMap[color]) {
      setActiveImage(colorImageMap[color]);
    }
  };

  const handleImageChange = (img) => {
    setActiveImage(img);
    const color = Object.keys(colorImageMap).find(k => colorImageMap[k] === img);
    if (color && product.colors.includes(color)) {
      setSelectedColor(color);
    }
  };

  const handleAddToCart = () => {
    let numericPrice = product.priceNum;
    if (!numericPrice && typeof product.price === 'string') {
      numericPrice = parseFloat(product.price) || 0;
    } else if (!numericPrice) {
      numericPrice = product.price || 0;
    }

    const cartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      price: numericPrice,
      size: selectedSize,
      color: selectedColor,
      image: activeImage,
      quantity: quantity
    };
    addToCart(cartItem);
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) return <div className="p-8 text-center text-slate-600 font-medium">Loading product...</div>;
  if (error || !product) return <div className="p-8 text-center text-red-500 font-bold text-xl">Product Not Found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left Column: Gallery */}
        <div className="w-full lg:w-1/2">
          <ProductGallery images={product.images} externalActiveImage={activeImage} onImageChange={handleImageChange} />
        </div>

        {/* Right Column: Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <ProductInfo product={product} />
          
          <hr className="border-slate-200 mb-8" />
          
          <ProductVariant 
            sizes={product.sizes && product.sizes.length > 0 ? product.sizes : ["All Size"]}
            colors={product.colors}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={handleColorChange}
          />

          <QuantitySelector 
            quantity={quantity}
            setQuantity={setQuantity}
            stock={availableStock}
          />

          <AddToCartButton 
            onAdd={handleAddToCart}
            onBuy={handleBuyNow}
            disabled={availableStock <= 0}
          />

          {/* Description Section */}
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 mt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider">Product Details</h3>
            <div className="space-y-4 text-sm sm:text-base">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-semibold text-slate-900">Bahan</span>
                <span className="sm:col-span-2 text-slate-600">{product.details.bahan}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-semibold text-slate-900">Spesifikasi</span>
                <span className="sm:col-span-2 text-slate-600">{product.details.spesifikasi}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-semibold text-slate-900">Info Tambahan</span>
                <span className="sm:col-span-2 text-slate-600">{product.details.infoTambahan}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts products={relatedProducts} onViewDetail={(p) => navigate(`/products/${p.id}`)} />
    </div>
  );
};

export default ProductDetail;
