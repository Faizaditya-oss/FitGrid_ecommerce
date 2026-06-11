import { Truck, RotateCcw, Clock, ShieldCheck } from 'lucide-react';

const ShippingReturns = () => {
  const features = [
    { icon: <Truck className="w-8 h-8" />, title: "Free Shipping", desc: "On all orders over $150" },
    { icon: <RotateCcw className="w-8 h-8" />, title: "Easy Returns", desc: "30-day return policy" },
    { icon: <Clock className="w-8 h-8" />, title: "Fast Dispatch", desc: "Orders ship within 24h" },
    { icon: <ShieldCheck className="w-8 h-8" />, title: "Secure Delivery", desc: "Fully insured packages" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Shipping & Returns</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about how we deliver your fashion pieces and our return policies.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {features.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm text-center border border-slate-100 hover:shadow-md transition-shadow">
              <div className="text-blue-600 flex justify-center mb-4">{item.icon}</div>
              <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-12">
          {/* Shipping Info */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Truck className="text-blue-600" /> Shipping Policy
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>
                We strive to process and dispatch all orders within 24 hours of purchase, excluding weekends and public holidays. Once your order is shipped, you will receive a confirmation email containing your tracking information.
              </p>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 text-lg">Shipping Rates & Estimates</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-3 font-semibold text-slate-900">Method</th>
                        <th className="pb-3 font-semibold text-slate-900">Estimated Delivery</th>
                        <th className="pb-3 font-semibold text-slate-900 text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-4 font-medium">Standard Shipping</td>
                        <td className="py-4">3-5 Business Days</td>
                        <td className="py-4 text-right font-medium">$5.99 <span className="text-xs text-slate-400 block md:inline">(Free over $150)</span></td>
                      </tr>
                      <tr>
                        <td className="py-4 font-medium">Express Shipping</td>
                        <td className="py-4">1-2 Business Days</td>
                        <td className="py-4 text-right font-medium">$14.99</td>
                      </tr>
                      <tr>
                        <td className="py-4 font-medium">International</td>
                        <td className="py-4">7-14 Business Days</td>
                        <td className="py-4 text-right font-medium">Calculated at checkout</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                * Note: Delivery times are estimates and may be subject to delays beyond our control, such as weather conditions or postal service interruptions.
              </p>
            </div>
          </div>

          {/* Returns Info */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <RotateCcw className="text-blue-600" /> Return Policy
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>
                We want you to be completely satisfied with your purchase. If you change your mind, we gladly accept returns on unworn, unwashed, and undamaged items with original tags attached within 30 days of the delivery date.
              </p>
              
              <h3 className="font-bold text-slate-900 text-xl mt-8 mb-4">How to Return an Item</h3>
              <ol className="list-decimal pl-5 space-y-3">
                <li>Pack your item(s) securely in the original product packaging, if possible.</li>
                <li>Go to our <a href="/track-order" className="text-blue-600 hover:underline font-medium">Track Order & Returns</a> page to generate a return shipping label.</li>
                <li>Print the label and attach it to your package.</li>
                <li>Drop off the package at your nearest authorized shipping center.</li>
              </ol>

              <div className="mt-8 p-5 bg-red-50 text-red-800 rounded-xl border border-red-100">
                <h4 className="font-bold mb-2">Non-Returnable Items</h4>
                <p className="text-sm">
                  Final sale items, intimates, swimwear, and gift cards cannot be returned or exchanged unless faulty.
                </p>
              </div>

              <h3 className="font-bold text-slate-900 text-xl mt-8 mb-4">Refunds</h3>
              <p>
                Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment, within 5-10 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturns;
