import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductGrid from '../../components/product/ProductGrid';
import ProductSearch from '../../components/product/ProductSearch';
import ProductFilter from '../../components/product/ProductFilter';
import ProductSort from '../../components/product/ProductSort';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useProducts } from '../../hooks/useProducts';

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

  const allProducts = useProducts();
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
    let result = [...allProducts];

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
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    // Sort
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));

    return result;
  }, [allProducts, search, filters, sort]);

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
          Discover {allProducts.length} curated fashion pieces for everyone.
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
