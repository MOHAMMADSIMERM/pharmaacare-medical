import React from 'react';
import { Menu, Pill, MapPin, ShoppingBag, LogOut } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentCustomer,
    currentWorker,
    currentAdmin,
    cart,
    setIsCartOpen,
    setIsSidebarDrawerOpen,
    setIsTrackingModalOpen,
    openAuthModal,
    customerSignOut,
  } = usePharmacy();

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Hamburger & Brand */}
          <div className="flex items-center space-x-3">
            <button
              id="btn-sidebar-drawer-toggle"
              onClick={() => setIsSidebarDrawerOpen(true)}
              className="p-2.5 text-slate-600 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 rounded-xl transition duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              id="brand-logo-button"
              className="flex items-center space-x-2.5 cursor-pointer select-none"
              onClick={() => setCurrentView('customer')}
            >
              <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-2 rounded-xl shadow-md shadow-emerald-200">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold bg-gradient-to-r from-emerald-700 to-teal-800 bg-clip-text text-transparent leading-none block">
                  PharmaCare Pro
                </span>
                <span className="block text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                  Pharmacy Management & Live Tracking
                </span>
              </div>
            </div>
          </div>

          {/* Right: Active Role Portal Badge, Track Button, Cart Trigger, Customer Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Active Portal Badge */}
            {currentView === 'worker' && currentWorker && (
              <div className="hidden sm:flex items-center text-[11px] px-2.5 py-1 bg-indigo-100 text-indigo-800 font-bold rounded-lg border border-indigo-200">
                Worker: {currentWorker.name}
              </div>
            )}
            {currentView === 'admin' && currentAdmin && (
              <div className="hidden sm:flex items-center text-[11px] px-2.5 py-1 bg-purple-100 text-purple-800 font-bold rounded-lg border border-purple-200">
                Super Admin
              </div>
            )}

            {/* Track Orders Nav Button */}
            <button
              id="btn-track-orders-nav"
              onClick={() => setIsTrackingModalOpen(true)}
              className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
              title="Track Live Orders"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Track Orders</span>
            </button>

            {/* Cart Trigger Button (Visible in Customer Storefront) */}
            {currentView === 'customer' && (
              <button
                id="btn-nav-cart"
                onClick={() => {
                  if (!currentCustomer) {
                    openAuthModal('signin');
                  } else {
                    setIsCartOpen(true);
                  }
                }}
                className="relative p-2.5 text-slate-600 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 rounded-xl transition duration-200 cursor-pointer"
                title="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span
                    id="cart-count-badge"
                    className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow"
                  >
                    {totalCartCount}
                  </span>
                )}
              </button>
            )}

            {/* Customer Auth Controls */}
            <div className="flex items-center space-x-2">
              {currentCustomer ? (
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-slate-800">{currentCustomer.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{currentCustomer.phone}</p>
                  </div>
                  <button
                    id="btn-customer-signout"
                    onClick={customerSignOut}
                    className="p-2 text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <button
                    id="btn-nav-signin"
                    onClick={() => openAuthModal('signin')}
                    className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    id="btn-nav-signup"
                    onClick={() => openAuthModal('signup')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-200 transition cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
