import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ActivePortal,
  CartItem,
  Customer,
  Medicine,
  Order,
  OrderStatus,
  PaymentConfig,
  PaymentMethodType,
  ToastNotification,
  Worker,
} from '../types';
import {
  DEFAULT_PAYMENT_CONFIG,
  SEED_CUSTOMERS,
  SEED_MEDICINES,
  SEED_ORDERS,
  SEED_WORKERS,
} from '../data/seedData';

interface UserCartData {
  items: CartItem[];
  prescriptionName: string | null;
  prescriptionDataUrl: string | null;
}

interface PharmacyContextType {
  // State
  currentView: ActivePortal;
  setCurrentView: (view: ActivePortal) => void;
  medicines: Medicine[];
  customers: Customer[];
  workers: Worker[];
  orders: Order[];
  paymentConfig: PaymentConfig;
  workerGatewayEnabled: boolean;
  adminPassword: string;
  currentCustomer: Customer | null;
  currentWorker: Worker | null;
  currentAdmin: boolean;
  cart: CartItem[];
  cartPrescriptionName: string | null;
  cartPrescriptionDataUrl: string | null;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  toasts: ToastNotification[];

  // Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isCustomerAuthOpen: boolean;
  setIsCustomerAuthOpen: (open: boolean) => void;
  customerAuthMode: 'signin' | 'signup' | 'forgot';
  setCustomerAuthMode: (mode: 'signin' | 'signup' | 'forgot') => void;
  isRecoveryNoticeOpen: boolean;
  setIsRecoveryNoticeOpen: (open: boolean) => void;
  recoveredUser: Customer | null;
  isWorkerLoginOpen: boolean;
  setIsWorkerLoginOpen: (open: boolean) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  isRxInspectionOpen: boolean;
  setIsRxInspectionOpen: (open: boolean) => void;
  activeInspectionOrder: Order | null;
  isAddMedicineOpen: boolean;
  setIsAddMedicineOpen: (open: boolean) => void;
  isAddWorkerOpen: boolean;
  setIsAddWorkerOpen: (open: boolean) => void;
  isSidebarDrawerOpen: boolean;
  setIsSidebarDrawerOpen: (open: boolean) => void;

  // Actions
  toast: (message: string, type?: 'success' | 'error') => void;
  openAuthModal: (mode: 'signin' | 'signup' | 'forgot') => void;
  addToCart: (medId: string) => void;
  adjustCartQty: (medId: string, delta: number) => void;
  setCartPrescription: (name: string | null, dataUrl: string | null) => void;
  clearCart: () => void;
  placeOrder: (orderData: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
    paymentMethodType: PaymentMethodType;
    cardLast4?: string;
    upiRef?: string;
  }) => string | null;
  trackOrderById: (orderId: string) => void;
  searchOrderToTrack: (query: string) => boolean;
  customerSignIn: (identifier: string, pass: string) => boolean;
  customerSignUp: (name: string, email: string, phone: string, pass: string) => boolean;
  customerSignOut: () => void;
  recoverPassword: (email: string) => boolean;
  autofillAndSignIn: () => void;
  workerLogin: (username: string, pass: string) => boolean;
  workerLogout: () => void;
  adminLogin: (pass: string) => boolean;
  adminLogout: () => void;
  updatePaymentConfig: (cfg: PaymentConfig) => void;
  togglePaymentMethod: (method: 'cod' | 'card' | 'upi', enabled: boolean) => void;
  saveNewAdminPassword: (newPass: string) => void;
  toggleWorkerGatewayKillswitch: () => void;
  saveMedicineMaster: (med: Omit<Medicine, 'id'>) => void;
  deleteMedicine: (id: string) => void;
  toggleCustomerStatus: (id: string) => void;
  resetCustomerPassword: (id: string, newPass: string) => void;
  deleteCustomerAccount: (id: string) => void;
  saveWorkerAccount: (worker: Omit<Worker, 'id' | 'active'>) => boolean;
  toggleWorkerActive: (id: string) => void;
  deleteWorker: (id: string) => void;
  openRxInspection: (order: Order) => void;
  submitInspectionDecision: (orderId: string, isApproved: boolean, note: string) => void;
  advanceOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  processPOSCheckout: (items: CartItem[]) => void;
}

const PharmacyContext = createContext<PharmacyContextType | null>(null);

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Main View
  const [currentView, setCurrentView] = useState<ActivePortal>('customer');

  // Core Data
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('pc_medicines');
    return saved ? JSON.parse(saved) : SEED_MEDICINES;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('pc_customers');
    return saved ? JSON.parse(saved) : SEED_CUSTOMERS;
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('pc_workers');
    return saved ? JSON.parse(saved) : SEED_WORKERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pc_orders');
    return saved ? JSON.parse(saved) : SEED_ORDERS;
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => {
    const saved = localStorage.getItem('pc_payment_config');
    return saved ? JSON.parse(saved) : DEFAULT_PAYMENT_CONFIG;
  });

  const [workerGatewayEnabled, setWorkerGatewayEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('pc_worker_gw_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('pc_admin_pass') || 'admin123';
  });

  // Sessions
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    const saved = localStorage.getItem('pc_current_customer');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentWorker, setCurrentWorker] = useState<Worker | null>(() => {
    const saved = localStorage.getItem('pc_current_worker');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentAdmin, setCurrentAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem('pc_current_admin');
    return saved ? JSON.parse(saved) : false;
  });

  // User Carts Isolated by Customer ID (or 'guest_cart')
  const [userCarts, setUserCarts] = useState<Record<string, UserCartData>>(() => {
    const saved = localStorage.getItem('pc_user_carts');
    return saved ? JSON.parse(saved) : {};
  });

  const cartOwnerKey = currentCustomer ? currentCustomer.id : 'guest_cart';
  const activeCartData: UserCartData = userCarts[cartOwnerKey] || {
    items: [],
    prescriptionName: null,
    prescriptionDataUrl: null,
  };

  const cart = activeCartData.items;
  const cartPrescriptionName = activeCartData.prescriptionName;
  const cartPrescriptionDataUrl = activeCartData.prescriptionDataUrl;

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(() => {
    return orders.length > 0 ? orders[0] : null;
  });

  const [activeInspectionOrder, setActiveInspectionOrder] = useState<Order | null>(null);
  const [recoveredUser, setRecoveredUser] = useState<Customer | null>(null);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [customerAuthMode, setCustomerAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [isRecoveryNoticeOpen, setIsRecoveryNoticeOpen] = useState(false);
  const [isWorkerLoginOpen, setIsWorkerLoginOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isRxInspectionOpen, setIsRxInspectionOpen] = useState(false);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const toast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pc_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('pc_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('pc_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('pc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pc_payment_config', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  useEffect(() => {
    localStorage.setItem('pc_worker_gw_enabled', JSON.stringify(workerGatewayEnabled));
  }, [workerGatewayEnabled]);

  useEffect(() => {
    localStorage.setItem('pc_admin_pass', adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    if (currentCustomer) {
      localStorage.setItem('pc_current_customer', JSON.stringify(currentCustomer));
    } else {
      localStorage.removeItem('pc_current_customer');
    }
  }, [currentCustomer]);

  useEffect(() => {
    if (currentWorker) {
      localStorage.setItem('pc_current_worker', JSON.stringify(currentWorker));
    } else {
      localStorage.removeItem('pc_current_worker');
    }
  }, [currentWorker]);

  useEffect(() => {
    localStorage.setItem('pc_current_admin', JSON.stringify(currentAdmin));
  }, [currentAdmin]);

  useEffect(() => {
    localStorage.setItem('pc_user_carts', JSON.stringify(userCarts));
  }, [userCarts]);

  // Cart update helper
  const updateActiveCart = (updater: (prev: UserCartData) => UserCartData) => {
    setUserCarts((prev) => {
      const current = prev[cartOwnerKey] || {
        items: [],
        prescriptionName: null,
        prescriptionDataUrl: null,
      };
      return {
        ...prev,
        [cartOwnerKey]: updater(current),
      };
    });
  };

  const openAuthModal = (mode: 'signin' | 'signup' | 'forgot') => {
    setCustomerAuthMode(mode);
    setIsCustomerAuthOpen(true);
  };

  const addToCart = (medId: string) => {
    if (!currentCustomer) {
      toast('Please Sign In or Create an Account to start shopping!', 'error');
      openAuthModal('signin');
      return;
    }

    const med = medicines.find((m) => m.id === medId);
    if (!med) return;

    if (med.stock <= 0) {
      toast('Item is currently out of stock!', 'error');
      return;
    }

    updateActiveCart((current) => {
      const existing = current.items.find((i) => i.id === medId);
      if (existing) {
        if (existing.qty + 1 > med.stock) {
          toast('Stock limit reached for this item!', 'error');
          return current;
        }
        toast(`Updated ${med.name} in cart.`);
        return {
          ...current,
          items: current.items.map((i) => (i.id === medId ? { ...i, qty: i.qty + 1 } : i)),
        };
      } else {
        toast(`Added ${med.name} to cart.`);
        return {
          ...current,
          items: [...current.items, { ...med, qty: 1 }],
        };
      }
    });
  };

  const adjustCartQty = (medId: string, delta: number) => {
    if (!currentCustomer) {
      toast('Please Sign In to modify your cart!', 'error');
      openAuthModal('signin');
      return;
    }

    const med = medicines.find((m) => m.id === medId);

    updateActiveCart((current) => {
      const existing = current.items.find((i) => i.id === medId);
      if (!existing) return current;

      if (delta > 0 && med && existing.qty + 1 > med.stock) {
        toast('Stock limit reached for this item!', 'error');
        return current;
      }

      const nextQty = existing.qty + delta;
      if (nextQty <= 0) {
        return {
          ...current,
          items: current.items.filter((i) => i.id !== medId),
        };
      }

      return {
        ...current,
        items: current.items.map((i) => (i.id === medId ? { ...i, qty: nextQty } : i)),
      };
    });
  };

  const setCartPrescription = (name: string | null, dataUrl: string | null) => {
    updateActiveCart((current) => ({
      ...current,
      prescriptionName: name,
      prescriptionDataUrl: dataUrl,
    }));
  };

  const clearCart = () => {
    updateActiveCart(() => ({
      items: [],
      prescriptionName: null,
      prescriptionDataUrl: null,
    }));
  };

  const placeOrder = (orderData: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
    paymentMethodType: PaymentMethodType;
    cardLast4?: string;
    upiRef?: string;
  }): string | null => {
    if (!currentCustomer) {
      toast('Please Sign In to complete checkout!', 'error');
      openAuthModal('signin');
      return null;
    }

    const rxItems = cart.filter((i) => i.rxRequired);
    const hasRx = rxItems.length > 0;

    let paymentMethodFormatted = '';
    let paymentStatusFormatted = '';

    if (orderData.paymentMethodType === 'cod') {
      paymentMethodFormatted = 'Cash on Delivery (COD)';
      paymentStatusFormatted = 'Pending - Pay upon Delivery';
    } else if (orderData.paymentMethodType === 'card') {
      paymentMethodFormatted = `Card Payment (Ending in •••• ${orderData.cardLast4 || '4012'})`;
      paymentStatusFormatted = 'Online Payment Authorized';
    } else if (orderData.paymentMethodType === 'upi') {
      paymentMethodFormatted = `Online UPI Transfer (${paymentConfig.upiId})`;
      paymentStatusFormatted = `Paid via UPI [Ref: ${orderData.upiRef || 'UPI-APP-TXN'}]`;
    }

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const total = parseFloat((subtotal * 1.05).toFixed(2));
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      id: orderId,
      customerId: currentCustomer.id,
      customerName: orderData.name,
      phone: orderData.phone,
      address: orderData.address,
      pincode: orderData.pincode,
      items: [...cart],
      itemsSummary: cart.map((i) => `${i.name} (x${i.qty})`).join(', '),
      total,
      paymentMethod: paymentMethodFormatted,
      paymentStatus: paymentStatusFormatted,
      rxRequired: hasRx,
      prescriptionFile: hasRx ? cartPrescriptionName : null,
      prescriptionDataUrl: hasRx ? cartPrescriptionDataUrl : null,
      rxVerified: !hasRx,
      status: hasRx ? 'PENDING_RX_APPROVAL' : 'DISPATCH_READY',
      stageStep: hasRx ? 1 : 3,
      currentCheckpoint: hasRx
        ? 'Under Pharmacist Clinical Review'
        : 'Medicines Packed & Quality Checked',
      courierAgent: 'SpeedRx Express Courier (Agent #902)',
      estimatedDelivery: 'Tomorrow by 01:00 PM',
      timestamp: new Date().toLocaleString(),
    };

    // Deduct stock from medicines
    setMedicines((prevMeds) =>
      prevMeds.map((med) => {
        const itemInCart = cart.find((c) => c.id === med.id);
        if (itemInCart) {
          return { ...med, stock: Math.max(0, med.stock - itemInCart.qty) };
        }
        return med;
      })
    );

    // Update orders
    setOrders((prev) => [newOrder, ...prev]);

    // Update customer stats
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === currentCustomer.id) {
          const updated = {
            ...c,
            ordersCount: (c.ordersCount || 0) + 1,
            totalSpent: parseFloat(((c.totalSpent || 0) + total).toFixed(2)),
          };
          setCurrentCustomer(updated);
          return updated;
        }
        return c;
      })
    );

    // Clear cart
    clearCart();
    setIsCheckoutOpen(false);
    toast(`Order ${orderId} placed successfully!`);

    // Set active tracking order and open modal
    setActiveTrackingOrder(newOrder);
    setIsTrackingModalOpen(true);

    return orderId;
  };

  const trackOrderById = (orderId: string) => {
    const found = orders.find((o) => o.id === orderId);
    if (found) {
      setActiveTrackingOrder(found);
      setIsTrackingModalOpen(true);
    }
  };

  const searchOrderToTrack = (query: string): boolean => {
    const clean = query.trim().toLowerCase();
    const found = orders.find(
      (o) => o.id.toLowerCase() === clean || o.phone.toLowerCase() === clean
    );
    if (found) {
      setActiveTrackingOrder(found);
      toast(`Tracking details loaded for ${found.id}`);
      return true;
    } else {
      toast(`No order found matching "${query}". Check your receipt!`, 'error');
      return false;
    }
  };

  const customerSignIn = (identifier: string, pass: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const customer = customers.find(
      (u) =>
        (u.email.toLowerCase() === cleanId || u.phone === cleanId) &&
        u.password === pass
    );

    if (!customer) {
      toast('Invalid Gmail or password.', 'error');
      return false;
    }

    if (customer.status === 'Suspended') {
      toast('Your account has been suspended by the administrator.', 'error');
      return false;
    }

    setCurrentCustomer(customer);
    setIsCustomerAuthOpen(false);
    toast(`Signed in as ${customer.name}`);
    return true;
  };

  const customerSignUp = (
    name: string,
    email: string,
    phone: string,
    pass: string
  ): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Validations
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!gmailRegex.test(cleanEmail)) {
      toast('Email must be a valid @gmail.com address!', 'error');
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(cleanPhone)) {
      toast('Mobile number must be exactly 10 numerical digits!', 'error');
      return false;
    }

    if (pass.length < 8) {
      toast('Password must be at least 8 characters long!', 'error');
      return false;
    }

    if (customers.some((c) => c.email.toLowerCase() === cleanEmail || c.phone === cleanPhone)) {
      toast('An account with this Gmail or Phone already exists!', 'error');
      return false;
    }

    const now = new Date();
    const formattedDate =
      now.toLocaleDateString() +
      ', ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newCustomer: Customer = {
      id: 'CUST-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: pass,
      status: 'Active',
      registeredAt: formattedDate,
      ordersCount: 0,
      totalSpent: 0,
    };

    setCustomers((prev) => [...prev, newCustomer]);
    setCurrentCustomer(newCustomer);

    // Transfer guest cart to newly registered customer if any
    setUserCarts((prev) => {
      const guestCart = prev['guest_cart'];
      if (guestCart) {
        const next = { ...prev, [newCustomer.id]: guestCart };
        delete next['guest_cart'];
        return next;
      }
      return prev;
    });

    setIsCustomerAuthOpen(false);
    toast(`Account created! Welcome, ${newCustomer.name}.`);
    return true;
  };

  const customerSignOut = () => {
    setCurrentCustomer(null);
    setUserCarts((prev) => {
      const next = { ...prev };
      delete next['guest_cart'];
      return next;
    });
    setActiveTrackingOrder(null);
    toast('Signed out. Session cleared.');
  };

  const recoverPassword = (email: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!gmailRegex.test(cleanEmail)) {
      toast('Enter a valid @gmail.com address!', 'error');
      return false;
    }

    const found = customers.find((c) => c.email.toLowerCase() === cleanEmail);
    if (!found) {
      toast('No account registered with this @gmail.com address.', 'error');
      return false;
    }

    setRecoveredUser(found);
    setIsCustomerAuthOpen(false);
    setIsRecoveryNoticeOpen(true);
    return true;
  };

  const autofillAndSignIn = () => {
    if (!recoveredUser) return;
    setIsRecoveryNoticeOpen(false);
    setCustomerAuthMode('signin');
    setIsCustomerAuthOpen(true);
    toast('Credentials ready! Click Sign In to continue.');
  };

  const workerLogin = (username: string, pass: string): boolean => {
    if (!workerGatewayEnabled) {
      toast('Worker portal access is currently disabled by Admin.', 'error');
      return false;
    }

    const worker = workers.find(
      (w) => w.username === username.trim() && w.password === pass && w.active
    );

    if (!worker) {
      toast('Invalid credentials or suspended worker account.', 'error');
      return false;
    }

    setCurrentWorker(worker);
    setIsWorkerLoginOpen(false);
    setCurrentView('worker');
    toast(`Authenticated as ${worker.name}`);
    return true;
  };

  const workerLogout = () => {
    setCurrentWorker(null);
    setCurrentView('customer');
    toast('Staff logged out.');
  };

  const adminLogin = (pass: string): boolean => {
    if (pass === adminPassword) {
      setCurrentAdmin(true);
      setIsAdminLoginOpen(false);
      setCurrentView('admin');
      toast('Master Admin authenticated.');
      return true;
    } else {
      toast('Invalid Master Password Key!', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setCurrentAdmin(false);
    setCurrentView('customer');
    toast('Admin logged out.');
  };

  const updatePaymentConfig = (cfg: PaymentConfig) => {
    setPaymentConfig(cfg);
    toast('Receiving bank and merchant settings updated.');
  };

  const togglePaymentMethod = (method: 'cod' | 'card' | 'upi', enabled: boolean) => {
    setPaymentConfig((prev) => ({
      ...prev,
      methods: {
        ...prev.methods,
        [method]: enabled,
      },
    }));
    toast(`${method.toUpperCase()} payment method ${enabled ? 'activated' : 'deactivated'}.`);
  };

  const saveNewAdminPassword = (newPass: string) => {
    if (newPass.length < 4) {
      toast('Password must be at least 4 characters!', 'error');
      return;
    }
    setAdminPassword(newPass);
    toast('Master admin password updated.');
  };

  const toggleWorkerGatewayKillswitch = () => {
    setWorkerGatewayEnabled((prev) => {
      const next = !prev;
      toast(`Worker gateway ${next ? 'enabled' : 'disabled'}.`);
      return next;
    });
  };

  const saveMedicineMaster = (medData: Omit<Medicine, 'id'>) => {
    const newMed: Medicine = {
      ...medData,
      id: 'm_' + Date.now(),
    };
    setMedicines((prev) => [newMed, ...prev]);
    setIsAddMedicineOpen(false);
    toast(`Medicine ${newMed.name} added.`);
  };

  const deleteMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    toast('Medicine deleted from master stock.');
  };

  const toggleCustomerStatus = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'Active' ? 'Suspended' : 'Active';
          if (currentCustomer && currentCustomer.id === id && nextStatus === 'Suspended') {
            customerSignOut();
          }
          toast(`Account status updated for ${c.name}`);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const resetCustomerPassword = (id: string, newPass: string) => {
    if (newPass.length < 8) {
      toast('Password must be at least 8 characters!', 'error');
      return;
    }
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          toast(`Password updated for ${c.name}.`);
          return { ...c, password: newPass };
        }
        return c;
      })
    );
  };

  const deleteCustomerAccount = (id: string) => {
    const cust = customers.find((c) => c.id === id);
    if (!cust) return;

    if (currentCustomer && currentCustomer.id === id) {
      customerSignOut();
    }

    setUserCarts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    setCustomers((prev) => prev.filter((c) => c.id !== id));
    toast('Customer account deleted.');
  };

  const saveWorkerAccount = (workerData: Omit<Worker, 'id' | 'active'>): boolean => {
    if (workers.some((w) => w.username === workerData.username.trim())) {
      toast('Username taken by another staff member!', 'error');
      return false;
    }

    const newWorker: Worker = {
      ...workerData,
      id: 'w_' + Date.now(),
      active: true,
    };

    setWorkers((prev) => [...prev, newWorker]);
    setIsAddWorkerOpen(false);
    toast(`Staff account created for ${newWorker.username}`);
    return true;
  };

  const toggleWorkerActive = (id: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextActive = !w.active;
          if (currentWorker && currentWorker.id === id && !nextActive) {
            workerLogout();
          }
          return { ...w, active: nextActive };
        }
        return w;
      })
    );
  };

  const deleteWorker = (id: string) => {
    setWorkers((prev) => prev.filter((w) => w.id !== id));
    toast('Worker deleted.');
  };

  const openRxInspection = (order: Order) => {
    setActiveInspectionOrder(order);
    setIsRxInspectionOpen(true);
  };

  const submitInspectionDecision = (
    orderId: string,
    isApproved: boolean,
    note: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          if (isApproved) {
            toast(`Order ${ord.id} prescription approved! Packed for dispatch.`);
            return {
              ...ord,
              status: 'DISPATCH_READY',
              rxVerified: true,
              stageStep: 3,
              currentCheckpoint: 'Prescription Cleared & Medicines Packed',
              pharmacistNote: note || 'Verified & Approved by Staff Pharmacist',
            };
          } else {
            toast(`Order ${ord.id} rejected.`, 'error');
            return {
              ...ord,
              status: 'REJECTED',
              rxVerified: false,
              stageStep: 0,
              currentCheckpoint: 'Prescription Verification Declined',
              pharmacistNote: note || 'Rejected due to invalid or illegible prescription slip.',
            };
          }
        }
        return ord;
      })
    );
    setIsRxInspectionOpen(false);
  };

  const advanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          let step = ord.stageStep;
          let checkpoint = ord.currentCheckpoint;
          if (nextStatus === 'OUT_FOR_DELIVERY') {
            step = 4;
            checkpoint = 'Out with Delivery Partner (Rider: Suresh Kumar)';
            toast(`Order ${orderId} marked as Out for Delivery! Live tracking updated.`);
          } else if (nextStatus === 'DELIVERED') {
            step = 5;
            checkpoint = 'Delivered to recipient address';
            toast(`Order ${orderId} successfully marked as Delivered!`);
          }
          return {
            ...ord,
            status: nextStatus,
            stageStep: step,
            currentCheckpoint: checkpoint,
          };
        }
        return ord;
      })
    );
  };

  const processPOSCheckout = (items: CartItem[]) => {
    if (items.length === 0) return;

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const tax = subtotal * 0.05;
    const total = parseFloat((subtotal + tax).toFixed(2));

    const newOrder: Order = {
      id: 'POS-' + Math.floor(100000 + Math.random() * 900000),
      customerName: 'Walk-In Customer',
      phone: 'Counter Sale',
      items: [...items],
      itemsSummary: items.map((i) => `${i.name} (x${i.qty})`).join(', '),
      total,
      paymentMethod: 'Counter Cash / POS Card',
      paymentStatus: 'Paid at Counter',
      rxRequired: false,
      rxVerified: true,
      status: 'DELIVERED',
      stageStep: 5,
      currentCheckpoint: 'Handed directly at pharmacy counter',
      timestamp: new Date().toLocaleString(),
    };

    // Deduct stock
    setMedicines((prevMeds) =>
      prevMeds.map((med) => {
        const sold = items.find((i) => i.id === med.id);
        if (sold) {
          return { ...med, stock: Math.max(0, med.stock - sold.qty) };
        }
        return med;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    toast('Bill printed and stock deducted.');
  };

  return (
    <PharmacyContext.Provider
      value={{
        currentView,
        setCurrentView,
        medicines,
        customers,
        workers,
        orders,
        paymentConfig,
        workerGatewayEnabled,
        adminPassword,
        currentCustomer,
        currentWorker,
        currentAdmin,
        cart,
        cartPrescriptionName,
        cartPrescriptionDataUrl,
        activeTrackingOrder,
        setActiveTrackingOrder,
        toasts,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isCustomerAuthOpen,
        setIsCustomerAuthOpen,
        customerAuthMode,
        setCustomerAuthMode,
        isRecoveryNoticeOpen,
        setIsRecoveryNoticeOpen,
        recoveredUser,
        isWorkerLoginOpen,
        setIsWorkerLoginOpen,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        isRxInspectionOpen,
        setIsRxInspectionOpen,
        activeInspectionOrder,
        isAddMedicineOpen,
        setIsAddMedicineOpen,
        isAddWorkerOpen,
        setIsAddWorkerOpen,
        isSidebarDrawerOpen,
        setIsSidebarDrawerOpen,
        toast,
        openAuthModal,
        addToCart,
        adjustCartQty,
        setCartPrescription,
        clearCart,
        placeOrder,
        trackOrderById,
        searchOrderToTrack,
        customerSignIn,
        customerSignUp,
        customerSignOut,
        recoverPassword,
        autofillAndSignIn,
        workerLogin,
        workerLogout,
        adminLogin,
        adminLogout,
        updatePaymentConfig,
        togglePaymentMethod,
        saveNewAdminPassword,
        toggleWorkerGatewayKillswitch,
        saveMedicineMaster,
        deleteMedicine,
        toggleCustomerStatus,
        resetCustomerPassword,
        deleteCustomerAccount,
        saveWorkerAccount,
        toggleWorkerActive,
        deleteWorker,
        openRxInspection,
        submitInspectionDecision,
        advanceOrderStatus,
        processPOSCheckout,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
