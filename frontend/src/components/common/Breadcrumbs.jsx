import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ALL_PRODUCTS } from '../../pages/public/AllProducts';

const Breadcrumbs = ({ className = "container mx-auto px-4 pt-6 pb-2" }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Hide breadcrumbs on the homepage
  if (location.pathname === '/') {
    return null;
  }

  const pathnames = location.pathname.split('/').filter((x) => x);
  const crumbs = [{ label: 'Home', path: '/', isLast: false }];

  // Helper to format category labels nicely
  const formatCategory = (cat) => {
    if (!cat) return '';
    const normalized = cat.toLowerCase();
    if (normalized === 'men') return 'Men';
    if (normalized === 'women') return 'Women';
    if (normalized === 'kids') return 'Kids';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  // Helper to translate route segments to readable labels
  const getRouteLabel = (segment) => {
    switch (segment.toLowerCase()) {
      case 'products':
        return 'All Products';
      case 'cart':
        return 'Shopping Cart';
      case 'checkout':
        return 'Checkout';
      case 'login':
        return 'Login';
      case 'register':
        return 'Register';
      case 'wishlist':
        return 'Wishlist';
      default:
        return decodeURIComponent(segment);
    }
  };

  // 1. Handle special "/products/:id" product detail route
  if (pathnames[0] === 'products' && pathnames[1]) {
    crumbs.push({ label: 'All Products', path: '/products', isLast: false });
    
    const productId = pathnames[1];
    const product = ALL_PRODUCTS.find((p) => p.id === productId);

    if (product) {
      // Insert product's category as a breadcrumb segment before the product name
      crumbs.push({ 
        label: formatCategory(product.category), 
        path: `/products?category=${product.category}`, 
        isLast: false 
      });
      // Add product name as the final segment
      crumbs.push({ 
        label: product.name, 
        path: `/products/${productId}`, 
        isLast: true 
      });
    } else {
      crumbs.push({ 
        label: decodeURIComponent(productId), 
        path: `/products/${productId}`, 
        isLast: true 
      });
    }
  } 
  // 2. Handle "/products" optionally with category parameter
  else if (pathnames[0] === 'products') {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      crumbs.push({ label: 'All Products', path: '/products', isLast: false });
      crumbs.push({ 
        label: formatCategory(categoryParam), 
        path: `/products?category=${categoryParam}`, 
        isLast: true 
      });
    } else {
      crumbs.push({ label: 'All Products', path: '/products', isLast: true });
    }
  } 
  // 3. Fallback route segment generation
  else {
    let currentPath = '';
    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathnames.length - 1;
      crumbs.push({
        label: getRouteLabel(segment),
        path: currentPath,
        isLast,
      });
    });
  }

  return (
    <nav className={`${className} text-[13px]`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center flex-wrap gap-1 md:gap-1.5 text-slate-500 font-medium">
        {crumbs.map((crumb, idx) => {
          const isHome = idx === 0;
          return (
            <li key={crumb.path + idx} className="inline-flex items-center">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1.5 flex-shrink-0" />}
              {crumb.isLast ? (
                <span className="text-slate-800 font-semibold cursor-default select-none">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="inline-flex items-center hover:text-slate-800 transition-colors gap-1"
                >
                  {isHome && <Home className="w-3.5 h-3.5 mb-0.5" />}
                  <span>{crumb.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
