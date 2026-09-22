import React, { useState } from 'react';
import { Search, Plus, Minus, AlertCircle } from 'lucide-react';
import { RxFilterType } from '../types';
import { usePharmacy } from '../context/PharmacyContext';

export const CustomerStorefront: React.FC = () => {
  const { medicines, cart, addToCart, adjustCartQty } = usePharmacy();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeDepartment, setActiveDepartment] = useState('ALL');
  const [activeRxFilter, setActiveRxFilter] = useState<RxFilterType>('ALL');

  const departments = [
    'ALL',
    'Antibiotics',
    'Pain Relief',
    'Cardiology',
    'Respiratory',
    'Supplements',
    'General Wellness',
  ];

  const filteredMedicines = medicines.filter((m) => {
    const matchesDept = activeDepartment === 'ALL' || m.department === activeDepartment;
    const cleanSearch = searchQuery.toLowerCase().trim();
    const matchesSearch =
      m.name.toLowerCase().includes(cleanSearch) || m.salt.toLowerCase().includes(cleanSearch);
    let matchesRx = true;
    if (activeRxFilter === 'OTC') matchesRx = !m.rxRequired;
    if (activeRxFilter === 'RX') matchesRx = m.rxRequired;
    return matchesDept && matchesSearch && matchesRx;
  });

  return (
    <section id="portal-customer" className="space-y-6">
      {/* Search & Filter Controls Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="customer-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicine name, active salt..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {departments.map((dept) => (
              <button
                key={dept}
                id={`dept-chip-${dept.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveDepartment(dept)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeDepartment === dept
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 text-xs gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Policy Filter:</span>
            <button
              id="filter-btn-all"
              onClick={() => setActiveRxFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                activeRxFilter === 'ALL'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Medicines
            </button>
            <button
              id="filter-btn-otc"
              onClick={() => setActiveRxFilter('OTC')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                activeRxFilter === 'OTC'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              No Prescription (OTC)
            </button>
            <button
              id="filter-btn-rx"
              onClick={() => setActiveRxFilter('RX')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                activeRxFilter === 'RX'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Prescription (Rx) Required
            </button>
          </div>
          <span id="catalog-count-badge" className="text-slate-400 text-[11px]">
            Showing {filteredMedicines.length} medicine(s)
          </span>
        </div>
      </div>

      {/* Product Cards Grid with Interactive Stepper */}
      <div
        id="customer-product-grid"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
      >
        {filteredMedicines.length === 0 ? (
          <div className="col-span-full text-center py-16 text-slate-400 font-medium bg-white rounded-2xl border border-slate-200">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No medicines match your search filters.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the department or search term.</p>
          </div>
        ) : (
          filteredMedicines.map((m) => {
            const cartItem = cart.find((item) => item.id === m.id);
            const qty = cartItem ? cartItem.qty : 0;

            return (
              <div
                key={m.id}
                id={`medicine-card-${m.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                        m.rxRequired
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {m.rxRequired ? 'Prescription (Rx) Required' : 'OTC - No Prescription Needed'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{m.batch}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm leading-snug">{m.name}</h3>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">Salt: {m.salt}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Dept: {m.department}</span>
                    <span className={m.stock <= 5 ? 'text-amber-600 font-semibold' : ''}>
                      Stock: {m.stock}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Price</span>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{m.price.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    {qty > 0 ? (
                      <div className="flex items-center bg-emerald-50 border border-emerald-300 rounded-xl p-1 space-x-2 shadow-xs">
                        <button
                          id={`btn-cart-dec-${m.id}`}
                          onClick={() => adjustCartQty(m.id, -1)}
                          className="w-6 h-6 bg-white hover:bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs active:scale-95 transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-extrabold text-emerald-900 min-w-[16px] text-center">
                          {qty}
                        </span>
                        <button
                          id={`btn-cart-inc-${m.id}`}
                          onClick={() => adjustCartQty(m.id, 1)}
                          className="w-6 h-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-xs active:scale-95 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`btn-add-cart-${m.id}`}
                        onClick={() => addToCart(m.id)}
                        disabled={m.stock <= 0}
                        className={`px-3.5 py-1.5 ${
                          m.stock <= 0
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 cursor-pointer'
                        } text-xs font-bold rounded-xl transition flex items-center space-x-1 shadow-xs`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{m.stock <= 0 ? 'Out of Stock' : 'Add'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
