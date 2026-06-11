import { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, CircleDashed } from 'lucide-react';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId || !email) return;
    
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setTracking({
        orderId: orderId,
        status: 'In Transit',
        carrier: 'FedEx',
        trackingNumber: 'FDX9876543210',
        estimatedDelivery: 'Oct 24, 2026',
        steps: [
          { title: 'Order Placed', date: 'Oct 20, 2026, 09:41 AM', completed: true },
          { title: 'Processing', date: 'Oct 21, 2026, 14:20 PM', completed: true },
          { title: 'Shipped', date: 'Oct 22, 2026, 08:15 AM', completed: true },
          { title: 'In Transit', date: 'Arrived at local facility', completed: false, current: true },
          { title: 'Delivered', date: 'Estimated: Oct 24, 2026', completed: false },
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Track Your Order</h1>
          <p className="text-lg text-slate-600">
            Enter your order number and email address to see the latest updates on your shipment.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100 mb-12">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="orderId" className="text-sm font-bold text-slate-700">Order ID</label>
                <input 
                  type="text" 
                  id="orderId" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. ORD-12345"
                  required
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors bg-slate-50/50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email used for order"
                  required
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors bg-slate-50/50"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? <CircleDashed className="animate-spin" /> : <Search className="w-5 h-5" />}
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>

        {tracking && (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Order Number</p>
                <h3 className="text-2xl font-bold">{tracking.orderId}</h3>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm mb-1">Estimated Delivery</p>
                <h3 className="text-2xl font-bold text-blue-400">{tracking.estimatedDelivery}</h3>
              </div>
            </div>
            
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-4 mb-10 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Carrier: {tracking.carrier}</p>
                  <p className="text-sm text-slate-500">Tracking: <a href="#" className="text-blue-600 hover:underline">{tracking.trackingNumber}</a></p>
                </div>
              </div>

              <div className="relative border-l-2 border-slate-100 ml-6 space-y-10 py-2">
                {tracking.steps.map((step, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className={`absolute -left-[11px] top-0.5 bg-white rounded-full ${step.completed ? 'text-green-500' : step.current ? 'text-blue-500 animate-pulse' : 'text-slate-300'}`}>
                      {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <CircleDashed className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className={`font-bold ${step.completed || step.current ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</h4>
                      <p className={`text-sm mt-1 ${step.completed || step.current ? 'text-slate-600' : 'text-slate-400'}`}>{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
