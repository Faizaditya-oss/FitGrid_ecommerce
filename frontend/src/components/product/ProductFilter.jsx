import { ChevronDown, ChevronRight, X, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────
const BRANDS = ['T-Shirt', 'Pants', 'Jacket', 'Jeans', 'Hoodie', "Basic"  ];

const KATEGORI_TREE = [
  {
    label: 'Semua Kategori',
    value: 'All',
    children: [],
  },
  {
    label: 'Pria',
    value: 'Men',
    children: [],
  },
  {
    label: 'Wanita',
    value: 'Women',
    children: [],
  },
  {
    label: 'Anak',
    value: 'Kids',
    children: [],
  },
];

const PRICE_RANGES = [
  { label: 'Semua Harga', value: 'all' },
  { label: 'Di bawah Rp 450.000', value: '0-450000' },
  { label: 'Rp 450.000 – Rp 900.000', value: '450000-900000' },
  { label: 'Rp 900.000 – Rp 1.500.000', value: '900000-1500000' },
  { label: 'Di atas Rp 1.500.000', value: '1500000-99999999' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// ─── Accordion ────────────────────────────────────────────────────────────────
const Accordion = ({ title, defaultOpen = true, children, rightLabel }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-[13px] font-semibold text-slate-800">{title}</span>
        <div className="flex items-center gap-1">
          {rightLabel && <span className="text-[11px] text-slate-400 mr-1">{rightLabel}</span>}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
};

// ─── Filter Panel (shared between sidebar & drawer) ───────────────────────────
const FilterPanel = ({ filters, onChange, onReset, search, onSearchChange }) => {
  const [expandedKat, setExpandedKat] = useState(null);

  const hasActive =
    filters.category !== 'All' ||
    filters.size !== '' ||
    filters.priceRange !== 'all' ||
    (filters.brand || '') !== '';

  return (
    <div className="space-y-5">
      {/* ── Search Input ── */}
      <div className="relative">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Pencarian Produk
        </span>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={search || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-all placeholder-slate-400 bg-white"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Active Filter Chips ── */}
      {hasActive && (
        <div className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Filter Terpasang
            </span>
            <button
              onClick={onReset}
              className="text-[11px] font-semibold text-green-600 hover:text-green-700 transition-colors"
            >
              Hapus Semua
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.category !== 'All' && (
              <FilterChip
                label={KATEGORI_TREE.find((k) => k.value === filters.category)?.label || filters.category}
                onRemove={() => onChange({ ...filters, category: 'All' })}
              />
            )}
            {filters.size && (
              <FilterChip label={filters.size} onRemove={() => onChange({ ...filters, size: '' })} />
            )}
            {filters.priceRange !== 'all' && (
              <FilterChip
                label={PRICE_RANGES.find((r) => r.value === filters.priceRange)?.label}
                onRemove={() => onChange({ ...filters, priceRange: 'all' })}
              />
            )}
            {filters.brand && (
              <FilterChip label={filters.brand} onRemove={() => onChange({ ...filters, brand: '' })} />
            )}
          </div>
        </div>
      )}

      {/* ── Brand ── */}
      {/* <Accordion title="Brand" defaultOpen={true}>
        <div className="space-y-0.5">
          {BRANDS.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 px-1 py-1.5 rounded cursor-pointer hover:bg-slate-50 group"
            >
              <input
                type="checkbox"
                checked={(filters.brand || '') === brand}
                onChange={() =>
                  onChange({ ...filters, brand: (filters.brand || '') === brand ? '' : brand })
                }
                className="w-3.5 h-3.5 rounded accent-green-600 cursor-pointer border-slate-300"
              />
              <span className="text-[12.5px] text-slate-600 group-hover:text-slate-800 transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
        <button className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-green-600 hover:text-green-700 transition-colors">
          Lihat semua brand
          <ChevronRight className="w-3 h-3" />
        </button>
      </Accordion> */}

      {/* ── Kategori ── */}
      <Accordion title="Kategori" defaultOpen={true}>
        <div className="space-y-0.5">
          {KATEGORI_TREE.map((kat) => (
            <div key={kat.value}>
              {/* Parent row */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onChange({ ...filters, category: kat.value })}
                  className={`flex-1 text-left text-[12.5px] px-2 py-1.5 rounded-lg transition-all ${
                    filters.category === kat.value
                      ? 'text-green-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 font-normal'
                  }`}
                >
                  {kat.label}
                </button>
                {kat.children.length > 0 && (
                  <button
                    onClick={() =>
                      setExpandedKat(expandedKat === kat.value ? null : kat.value)
                    }
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        expandedKat === kat.value ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Sub-children pills */}
              {expandedKat === kat.value && kat.children.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-2 pb-2 pt-1">
                  <button
                    onClick={() => onChange({ ...filters, category: kat.value })}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all ${
                      filters.category === kat.value
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    Semua
                  </button>
                  {kat.children.map((sub) => (
                    <button
                      key={sub}
                      className="px-3 py-1 rounded-full text-[11px] font-medium border border-slate-200 bg-white text-slate-600 hover:border-slate-400 transition-all"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Accordion>

      {/* ── Ukuran ── */}
      <Accordion title="Ukuran" defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onChange({ ...filters, size: filters.size === size ? '' : size })}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                filters.size === size
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </Accordion>

      {/* ── Harga ── */}
      <Accordion title="Harga" defaultOpen={false}>
        <div className="space-y-0.5">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.value}
              className="flex items-center gap-2.5 px-1 py-1.5 rounded cursor-pointer hover:bg-slate-50"
            >
              <input
                type="radio"
                name="harga"
                checked={filters.priceRange === range.value}
                onChange={() => onChange({ ...filters, priceRange: range.value })}
                className="w-3.5 h-3.5 accent-green-600 cursor-pointer"
              />
              <span
                className={`text-[12.5px] transition-colors ${
                  filters.priceRange === range.value
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-600'
                }`}
              >
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </Accordion>
    </div>
  );
};

// ─── Chip ─────────────────────────────────────────────────────────────────────
const FilterChip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
    {label}
    <button
      onClick={onRemove}
      className="ml-0.5 hover:text-red-500 transition-colors"
      type="button"
    >
      <X className="w-2.5 h-2.5" />
    </button>
  </span>
);

// ─── Main Export ──────────────────────────────────────────────────────────────
const ProductFilter = ({
  filters,
  onChange,
  onReset,
  totalResults,
  search,
  onSearchChange,
  hideMobileTrigger = false,
  hideDesktopSidebar = false
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hasActive =
    filters.category !== 'All' ||
    filters.size !== '' ||
    filters.priceRange !== 'all' ||
    (filters.brand || '') !== '';

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      {!hideDesktopSidebar && (
        <div className="hidden lg:block w-[260px] shrink-0">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm sticky top-24 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="text-[13px] font-bold text-slate-800">Filter & Cari</span>
              <span className="text-[11px] text-slate-400">{totalResults} produk</span>
            </div>
            <div className="px-4 py-3 max-h-[calc(100vh-140px)] overflow-y-auto">
              <FilterPanel
                filters={filters}
                onChange={onChange}
                onReset={onReset}
                search={search}
                onSearchChange={onSearchChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile: Filter button only ── */}
      {!hideMobileTrigger && (
        <div className="lg:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
            type="button"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
            {hasActive && (
              <span className="bg-green-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>
      )}

      {/* ── Mobile Drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative ml-auto w-[290px] h-full bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                <span className="text-[14px] font-bold text-slate-800">Filter & Cari</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} type="button">
                <X className="w-4 h-4 text-slate-500 hover:text-slate-900 transition-colors" />
              </button>
            </div>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <FilterPanel
                filters={filters}
                onChange={onChange}
                onReset={onReset}
                search={search}
                onSearchChange={onSearchChange}
              />
            </div>
            {/* CTA */}
            <div className="shrink-0 p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full bg-green-600 text-white py-2.5 rounded-xl text-[13px] font-bold hover:bg-green-700 transition-colors"
                type="button"
              >
                Tampilkan {totalResults} Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilter;
