import { Customer, Medicine, Order, PaymentConfig, Worker } from '../types';

export const SEED_MEDICINES: Medicine[] = [
  { id: 'm1', name: 'Paracetamol 650mg (Dolo)', salt: 'Paracetamol / Acetaminophen', department: 'Pain Relief', price: 32.0, stock: 240, rxRequired: false, batch: 'DOL-991' },
  { id: 'm2', name: 'Gelusil Antacid Liquid 200ml', salt: 'Aluminium Hydroxide + Magnesium', department: 'General Wellness', price: 115.0, stock: 65, rxRequired: false, batch: 'GEL-410' },
  { id: 'm3', name: 'Vitamin C 500mg (Limcee)', salt: 'Ascorbic Acid', department: 'Supplements', price: 28.0, stock: 180, rxRequired: false, batch: 'LIM-102' },
  { id: 'm4', name: 'Cetirizine 10mg (Okacet)', salt: 'Cetirizine Hydrochloride', department: 'Respiratory', price: 38.0, stock: 120, rxRequired: false, batch: 'CET-880' },
  { id: 'm5', name: 'Dextromethorphan Cough Syrup', salt: 'Dextromethorphan HBr', department: 'Respiratory', price: 85.0, stock: 75, rxRequired: false, batch: 'DXM-022' },
  { id: 'm6', name: 'Ibuprofen 400mg (Brufen)', salt: 'Ibuprofen', department: 'Pain Relief', price: 42.0, stock: 150, rxRequired: false, batch: 'IBU-312' },
  { id: 'm7', name: 'Amoxicillin 500mg (Novamox)', salt: 'Amoxicillin Trihydrate', department: 'Antibiotics', price: 110.0, stock: 55, rxRequired: true, batch: 'AMX-204' },
  { id: 'm8', name: 'Azithromycin 500mg (Azee)', salt: 'Azithromycin Dihydrate', department: 'Antibiotics', price: 145.0, stock: 40, rxRequired: true, batch: 'AZI-441' },
  { id: 'm9', name: 'Atorvastatin 10mg (Atorva)', salt: 'Atorvastatin Calcium', department: 'Cardiology', price: 95.0, stock: 85, rxRequired: true, batch: 'ATR-102' },
  { id: 'm10', name: 'Amlodipine 5mg (Amlong)', salt: 'Amlodipine Besylate', department: 'Cardiology', price: 65.0, stock: 90, rxRequired: true, batch: 'AML-501' },
  { id: 'm11', name: 'Alprazolam 0.5mg (Restyl)', salt: 'Alprazolam (Schedule H)', department: 'Cardiology', price: 78.0, stock: 25, rxRequired: true, batch: 'ALP-902' }
];

export const SEED_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Ramesh Kumar', email: 'ramesh.pharma@gmail.com', phone: '9876543210', password: 'password123', status: 'Active', registeredAt: '15/03/2026, 10:30 AM', ordersCount: 2, totalSpent: 174.0 },
  { id: 'c2', name: 'Anita Roy', email: 'anita.roy@gmail.com', phone: '9123456780', password: 'securepass2026', status: 'Active', registeredAt: '18/03/2026, 04:15 PM', ordersCount: 1, totalSpent: 171.0 }
];

export const SEED_WORKERS: Worker[] = [
  {
    id: 'w1',
    name: 'John Doe',
    username: 'john_pharmacist',
    password: 'worker123',
    role: 'Lead Pharmacist',
    active: true,
    permissions: { rx: true, pos: true, orders: true, stock: true }
  },
  {
    id: 'w2',
    name: 'Anita Sharma',
    username: 'anita_counter',
    password: 'worker123',
    role: 'Counter POS Cashier',
    active: true,
    permissions: { rx: false, pos: true, orders: true, stock: false }
  }
];

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  receivingHolder: 'PharmaCare Pro Institutional Ltd',
  bankName: 'HDFC Bank Ltd',
  accountNumber: '50200088991122',
  ifscCode: 'HDFC0001234',
  upiId: 'pharmacare@okhdfcbank',
  methods: {
    cod: true,
    card: true,
    upi: true
  }
};

export const SEED_ORDERS: Order[] = [
  { 
    id: 'ORD-9021', 
    customerId: 'c1',
    customerName: 'Ramesh Kumar', 
    phone: '9876543210', 
    items: [
      { id: 'm7', name: 'Amoxicillin 500mg (Novamox)', qty: 1, price: 110.0, rxRequired: true, salt: 'Amoxicillin Trihydrate', department: 'Antibiotics', stock: 55, batch: 'AMX-204' },
      { id: 'm1', name: 'Paracetamol 650mg (Dolo)', qty: 2, price: 32.0, rxRequired: false, salt: 'Paracetamol', department: 'Pain Relief', stock: 240, batch: 'DOL-991' }
    ],
    itemsSummary: 'Amoxicillin 500mg (Novamox) (x1), Paracetamol 650mg (Dolo) (x2)', 
    total: 174.0, 
    paymentMethod: 'Online Payment (UPI: pharmacare@okhdfcbank)',
    paymentStatus: 'Online Payment Confirmed',
    rxRequired: true, 
    prescriptionFile: 'dr_sharma_prescription_ramesh.jpg',
    prescriptionDataUrl: null,
    rxVerified: false, 
    status: 'PENDING_RX_APPROVAL',
    stageStep: 1,
    currentCheckpoint: 'Awaiting Pharmacist Rx Clinical Audit',
    courierAgent: 'MedExpress Dispatch Partner (Reg: ME-4421)',
    estimatedDelivery: 'Tomorrow by 02:00 PM',
    timestamp: '22/09/2026, 09:15 AM'
  },
  { 
    id: 'ORD-9020', 
    customerId: 'c2',
    customerName: 'Anita Roy', 
    phone: '9123456780', 
    items: [
      { id: 'm2', name: 'Gelusil Antacid Liquid 200ml', qty: 1, price: 115.0, rxRequired: false, salt: 'Aluminium Hydroxide', department: 'General Wellness', stock: 65, batch: 'GEL-410' },
      { id: 'm3', name: 'Vitamin C 500mg (Limcee)', qty: 2, price: 28.0, rxRequired: false, salt: 'Ascorbic Acid', department: 'Supplements', stock: 180, batch: 'LIM-102' }
    ],
    itemsSummary: 'Gelusil Antacid Liquid 200ml (x1), Vitamin C 500mg (Limcee) (x2)', 
    total: 171.0, 
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'Pay on Delivery',
    rxRequired: false, 
    prescriptionFile: null, 
    prescriptionDataUrl: null,
    rxVerified: true, 
    status: 'OUT_FOR_DELIVERY',
    stageStep: 4,
    currentCheckpoint: 'Out with Delivery Partner (Rider: Suresh Kumar)',
    courierAgent: 'SpeedRx Logistics (Contact: +91 98401 23456)',
    estimatedDelivery: 'Today by 04:30 PM',
    timestamp: '22/09/2026, 08:30 AM'
  }
];
