import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { orderService } from '../../services/orderService';
import OrderTable from '../../components/admin/OrderTable';
import toast from 'react-hot-toast';

const OrderModal = ({ order, onClose }) => {
  if (!order) return null;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Order Detail: {order.id}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Customer Info</h3>
              <p className="font-medium text-slate-900">{order.customer}</p>
              <p className="text-slate-600 text-sm mt-1">{order.date}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Shipping Address</h3>
              <p className="text-slate-700 text-sm">{order.address}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
             <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</h3>
              <div className="flex gap-4">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Payment</span>
                  <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>{order.paymentStatus}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Order</span>
                  <span className="font-medium text-blue-600">{order.orderStatus}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Payment Proof</h3>
              {order.paymentProof ? (
                <a href={order.paymentProof} target="_blank" rel="noreferrer" className="block w-full h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 cursor-pointer shadow-sm hover:shadow-md transition-all">
                  <img src={order.paymentProof} alt="Payment Proof" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </a>
              ) : (
                <div className="w-full h-24 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm border border-dashed border-slate-300">
                  No Receipt
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Product List</h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded bg-slate-100 object-cover" />
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <p className="font-medium text-slate-900 text-sm">{formatCurrency(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <span className="font-bold text-slate-700">Order Total</span>
          <span className="text-xl font-bold text-slate-900">{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const orders = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVerifyPayment = (orderId) => {
    if(window.confirm('Verify payment for this order?')) {
      const result = orderService.updateOrder(orderId, { paymentStatus: 'Paid' });
      if (result) toast.success(`Payment verified for order ${orderId}`);
    }
  };

  const handleUpdateStatus = (orderId) => {
    const statusCycle = ['Pending', 'Processing', 'Shipped', 'Completed'];
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const currentIndex = statusCycle.indexOf(order.orderStatus);
      const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
      const result = orderService.updateOrder(orderId, { orderStatus: nextStatus });
      if (result) toast.success(`Order ${orderId} status updated to ${nextStatus}`);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Orders</h1>
          <p className="text-slate-500 mt-1">Track and manage customer orders</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent appearance-none bg-white font-medium text-slate-700"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        
        <OrderTable 
          orders={filteredOrders} 
          onViewDetail={(order) => setSelectedOrder(order)} 
          onVerifyPayment={handleVerifyPayment}
          onUpdateStatus={handleUpdateStatus}
        />
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <p>Showing {filteredOrders.length} of {orders.length} orders</p>
          <div className="flex gap-2">
             <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>

      <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};

export default Orders;
