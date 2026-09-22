import React, { useState } from 'react';
import { Radar, X, Search, Navigation, Milestone, LocateFixed, PackageOpen, Info, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { usePharmacy } from '../context/PharmacyContext';

export const LiveTrackingModal: React.FC = () => {
  const {
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    currentCustomer,
    orders,
    activeTrackingOrder,
    setActiveTrackingOrder,
    searchOrderToTrack,
    openAuthModal,
  } = usePharmacy();

  const [searchQuery, setSearchQuery] = useState('');

  if (!isTrackingModalOpen) return null;

  const userOrders = currentCustomer
    ? orders.filter(
        (o) => o.customerId === currentCustomer.id || o.phone === currentCustomer.phone
      )
    : [];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    searchOrderToTrack(searchQuery);
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

  const order = activeTrackingOrder;

  // Determine stage step
  let currentStep = order?.stageStep || 1;
  if (order?.status === 'PENDING_RX_APPROVAL') currentStep = 1;
  if (order?.status === 'RX_VERIFIED') currentStep = 2;
  if (order?.status === 'DISPATCH_READY' || order?.status === 'PACKED') currentStep = 3;
  if (order?.status === 'OUT_FOR_DELIVERY') currentStep = 4;
  if (order?.status === 'DELIVERED') currentStep = 5;
  if (order?.status === 'REJECTED') currentStep = 0;

  const steps = [
    { num: 1, title: 'Order Confirmed', desc: 'Order details verified & logged' },
    {
      num: 2,
      title: 'Prescription Clear',
      desc: order?.rxRequired
        ? 'Pharmacist Clinical Slip Audit'
        : 'Auto-Cleared (Normal OTC Items)',
    },
    { num: 3, title: 'Packed at Pharmacy', desc: 'Batch checked, sealed in secure bag' },
    { num: 4, title: 'Out for Delivery', desc: order?.courierAgent || 'Handed to courier partner' },
    { num: 5, title: 'Delivered', desc: 'Received at customer address' },
  ];

  return (
    <div id="tracking-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Radar className="w-5 h-5 step-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Live Order Tracking & Fulfillment
              </h3>
              <p className="text-[11px] text-slate-400">
                {currentCustomer
                  ? `Logged in as: ${currentCustomer.name} (${currentCustomer.email}) • Real-time transit feed`
                  : 'Guest Mode • Enter your Order ID below or Sign In to view all your orders'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-tracking"
            onClick={() => setIsTrackingModalOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-slate-50">
          {/* Fast Lookup */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                id="tracking-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by Order ID (e.g. ORD-9021) or 10-digit mobile..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <button
              id="btn-track-package-search"
              onClick={handleSearch}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Track Package</span>
            </button>
          </div>

          {/* Active Order Details */}
          {order && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
              {/* Meta */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      {order.id}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      ₹{order.total.toFixed(2)}
                    </span>
                    {order.rxRequired ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                        Rx Required Order
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                        OTC Fast Order
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mt-1.5">
                    Recipient: {order.customerName} &bull; {order.phone}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Destination: {order.address || 'Registered Address'}, Pincode:{' '}
                    {order.pincode || '600001'}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Est. Delivery Window
                  </span>
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    {order.estimatedDelivery || 'Tomorrow by 02:00 PM'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{order.paymentMethod}</span>
                </div>
              </div>

              {/* Status or Stepper */}
              {order.status === 'REJECTED' ? (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-900 text-xs space-y-1">
                  <div className="flex items-center space-x-2 font-bold text-sm text-rose-800">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Prescription Verification Declined</span>
                  </div>
                  <p className="text-[11px] text-rose-700">
                    Reason:{' '}
                    {order.pharmacistNote ||
                      'Doctor slip was invalid, illegible or missing clinical seal. Please re-order with a clear photo.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-800 flex items-center space-x-1.5">
                      <Milestone className="w-4 h-4 text-emerald-600" />
                      <span>Live Tracking Milestone ({currentStep} of 5)</span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {order.currentCheckpoint || 'In transit'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                    {steps.map((st) => {
                      const isCompleted = currentStep > st.num;
                      const isCurrent = currentStep === st.num;
                      return (
                        <div
                          key={st.num}
                          className={`relative p-3 rounded-2xl border transition-all ${
                            isCurrent
                              ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500 shadow-xs'
                              : isCompleted
                              ? 'bg-slate-50 border-emerald-200'
                              : 'bg-slate-50/60 border-slate-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                                isCurrent
                                  ? 'bg-emerald-600 text-white step-pulse'
                                  : isCompleted
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {isCompleted ? '✓' : st.num}
                            </div>
                            <span
                              className={`text-[9px] font-extrabold uppercase tracking-wider ${
                                isCurrent
                                  ? 'text-emerald-700'
                                  : isCompleted
                                  ? 'text-emerald-600'
                                  : 'text-slate-400'
                              }`}
                            >
                              {isCurrent ? 'Active Now' : isCompleted ? 'Done' : 'Pending'}
                            </span>
                          </div>
                          <p className="font-bold text-xs text-slate-800 leading-tight">{st.title}</p>
                          <p className="text-[10px] text-slate-500 mt-1 leading-snug">{st.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Package summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Package Contents ({order.items?.length || 1} items)
                </span>
                <p className="font-medium text-slate-800">{order.itemsSummary}</p>
                {order.pharmacistNote && (
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-indigo-900">
                    <strong>Dispensary Pharmacist Note:</strong> {order.pharmacistNote}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Past and Active Orders List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                {currentCustomer ? 'Your Recent Orders' : 'Recent System Orders'}
              </h4>
              <span className="text-[11px] font-semibold text-slate-400">
                {currentCustomer ? `${userOrders.length} order(s)` : 'Guest Search'}
              </span>
            </div>

            {currentCustomer ? (
              userOrders.length === 0 ? (
                <div className="text-center py-8 text-slate-400 bg-white rounded-2xl border border-slate-200">
                  <PackageOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold">You haven't placed any orders yet.</p>
                  <p className="text-[11px] text-slate-400">
                    Browse the catalog to add medicines and place your first order!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                            {o.id}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            ₹{o.total.toFixed(2)}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getBadgeStyleForStatus(
                              o.status
                            )}`}
                          >
                            {getStatusLabel(o.status)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 max-w-md truncate font-medium">
                          {o.itemsSummary}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Placed: {o.timestamp} &bull; {o.paymentMethod}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTrackingOrder(o)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
                      >
                        <LocateFixed className="w-3.5 h-3.5" />
                        <span>View Live Status</span>
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Have a registered account? Sign In to view your entire order history.</span>
                </div>
                <button
                  onClick={() => {
                    setIsTrackingModalOpen(false);
                    openAuthModal('signin');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs shrink-0 shadow cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
