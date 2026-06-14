import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import { useProducts } from '../../hooks/useProducts';
import { useUsers } from '../../hooks/useUsers';
import { useOrders } from '../../hooks/useOrders';

const Dashboard = () => {
  const products = useProducts();
  const users = useUsers();
  const orders = useOrders();

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalCustomers = users.filter(u => u.role === 'customer').length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

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

  const topSelling = [...products].sort((a, b) => b.stock - a.stock).slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(totalRevenue)} 
          icon={<DollarSign className="w-6 h-6" />} 
          trend="12.5%" 
          isPositive={true} 
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders} 
          icon={<ShoppingCart className="w-6 h-6" />} 
          trend="5.2%" 
          isPositive={true} 
        />
        <StatCard 
          title="Total Customers" 
          value={totalCustomers} 
          icon={<Users className="w-6 h-6" />} 
          trend="2.1%" 
          isPositive={true} 
        />
        <StatCard 
          title="Total Products" 
          value={totalProducts} 
          icon={<Package className="w-6 h-6" />} 
          trend="0.0%" 
          isPositive={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">Recent Orders</h2>
            <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors text-sm">
                    <td className="p-4 font-medium text-slate-900">{order.id}</td>
                    <td className="p-4 text-slate-600">{order.customer}</td>
                    <td className="p-4 text-slate-500">{order.date}</td>
                    <td className="p-4">{getStatusBadge(order.orderStatus)}</td>
                    <td className="p-4 font-medium text-slate-900">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">Top Selling Products</h2>
          </div>
          <div className="p-6 space-y-6">
            {topSelling.map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">{product.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{Math.floor(Math.random() * 50) + 10}</p>
                  <p className="text-xs text-slate-500">Sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
