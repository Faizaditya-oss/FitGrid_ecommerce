import { useState, useEffect } from 'react';
import { Search, Filter, X, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { orderService } from '../../services/orderService';
import OrderTable from '../../components/admin/OrderTable';
import toast from 'react-hot-toast';

import { formatRupiah } from '../../utils/currency';

const getPaymentBadge = (status) => {
  const styles = {
    Unpaid: 'bg-slate-100 text-slate-800',
    Paid: 'bg-green-100 text-green-800',
    Failed: 'bg-red-100 text-red-800',
    Refunded: 'bg-purple-100 text-purple-800',
  };
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-800'}`}>{status}</span>;
};

const getOrderBadge = (status) => {
  const styles = {
    Pending: 'bg-amber-100 text-amber-800',
    Processing: 'bg-blue-100 text-blue-800',
    Shipped: 'bg-indigo-100 text-indigo-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-800'}`}>{status}</span>;
};

const OrderModal = ({ order, onClose, onRefresh }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchPaymentData = async () => {
    if (!order) return;
    setIsLoadingPayment(true);
    try {
      const response = await fetch(`http://localhost:8000/api/payments/getByOrder.php?order_id=${order.id}`);
      const data = await response.json();
      if (data.success) {
        setPaymentData(data.data);
      } else {
        setPaymentData(null);
      }
    } catch (err) {
      console.error('Failed to fetch payment data', err);
    } finally {
      setIsLoadingPayment(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, [order]);

  const handleVerify = async (status) => {
    if (!window.confirm(`Are you sure you want to ${status === 'Paid' ? 'approve' : 'reject'} this payment?`)) return;
    
    setIsVerifying(true);
    try {
      const response = await fetch('http://localhost:8000/api/payments/verify.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: order.id, status: status })
      });
      const result = await response.json();
      if (result.success) {
        toast.success(`Payment ${status === 'Paid' ? 'approved' : 'rejected'} successfully`);
        fetchPaymentData();
        if (onRefresh) onRefresh(order.id, status);
      } else {
        toast.error(result.message || 'Failed to verify payment');
      }
    } catch (error) {
      toast.error('Network error while verifying payment');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
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
                  {getPaymentBadge(paymentData?.payment_status || order.paymentStatus || 'Unpaid')}
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Order</span>
                  {getOrderBadge(order.orderStatus)}
                </div>
              </div>
            </div>
            
            {/* Payment Verification Section */}
            <div className="md:col-span-2 mt-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Payment Verification</h3>
              {isLoadingPayment ? (
                <p className="text-sm text-slate-500">Loading payment info...</p>
              ) : paymentData ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500">Method</p>
                      <p className="font-semibold text-slate-900">{paymentData.payment_method}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Status</p>
                      <p className="font-semibold text-slate-900">{paymentData.payment_status}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="font-semibold text-slate-900">
                        {paymentData.payment_date ? new Date(paymentData.payment_date).toLocaleString('id-ID') : '-'}
                      </p>
                    </div>
                  </div>
                  
                  {paymentData.payment_proof && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 mb-2">Proof Document</p>
                      {paymentData.payment_proof.toLowerCase().endsWith('.pdf') ? (
                        <a 
                          href={`http://localhost:8000${paymentData.payment_proof}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:bg-slate-50 transition-colors shadow-sm"
                        >
                          <FileText className="w-4 h-4" /> View PDF
                        </a>
                      ) : (
                        <a 
                          href={`http://localhost:8000${paymentData.payment_proof}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="block w-48 h-32 bg-white rounded-lg overflow-hidden border border-slate-200 cursor-pointer shadow-sm hover:shadow-md transition-all"
                        >
                          <img 
                            src={`http://localhost:8000${paymentData.payment_proof}`} 
                            alt="Payment Proof" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                          />
                        </a>
                      )}
                    </div>
                  )}

                  {paymentData.payment_status !== 'Paid' && (
                    <div className="flex gap-3 pt-4 border-t border-slate-200 mt-4">
                      <button 
                        onClick={() => handleVerify('Paid')}
                        disabled={isVerifying}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Payment
                      </button>
                      <button 
                        onClick={() => handleVerify('Failed')}
                        disabled={isVerifying}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" /> Reject Payment
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 text-center">
                  <p className="text-slate-500 text-sm">Customer has not uploaded payment proof yet</p>
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
                  <p className="font-medium text-slate-900 text-sm">{formatRupiah(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <span className="font-bold text-slate-700">Order Total</span>
          <span className="text-xl font-bold text-slate-900">{formatRupiah(order.total)}</span>
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
    const matchesSearch = String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) || 
                          String(order.customer || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVerifyPayment = async (orderId) => {
    if(window.confirm('Verify payment for this order?')) {
      try {
        const response = await fetch('http://localhost:8000/api/payments/verify.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: orderId, status: 'Paid' })
        });
        const result = await response.json();
        if (result.success) {
          toast.success(`Payment verified for order ${orderId}`);
          window.dispatchEvent(new Event('orders_updated'));
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(prev => ({ ...prev, paymentStatus: 'Paid' }));
          }
        } else {
          toast.error(result.message || 'Failed to verify payment');
        }
      } catch (error) {
        toast.error('Network error');
      }
    }
  };

  const handleUpdateStatus = async (orderId) => {
    const statusCycle = ['Pending', 'Processing', 'Shipped', 'Completed'];
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const currentIndex = statusCycle.indexOf(order.orderStatus);
      const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
      
      try {
        const response = await fetch('http://localhost:8000/api/admin/orders/updateStatus.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: orderId, status: nextStatus })
        });
        const result = await response.json();
        if (result.success) {
          toast.success(`Order ${orderId} status updated to ${nextStatus}`);
          window.dispatchEvent(new Event('orders_updated'));
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(prev => ({ ...prev, orderStatus: nextStatus }));
          }
        } else {
          toast.error(result.message || 'Failed to update status');
        }
      } catch (error) {
        toast.error('Network error');
      }
    }
  };

  const handleRefreshModal = (orderId, status) => {
    window.dispatchEvent(new Event('orders_updated'));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({
        ...prev, 
        paymentStatus: status,
        ...(status === 'Paid' ? { orderStatus: 'Processing' } : {})
      }));
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

      <OrderModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        onRefresh={handleRefreshModal}
      />
    </div>
  );
};

export default Orders;
