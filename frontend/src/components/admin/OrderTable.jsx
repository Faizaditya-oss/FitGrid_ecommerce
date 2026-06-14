import { Eye, CheckCircle, RefreshCw } from 'lucide-react';
import { formatRupiah } from '../../utils/currency';

const OrderTable = ({ orders, onViewDetail, onVerifyPayment, onUpdateStatus }) => {

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-amber-100 text-amber-800',
      Processing: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-indigo-100 text-indigo-800',
      Completed: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
        {status}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const styles = {
      Pending: 'bg-amber-100 text-amber-800',
      Paid: 'bg-green-100 text-green-800',
      Failed: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-sm">
            <th className="p-4 font-semibold">Order ID</th>
            <th className="p-4 font-semibold">Customer</th>
            <th className="p-4 font-semibold">Date</th>
            <th className="p-4 font-semibold">Payment Status</th>
            <th className="p-4 font-semibold">Order Status</th>
            <th className="p-4 font-semibold">Total</th>
            <th className="p-4 font-semibold text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50 transition-colors text-sm">
              <td className="p-4 font-medium text-slate-900">{order.id}</td>
              <td className="p-4 text-slate-600">{order.customer}</td>
              <td className="p-4 text-slate-500">{order.date}</td>
              <td className="p-4">{getPaymentBadge(order.paymentStatus)}</td>
              <td className="p-4">{getStatusBadge(order.orderStatus)}</td>
              <td className="p-4 font-medium text-slate-900">{formatRupiah(order.total)}</td>
              <td className="p-4">
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={() => onViewDetail(order)}
                    className="text-slate-500 hover:text-blue-600 transition-colors tooltip"
                    title="View Detail"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onVerifyPayment(order.id)}
                    className={`transition-colors tooltip ${order.paymentStatus === 'Paid' ? 'text-green-500 cursor-default' : 'text-slate-400 hover:text-green-600'}`}
                    title={order.paymentStatus === 'Paid' ? 'Payment Verified' : 'Verify Payment'}
                    disabled={order.paymentStatus === 'Paid'}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onUpdateStatus(order.id)}
                    className={`transition-colors tooltip ${order.orderStatus === 'Completed' ? 'text-blue-500 cursor-default' : 'text-slate-400 hover:text-amber-600'}`}
                    title={order.orderStatus === 'Completed' ? 'Order Completed' : 'Update Status'}
                    disabled={order.orderStatus === 'Completed'}
                  >
                    <RefreshCw className="w-4 h-4" />
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

export default OrderTable;
