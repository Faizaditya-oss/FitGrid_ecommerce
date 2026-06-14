import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { toast } from 'react-hot-toast';
import { productService } from '../../services/productService';
import { formatRupiah } from '../../utils/currency';
import ProductGrid from '../../components/product/ProductGrid';
import heroImg from '../../assets/images/hero/hero.jpg';
import catalog1 from '../../assets/images/products/catalog1.jpg';
import catalog2 from '../../assets/images/products/catalog2.jpg';
import catalog3 from '../../assets/images/products/catalog3.jpg';
import catalog4 from '../../assets/images/products/catalog4.jpg';

import { useProducts } from '../../hooks/useProducts';

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    verified: true,
    text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations."
  },
  {
    id: 2,
    name: "Alex K.",
    rating: 5,
    verified: true,
    text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions."
  },
  {
    id: 3,
    name: "James L.",
    rating: 5,
    verified: true,
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."
  },
  {
    id: 4,
    name: "Mooen",
    rating: 5,
    verified: true,
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."
  },
  {
    id: 5,
    name: "Emily R.",
    rating: 5,
    verified: true,
    text: "I absolutely love the variety and quality of the items! Every piece I ordered fits perfectly and looks just like the pictures. Highly recommend this store."
  },
  {
    id: 6,
    name: "Michael T.",
    rating: 4,
    verified: true,
    text: "Great customer service and fast shipping. The shirt I got is super comfortable, although I wish there were more color options. Still a great purchase."
  },
  {
    id: 7,
    name: "Jessica W.",
    rating: 5,
    verified: true,
    text: "This has become my go-to place for online clothing shopping. The styles are always up-to-date with current trends, and the prices are very reasonable."
  },
  {
    id: 8,
    name: "David H.",
    rating: 5,
    verified: true,
    text: "I was skeptical at first, but the quality of the denim jeans completely blew me away. They feel premium and have held up well after multiple washes."
  }
];


const Home = () => {
  const { addToCart, cart } = useContext(CartContext);
  const navigate = useNavigate();
  const allProducts = useProducts();
  const trendingProducts = allProducts.slice(0, 4);

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "All Size";
    const defaultColor = product.color || "Standard";

    const maxStock = parseInt(product.stock, 10) || 0;
    
    const itemsInCart = (cart || []).filter(item => item.productId === product.id).reduce((acc, item) => acc + item.quantity, 0);
    const availableStock = Math.max(0, maxStock - itemsInCart);

    if (availableStock <= 0) {
      toast.error(`Stok ${product.name} telah habis!`, {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      return;
    }

    const numericPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

    const cartItem = {
      id: `${product.id}-${defaultSize}-${defaultColor}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      price: numericPrice,
      size: defaultSize,
      color: defaultColor,
      image: product.image,
      quantity: 1,
    };

    addToCart(cartItem);
    toast.success(`${product.name} ditambahkan ke keranjang!`, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
      iconTheme: {
        primary: '#4ade80',
        secondary: '#fff',
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-white rounded-3xl overflow-hidden mb-16 flex flex-col md:flex-row items-stretch justify-between min-h-[70vh] shadow-sm border border-slate-100">
        
        {/* Hero Image (Left Side) */}
        <div className="w-full md:w-1/2 relative overflow-hidden flex-shrink-0 min-h-[300px] md:min-h-full bg-slate-100">
          <img 
            src={heroImg} 
            alt="Hero Fashion" 
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105" 
          />
        </div>
        
        {/* Hero Text (Right Side) */}
        <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col justify-center items-start text-left bg-gradient-to-br from-white to-slate-50">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-slate-900 leading-[1.1] capitalize">
            Find your <br/>
            <span className="text-blue-600">favorite fashion</span> <br/>
            style
          </h1>
          <p className="text-lg md:text-xl mb-10 text-slate-600 max-w-lg leading-relaxed">
            Discover our latest arrivals. Fresh, modern, and elegantly designed to elevate your everyday confidence.
          </p>
          <div className="flex gap-4"> 
            <Link to="/cart" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-lg shadow-slate-900/20">
              Shop Now
            </Link>
            <Link to="/products" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products (Placeholder) */}
      <section className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold">Trending Now</h2>
         <a 
          href="/products" 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-400 transition-colors"
        >
          View all
        </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer hover-lift"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-4 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <button 
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="glass text-primary px-6 py-2 rounded-full font-medium shadow-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    Quick Add
                  </button>
                </div>
              </div>
              <div className="px-2">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="text-secondary mb-1">{product.category}</p>
                <p className="text-lg font-bold text-slate-900 mt-1">{formatRupiah(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Happy Customers Section */}
      <section className="mb-16 overflow-hidden">
        <style>
          {`
            @keyframes slide-infinite {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-slider {
              animation: slide-infinite 40s linear infinite;
            }
            .animate-slider:hover {
              animation-play-state: paused;
            }
          `}
        </style>
        <div className="flex justify-center items-end mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight uppercase ">OUR HAPPY CUSTOMERS</h2>
          <div className="flex gap-4">
            {/* <button className="text-slate-900 hover:text-slate-600 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button> */}
            {/* <button className="text-slate-900 hover:text-slate-600 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8">
                <path d="M5 12H19M19 12L12 19M19 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button> */}
          </div>
        </div>
        
        <div className="relative w-full">
          <div className="flex gap-6 w-max animate-slider pr-6">
            {/* Duplicate array for seamless infinite looping */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={`${testimonial.id}-${index}`} className="w-[320px] md:w-[400px] shrink-0 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 cursor-pointer">
                <div className="flex text-yellow-400 mb-4 gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-slate-900">{testimonial.name}</h3>
                  {testimonial.verified && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                      <circle cx="12" cy="12" r="12" fill="#22C55E"/>
                      <path d="M7 12.5L10.5 16L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Banner */}
      <section className="mb-16">
        <div className="bg-blue-700 rounded-3xl py-14 px-8 md:px-20 flex flex-col md:flex-row items-center justify-between shadow-sm">
          {/* Left Side: Title */}
          <div className="md:w-1/2 flex justify-center md:justify-start mb-6 md:mb-0">
            <h2 className="text-5xl md:text-6xl font-serif italic text-[#ffbde4] font-medium tracking-tight">
              New Arrivals
            </h2>
          </div>
          
          {/* Right Side: Description and Link */}
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="text-center flex flex-col items-center">
              <p className="text-white text-lg md:text-xl mb-4 tracking-wide font-light">
                Discover the latest selections to add to your wardrobe. <br></br>GET A DISCOUNT NOW!
              </p>
              <a href="/products" className="text-white font-medium text-lg hover:opacity-80 transition-opacity">
                Shop Now &gt;
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
