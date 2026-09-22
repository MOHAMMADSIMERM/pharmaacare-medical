export interface Medicine {
  id: string;
  name: string;
  salt: string;
  department: string;
  price: number;
  stock: number;
  rxRequired: boolean;
  batch: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  status: 'Active' | 'Suspended';
  registeredAt: string;
  ordersCount: number;
  totalSpent: number;
}

export interface WorkerPermissions {
  rx: boolean;
  pos: boolean;
  orders: boolean;
  stock: boolean;
}

export interface Worker {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
  active: boolean;
  permissions: WorkerPermissions;
}

export interface PaymentConfig {
  receivingHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  methods: {
    cod: boolean;
    card: boolean;
    upi: boolean;
  };
}

export interface CartItem extends Medicine {
  qty: number;
}

export interface OrderItem {
  id?: string;
  name: string;
  qty: number;
  price: number;
  rxRequired: boolean;
}

export type OrderStatus =
  | 'PENDING_RX_APPROVAL'
  | 'RX_VERIFIED'
  | 'DISPATCH_READY'
  | 'PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'REJECTED';

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  phone: string;
  address?: string;
  pincode?: string;
  items: CartItem[] | OrderItem[];
  itemsSummary: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  rxRequired: boolean;
  prescriptionFile?: string | null;
  prescriptionDataUrl?: string | null;
  rxVerified: boolean;
  status: OrderStatus;
  stageStep: number; // 1: Placed, 2: Rx Verified, 3: Packed, 4: Out for Delivery, 5: Delivered, 0: Rejected
  currentCheckpoint?: string;
  courierAgent?: string;
  estimatedDelivery?: string;
  pharmacistNote?: string;
  timestamp: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export type ActivePortal = 'customer' | 'worker' | 'admin';
export type RxFilterType = 'ALL' | 'OTC' | 'RX';
export type PaymentMethodType = 'cod' | 'card' | 'upi';
