import React, { useState } from 'react';
import {
  ArrowLeft,
  LogOut,
  FileCheck2,
  Calculator,
  Truck,
  Package,
  FileCheck,
  Eye,
  FileText,
  Printer,
} from 'lucide-react';
import { CartItem, OrderStatus } from '../types';
import { usePharmacy } from '../context/PharmacyContext';

export const WorkerStation: React.FC = () => {
  const {
    currentWorker,
    setCurrentView,
    workerLogout,
    orders,
    medicines,
    openRxInspection,
    advanceOrderStatus,
    processPOSCheckout,
  } = usePharmacy();

  const permissions = currentWorker?.permissions || {
    rx: true,
    pos: true,
    orders: true,
    stock: true,
  };

  const initialTab = permissions.rx
    ? 'verification'
    : permissions.pos
    ? 'pos'
    : permissions.orders
    ? 'orders'
    : 'stock';

  const [activeTab, setActiveTab] = useState<'verification' | 'pos' | 'orders' | 'stock'>(initialTab);

  // POS State
  const [posSearch, setPosSearch] = useState('');
  const [posCart, setPosCart] = useState<CartItem[]>([]);

  const pendingRxOrders = orders.filter((o) => o.status === 'PENDING_RX_APPROVAL');

  const filteredPOSMeds = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(posSearch.toLowerCase()) ||
      m.salt.toLowerCase().includes(posSearch.toLowerCase())
  );

  const addToPOSCart = (medId: string) => {
    const med = medicines.find((m) => m.id === medId);
    if (!med || med.stock <= 0) return;

    setPosCart((prev) => {
      const existing = prev.find((i) => i.id === medId);
      if (existing) {
        if (existing.qty + 1 > med.stock) return prev;
        return prev.map((i) => (i.id === medId ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...med, qty: 1 }];
    });
  };

  const clearPOSCart = () => setPosCart([]);

  const handlePOSCheckout = () => {
    if (posCart.length === 0) return;

    // Trigger printable receipt rendering
    const receiptContainer = document.getElementById('receipt-items-list');
    if (receiptContainer) {
      receiptContainer.innerHTML = posCart
        .map(
          (i) => `
        <div class="flex justify-between py-1">
          <span>${i.name} x${i.qty}</span>
          <span>₹${(i.price * i.qty).toFixed(2)}</span>
        </div>
      `
        )
        .join('');
    }

    const subtotal = posCart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const dtEl = document.getElementById('receipt-date-time');
    if (dtEl) dtEl.innerText = new Date().toLocaleString();
    const subEl = document.getElementById('receipt-subtotal');
    if (subEl) subEl.innerText = `Subtotal: ₹${subtotal.toFixed(2)}`;
    const taxEl = document.getElementById('receipt-tax');
    if (taxEl) taxEl.innerText = `GST (5%): ₹${tax.toFixed(2)}`;
    const totEl = document.getElementById('receipt-total');
    if (totEl) totEl.innerText = `Grand Total: ₹${total.toFixed(2)}`;

    processPOSCheckout(posCart);
    window.print();
    setPosCart([]);
  };

  const posSubtotal = posCart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const posTax = posSubtotal * 0.05;
  const posTotal = posSubtotal + posTax;

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_RX_APPROVAL':
        return 'Rx Review Pending';
      case 'RX_VERIFIED':
        return 'Prescription Approved';
      case 'DISPATCH_READY':
        return 'Packed at Pharmacy';
      case 'OUT_FOR_DELIVERY':
        return 'Out for Delivery';
      case 'DELIVERED':
        return 'Delivered Successfully';
      case 'REJECTED':
        return 'Declined Slip';
      default:
        return status;
    }
  };

  const getBadgeStyleForStatus = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_RX_APPROVAL':
        return 'bg-amber-100 text-amber-900 border border-amber-200';
      case 'RX_VERIFIED':
        return 'bg-blue-100 text-blue-900 border border-blue-200';
      case 'DISPATCH_READY':
      case 'PACKED':
        return 'bg-indigo-100 text-indigo-900 border border-indigo-200';
      case 'OUT_FOR_DELIVERY':
        return 'bg-purple-100 text-purple-900 border border-purple-200';
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-900 border border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-900 border border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <section id="portal-worker" className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-indigo-950 text-white p-6 rounded-3xl shadow-xl border border-indigo-900">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-indigo-800 text-indigo-200 text-[11px] font-bold rounded-lg uppercase tracking-wider">
              Staff Dispensary Station
            </span>
            <span id="worker-name-display" className="text-xs font-semibold text-indigo-300">
              ({currentWorker?.name} • {currentWorker?.role})
            </span>
          </div>
          <h2 className="text-2xl font-black mt-1">Prescriptions Review, POS & Fulfillment</h2>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={() => setCurrentView('customer')}
            className="px-3.5 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Storefront</span>
          </button>
          <button
            onClick={workerLogout}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Staff Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex space-x-6 overflow-x-auto pb-1">
        {permissions.rx && (
          <button
            id="wtab-btn-verification"
            onClick={() => setActiveTab('verification')}
            className={`py-3 px-1 border-b-2 font-semibold text-xs sm:text-sm flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'verification'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Rx Approvals Queue</span>
            {pendingRxOrders.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                {pendingRxOrders.length}
              </span>
            )}
          </button>
        )}

        {permissions.pos && (
          <button
            id="wtab-btn-pos"
            onClick={() => setActiveTab('pos')}
            className={`py-3 px-1 border-b-2 font-semibold text-xs sm:text-sm flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'pos'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Counter POS</span>
          </button>
        )}

        {permissions.orders && (
          <button
            id="wtab-btn-orders"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-1 border-b-2 font-semibold text-xs sm:text-sm flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Dispatch Orders</span>
          </button>
        )}

        {permissions.stock && (
          <button
            id="wtab-btn-stock"
            onClick={() => setActiveTab('stock')}
            className={`py-3 px-1 border-b-2 font-semibold text-xs sm:text-sm flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'stock'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Stock Vault</span>
          </button>
        )}
      </div>

      {/* Sub-Tab 1: Rx Verification Queue */}
      {activeTab === 'verification' && (
        <div id="wtab-verification" className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center">
                  <FileCheck className="w-5 h-5 text-indigo-600 mr-2" />
                  <span>Uploaded Doctor Prescription Review Queue</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click <strong>"Inspect Prescription"</strong> to view uploaded slips and verify
                  medical practitioner signatures.
                </p>
              </div>
              <span
                id="worker-pending-count-badge"
                className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full"
              >
                {pendingRxOrders.length} Pending
              </span>
            </div>

            <div id="worker-rx-queue" className="space-y-3">
              {pendingRxOrders.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center font-medium">
                  No doctor prescriptions waiting in queue. Dispensary workflow is completely up to
                  date!
                </p>
              ) : (
                pendingRxOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                          {o.id}
                        </span>
                        <span className="text-xs text-slate-600">
                          Patient: <strong>{o.customerName}</strong> ({o.phone})
                        </span>
                      </div>
                      <p className="text-xs text-indigo-700 font-mono font-bold flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Attached File: {o.prescriptionFile || 'Captured Prescription Slip'}</span>
                      </p>
                      <p className="text-xs text-slate-700">
                        Prescribed: <strong>{o.itemsSummary}</strong>
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Payment: <strong>{o.paymentMethod || 'N/A'}</strong>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <button
                        onClick={() => openRxInspection(o)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Inspect Prescription</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Counter POS Billing */}
      {activeTab === 'pos' && (
        <div id="wtab-pos" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
              Walk-In Patient Counter
            </h3>
            <input
              id="pos-search"
              type="text"
              value={posSearch}
              onChange={(e) => setPosSearch(e.target.value)}
              placeholder="Search medicine or scan barcode..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <div
              id="pos-items-grid"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto custom-scrollbar p-1"
            >
              {filteredPOSMeds.map((m) => (
                <div
                  key={m.id}
                  onClick={() => addToPOSCart(m.id)}
                  className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-xl cursor-pointer transition"
                >
                  <div className="flex justify-between">
                    <p className="font-bold text-xs text-slate-800">{m.name}</p>
                    <span
                      className={`text-[10px] font-bold ${
                        m.rxRequired ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {m.rxRequired ? 'Rx' : 'OTC'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Stock: {m.stock} | ₹{m.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <h3 className="font-bold text-sm text-emerald-400">Counter Invoice Bill</h3>
                <button
                  onClick={clearPOSCart}
                  className="text-xs text-rose-400 hover:underline cursor-pointer"
                >
                  Clear Bill
                </button>
              </div>
              <div
                id="pos-cart-list"
                className="divide-y divide-slate-800 max-h-56 overflow-y-auto custom-scrollbar my-2"
              >
                {posCart.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center italic">
                    Select medicines to build counter invoice.
                  </p>
                ) : (
                  posCart.map((i) => (
                    <div key={i.id} className="py-2 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-200">{i.name}</p>
                        <p className="text-slate-400">
                          ₹{i.price.toFixed(2)} x {i.qty}
                        </p>
                      </div>
                      <span className="font-bold text-emerald-400 font-mono">
                        ₹{(i.price * i.qty).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal:</span>
                <span id="pos-subtotal" className="font-mono text-white">
                  ₹{posSubtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>GST (5%):</span>
                <span id="pos-tax" className="font-mono text-white">
                  ₹{posTax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Total Payable:</span>
                <span id="pos-total" className="text-emerald-400 font-mono text-lg">
                  ₹{posTotal.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handlePOSCheckout}
                disabled={posCart.length === 0}
                className={`w-full py-3 font-extrabold rounded-xl transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer ${
                  posCart.length === 0
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill & Dispense Stock</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Dispatch & Fulfillment */}
      {activeTab === 'orders' && (
        <div id="wtab-orders">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
                  Patient Orders Dispatch Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Advancing stages updates the customer's live tracking timeline immediately.
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase border-b">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Items Summary</th>
                    <th className="p-3">Payment Info</th>
                    <th className="p-3">Prescription</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Current Tracking Stage</th>
                    <th className="p-3 text-right">Advance Action</th>
                  </tr>
                </thead>
                <tbody id="worker-orders-table" className="divide-y text-slate-700">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold font-mono">{o.id}</td>
                      <td className="p-3">{o.customerName}</td>
                      <td className="p-3 max-w-xs truncate">{o.itemsSummary}</td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-800 block">
                          {o.paymentMethod || 'COD'}
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                          {o.paymentStatus || 'Confirmed'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.rxVerified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {o.rxVerified ? 'Verified' : 'Pending Rx'}
                        </span>
                      </td>
                      <td className="p-3 font-bold">₹{o.total.toFixed(2)}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getBadgeStyleForStatus(
                            o.status
                          )}`}
                        >
                          {getStatusLabel(o.status)}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                        {o.rxRequired && !o.rxVerified && o.status !== 'REJECTED' && (
                          <button
                            onClick={() => openRxInspection(o)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            Review Rx
                          </button>
                        )}
                        {(o.status === 'DISPATCH_READY' || o.status === 'PACKED') && (
                          <button
                            onClick={() => advanceOrderStatus(o.id, 'OUT_FOR_DELIVERY')}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                          >
                            Out for Delivery
                          </button>
                        )}
                        {o.status === 'OUT_FOR_DELIVERY' && (
                          <button
                            onClick={() => advanceOrderStatus(o.id, 'DELIVERED')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {o.status === 'DELIVERED' && (
                          <span className="text-xs text-slate-400 font-bold">Completed</span>
                        )}
                        {o.status === 'REJECTED' && (
                          <span className="text-xs text-rose-500 font-bold">Declined</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Stock Vault */}
      {activeTab === 'stock' && (
        <div id="wtab-stock">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide mb-4">
              Dispensary Stock Audit
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase border-b">
                  <tr>
                    <th className="p-3">Medicine</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Batch Code</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">Alert Status</th>
                  </tr>
                </thead>
                <tbody id="worker-stock-table" className="divide-y text-slate-700">
                  {medicines.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">
                        {m.name}
                        <br />
                        <span className="text-[10px] text-slate-400 font-normal">{m.salt}</span>
                      </td>
                      <td className="p-3">{m.department}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.rxRequired
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {m.rxRequired ? 'Important (Rx)' : 'Normal (OTC)'}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{m.batch}</td>
                      <td
                        className={`p-3 font-bold ${m.stock < 20 ? 'text-rose-600' : 'text-slate-900'}`}
                      >
                        {m.stock}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.stock < 20
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {m.stock < 20 ? 'Low Stock' : 'Good'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
