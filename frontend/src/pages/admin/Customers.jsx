import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import CustomerTable from '../../components/admin/CustomerTable';

const CustomerModal = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Customer Detail</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center font-bold text-2xl text-slate-700">
              {customer.name ? customer.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{customer.name || 'Unnamed'}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                {customer.status} Account
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Contact Information</p>
              <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Email</span>
                  <span className="text-sm font-medium text-slate-900">{customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Phone</span>
                  <span className="text-sm font-medium text-slate-900">{customer.phone || '-'}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Shopping Activity</p>
              <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center">
                <span className="text-sm text-slate-500">Total Orders</span>
                <span className="text-lg font-bold text-slate-900">{customer.totalOrders || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const users = useUsers();
  const customers = users.filter(u => u.role === 'customer');

  const filteredCustomers = customers.filter(customer => 
    (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phone && String(customer.phone).includes(searchTerm))
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-slate-500 mt-1">Manage and view customer details</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <CustomerTable customers={filteredCustomers} onViewDetail={(customer) => setSelectedCustomer(customer)} />
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <p>Showing {filteredCustomers.length} of {customers.length} customers</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>

      <CustomerModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
    </div>
  );
};

export default Customers;
