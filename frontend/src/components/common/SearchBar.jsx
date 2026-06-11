import { useState, useRef, useEffect } from 'react';
import { LayoutGrid, ChevronDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const currentCategory = categories.find(c => c.label === selectedCategory);
      let baseRoute = currentCategory ? currentCategory.route : '/products';
      
      // We don't want to redirect to /products?category=Men&search=... if it's All Products
      // because All Products is just '/products'. 
      // The currentCategory.route gives us the correct base route.
      
      const separator = baseRoute.includes('?') ? '&' : '?';
      navigate(`${baseRoute}${separator}search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      const currentCategory = categories.find(c => c.label === selectedCategory);
      if (currentCategory) {
        navigate(currentCategory.route);
      }
    }
  };

  // Categories based on the provided image
  const categories = [
    { label: 'Man', route: '/products?category=Men' },
    { label: 'Woman', route: '/products?category=Women' },
    { label: 'Kids', route: '/products?category=Kids' },
    { label: 'All Products', route: '/products' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center bg-white border border-gray-200 rounded-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-slate-200 transition-all max-w-3xl w-full mx-4 shadow-sm">
      {/* Category Selector */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-l-xl transition-colors focus:outline-none"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <LayoutGrid className="w-4 h-4 text-slate-500" />
          <span>{selectedCategory}</span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </button>

        {/* Dropdown Menu Popup */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2">
            {categories.map((cat) => (
              <button
                key={cat.label}
                className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                  selectedCategory === cat.label
                    ? 'bg-slate-100 text-slate-900 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => {
                  setSelectedCategory(cat.label);
                  setIsDropdownOpen(false);
                  navigate(cat.route);
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Vertical Divider */}
      <div className="w-px h-6 bg-gray-200 flex-shrink-0"></div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for products"
        className="flex-grow px-4 py-3 text-sm text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 min-w-0"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />

      {/* Search Button */}
      <button
        type="button"
        onClick={handleSearch}
        className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-neutral-500 text-white text-sm font-medium rounded-r-xl transition-colors focus:outline-none"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </div>
  );
};

export default SearchBar;
