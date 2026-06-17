import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';

import { Package, X, CheckCircle2, CircleDashed, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { formatRupiah } from '../../utils/currency';

const OrderModal = ({ order, onClose }) => {
  if (!order) return null;

  const steps = [
    { id: 'Pending', label: 'Order Created' },
    { id: 'Paid', label: 'Payment Verified' },
    { id: 'Processing', label: 'Processing' },
    { id: 'Shipped', label: 'Shipped' },
    { id: 'Completed', label: 'Completed' }
  ];

  // Determine current step index
  let currentStepIndex = 0;
  if (order.orderStatus === 'Completed') currentStepIndex = 4;
  else if (order.orderStatus === 'Shipped') currentStepIndex = 3;
  else if (order.orderStatus === 'Processing') currentStepIndex = 2;
  else if (order.paymentStatus === 'Paid') currentStepIndex = 1;

  if (order.orderStatus === 'Cancelled') currentStepIndex = -1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Order Detail</h2>
            <p className="text-sm text-slate-500">ID: {order.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          {/* Order Status Tracker */}
          {order.orderStatus !== 'Cancelled' ? (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Order Status</h3>
              <div className="relative flex justify-between items-center px-4">
                <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-10"></div>
                <div 
                  className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-blue-500 -z-10 transition-all duration-500"
                  style={{ width: `calc(${(currentStepIndex / (steps.length - 1)) * 100}% - 4rem)` }}
                ></div>
                
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-blue-500 text-white' : 'bg-white border-2 border-slate-200 text-slate-300'}`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <CircleDashed className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs font-semibold absolute top-10 whitespace-nowrap ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-center font-bold">
              This order has been cancelled.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Order Info</h3>
              <div className="space-y-1 text-sm text-slate-700">
                <p><span className="font-medium text-slate-500">Date:</span> {new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</p>
                <p><span className="font-medium text-slate-500">Payment Status:</span> <span className={order.paymentStatus === 'Paid' ? 'text-green-600 font-bold' : 'text-amber-600 font-bold'}>{order.paymentStatus}</span></p>
                <p><span className="font-medium text-slate-500">Payment Method:</span> {order.paymentMethod || 'Bank Transfer'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Shipping details</h3>
              <div className="space-y-1 text-sm text-slate-700">
                <p><span className="font-medium text-slate-500">Recipient:</span> {order.customer}</p>
                <p><span className="font-medium text-slate-500">Address:</span> {order.address}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Purchased Items</h3>
            <div className="space-y-4">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                  <div className="flex items-center gap-4">
                    {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg bg-white object-cover border border-slate-200" />}
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{formatRupiah(item.price)} x {item.qty}</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-900">{formatRupiah(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <div className="w-full md:w-1/2 space-y-3">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatRupiah(order.subtotal || order.total)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Shipping Fee</span>
                <span className="font-medium">{formatRupiah(order.shipping || 0)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Tax</span>
                <span className="font-medium">{formatRupiah(order.tax || 0)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-200">
                <span className="font-bold text-slate-900">Total Payment</span>
                <span className="text-xl font-black text-slate-900">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`http://localhost:8000/api/orders/getByUser.php?user_id=${user.id}`);
          const data = await response.json();
          if (data.success) {
            setUserOrders(data.data);
          }
        } catch (error) {
          console.error("Failed to fetch orders", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-amber-100 text-amber-800',
      Processing: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-indigo-100 text-indigo-800',
      Completed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
        {status}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Please Log In</h2>
        <p className="text-slate-500 mb-8">You need to log in to view your orders.</p>
        <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Orders</h1>
        <p className="text-slate-500 mt-2">View and track your current and past orders.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <p className="text-slate-500">Loading orders...</p>
        </div>
      ) : userOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Orders Yet</h2>
          <p className="text-slate-500 mb-6">Looks like you haven't made any purchases yet.</p>
          <Link to="/products" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors text-sm">
                  <td className="p-4 font-bold text-slate-900">{order.id}</td>
                  <td className="p-4 text-slate-600">{new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="p-4 text-slate-600">{(order.items || []).reduce((acc, item) => acc + item.qty, 0)} Items</td>
                  <td className="p-4 font-bold text-slate-900">{formatRupiah(order.total)}</td>
                  <td className="p-4">{getStatusBadge(order.orderStatus)}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center gap-1"
                    >
                      View Detail <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {userOrders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-slate-900 text-lg">{order.id}</p>
                <p className="text-xs text-slate-500">{new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              {getStatusBadge(order.orderStatus)}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500">Total Payment</p>
                <p className="font-bold text-slate-900">{formatRupiah(order.total)}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(order)}
                className="bg-slate-50 text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors"
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};

export default Orders;
