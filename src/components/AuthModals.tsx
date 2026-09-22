import React, { useState } from 'react';
import { User, X, MailCheck, UserCog, ShieldCheck } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const AuthModals: React.FC = () => {
  const {
    isCustomerAuthOpen,
    setIsCustomerAuthOpen,
    customerAuthMode,
    setCustomerAuthMode,
    customerSignIn,
    customerSignUp,
    recoverPassword,
    isRecoveryNoticeOpen,
    setIsRecoveryNoticeOpen,
    recoveredUser,
    autofillAndSignIn,
    isWorkerLoginOpen,
    setIsWorkerLoginOpen,
    workerLogin,
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    adminLogin,
  } = usePharmacy();

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');

  // Worker Login State
  const [workerUser, setWorkerUser] = useState('');
  const [workerPass, setWorkerPass] = useState('');

  // Admin Login State
  const [adminPass, setAdminPass] = useState('');

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerSignIn(signInIdentifier, signInPassword)) {
      setSignInIdentifier('');
      setSignInPassword('');
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerSignUp(signUpName, signUpEmail, signUpPhone, signUpPassword)) {
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPhone('');
      setSignUpPassword('');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoverPassword(forgotEmail)) {
      setForgotEmail('');
    }
  };

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workerLogin(workerUser, workerPass)) {
      setWorkerUser('');
      setWorkerPass('');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(adminPass)) {
      setAdminPass('');
    }
  };

  return (
    <>
      {/* 1. CUSTOMER AUTH MODAL */}
      {isCustomerAuthOpen && (
        <div id="customerAuthModal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsCustomerAuthOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-5">
              <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <User className="w-6 h-6" />
              </div>
              <h3 id="auth-modal-title" className="text-lg font-bold text-slate-800">
                {customerAuthMode === 'signin' && 'Sign In to Your Account'}
                {customerAuthMode === 'signup' && 'Create Customer Account'}
                {customerAuthMode === 'forgot' && 'Recover Account Password'}
              </h3>
              <p id="auth-modal-subtitle" className="text-xs text-slate-500 mt-0.5">
                {customerAuthMode === 'signin' && 'Mandatory login to shop, add medicines, and track orders'}
                {customerAuthMode === 'signup' && 'Sign up with 10-digit mobile & @gmail.com'}
                {customerAuthMode === 'forgot' && 'We will send your password to your registered Gmail'}
              </p>
            </div>

            {/* Sign In Form */}
            {customerAuthMode === 'signin' && (
              <form id="signin-form" onSubmit={handleSignInSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-600 uppercase text-[10px]">
                    Registered Gmail Address
                  </label>
                  <input
                    id="signin-identifier"
                    type="email"
                    required
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-slate-600 uppercase text-[10px]">Password</label>
                    <button
                      type="button"
                      onClick={() => setCustomerAuthMode('forgot')}
                      className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    id="signin-password"
                    type="password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-md shadow-emerald-200 cursor-pointer"
                >
                  Sign In & Continue
                </button>
                <p className="text-center text-xs text-slate-500 mt-2">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setCustomerAuthMode('signup')}
                    className="text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </form>
            )}

            {/* Sign Up Form */}
            {customerAuthMode === 'signup' && (
              <form id="signup-form" onSubmit={handleSignUpSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-600 uppercase text-[10px]">Full Name</label>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 uppercase text-[10px]">
                    Email Address (@gmail.com mandatory)
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Must end with @gmail.com</span>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 uppercase text-[10px]">
                    Mobile Number (Exactly 10 Digits)
                  </label>
                  <input
                    id="signup-phone"
                    type="tel"
                    required
                    maxLength={10}
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Strictly 10 numerical digits</span>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 uppercase text-[10px]">
                    Create Password (Minimum 8 Characters)
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    required
                    minLength={8}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-md shadow-emerald-200 mt-1 cursor-pointer"
                >
                  Sign Up & Continue
                </button>
                <p className="text-center text-xs text-slate-500 mt-2">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setCustomerAuthMode('signin')}
                    className="text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}

            {/* Forgot Password Form */}
            {customerAuthMode === 'forgot' && (
              <form id="forgot-form" onSubmit={handleForgotSubmit} className="space-y-3.5 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                  Enter your registered <strong>@gmail.com</strong> address. Your account password will be
                  retrieved and dispatched to your email!
                </div>
                <div>
                  <label className="font-semibold text-slate-600 uppercase text-[10px]">
                    Registered Gmail Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-md shadow-emerald-200 cursor-pointer"
                >
                  Send Password to Email
                </button>
                <p className="text-center text-xs text-slate-500 mt-2">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => setCustomerAuthMode('signin')}
                    className="text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. FORGOT PASSWORD RECOVERY NOTICE MODAL */}
      {isRecoveryNoticeOpen && recoveredUser && (
        <div id="recoveryNoticeModal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 border border-emerald-100">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <MailCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Email Dispatched!</h3>
              <p className="text-xs text-slate-500 mt-1">We located your account and simulated sending an email to:</p>
              <p id="recovery-dispatched-email" className="text-xs font-bold text-emerald-700 font-mono mt-0.5">
                {recoveredUser.email}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Account Credentials:</span>
              <p className="text-xs text-slate-700">
                Password:{' '}
                <strong id="recovery-password-display" className="text-slate-900 font-mono font-extrabold text-sm">
                  {recoveredUser.password}
                </strong>
              </p>
            </div>
            <button
              onClick={autofillAndSignIn}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
            >
              Autofill & Sign In Now
            </button>
          </div>
        </div>
      )}

      {/* 3. WORKER LOGIN MODAL */}
      {isWorkerLoginOpen && (
        <div id="workerLoginModal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsWorkerLoginOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-5">
              <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <UserCog className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Staff Station Login</h3>
              <p className="text-xs text-slate-500 mt-0.5">Authorized Pharmacists & Cashiers</p>
            </div>
            <form onSubmit={handleWorkerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Staff Username</label>
                <input
                  id="worker-username-input"
                  type="text"
                  required
                  value={workerUser}
                  onChange={(e) => setWorkerUser(e.target.value)}
                  placeholder="e.g. john_pharmacist"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Password</label>
                <input
                  id="worker-password-input"
                  type="password"
                  required
                  value={workerPass}
                  onChange={(e) => setWorkerPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md shadow-indigo-200 cursor-pointer"
              >
                Authenticate Staff Station
              </button>
              <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-500 text-center">
                Default:{' '}
                <span className="font-mono text-indigo-600 font-bold">john_pharmacist</span> /{' '}
                <span className="font-mono text-indigo-600 font-bold">worker123</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MASTER ADMIN LOGIN MODAL */}
      {isAdminLoginOpen && (
        <div id="adminLoginModal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAdminLoginOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-5">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Master Admin Key</h3>
              <p className="text-xs text-slate-500 mt-0.5">Full System & RBAC Configuration</p>
            </div>
            <form onSubmit={handleAdminSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Admin Master Password</label>
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl transition shadow-md shadow-purple-200 cursor-pointer"
              >
                Access Master Admin
              </button>
              <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-500 text-center">
                Default Key: <span className="font-mono text-purple-700 font-bold">admin123</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
