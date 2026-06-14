import { Edit, Trash2, AlertCircle } from 'lucide-react';
import { formatRupiah } from '../../utils/currency';

const ProductTable = ({ products, onEdit, onDelete }) => {

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-sm">
            <th className="p-4 font-semibold">Image</th>
            <th className="p-4 font-semibold">Name</th>
            <th className="p-4 font-semibold">Category</th>
            <th className="p-4 font-semibold">Price</th>
            <th className="p-4 font-semibold">Stock</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50 transition-colors text-sm">
              <td className="p-4">
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
              </td>
              <td className="p-4 font-medium text-slate-900">{product.name}</td>
              <td className="p-4 text-slate-600">{product.category}</td>
              <td className="p-4 font-medium text-slate-900">{formatRupiah(product.price)}</td>
              <td className="p-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-medium">{product.stock}</span>
                  {product.stock < 5 && product.stock > 0 && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      <AlertCircle className="w-3 h-3" /> Low Stock
                    </span>
                  )}
                  {product.stock === 0 && (
                     <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">Out of Stock</span>
                  )}
                </div>
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.status}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-3">
                  <button onClick={() => onEdit(product)} className="text-slate-400 hover:text-blue-600 transition-colors tooltip" title="Edit Product">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(product.id)} className="text-slate-400 hover:text-red-600 transition-colors tooltip" title="Delete Product">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
