import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, DollarSign, Clock, Truck, CheckCircle } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import { formatRupiah } from '../../utils/currency';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          fetch('http://localhost:8000/api/admin/dashboard/stats.php'),
          fetch('http://localhost:8000/api/admin/dashboard/recentOrders.php'),
          fetch('http://localhost:8000/api/admin/dashboard/topProducts.php')
        ]);

        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        if (statsData.success) setStats(statsData.data);
        if (ordersData.success) setRecentOrders(ordersData.data);
        if (productsData.success) setTopProducts(productsData.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Data Available</h2>
          <p className="text-slate-500">There is currently no data to display on the dashboard.</p>
        </div>
      </div>
    );
  }

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
          value={formatRupiah(stats.totalRevenue)} 
          icon={<DollarSign className="w-6 h-6" />} 
          trend="" 
          isPositive={true} 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={<ShoppingCart className="w-6 h-6" />} 
          trend="" 
          isPositive={true} 
        />
        <StatCard 
          title="Total Customers" 
          value={stats.totalCustomers} 
          icon={<Users className="w-6 h-6" />} 
          trend="" 
          isPositive={true} 
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={<Package className="w-6 h-6" />} 
          trend="" 
          isPositive={true} 
        />
      </div>

      {/* Order Summary */}
      <h2 className="text-xl font-semibold text-slate-900 pt-2">Order Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-amber-800 font-bold text-sm tracking-wide uppercase">Pending</p>
            <h3 className="text-2xl font-black text-amber-900">{stats.pendingOrders}</h3>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-blue-800 font-bold text-sm tracking-wide uppercase">Processing</p>
            <h3 className="text-2xl font-black text-blue-900">{stats.processingOrders}</h3>
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-green-800 font-bold text-sm tracking-wide uppercase">Completed</p>
            <h3 className="text-2xl font-black text-green-900">{stats.completedOrders}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto flex-1">
            {recentOrders.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-500 font-medium">No recent orders found.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm">
                    <th className="p-4 font-semibold border-b border-slate-100">Order ID</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Customer</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Date</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Status</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.order_id} className="hover:bg-slate-50 transition-colors text-sm">
                      <td className="p-4 font-bold text-slate-900">#{order.order_id}</td>
                      <td className="p-4 text-slate-600 font-medium">{order.customer}</td>
                      <td className="p-4 text-slate-500">{new Date(order.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                      <td className="p-4">{getStatusBadge(order.status)}</td>
                      <td className="p-4 font-bold text-slate-900">{formatRupiah(order.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">Top Selling Products</h2>
          </div>
          <div className="p-6 space-y-6 flex-1">
            {topProducts.length === 0 ? (
              <div className="text-center pt-8">
                <p className="text-slate-500 font-medium">No products sold yet.</p>
              </div>
            ) : (
              topProducts.map((product) => (
                <div key={product.product_id} className="flex items-center gap-4 group">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{product.name}</h3>
                    <p className="text-xs font-semibold text-blue-600 mt-1">{formatRupiah(product.price)}</p>
                  </div>
                  <div className="text-right bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    <p className="text-sm font-black text-slate-900">{product.sold}</p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Sales</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
