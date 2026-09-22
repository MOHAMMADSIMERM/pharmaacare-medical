import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const AdminModals: React.FC = () => {
  const {
    isAddMedicineOpen,
    setIsAddMedicineOpen,
    saveMedicineMaster,
    isAddWorkerOpen,
    setIsAddWorkerOpen,
    saveWorkerAccount,
  } = usePharmacy();

  // Add Medicine State
  const [medName, setMedName] = useState('');
  const [medSalt, setMedSalt] = useState('');
  const [medDept, setMedDept] = useState('Antibiotics');
  const [medBatch, setMedBatch] = useState('');
  const [medPrice, setMedPrice] = useState('');
  const [medStock, setMedStock] = useState('');
  const [medRx, setMedRx] = useState(false);

  // Add Worker State
  const [wName, setWName] = useState('');
  const [wUser, setWUser] = useState('');
  const [wPass, setWPass] = useState('');
  const [wRole, setWRole] = useState('Lead Pharmacist');
  const [permRx, setPermRx] = useState(true);
  const [permPos, setPermPos] = useState(true);
  const [permOrders, setPermOrders] = useState(true);
  const [permStock, setPermStock] = useState(true);

  const handleAddMedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMedicineMaster({
      name: medName.trim(),
      salt: medSalt.trim(),
      department: medDept,
      batch: medBatch.trim(),
      price: parseFloat(medPrice),
      stock: parseInt(medStock, 10),
      rxRequired: medRx,
    });
    setMedName('');
    setMedSalt('');
    setMedBatch('');
    setMedPrice('');
    setMedStock('');
    setMedRx(false);
  };

  const handleAddWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      saveWorkerAccount({
        name: wName.trim(),
        username: wUser.trim(),
        password: wPass,
        role: wRole,
        permissions: {
          rx: permRx,
          pos: permPos,
          orders: permOrders,
          stock: permStock,
        },
      })
    ) {
      setWName('');
      setWUser('');
      setWPass('');
      setWRole('Lead Pharmacist');
      setPermRx(true);
      setPermPos(true);
      setPermOrders(true);
      setPermStock(true);
    }
  };

  return (
    <>
      {/* 1. ADD MEDICINE MODAL */}
      {isAddMedicineOpen && (
        <div id="addMedicineModal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsAddMedicineOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-800 mb-3">Add Medicine Record</h3>
            <form onSubmit={handleAddMedSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Medicine Trade Name</label>
                <input
                  id="med-name"
                  type="text"
                  required
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Amoxicillin 500mg"
                  className="w-full p-2 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Active Generic Chemical Salt</label>
                <input
                  id="med-salt"
                  type="text"
                  required
                  value={medSalt}
                  onChange={(e) => setMedSalt(e.target.value)}
                  placeholder="e.g. Amoxicillin Trihydrate"
                  className="w-full p-2 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Department</label>
                  <select
                    id="med-dept"
                    value={medDept}
                    onChange={(e) => setMedDept(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Supplements">Supplements</option>
                    <option value="General Wellness">General Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Batch Code</label>
                  <input
                    id="med-batch"
                    type="text"
                    required
                    value={medBatch}
                    onChange={(e) => setMedBatch(e.target.value)}
                    placeholder="AMX-204"
                    className="w-full p-2 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden uppercase"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Unit Price (₹)</label>
                  <input
                    id="med-price"
                    type="number"
                    step="0.1"
                    required
                    value={medPrice}
                    onChange={(e) => setMedPrice(e.target.value)}
                    placeholder="120.00"
                    className="w-full p-2 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Stock Units</label>
                  <input
                    id="med-stock"
                    type="number"
                    required
                    value={medStock}
                    onChange={(e) => setMedStock(e.target.value)}
                    placeholder="50"
                    className="w-full p-2 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    id="med-rx"
                    type="checkbox"
                    checked={medRx}
                    onChange={(e) => setMedRx(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                  />
                  <span className="font-bold text-amber-900">
                    Important Medicine (Prescription / Rx Required)
                  </span>
                </label>
                <p className="text-[10px] text-amber-700 pl-6">
                  When checked, customers cannot order this medicine without uploading a doctor's
                  certificate.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl transition shadow-sm mt-2 cursor-pointer"
              >
                Save to Master Inventory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. PROVISION WORKER ACCOUNT MODAL */}
      {isAddWorkerOpen && (
        <div id="addWorkerModal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddWorkerOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-800 mb-3">Provision Worker Account</h3>
            <form onSubmit={handleAddWorkerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  id="w-fullname"
                  type="text"
                  required
                  value={wName}
                  onChange={(e) => setWName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full p-2 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Username</label>
                  <input
                    id="w-username"
                    type="text"
                    required
                    value={wUser}
                    onChange={(e) => setWUser(e.target.value)}
                    placeholder="priya_pharma"
                    className="w-full p-2 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Password</label>
                  <input
                    id="w-password"
                    type="password"
                    required
                    value={wPass}
                    onChange={(e) => setWPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Role Designation</label>
                <select
                  id="w-designation"
                  value={wRole}
                  onChange={(e) => setWRole(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden cursor-pointer"
                >
                  <option value="Lead Pharmacist">Lead Pharmacist</option>
                  <option value="Dispensing Chemist">Dispensing Chemist</option>
                  <option value="Counter POS Cashier">Counter POS Cashier</option>
                  <option value="Inventory Associate">Inventory Associate</option>
                </select>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-[11px]">
                <p className="font-bold text-slate-800">Granted Granular Permissions:</p>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permRx}
                    onChange={(e) => setPermRx(e.target.checked)}
                    className="text-purple-600 rounded cursor-pointer"
                  />
                  <span>Can Verify & Approve Prescriptions</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permPos}
                    onChange={(e) => setPermPos(e.target.checked)}
                    className="text-purple-600 rounded cursor-pointer"
                  />
                  <span>Can Operate Counter POS Billing</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permOrders}
                    onChange={(e) => setPermOrders(e.target.checked)}
                    className="text-purple-600 rounded cursor-pointer"
                  />
                  <span>Can Advance Orders Dispatch</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permStock}
                    onChange={(e) => setPermStock(e.target.checked)}
                    className="text-purple-600 rounded cursor-pointer"
                  />
                  <span>Can View Dispensary Stock Vault</span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl transition shadow mt-3 cursor-pointer"
              >
                Create Worker Account
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
