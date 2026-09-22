import React from 'react';
import { PharmacyProvider, usePharmacy } from './context/PharmacyContext';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { CustomerStorefront } from './components/CustomerStorefront';
import { WorkerStation } from './components/WorkerStation';
import { AdminPanel } from './components/AdminPanel';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveTrackingModal } from './components/LiveTrackingModal';
import { RxInspectionModal } from './components/RxInspectionModal';
import { AuthModals } from './components/AuthModals';
import { AdminModals } from './components/AdminModals';
import { PrintableReceipt } from './components/PrintableReceipt';
import { ToastContainer } from './components/ToastContainer';
import { Pill, ShieldCheck, HeartPulse } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = usePharmacy();

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Header />

      {/* Navigation Slide-over Drawer */}
      <NavigationDrawer />

      {/* Main View Portals */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'customer' && <CustomerStorefront />}
        {currentView === 'worker' && <WorkerStation />}
        {currentView === 'admin' && <AdminPanel />}
      </main>

      {/* Modals & Overlays */}
      <CartDrawer />
      <CheckoutModal />
      <LiveTrackingModal />
      <RxInspectionModal />
      <AuthModals />
      <AdminModals />
      <PrintableReceipt />
      <ToastContainer />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-emerald-100 text-emerald-700 rounded-lg">
              <Pill className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">PharmaCare Pro</span>
            <span className="text-slate-400">|</span>
            <span>Licensed Medical Dispensary System</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <div className="flex items-center space-x-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Schedule H & Rx Compliant</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-600">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              <span>Real-Time Logistics Tracking</span>
            </div>
            <button
              onClick={() => setCurrentView('customer')}
              className="text-slate-600 hover:text-emerald-700 font-semibold cursor-pointer"
            >
              Storefront
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} PharmaCare Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <PharmacyProvider>
      <AppContent />
    </PharmacyProvider>
  );
}
