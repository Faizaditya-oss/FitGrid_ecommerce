import { Outlet, Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import SearchBar from '../components/common/SearchBar';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { ShoppingCart, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const MainLayout = () => {
  const location = useLocation();
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const [subscribeEmail, setSubscribeEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribeEmail) return;
    
    toast.success(`Subscription berhasil! Silakan periksa email ${subscribeEmail} Anda untuk notifikasi dari FitGrid. selanjutnya.`, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    setSubscribeEmail('');
  };
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
          {/* Logo */}
          <h1 className="text-2xl font-bold tracking-tighter flex-shrink-0">
            FitGrid<span className="text-blue-600">.</span>
          </h1>
          
          {/* Search Bar - Centered */}
          <div className="hidden md:flex flex-grow justify-center px-4 md:px-8 max-w-3xl">
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex flex-shrink-0 items-center gap-6">
            {/* Auth Links or Profile */}
            {user ? (
              <div className="flex items-center gap-3 relative group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 hidden lg:block">{user.name}</span>
                </div>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-4 border-b border-slate-50">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        logout();
                        toast.success('Anda telah berhasil logout.', {
                          style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                          },
                        });
                      }} 
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Link to="/login" className="hover:text-blue-600 transition-colors">Login</Link>
                <span className="text-slate-300">|</span>
                <Link to="/register" className="hover:text-blue-600 transition-colors">Register</Link>
              </div>
            )}
            
            {/* Wishlist */}
            <Link to="/wishlist" className="text-slate-700 hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="text-slate-700 hover:text-blue-600 transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        
        {/* Mobile Search Bar - Shown only on small screens */}
        <div className="md:hidden px-4 pb-4">
          <SearchBar />
        </div>
      </header>
      
      <main className="flex-grow">
        {location.pathname !== '/products' && <Breadcrumbs />}
        <Outlet />
      </main>
      
      <footer className="bg-slate-900 text-slate-300 py-16 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-2xl font-bold text-white mb-6">
                FitGrid<span className="text-blue-500">.</span>
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Elevate your everyday style with our curated collection of modern, sustainable fashion.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Shop</h4>
              <ul className="space-y-3">
                <li><Link to="/products" className="hover:text-blue-500 transition-colors">All Products</Link></li>
                <li><Link to="/products?category=men" className="hover:text-blue-500 transition-colors">Men's Fashion</Link></li>
                <li><Link to="/products?category=women" className="hover:text-blue-500 transition-colors">Women's Fashion</Link></li>
                <li><Link to="/products?category=kids" className="hover:text-blue-500 transition-colors">Kids' Collection</Link></li>
                <li><Link to="/products?sale=true" className="hover:text-blue-500 transition-colors">Sale & Offers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Support</h4>
              <ul className="space-y-3">
                <li><Link to="/faq" className="hover:text-blue-500 transition-colors">FAQ</Link></li>
                <li><Link to="/shipping-returns" className="hover:text-blue-500 transition-colors">Shipping & Returns</Link></li>
                <li><Link to="/size-guide" className="hover:text-blue-500 transition-colors">Size Guide</Link></li>
                <li><Link to="/track-order" className="hover:text-blue-500 transition-colors">Track Order</Link></li>
                <li><Link to="/contact" className="hover:text-blue-500 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Stay in the loop</h4>
              <p className="text-slate-400 mb-4 text-sm">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
              <form className="flex" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="bg-slate-800 text-white px-4 py-3 rounded-l-lg w-full focus:outline-none focus:ring-1 focus:ring-blue-500 border-none"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-r-lg transition-colors font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} FitGrid Fashion. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
