import React from 'react';
import { ShoppingBag, X, CheckCircle, AlertTriangle, FileCheck, ArrowRight, Lock, Trash2 } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    adjustCartQty,
    cartPrescriptionName,
    setCartPrescription,
    setIsCheckoutOpen,
    toast,
  } = usePharmacy();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  const rxItems = cart.filter((i) => i.rxRequired);
  const hasRx = rxItems.length > 0;
  const hasUploaded = cartPrescriptionName !== null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCartPrescription(file.name, event.target?.result as string);
      toast(`Prescription image captured: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleCheckoutClick = () => {
    if (hasRx && !hasUploaded) {
      toast('Please upload your prescription document first!', 'error');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-800">Your Shopping Cart</h2>
            </div>
            <button
              id="btn-close-cart"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div id="cart-items-container" className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-500">Your medicine cart is currently empty.</p>
                <p className="mt-1">Add items from the catalog to prepare your dispensary order.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  id={`cart-item-row-${item.id}`}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="pr-2">
                    <h4 className="font-bold text-xs text-slate-900 leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-slate-500">₹{item.price.toFixed(2)} each</p>
                    <span
                      className={`inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        item.rxRequired ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.rxRequired ? 'Rx Required' : 'Normal OTC'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      id={`btn-cart-minus-${item.id}`}
                      onClick={() => adjustCartQty(item.id, -1)}
                      className="w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold min-w-[16px] text-center">{item.qty}</span>
                    <button
                      id={`btn-cart-plus-${item.id}`}
                      onClick={() => adjustCartQty(item.id, 1)}
                      className="w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      +
                    </button>
                    <button
                      id={`btn-cart-remove-${item.id}`}
                      onClick={() => adjustCartQty(item.id, -item.qty)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Conditional Prescription Upload */}
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {cart.length > 0 && (
              <>
                {!hasRx ? (
                  <div className="p-3 rounded-xl text-xs bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold">No Prescription Needed!</p>
                        <p className="text-[11px] text-emerald-700">
                          All items are over-the-counter (OTC). Order can be placed immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl text-xs bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold">Doctor's Prescription (Rx) Required</p>
                        <p className="text-[11px] text-rose-700">
                          Important Schedule drugs in cart:{' '}
                          <strong>{rxItems.map((i) => i.name).join(', ')}</strong>. Upload your doctor
                          slip so the pharmacist can inspect it.
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-rose-200/70">
                      <label className="block text-[11px] font-bold text-rose-900 uppercase tracking-wider mb-1">
                        Attach Doctor Prescription (Image/Photo):
                      </label>
                      <input
                        id="input-cart-rx-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-rose-600 file:text-white hover:file:bg-rose-700 cursor-pointer"
                      />
                      {hasUploaded ? (
                        <div className="mt-2 p-2 bg-emerald-100/70 border border-emerald-300 rounded-lg flex items-center justify-between text-emerald-900 text-[11px] font-bold">
                          <div className="flex items-center space-x-1.5 truncate">
                            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="truncate">Attached: {cartPrescriptionName}</span>
                          </div>
                          <span className="text-[10px] text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded">
                            Ready for Inspection
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-rose-600 italic block mt-1">
                          Upload required to unlock checkout and payment.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Subtotals & Taxes */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span id="cart-subtotal" className="font-semibold text-slate-900">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated GST (5%):</span>
                    <span id="cart-tax" className="font-semibold text-slate-900">
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                    <span>Grand Total:</span>
                    <span id="cart-total" className="text-emerald-600 text-base">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  id="cart-checkout-btn"
                  onClick={handleCheckoutClick}
                  disabled={hasRx && !hasUploaded}
                  className={`w-full py-3.5 font-extrabold rounded-xl transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer ${
                    hasRx && !hasUploaded
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                  }`}
                >
                  {hasRx && !hasUploaded ? (
                    <>
                      <span>Upload Prescription to Continue</span>
                      <Lock className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
