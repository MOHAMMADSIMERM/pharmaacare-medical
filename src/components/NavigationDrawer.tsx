import React from 'react';
import { LayoutGrid, X, Store, PackageSearch, UserCog, ShieldCheck } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const NavigationDrawer: React.FC = () => {
  const {
    isSidebarDrawerOpen,
    setIsSidebarDrawerOpen,
    setCurrentView,
    currentWorker,
    currentAdmin,
    setIsWorkerLoginOpen,
    setIsAdminLoginOpen,
    setIsTrackingModalOpen,
  } = usePharmacy();

  if (!isSidebarDrawerOpen) return null;

  return (
    <div id="sidebar-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSidebarDrawerOpen(false)}
      />
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-xs bg-slate-900 text-slate-100 shadow-2xl flex flex-col justify-between border-r border-slate-800">
          <div>
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center space-x-2.5">
                <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md shadow-emerald-900/50">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-base tracking-wide text-white block">Main Portals</span>
                  <span className="text-[10px] text-slate-400 font-medium">Customer & Dispensary Access</span>
                </div>
              </div>
              <button
                id="btn-close-drawer"
                onClick={() => setIsSidebarDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="p-4 space-y-2">
              <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Customer Services
              </p>

              {/* Customer Storefront */}
              <button
                id="nav-drawer-storefront"
                onClick={() => {
                  setCurrentView('customer');
                  setIsSidebarDrawerOpen(false);
                }}
                className="w-full flex items-center px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition group cursor-pointer text-left"
              >
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition mr-3">
                  <Store className="w-4 h-4" />
                </div>
                <span>Customer Storefront</span>
              </button>

              {/* Track My Orders Option */}
              <button
                id="nav-drawer-tracking"
                onClick={() => {
                  setIsSidebarDrawerOpen(false);
                  setIsTrackingModalOpen(true);
                }}
                className="w-full flex items-center px-3.5 py-3 rounded-xl text-sm font-semibold text-emerald-300 hover:bg-emerald-950/60 hover:text-emerald-200 transition group border border-emerald-800/40 bg-emerald-950/20 cursor-pointer text-left"
              >
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition mr-3">
                  <PackageSearch className="w-4 h-4" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-bold">Track My Orders</span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-extrabold tracking-wide uppercase">
                    Live
                  </span>
                </div>
              </button>

              <p className="px-3 pt-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Management & Operations
              </p>

              {/* Worker Station */}
              <button
                id="nav-drawer-worker"
                onClick={() => {
                  setIsSidebarDrawerOpen(false);
                  if (currentWorker) {
                    setCurrentView('worker');
                  } else {
                    setIsWorkerLoginOpen(true);
                  }
                }}
                className="w-full flex items-center px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition group cursor-pointer text-left"
              >
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition mr-3">
                  <UserCog className="w-4 h-4" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span>Staff / Worker Station</span>
                  {currentWorker && (
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  )}
                </div>
              </button>

              {/* Master Admin Panel */}
              <button
                id="nav-drawer-admin"
                onClick={() => {
                  setIsSidebarDrawerOpen(false);
                  if (currentAdmin) {
                    setCurrentView('admin');
                  } else {
                    setIsAdminLoginOpen(true);
                  }
                }}
                className="w-full flex items-center px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition group cursor-pointer text-left"
              >
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition mr-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span>Master Admin Panel</span>
                  {currentAdmin && (
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                      Admin
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Drawer Credentials Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span>Staff User:</span>
              <code className="text-indigo-400 bg-slate-900 px-1.5 py-0.5 rounded text-[11px] font-mono">
                john_pharmacist
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span>Staff Pass:</span>
              <code className="text-indigo-400 bg-slate-900 px-1.5 py-0.5 rounded text-[11px] font-mono">
                worker123
              </code>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <span>Admin Pass:</span>
              <code className="text-purple-400 bg-slate-900 px-1.5 py-0.5 rounded text-[11px] font-mono">
                admin123
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
