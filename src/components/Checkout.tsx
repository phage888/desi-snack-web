import { useState } from 'react';
import { ArrowLeft, CheckCircle, Info, Smartphone, QrCode, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { Order, OrderItem } from '../types';

interface CheckoutProps {
  onBack: () => void;
}

export default function Checkout({ onBack }: CheckoutProps) {
  const { cart, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    utr_number: '',
  });

  // --- BUSINESS LOGIC ---
  const upiId = "8433415280-4@ybl";
  const payeeName = "Desi Snacks & Meals";
  
  // Calculate Totals and Delivery Charges
  const subtotal = getCartTotal();
  const deliveryCharge = subtotal > 300 ? 0 : 30;
  const finalTotal = subtotal + deliveryCharge;

  // UPI Intent Links for Mobile Apps using finalTotal
  const phonePeLink = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${finalTotal}&cu=INR`;
  const paytmLink = `paytmmpay://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${finalTotal}&cu=INR`;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinueToPayment = () => {
    if (!formData.customer_name || !formData.customer_phone || !formData.customer_address) {
      alert('Please fill in all delivery fields');
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (formData.utr_number.length !== 12) {
      alert('Please enter a valid 12-digit UTR number');
      return;
    }

    setLoading(true);
    try {
      const orderData: Order = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_address: formData.customer_address,
        total_amount: finalTotal, // Saving final total including delivery
        payment_status: 'confirmed',
        order_status: 'placed',
        utr_number: formData.utr_number,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .maybeSingle();

      if (orderError || !order) throw new Error('Failed to create order');

      const orderItems: OrderItem[] = cart.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menuItem.id,
        item_name: item.menuItem.name,
        quantity: item.quantity,
        unit_price: item.price,
        size: item.size,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw new Error('Failed to create order items');

      setOrderId(order.id);
      clearCart();
      setStep('success');
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP: SUCCESS
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Successful!</h2>
          <p className="text-gray-600 mb-2 font-mono">Order ID: {orderId}</p>
          <p className="text-gray-600 mb-6">We will call you shortly to confirm your delivery.</p>
          <button onClick={onBack} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold shadow-lg">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // STEP: PAYMENT
  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => { setStep('details'); setPaymentInitiated(false); }} className="flex items-center gap-2 text-gray-700 mb-6 font-semibold">
            <ArrowLeft size={20} /> Back to Details
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6 mb-8 text-center">
              <p className="text-lg opacity-90">Total Payable Amount</p>
              <p className="text-5xl font-bold">₹{finalTotal}</p>
              {deliveryCharge > 0 && <p className="text-sm mt-2 opacity-80">(Includes ₹30 delivery charge)</p>}
            </div>

            {!paymentInitiated ? (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 text-center">Select Payment Method</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href={phonePeLink} onClick={() => setPaymentInitiated(true)} className="flex items-center justify-center gap-3 p-4 border-2 border-purple-100 rounded-xl hover:bg-purple-50 transition-colors">
                    <Smartphone className="text-purple-600" />
                    <span className="font-bold text-purple-700">PhonePe</span>
                  </a>
                  <a href={paytmLink} onClick={() => setPaymentInitiated(true)} className="flex items-center justify-center gap-3 p-4 border-2 border-blue-100 rounded-xl hover:bg-blue-50 transition-colors">
                    <Smartphone className="text-blue-600" />
                    <span className="font-bold text-blue-700">Paytm</span>
                  </a>
                </div>

                <div className="text-center pt-6 border-t border-gray-100">
                  <p className="text-gray-500 mb-4 flex items-center justify-center gap-2">
                    <QrCode size={18} /> Or Scan QR Code
                  </p>
                  <img src="/img-20260201-wa0003.jpg" alt="UPI QR" className="mx-auto w-48 rounded-lg shadow-md mb-4 border" />
                  <button onClick={() => setPaymentInitiated(true)} className="text-orange-600 font-bold hover:underline">
                    I have scanned and paid
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-6 flex gap-3">
                  <Info className="text-blue-500 shrink-0" />
                  <p className="text-sm text-blue-700">
                    Enter the 12-digit UTR number from your payment app to confirm ₹{finalTotal} payment.
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2">UTR Number *</label>
                  <input
                    type="text"
                    name="utr_number"
                    maxLength={12}
                    value={formData.utr_number}
                    onChange={(e) => setFormData({...formData, utr_number: e.target.value.replace(/\D/g, '')})}
                    placeholder="Enter 12-digit reference number"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none text-lg"
                  />
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || formData.utr_number.length !== 12}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Verify & Confirm Order'}
                </button>
                
                <button onClick={() => setPaymentInitiated(false)} className="w-full mt-6 text-gray-400 text-sm hover:text-gray-600">
                  Change payment method
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // STEP: DETAILS
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700 mb-6 font-semibold">
          <ArrowLeft size={20} /> Back to Cart
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Delivery Details</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
              <input type="text" name="customer_name" value={formData.customer_name} onChange={handleInputChange} placeholder="Your name" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500" required />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
              <input type="tel" name="customer_phone" value={formData.customer_phone} onChange={handleInputChange} placeholder="Mobile number" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500" required />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Delivery Address *</label>
              <textarea name="customer_address" value={formData.customer_address} onChange={handleInputChange} placeholder="Full address" rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500" required />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 my-8">
            <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between text-gray-700 mb-2">
                <span>{item.menuItem.name} x {item.quantity}</span>
                <span className="font-semibold">₹{item.price * item.quantity}</span>
              </div>
            ))}
            
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span className="flex items-center gap-1"><Truck size={14}/> Delivery</span>
                <span className={deliveryCharge === 0 ? "text-green-600 font-bold" : ""}>
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-gray-800 pt-2 border-t border-dashed">
                <span>Total</span>
                <span className="text-orange-600">₹{finalTotal}</span>
              </div>
            </div>
            
            {deliveryCharge > 0 && (
              <div className="mt-4 p-3 bg-orange-50 rounded-lg text-xs text-orange-700 text-center font-medium">
                Add ₹{301 - subtotal} more to your cart for FREE delivery!
              </div>
            )}
          </div>

          <button onClick={handleContinueToPayment} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg">
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}