import { useState } from 'react';
import { X } from 'lucide-react';

const ProductVariant = ({ sizes, colors, selectedSize, setSelectedSize, selectedColor, setSelectedColor }) => {
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  return (
    <div className="mb-8 space-y-6">
      {/* Colors */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Color: {selectedColor}</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                selectedColor === color 
                  ? 'border-slate-900 bg-slate-900 text-white shadow-md' 
                  : 'border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Size</h3>
          <button 
            onClick={() => setShowSizeGuide(true)}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                selectedSize === size 
                  ? 'border-slate-900 bg-slate-900 text-white shadow-md' 
                  : 'border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Size Guide</h3>
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 rounded-l-xl">Size</th>
                      <th className="px-4 py-3">Chest (cm)</th>
                      <th className="px-4 py-3">Length (cm)</th>
                      <th className="px-4 py-3 rounded-r-xl">Sleeve (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-slate-900">S</td>
                      <td className="px-4 py-3 text-slate-600">96</td>
                      <td className="px-4 py-3 text-slate-600">68</td>
                      <td className="px-4 py-3 text-slate-600">20</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-slate-900">M</td>
                      <td className="px-4 py-3 text-slate-600">102</td>
                      <td className="px-4 py-3 text-slate-600">70</td>
                      <td className="px-4 py-3 text-slate-600">21</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-slate-900">L</td>
                      <td className="px-4 py-3 text-slate-600">108</td>
                      <td className="px-4 py-3 text-slate-600">72</td>
                      <td className="px-4 py-3 text-slate-600">22</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-slate-900">XL</td>
                      <td className="px-4 py-3 text-slate-600">114</td>
                      <td className="px-4 py-3 text-slate-600">74</td>
                      <td className="px-4 py-3 text-slate-600">23</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-4 text-center">
                Measurements may vary by 1-2 cm due to manual measuring.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariant;
