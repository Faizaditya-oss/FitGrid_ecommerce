import { Eye } from 'lucide-react';

const CustomerTable = ({ customers, onViewDetail }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-sm">
            <th className="p-4 font-semibold">Customer Name</th>
            <th className="p-4 font-semibold">Email</th>
            <th className="p-4 font-semibold">Phone Number</th>
            <th className="p-4 font-semibold">Total Orders</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-slate-50 transition-colors text-sm">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                    {customer.name.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-900">{customer.name}</span>
                </div>
              </td>
              <td className="p-4 text-slate-600">{customer.email}</td>
              <td className="p-4 text-slate-600">{customer.phone}</td>
              <td className="p-4 font-medium text-slate-900">{customer.totalOrders}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                  {customer.status}
                </span>
              </td>
              <td className="p-4 text-center">
                <button onClick={() => onViewDetail(customer)} className="text-slate-400 hover:text-blue-600 transition-colors tooltip" title="View Detail">
                  <Eye className="w-5 h-5 mx-auto" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
