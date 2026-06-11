import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductGrid from '../../components/product/ProductGrid';
import ProductSearch from '../../components/product/ProductSearch';
import ProductFilter from '../../components/product/ProductFilter';
import ProductSort from '../../components/product/ProductSort';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Product Data ─────────────────────────────────────────────────────────────
import catalog1 from '../../assets/images/products/catalog1.jpg';
import catalog2 from '../../assets/images/products/catalog2.jpg';
import catalog3 from '../../assets/images/products/catalog3.jpg';
import catalog4 from '../../assets/images/products/catalog4.jpg';

// Men
import chinoShorts from '../../assets/images/products/chinoShorts.jpg';
import oxfordShirt from '../../assets/images/products/oxfordShirt.jpg';
import slimChinos from '../../assets/images/products/slimChinos.jpg';
import bomberJacket from '../../assets/images/products/bomberJacket.jpg';
import cargoPants from '../../assets/images/products/cargoPants.jpg';

// Women
import floralDress from '../../assets/images/products/floralDress.jpg';
import silkBlouse from '../../assets/images/products/silkBlouse.jpg';
import midiSkirt from '../../assets/images/products/midiSkirt.jpg';
import wrapDress from '../../assets/images/products/wrapDress.jpg';
import linenPants from '../../assets/images/products/linenPants.jpg';
import knitCardigan from '../../assets/images/products/knitCardigan.jpg';
import pleatedSkirt from '../../assets/images/products/pleatedSkirt.jpg';

// Kids
import graphicTee from '../../assets/images/products/graphicTee.jpg';
import tutuDress from '../../assets/images/products/tutuDress.jpg';
import kidsOverall from '../../assets/images/products/kidsOverall.jpg';
import cozyHoodie from '../../assets/images/products/cozyHoodie.jpg';
import stripedShorts from '../../assets/images/products/stripedShorts.jpg';
import denimJacket from '../../assets/images/products/denimJacket.jpg';
import floralJumpsuit from '../../assets/images/products/floralJumpsuit.jpg';
import joggerSet from '../../assets/images/products/joggerSet.jpg';

export const ALL_PRODUCTS = [
  // ── Men ──
  { id: 'm1', name: 'Basic T-Shirt', category: 'Men', price: 'Rp 435.000', priceNum: 435000, originalPrice: null, discount: null, isNew: true, rating: 4, reviews: 128, sizes: ['S','M','L','XL'], image: catalog1 },
  { id: 'm2', name: 'Denim Jeans', category: 'Men', price: 'Rp 885.000', priceNum: 885000, originalPrice: 'Rp 1.125.000', discount: 21, isNew: false, rating: 5, reviews: 84, sizes: ['M','L','XL'], image: catalog3 },
  { id: 'm3', name: 'Red Flannel Shirt', category: 'Men', price: 'Rp 1.335.000', priceNum: 1335000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 57, sizes: ['S','M','L'], image: catalog2 },
  { id: 'm4', name: 'Chino Shorts', category: 'Men', price: 'Rp 600.000', priceNum: 600000, originalPrice: 'Rp 750.000', discount: 20, isNew: false, rating: 4, reviews: 42, sizes: ['S','M','L'], image: chinoShorts },
  { id: 'm5', name: 'Oxford Shirt', category: 'Men', price: 'Rp 1.125.000', priceNum: 1125000, originalPrice: null, discount: null, isNew: true, rating: 5, reviews: 31, sizes: ['XS','S','M'], image: oxfordShirt },
  { id: 'm6', name: 'Slim Chinos', category: 'Men', price: 'Rp 975.000', priceNum: 975000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 66, sizes: ['S','M','L','XL'], image: slimChinos },
  { id: 'm7', name: 'Bomber Jacket', category: 'Men', price: 'Rp 2.025.000', priceNum: 2025000, originalPrice: 'Rp 2.400.000', discount: 16, isNew: true, rating: 5, reviews: 22, sizes: ['S','M','L','XL'], image: bomberJacket },
  { id: 'm8', name: 'Cargo Pants', category: 'Men', price: 'Rp 825.000', priceNum: 825000, originalPrice: null, discount: null, isNew: false, rating: 3, reviews: 19, sizes: ['L','XL','XXL'], image: cargoPants },
  // ── Women ──
  { id: 'w1', name: 'Floral Dress', category: 'Women', price: 'Rp 825.000', priceNum: 825000, originalPrice: null, discount: null, isNew: true, rating: 5, reviews: 210, sizes: ['XS','S','M','L'], image: floralDress },
  { id: 'w2', name: "Women's Trousers", category: 'Women', price: 'Rp 1.800.000', priceNum: 1800000, originalPrice: 'Rp 2.250.000', discount: 20, isNew: false, rating: 5, reviews: 143, sizes: ['XS','S','M'], image: catalog4 },
  { id: 'w3', name: 'Silk Blouse', category: 'Women', price: 'Rp 675.000', priceNum: 675000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 89, sizes: ['S','M','L','XL'], image: silkBlouse },
  { id: 'w4', name: 'Midi Skirt', category: 'Women', price: 'Rp 750.000', priceNum: 750000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 76, sizes: ['XS','S','M','L'], image: midiSkirt },
  { id: 'w5', name: 'Wrap Dress', category: 'Women', price: 'Rp 1.200.000', priceNum: 1200000, originalPrice: 'Rp 1.425.000', discount: 16, isNew: true, rating: 5, reviews: 54, sizes: ['S','M'], image: wrapDress },
  { id: 'w6', name: 'Linen Pants', category: 'Women', price: 'Rp 1.050.000', priceNum: 1050000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 38, sizes: ['XS','S','M','L','XL'], image: linenPants },
  { id: 'w7', name: 'Knit Cardigan', category: 'Women', price: 'Rp 900.000', priceNum: 900000, originalPrice: 'Rp 1.200.000', discount: 25, isNew: false, rating: 5, reviews: 115, sizes: ['S','M','L'], image: knitCardigan },
  { id: 'w8', name: 'Pleated Skirt', category: 'Women', price: 'Rp 675.000', priceNum: 675000, originalPrice: null, discount: null, isNew: true, rating: 4, reviews: 29, sizes: ['XS','S','M'], image: pleatedSkirt },
  // ── Kids ──
  { id: 'k1', name: 'Boys Graphic Tee', category: 'Kids', price: 'Rp 225.000', priceNum: 225000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 61, sizes: ['XS','S','M'], image: graphicTee },
  { id: 'k2', name: 'Girls Tutu Dress', category: 'Kids', price: 'Rp 375.000', priceNum: 375000, originalPrice: 'Rp 480.000', discount: 22, isNew: true, rating: 5, reviews: 47, sizes: ['XS','S'], image: tutuDress },
  { id: 'k3', name: 'Kids Overalls', category: 'Kids', price: 'Rp 450.000', priceNum: 450000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 38, sizes: ['XS','S','M','L'], image: kidsOverall },
  { id: 'k4', name: 'Cozy Hoodie', category: 'Kids', price: 'Rp 525.000', priceNum: 525000, originalPrice: null, discount: null, isNew: false, rating: 5, reviews: 92, sizes: ['S','M','L'], image: cozyHoodie },
  { id: 'k5', name: 'Striped Shorts', category: 'Kids', price: 'Rp 270.000', priceNum: 270000, originalPrice: 'Rp 360.000', discount: 25, isNew: false, rating: 3, reviews: 17, sizes: ['XS','S','M'], image: stripedShorts },
  { id: 'k6', name: 'Denim Jacket', category: 'Kids', price: 'Rp 600.000', priceNum: 600000, originalPrice: null, discount: null, isNew: true, rating: 4, reviews: 23, sizes: ['S','M','L'], image: denimJacket },
  { id: 'k7', name: 'Floral Jumpsuit', category: 'Kids', price: 'Rp 420.000', priceNum: 420000, originalPrice: null, discount: null, isNew: false, rating: 5, reviews: 55, sizes: ['XS','S'], image: floralJumpsuit },
  { id: 'k8', name: 'Jogger Set', category: 'Kids', price: 'Rp 480.000', priceNum: 480000, originalPrice: 'Rp 600.000', discount: 20, isNew: true, rating: 4, reviews: 41, sizes: ['S','M','L'], image: joggerSet },
];

const ITEMS_PER_PAGE = 12;
const DEFAULT_FILTERS = { category: 'All', size: '', priceRange: 'all' };

// ─── Pagination Component ─────────────────────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
            currentPage === page
              ? 'bg-slate-900 text-white shadow-md'
              : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AllProducts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Derive initial category from URL param — case-insensitive
  const getInitialCategory = () => {
    const param = searchParams.get('category');
    if (!param) return 'All';
    const normalized = param.charAt(0).toUpperCase() + param.slice(1).toLowerCase();
    return ['Men', 'Women', 'Kids'].includes(normalized) ? normalized : 'All';
  };

  const getInitialSearch = () => {
    return searchParams.get('search') || '';
  };

  const [search, setSearch] = useState(getInitialSearch());
  const [filters, setFilters] = useState({ category: getInitialCategory(), size: '', priceRange: 'all' });

  // Sync filter category and search when URL changes (e.g. navigating from footer/searchbar)
  useEffect(() => {
    const param = searchParams.get('category');
    if (!param) {
      setFilters(f => ({ ...f, category: 'All' }));
    } else {
      const normalized = param.charAt(0).toUpperCase() + param.slice(1).toLowerCase();
      const category = ['Men', 'Women', 'Kids'].includes(normalized) ? normalized : 'All';
      setFilters(f => ({ ...f, category }));
    }

    const searchParam = searchParams.get('search');
    setSearch(searchParam || '');

    setPage(1);
  }, [searchParams]);

  const handleReset = () => {
    setFilters({ category: 'All', size: '', priceRange: 'all' });
    setSearch('');
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category !== 'All') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Size
    if (filters.size) {
      result = result.filter((p) => p.sizes.includes(filters.size));
    }

    // Price Range
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter((p) => p.priceNum >= min && p.priceNum <= max);
    }

    // Sort
    if (sort === 'price-asc') result.sort((a, b) => a.priceNum - b.priceNum);
    else if (sort === 'price-desc') result.sort((a, b) => b.priceNum - a.priceNum);
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));

    return result;
  }, [search, filters, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearchChange = (val) => { setSearch(val); setPage(1); };
  const handleFilterChange = (f) => { setFilters(f); setPage(1); };
  const handleSortChange = (s) => { setSort(s); setPage(1); };
  const handleViewDetail = (product) => navigate(`/products/${product.id}`);

  return (
    <div className="container mx-auto px-4 pt-4 pb-12">
      {/* ── Page Header ── */}
      <div className="mb-4 text-center">
        <p className="text-xs text-blue-500 tracking-widest font-semibold mb-0.5">FitGrid. <span className="text-black">Store</span></p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-1">
          ALL PRODUCTS
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          Discover {ALL_PRODUCTS.length} curated fashion pieces for everyone.
        </p>
      </div>

      <Breadcrumbs className="pt-2 pb-4 mb-2" />

      {/* ── Search Bar (Mobile only) ── */}
      <div className="mb-4 lg:hidden">
        <ProductSearch value={search} onChange={handleSearchChange} />
      </div>

      {/* ── Layout: Filter Sidebar + Content ── */}
      <div className="flex gap-8 items-start">
        {/* Sidebar Filter (desktop) */}
        <ProductFilter
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          totalResults={filtered.length}
          search={search}
          onSearchChange={handleSearchChange}
          hideMobileTrigger={true}
        />

        {/* ── Right: Sort bar + Grid ── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            {/* Mobile Filter Trigger */}
            <ProductFilter
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
              totalResults={filtered.length}
              search={search}
              onSearchChange={handleSearchChange}
              hideDesktopSidebar={true}
            />

            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-slate-500 hidden sm:block">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </span>
              <ProductSort value={sort} onChange={handleSortChange} />
            </div>
          </div>

          {/* Grid */}
          <ProductGrid products={paginated} onViewDetail={handleViewDetail} />

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
