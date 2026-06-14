import { useContext, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { Navigate } from 'react-router-dom';
import { formatRupiah } from '../../utils/currency';

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [selectedBank, setSelectedBank] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const vaNumber = useMemo(() => {
    if (paymentMethod !== 'va' || !selectedBank) return '';
    const prefix = {
      BCA: '3901',
      Mandiri: '89508',
      BNI: '824',
      BRI: '2269'
    }[selectedBank];
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    return `${prefix}${randomDigits}`;
  }, [paymentMethod, selectedBank]);

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

  const shippingOptions = useMemo(() => {
    const isEligibleForDiscount = subtotal > 1500000; // Shipping discount for orders over 1.5M
    return [
      { id: 'standard', name: 'Standard Delivery', desc: '3-5 business days', price: isEligibleForDiscount ? 0 : 25000 },
      { id: 'fast', name: 'Fast Delivery', desc: '1-2 business days', price: isEligibleForDiscount ? 12500 : 25000 },
      { id: 'sameday', name: 'Same Day Delivery', desc: 'Delivered today', price: isEligibleForDiscount ? 25000 : 50000 },
    ];
  }, [subtotal]);

  const { tax, shipping, discount, total } = useMemo(() => {
    const tax = subtotal * 0.1; // 10% tax
    const selectedOption = shippingOptions.find(opt => opt.id === shippingMethod) || shippingOptions[0];
    const shipping = selectedOption.price;
    const discount = 0; // Fixed for now
    const total = subtotal + tax + shipping - discount;
    return { tax, shipping, discount, total };
  }, [subtotal, shippingMethod, shippingOptions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'va' && !selectedBank) {
      alert('Silakan pilih salah satu bank untuk metode pembayaran Virtual Account.');
      return;
    }

    // Extract form data safely using FormData
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName') || '';
    const lastName = formData.get('lastName') || '';
    const address = formData.get('address') || '';

    const paymentProofFile = formData.get('paymentProof');

    const processOrder = (proofBase64) => {
      setTimeout(() => {
        const orderData = {
          customerId: user ? user.id : 'guest',
          customer: user ? user.name : `${firstName} ${lastName}`,
          address: address,
          items: cart.map(item => ({ 
            name: item.name, 
            qty: item.quantity, 
            price: item.price, 
            image: item.image 
          })),
          total: total,
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          discount: discount,
          paymentMethod: paymentMethod === 'credit' ? 'Credit Card' : 'Virtual Account',
          paymentProof: proofBase64
        };
        
        orderService.createOrder(orderData);
        clearCart();
        setIsSuccess(true);
      }, 1000);
    };

    if (paymentMethod === 'va' && paymentProofFile && paymentProofFile.size > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processOrder(reader.result);
      };
      reader.readAsDataURL(paymentProofFile);
    } else {
      processOrder(null);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 lg:py-24 max-w-3xl text-center min-h-[60vh] flex flex-col justify-center items-center">
        <div className="mb-8">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Order Confirmed!</h1>
        <p className="text-slate-600 mb-10 text-lg md:text-xl max-w-lg mx-auto">
          Thank you for your purchase. We have received your order and will process it shortly.
        </p>
        <Link 
          to="/products"
          className="inline-flex bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[50vh] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-8 text-lg">You cannot proceed to checkout without items.</p>
        <button onClick={() => navigate('/products')} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5">Browse Products</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8 bg-slate-50 px-4 py-2 rounded-lg">
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-8 lg:mb-12">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column - Form */}
        <div className="w-full lg:flex-1">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
            
            {/* Contact Info */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input type="email" name="email" required className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors bg-slate-50/50" placeholder="you@example.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">First Name</label>
                  <input type="text" name="firstName" required pattern="[A-Za-z\s]+" title="Hanya huruf yang diperbolehkan" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors bg-slate-50/50" placeholder="First Name" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Last Name</label>
                  <input type="text" name="lastName" required pattern="[A-Za-z\s]+" title="Hanya huruf yang diperbolehkan" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors bg-slate-50/50" placeholder="Last Name" />
                </div>
              </div>
            </section>

            {/* Shipping Info */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Shipping Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Address</label>
                  <input type="text" name="address" required pattern="[A-Za-z\s]+" title="Hanya huruf yang diperbolehkan" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors bg-slate-50/50" placeholder="Street Address" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Apartment, suite, etc. (optional)</label>
                  <input type="text" name="apartment" pattern="[A-Za-z\s]+" title="Hanya huruf yang diperbolehkan" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors bg-slate-50/50" placeholder="Apartment, suite, etc." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">City</label>
                  <input type="text" name="city" required pattern="[A-Za-z\s]+" title="Hanya huruf yang diperbolehkan" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors bg-slate-50/50" placeholder="City" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Postal Code</label>
                  <input type="text" name="postalCode" required pattern="[0-9]+" title="Hanya angka yang diperbolehkan" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors bg-slate-50/50" placeholder="Postal Code" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">WhatsApp Number</label>
                  <input type="tel" name="whatsapp" required pattern="[0-9]+" title="Hanya angka yang diperbolehkan" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors bg-slate-50/50" placeholder="0812xxxxxxxx" />
                </div>
              </div>
            </section>

            {/* Delivery Package */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Delivery Package</h2>
              <div className="space-y-4">
                {shippingOptions.map(option => (
                  <label key={option.id} className={`block border-2 rounded-2xl p-4 cursor-pointer transition-colors ${shippingMethod === option.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="shipping" 
                          value={option.id} 
                          checked={shippingMethod === option.id} 
                          onChange={(e) => setShippingMethod(e.target.value)} 
                          className="w-5 h-5 text-slate-900 focus:ring-slate-900 border-slate-300" 
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{option.name}</span>
                          <span className="text-sm text-slate-500">{option.desc}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">
                        {option.price === 0 ? 'Free' : formatRupiah(option.price)}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Payment Method</h2>
              <div className="space-y-5">
                {/* Credit Card Option */}
                <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-colors ${paymentMethod === 'credit' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="credit" checked={paymentMethod === 'credit'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-slate-900 focus:ring-slate-900 border-slate-300" />
                    <span className="font-bold text-slate-900">Credit Card</span>
                  </div>
                </label>
                
                {paymentMethod === 'credit' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 border-2 border-slate-100 rounded-2xl bg-slate-50/30">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-bold text-slate-700">Card Number</label>
                      <input type="text" required={paymentMethod === 'credit'} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Expiration Date (MM/YY)</label>
                      <input type="text" required={paymentMethod === 'credit'} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">CVC</label>
                      <input type="text" required={paymentMethod === 'credit'} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors" placeholder="CVC" />
                    </div>
                  </div>
                )}

                {/* Virtual Account Option */}
                <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-colors ${paymentMethod === 'va' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="va" checked={paymentMethod === 'va'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-slate-900 focus:ring-slate-900 border-slate-300" />
                    <span className="font-bold text-slate-900">Transfer Virtual Account</span>
                  </div>
                </label>

                {paymentMethod === 'va' && (
                  <div className="space-y-5 p-6 border-2 border-slate-100 rounded-2xl bg-slate-50/30">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700">Select Bank</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['BCA', 'Mandiri', 'BNI', 'BRI'].map(bank => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => setSelectedBank(bank)}
                            className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${selectedBank === bank ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedBank && (
                      <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2 mt-4 shadow-inner">
                        <p className="text-sm text-slate-500 font-medium">Virtual Account Number</p>
                        <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-wider font-mono">
                          {vaNumber}
                        </p>
                        <p className="text-xs text-slate-400">Please transfer the exact total amount.</p>
                      </div>
                    )}

                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <label className="text-sm font-bold text-slate-700 block">Upload Payment Proof</label>
                      <input 
                        type="file" 
                        name="paymentProof"
                        accept="image/*" 
                        required={paymentMethod === 'va'}
                        className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2.5 file:px-4
                          file:rounded-xl file:border-0
                          file:text-sm file:font-bold
                          file:bg-slate-900 file:text-white
                          hover:file:bg-slate-800 transition-colors
                          border border-slate-200 rounded-xl p-2 bg-white" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-[420px] xl:w-[460px] flex-shrink-0">
          <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 sticky top-28">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-slate-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 py-1 flex flex-col">
                    <h4 className="text-sm font-bold text-slate-900 truncate mb-0.5">{item.name}</h4>
                    <p className="text-xs text-slate-500 mb-auto">{item.color} / {item.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md">Qty {item.quantity}</p>
                      <div className="text-sm font-bold text-slate-900">
                        {formatRupiah(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-200">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">{shipping === 0 ? 'Free' : formatRupiah(shipping)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Tax (10%)</span>
                <span className="font-semibold text-slate-900">{formatRupiah(tax)}</span>
              </div>
              <div className="flex justify-between items-center pt-5 mt-5 border-t border-slate-200">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{formatRupiah(total)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              className="w-full mt-8 bg-slate-900 text-white py-4 md:py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Place Order
            </button>
            <p className="text-xs text-center text-slate-400 font-medium tracking-wide mt-4 flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Secure checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
