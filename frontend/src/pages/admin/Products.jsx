import { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { productService } from '../../services/productService';
import { useProducts } from '../../hooks/useProducts';
import ProductTable from '../../components/admin/ProductTable';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '',
  description: '',
  category: 'Men',
  color: '',
  sizes: [],
  price: '',
  stock: '',
  image: ''
};

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState(
    product
      ? { ...product, sizes: product.sizes || [] }
      : { ...EMPTY_FORM }
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setFormData({ ...formData, image: compressedDataUrl });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const priceNum = Number(formData.price);
    const stockNum = Number(formData.stock);

    if (priceNum <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    if (stockNum < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    setIsSaving(true);
    await onSave({ ...formData, price: priceNum, stock: stockNum });
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name *</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Classic White Shirt" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Short product description..." className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Color</label>
              <input type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} placeholder="e.g. White, Black" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Price (Rp) *</label>
              <input required type="number" min="1" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Stock *</label>
              <input required type="number" min="0" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                    formData.sizes.includes(size)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Product Image</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0 bg-slate-50">
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 transition-all cursor-pointer"
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-5 py-2.5 bg-slate-900 text-white font-medium hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-60">
              {isSaving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Products = () => {
  const products = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    if (selectedProduct) {
      const result = await productService.updateProduct(productData);
      if (result) toast.success('Product updated successfully!');
      else toast.error('Failed to update product.');
    } else {
      const result = await productService.addProduct(productData);
      if (result) toast.success('Product added successfully!');
      else toast.error('Failed to add product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await productService.deleteProduct(id);
      if (result) toast.success('Product deleted successfully!');
      else toast.error('Failed to delete product.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Products</h1>
          <p className="text-slate-500 mt-1">Manage your store's catalog</p>
        </div>
        <button onClick={handleAddProduct} className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-colors font-medium shadow-sm">
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search products by name or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <ProductTable products={filteredProducts} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <p>Showing {filteredProducts.length} of {products.length} products</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          product={selectedProduct} 
          onSave={handleSaveProduct} 
        />
      )}
    </div>
  );
};

export default Products;
