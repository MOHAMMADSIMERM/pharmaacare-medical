import React, { useState, useEffect } from 'react';
import { X, Banknote, CreditCard, QrCode, CheckCircle, ShieldCheck } from 'lucide-react';
import { PaymentMethodType } from '../types';
import { usePharmacy } from '../context/PharmacyContext';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    currentCustomer,
    cart,
    cartPrescriptionName,
    paymentConfig,
    placeOrder,
    toast,
  } = usePharmacy();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UPI details
  const [upiRef, setUpiRef] = useState('');

  useEffect(() => {
    if (currentCustomer) {
      setName(currentCustomer.name);
      setPhone(currentCustomer.phone);
    }
  }, [currentCustomer, isCheckoutOpen]);

  // Ensure selected method is enabled
  useEffect(() => {
    if (!paymentConfig.methods[paymentMethod]) {
      if (paymentConfig.methods.cod) setPaymentMethod('cod');
      else if (paymentConfig.methods.card) setPaymentMethod('card');
      else if (paymentConfig.methods.upi) setPaymentMethod('upi');
    }
  }, [paymentConfig, paymentMethod]);

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = (subtotal * 1.05).toFixed(2);
  const rxItems = cart.filter((i) => i.rxRequired);
  const hasRx = rxItems.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      toast('Phone number must be exactly 10 digits!', 'error');
      return;
    }

    if (paymentMethod === 'card' && cardNumber.replace(/\s+/g, '').length < 12) {
      toast('Please enter a valid card number!', 'error');
      return;
    }

    const cardLast4 = cardNumber ? cardNumber.replace(/\s+/g, '').slice(-4) : '4012';

    placeOrder({
      name,
      phone,
      address,
      pincode,
      paymentMethodType: paymentMethod,
      cardLast4,
      upiRef: upiRef.trim() || undefined,
    });
  };

  const methods = [
    {
      id: 'cod' as PaymentMethodType,
      label: 'Cash on Delivery',
      sub: 'Pay in cash upon doorstep delivery',
      icon: Banknote,
      enabled: paymentConfig.methods.cod,
    },
    {
      id: 'card' as PaymentMethodType,
      label: 'Credit / Debit Card',
      sub: 'Instant gateway authorization',
      icon: CreditCard,
      enabled: paymentConfig.methods.card,
    },
    {
      id: 'upi' as PaymentMethodType,
      label: 'Online Payment (UPI / QR)',
      sub: paymentConfig.upiId,
      icon: QrCode,
      enabled: paymentConfig.methods.upi,
    },
  ];

  return (
    <div id="checkout-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar">
        <button
          id="btn-close-checkout"
          onClick={() => setIsCheckoutOpen(false)}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800">Checkout & Payment Gateway</h3>
          <p className="text-xs text-slate-500">
            Provide recipient address and choose from 3 active payment methods.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Destination */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              1. Delivery Destination
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700">Patient / Recipient Name</label>
                <input
                  id="chk-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Phone Number (10 Digits)</label>
                <input
                  id="chk-phone"
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700">Complete Address</label>
                <input
                  id="chk-address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Flat/Door, Landmark..."
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Pincode</label>
                <input
                  id="chk-pincode"
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 600001"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                2. Select Payment Gateway
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Secure Merchant Checkout
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {methods.map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <div
                    key={m.id}
                    id={`pay-method-choice-${m.id}`}
                    onClick={() => {
                      if (m.enabled) setPaymentMethod(m.id);
                    }}
                    className={`p-3 rounded-2xl border transition flex flex-col justify-between ${
                      !m.enabled
                        ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                        : isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500 shadow-xs cursor-pointer'
                        : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs text-slate-800">{m.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block truncate">
                      {m.enabled ? m.sub : 'Disabled by Admin'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Payment Method Card */}
          <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 space-y-2 text-xs">
            {paymentMethod === 'cod' && (
              <>
                <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Cash on Delivery Selected</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Please keep exact cash of <strong>₹{total}</strong> ready when our dispatch agent
                  delivers the package to your address.
                </p>
              </>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-2">
                <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Credit / Debit Card Checkout</span>
                </span>
                <div className="space-y-1.5">
                  <input
                    id="chk-card-num"
                    type="text"
                    required
                    placeholder="Card Number (4444 5555 6666 7777)"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      id="chk-card-exp"
                      type="text"
                      required
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <input
                      id="chk-card-cvv"
                      type="password"
                      required
                      placeholder="CVV"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  Merchant Routing: {paymentConfig.receivingHolder}
                </p>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-900 flex items-center space-x-1.5">
                    <QrCode className="w-4 h-4 text-teal-600" />
                    <span>Scan & Pay via UPI App (GPay / PhonePe / Paytm)</span>
                  </span>
                  <span className="text-[10px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded-sm font-bold font-mono">
                    Instant QR
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-2.5 bg-white rounded-xl border border-teal-100">
                  <div className="w-20 h-20 bg-slate-900 text-white rounded-lg flex flex-col items-center justify-center p-1 shrink-0">
                    <QrCode className="w-12 h-12 text-teal-300" />
                    <span className="text-[8px] font-mono">SCAN TO PAY</span>
                  </div>
                  <div className="text-[11px] space-y-0.5">
                    <p className="text-slate-500 text-[10px]">Merchant UPI VPA:</p>
                    <p className="font-bold font-mono text-teal-900 text-xs">{paymentConfig.upiId}</p>
                    <p className="text-slate-500 text-[10px] mt-1">
                      Payable: <strong>₹{total}</strong>
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">
                    UPI 12-Digit Reference No (Optional):
                  </label>
                  <input
                    id="chk-upi-ref"
                    type="text"
                    value={upiRef}
                    onChange={(e) => setUpiRef(e.target.value)}
                    placeholder="e.g. 402910442110"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Rx Status */}
          <div
            className={`p-3 rounded-xl border text-[11px] ${
              hasRx
                ? 'border-amber-200 bg-amber-50 text-amber-900'
                : 'border-emerald-200 bg-emerald-50 text-emerald-900'
            }`}
          >
            {hasRx ? (
              <>
                <strong>Rx Verification Attached:</strong> {cartPrescriptionName} (Stored for
                Pharmacist Inspection before packaging)
              </>
            ) : (
              <>
                <strong>OTC Items Only:</strong> Instant dispatch approved. No prescription needed.
              </>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Total Payable:</span>
              <span id="chk-modal-total-price" className="text-xl font-extrabold text-emerald-600 font-mono">
                ₹{total}
              </span>
            </div>
            <button
              id="btn-submit-order"
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition shadow-lg shadow-emerald-200 flex items-center space-x-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm & Place Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
