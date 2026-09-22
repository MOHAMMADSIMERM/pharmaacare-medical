import React from 'react';

export const PrintableReceipt: React.FC = () => {
  return (
    <div
      id="printable-receipt"
      className="hidden p-8 bg-white text-black font-mono text-sm max-w-md mx-auto"
    >
      <div className="text-center pb-4 border-b border-black">
        <h2 className="text-xl font-bold uppercase">PharmaCare Pro</h2>
        <p>Official Counter Bill & Dispensary Receipt</p>
        <p id="receipt-date-time" className="text-xs mt-1" />
      </div>
      <div className="py-4 border-b border-black space-y-2" id="receipt-items-list" />
      <div className="pt-4 space-y-1 text-right font-bold">
        <p id="receipt-subtotal" />
        <p id="receipt-tax" />
        <p id="receipt-total" className="text-base" />
      </div>
      <div className="mt-8 text-center text-xs">
        <p>Prescription Verified by Licensed Dispenser</p>
        <p>Thank you for choosing PharmaCare Pro!</p>
      </div>
    </div>
  );
};
