import React, { useState } from 'react';
import {
  ArrowLeft,
  LogOut,
  IndianRupee,
  Package,
  Users,
  UserCog,
  Landmark,
  Plus,
  UserPlus,
  Eye,
  EyeOff,
  Building,
  Save,
  Banknote,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const AdminPanel: React.FC = () => {
  const {
    setCurrentView,
    adminLogout,
    orders,
    medicines,
    customers,
    workers,
    paymentConfig,
    updatePaymentConfig,
    togglePaymentMethod,
    workerGatewayEnabled,
    toggleWorkerGatewayKillswitch,
    saveNewAdminPassword,
    deleteMedicine,
    toggleCustomerStatus,
    resetCustomerPassword,
    deleteCustomerAccount,
    toggleWorkerActive,
    deleteWorker,
    setIsAddMedicineOpen,
    setIsAddWorkerOpen,
    toast,
  } = usePharmacy();

  const [activeTab, setActiveTab] = useState<'inventory' | 'customers' | 'workers' | 'payments' | 'security'>('inventory');

  // Revealable passwords map
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // Payment form state
  const [payHolder, setPayHolder] = useState(paymentConfig.receivingHolder);
  const [payBank, setPayBank] = useState(paymentConfig.bankName);
  const [payIfsc, setPayIfsc] = useState(paymentConfig.ifscCode);
  const [payAccount, setPayAccount] = useState(paymentConfig.accountNumber);
  const [payUpi, setPayUpi] = useState(paymentConfig.upiId);

  // Security password state
  const [newAdminPass, setNewAdminPass] = useState('');

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const toggleReveal = (id: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSavePaymentSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentConfig({
      ...paymentConfig,
      receivingHolder: payHolder.trim(),
      bankName: payBank.trim(),
      ifscCode: payIfsc.trim().toUpperCase(),
      accountNumber: payAccount.trim(),
      upiId: payUpi.trim(),
    });
  };

  const handleSaveAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPass.trim()) return;
    saveNewAdminPassword(newAdminPass.trim());
    setNewAdminPass('');
  };

  const handlePromptPasswordReset = (customerId: string, customerName: string, currentPass: string) => {
    const nextPass = window.prompt(`Enter new password for ${customerName} (min 8 characters):`, currentPass);
    if (nextPass && nextPass.trim().length >= 8) {
      resetCustomerPassword(customerId, nextPass.trim());
    } else if (nextPass !== null) {
      toast('Password must be at least 8 characters!', 'error');
    }
  };

  const handleDeleteCust = (id: string, name: string) => {
    if (window.confirm(`Permanently delete customer account: ${name}?`)) {
      deleteCustomerAccount(id);
    }
  };

  const handleDeleteMed = (id: string, name: string) => {
    if (window.confirm(`Delete ${name} from master stock?`)) {
      deleteMedicine(id);
    }
  };

  const handleDeleteWorker = (id: string, username: string) => {
    if (window.confirm(`Delete worker account: ${username}?`)) {
      deleteWorker(id);
    }
  };

  return (
    <section id="portal-admin" className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-purple-950 text-white p-6 rounded-3xl shadow-xl border border-purple-900">
        <div>
          <span className="px-2.5 py-0.5 bg-purple-800 text-purple-200 text-[11px] font-bold rounded-lg uppercase tracking-wider">
            Super Administrator Hub
          </span>
          <h2 className="text-2xl font-black mt-1">Master Inventory, Customers, Staff & Payments</h2>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={() => setCurrentView('customer')}
            className="px-3.5 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Storefront</span>
          </button>
          <button
            onClick={adminLogout}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>

      {/* Admin KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Gross Sales</p>
            <h4 id="admin-stat-revenue" className="text-2xl font-black text-slate-900 mt-1">
              ₹{totalRevenue.toFixed(2)}
            </h4>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Inventory SKUs</p>
            <h4 id="admin-stat-medicines" className="text-2xl font-black text-slate-900 mt-1">
              {medicines.length}
            </h4>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Registered Customers</p>
            <h4 id="admin-stat-customers" className="text-2xl font-black text-emerald-600 mt-1">
              {customers.length}
            </h4>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Staff Workers</p>
            <h4 id="admin-stat-workers" className="text-2xl font-black text-indigo-600 mt-1">
              {workers.length}
            </h4>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <UserCog className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Admin Sub-Navigation Tabs */}
      <div className="border-b border-slate-200 flex space-x-6 overflow-x-auto pb-1">
        <button
          id="atab-btn-inventory"
          onClick={() => setActiveTab('inventory')}
          className={`py-3 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-purple-600 font-bold text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Medicine Master CRUD
        </button>
        <button
          id="atab-btn-customers"
          onClick={() => setActiveTab('customers')}
          className={`py-3 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
            activeTab === 'customers'
              ? 'border-purple-600 font-bold text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Customer Accounts & Passwords
        </button>
        <button
          id="atab-btn-workers"
          onClick={() => setActiveTab('workers')}
          className={`py-3 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
            activeTab === 'workers'
              ? 'border-purple-600 font-bold text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Worker RBAC
        </button>
        <button
          id="atab-btn-payments"
          onClick={() => setActiveTab('payments')}
          className={`py-3 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'payments'
              ? 'border-purple-600 font-bold text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Landmark className="w-4 h-4 text-emerald-600" />
          <span>Payment Gateways & Receiving Bank</span>
        </button>
        <button
          id="atab-btn-security"
          onClick={() => setActiveTab('security')}
          className={`py-3 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'border-purple-600 font-bold text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Security Gateways
        </button>
      </div>

      {/* Sub-Tab 1: Inventory Master */}
      {activeTab === 'inventory' && (
        <div id="atab-inventory" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">Master Drug Inventory</h3>
              <p className="text-xs text-slate-500">
                Configure prices, stock levels, batches, and toggle Important / Rx policies.
              </p>
            </div>
            <button
              onClick={() => setIsAddMedicineOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Medicine</span>
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase border-b">
                  <tr>
                    <th className="p-3">Medicine & Salt</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Batch Code</th>
                    <th className="p-3">Prescription Policy</th>
                    <th className="p-3">Unit Price</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody id="admin-inventory-table" className="divide-y text-slate-700">
                  {medicines.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">
                        {m.name}
                        <br />
                        <span className="text-[10px] text-slate-400 font-normal">{m.salt}</span>
                      </td>
                      <td className="p-3">{m.department}</td>
                      <td className="p-3 font-mono">{m.batch}</td>
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
                      <td className="p-3 font-bold">₹{m.price.toFixed(2)}</td>
                      <td
                        className={`p-3 font-semibold ${
                          m.stock < 20 ? 'text-rose-600' : 'text-slate-700'
                        }`}
                      >
                        {m.stock} units
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteMed(m.id, m.name)}
                          className="text-rose-600 hover:underline font-bold text-xs cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Customer Accounts Directory */}
      {activeTab === 'customers' && (
        <div id="atab-customers" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Registered Customer Accounts & Plain Passwords
              </h3>
              <p className="text-xs text-slate-500">
                Inspect registered users with @gmail.com validation, 10-digit mobile, orders, and
                view passwords via eye toggle.
              </p>
            </div>
            <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
              Total Users: <strong className="text-purple-700 font-bold">{customers.length}</strong>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase border-b">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Registered Gmail</th>
                    <th className="p-3">Mobile (10 Digits)</th>
                    <th className="p-3">Account Password</th>
                    <th className="p-3">Orders</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody id="admin-customers-table" className="divide-y text-slate-700">
                  {customers.map((c) => {
                    const isRevealed = !!revealedPasswords[c.id];
                    return (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{c.name}</td>
                        <td className="p-3 font-mono text-emerald-800 font-bold">{c.email}</td>
                        <td className="p-3 font-mono text-slate-600">{c.phone}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-1.5 bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg w-fit">
                            <span className="font-mono text-xs font-bold text-slate-800">
                              {isRevealed ? c.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => toggleReveal(c.id)}
                              className="text-slate-500 hover:text-purple-700 ml-1 cursor-pointer"
                              title={isRevealed ? 'Hide Password' : 'Show Password'}
                            >
                              {isRevealed ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-900">{c.ordersCount || 0} orders</span>
                          <span className="text-slate-400 ml-1">
                            (₹{(c.totalSpent || 0).toFixed(2)})
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => toggleCustomerStatus(c.id)}
                            className={`text-[11px] font-bold hover:underline cursor-pointer ${
                              c.status === 'Active' ? 'text-amber-600' : 'text-emerald-600'
                            }`}
                          >
                            {c.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handlePromptPasswordReset(c.id, c.name, c.password)}
                            className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
                          >
                            Edit Pass
                          </button>
                          <button
                            onClick={() => handleDeleteCust(c.id, c.name)}
                            className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Worker RBAC Provisioning */}
      {activeTab === 'workers' && (
        <div id="atab-workers" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Staff Credentials & Role Delegations
              </h3>
              <p className="text-xs text-slate-500">
                Create staff accounts with individual usernames, passwords, and access privileges.
              </p>
            </div>
            <button
              onClick={() => setIsAddWorkerOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision Worker Account</span>
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase border-b">
                  <tr>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Granted Permissions</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody id="admin-workers-table" className="divide-y text-slate-700">
                  {workers.map((w) => {
                    const perms: string[] = [];
                    if (w.permissions.rx) perms.push('Rx Approvals');
                    if (w.permissions.pos) perms.push('POS Billing');
                    if (w.permissions.orders) perms.push('Dispatch');
                    if (w.permissions.stock) perms.push('Stock Vault');

                    return (
                      <tr key={w.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">{w.name}</td>
                        <td className="p-3 font-mono text-indigo-700">{w.username}</td>
                        <td className="p-3">{w.role}</td>
                        <td className="p-3 text-[11px] text-slate-600">
                          {perms.join(', ') || 'None'}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              w.active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {w.active ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => toggleWorkerActive(w.id)}
                            className={`text-xs font-bold hover:underline cursor-pointer ${
                              w.active ? 'text-amber-600' : 'text-emerald-600'
                            }`}
                          >
                            {w.active ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteWorker(w.id, w.username)}
                            className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Payment Settings */}
      {activeTab === 'payments' && (
        <div id="atab-payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-800">
                    Pharmacy Receiving Bank & Merchant Account
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure where customer UPI, Card, and Digital payments get deposited.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSavePaymentSettings} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Merchant / Account Holder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={payHolder}
                    onChange={(e) => setPayHolder(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      required
                      value={payBank}
                      onChange={(e) => setPayBank(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      required
                      value={payIfsc}
                      onChange={(e) => setPayIfsc(e.target.value.toUpperCase())}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden font-mono uppercase"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      required
                      value={payAccount}
                      onChange={(e) => setPayAccount(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      UPI VPA ID (For Online Payment)
                    </label>
                    <input
                      type="text"
                      required
                      value={payUpi}
                      onChange={(e) => setPayUpi(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl transition shadow flex items-center space-x-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Receiving Account Settings</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
                  3 Active Checkout Gateways
                </h3>
                <p className="text-xs text-slate-500">
                  Net Banking has been permanently disabled. Toggle the remaining 3 methods:
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                    <div className="flex items-center space-x-2.5">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-slate-800">Cash on Delivery (COD)</p>
                        <p className="text-[10px] text-slate-500">
                          Pay cash upon delivery to the doorstep agent
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={paymentConfig.methods.cod}
                      onChange={(e) => togglePaymentMethod('cod', e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                    <div className="flex items-center space-x-2.5">
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                      <div>
                        <p className="font-bold text-slate-800">Credit / Debit Card</p>
                        <p className="text-[10px] text-slate-500">
                          Visa, Mastercard, Rupay gateway
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={paymentConfig.methods.card}
                      onChange={(e) => togglePaymentMethod('card', e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                    <div className="flex items-center space-x-2.5">
                      <QrCode className="w-4 h-4 text-teal-600" />
                      <div>
                        <p className="font-bold text-slate-800">Online Payment (UPI / QR Code)</p>
                        <p className="text-[10px] text-slate-500">
                          Google Pay, PhonePe, Paytm, BHIM
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={paymentConfig.methods.upi}
                      onChange={(e) => togglePaymentMethod('upi', e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Live Merchant Card Preview */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-lg border border-slate-800 text-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Live Active Merchant Card
                </span>
                <h4 id="preview-holder" className="text-base font-bold text-white">
                  {payHolder}
                </h4>
                <p id="preview-bank-details" className="text-slate-300 font-mono text-[11px]">
                  {payBank} &bull; A/C: {payAccount}
                </p>
                <p id="preview-upi" className="text-emerald-300 font-mono text-[11px]">
                  UPI: {payUpi}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Security Gateways */}
      {activeTab === 'security' && (
        <div id="atab-security" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Update Master Admin Security Password
            </h3>
            <form onSubmit={handleSaveAdminPassword} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600">New Master Password</label>
                <input
                  id="new-admin-pass"
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Save Password
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Global Staff Access Killswitch</h3>
            <p className="text-xs text-slate-500">
              Immediately lock all worker sessions during stocktaking or audits.
            </p>
            <div className="pt-2 flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="text-xs font-bold text-slate-800">Worker Portal Gateway</p>
                <p
                  id="worker-gateway-status-text"
                  className={`text-[11px] font-semibold ${
                    workerGatewayEnabled ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {workerGatewayEnabled
                    ? 'Active and accepting logins'
                    : 'Disabled system-wide'}
                </p>
              </div>
              <button
                id="worker-gateway-toggle-btn"
                onClick={toggleWorkerGatewayKillswitch}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                  workerGatewayEnabled
                    ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                {workerGatewayEnabled ? 'Disable Access' : 'Enable Access'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
