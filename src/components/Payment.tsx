
import { useState } from 'react';
import { Info } from 'lucide-react';

const PaymentSection = () => {
  // 1. Create the state to track if payment is "initiated"
  const [hasScanned, setHasScanned] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Scan to Pay</h3>
        <p className="text-sm text-gray-500">UPI ID: 8433415280-4@ybl</p>
      </div>

      {/* QR Code Placeholder (Your existing Image) */}
      <div className="flex justify-center mb-6 bg-black p-4 rounded-xl">
         {/* Replace with your actual QR image tag */}
         <img src="/qr-code.png" alt="UPI QR" className="w-48 h-48" />
      </div>

      {/* 2. Initial "Paid" Button - Shows only if they haven't clicked it yet */}
      {!hasScanned ? (
        <button 
          onClick={() => setHasScanned(true)}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          I have completed the payment
        </button>
      ) : (
        /* 3. The UTR Section - Shows only after clicking the button above */
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2 border border-blue-100">
            <Info size={18} className="text-blue-600 mt-0.5" />
            <p className="text-xs text-blue-700">
              Please enter the 12-digit UTR number from your payment app to confirm your order.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              UPI Transaction Reference (UTR) *
            </label>
            <input 
              type="text"
              maxLength={12}
              placeholder="Enter 12-digit UTR number"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))} // Only allows numbers
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            />
          </div>

          <button 
            disabled={utrNumber.length !== 12}
            className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all ${
              utrNumber.length === 12 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:scale-[1.02]' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Confirm Order
          </button>
          
          <button 
            onClick={() => setHasScanned(false)}
            className="w-full text-sm text-gray-400 hover:text-gray-600 underline"
          >
            Go back to QR code
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;