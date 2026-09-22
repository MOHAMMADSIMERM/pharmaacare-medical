import React, { useState } from 'react';
import { FileSearch, X, Image as ImageIcon, RotateCcw, RotateCw, CheckCircle, XCircle } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const RxInspectionModal: React.FC = () => {
  const {
    isRxInspectionOpen,
    setIsRxInspectionOpen,
    activeInspectionOrder,
    submitInspectionDecision,
  } = usePharmacy();

  const [rotation, setRotation] = useState(0);
  const [pharmacistNote, setPharmacistNote] = useState('');

  if (!isRxInspectionOpen || !activeInspectionOrder) return null;

  const order = activeInspectionOrder;
  const rxDrugs = (order.items || []).filter((i) => i.rxRequired);

  const handleDecision = (approved: boolean) => {
    submitInspectionDecision(order.id, approved, pharmacistNote);
    setPharmacistNote('');
    setRotation(0);
  };

  return (
    <div id="rx-inspection-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Prescription Slip Inspection & Audit
              </h3>
              <p className="text-[11px] text-slate-400">
                Order: {order.id} • Patient: {order.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRxInspectionOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Slip Viewer */}
          <div className="lg:col-span-7 p-5 bg-slate-100 flex flex-col justify-between items-center min-h-[350px]">
            <div className="w-full flex justify-between items-center text-xs text-slate-500 mb-2">
              <span className="font-semibold flex items-center space-x-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{order.prescriptionFile || 'uploaded_prescription.jpg'}</span>
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setRotation((prev) => (prev - 90) % 360)}
                  className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs cursor-pointer"
                  title="Rotate Left"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs cursor-pointer"
                  title="Rotate Right"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full flex-1 flex items-center justify-center p-2 overflow-hidden">
              <div
                style={{ transform: `rotate(${rotation}deg)` }}
                className="transition-transform duration-300 transform origin-center max-h-[440px] flex items-center justify-center"
              >
                {order.prescriptionDataUrl ? (
                  <img
                    src={order.prescriptionDataUrl}
                    alt="Customer Uploaded Doctor Prescription"
                    referrerPolicy="no-referrer"
                    className="max-h-[380px] w-auto object-contain rounded-xl shadow-lg border border-slate-300 bg-white"
                  />
                ) : (
                  <div className="w-80 sm:w-96 bg-white p-6 rounded-2xl shadow-xl border border-slate-300 rx-slip-watermark text-slate-800 space-y-3 select-none">
                    <div className="border-b-2 border-emerald-600 pb-2 flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-emerald-800 text-sm tracking-wide uppercase">
                          City Health Multispeciality Clinic
                        </h4>
                        <p className="text-[10px] font-semibold text-slate-500">
                          Dr. Sarah Jenkins, MD (General Medicine)
                        </p>
                        <p className="text-[9px] font-mono text-slate-400">
                          Medical Reg. No: MCI-2024-88412
                        </p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        Rx Clinic Slip
                      </span>
                    </div>
                    <div className="text-[11px] space-y-0.5">
                      <p>
                        <strong>Patient Name:</strong> {order.customerName}
                      </p>
                      <p>
                        <strong>Date:</strong> 22/09/2026 &bull; <strong>Age:</strong> 34 &bull;{' '}
                        <strong>Sex:</strong> M
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <span className="font-serif italic text-base font-bold text-slate-700">Rx:</span>
                      <div className="pl-3 text-xs space-y-1 mt-1 font-mono text-slate-800">
                        <p>1. Tab. Amoxicillin 500mg - 1 Tab TDS x 5 days</p>
                        <p>2. Tab. Dolo 650mg - 1 Tab SOS</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                      <div className="text-[9px] text-slate-400">
                        <p>City Clinic Official Seal</p>
                        <p className="font-mono text-emerald-700 font-bold">[VERIFIED STAMP]</p>
                      </div>
                      <div className="text-right">
                        <div className="font-serif italic text-sm text-indigo-950 font-bold border-b border-slate-400 pb-0.5 px-2">
                          S. Jenkins
                        </div>
                        <p className="text-[9px] text-slate-500">Doctor's Signature</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Verify Doctor Registration No., Clinic Stamp, Patient Name & Active Date.
            </p>
          </div>

          {/* Clinical Decision & Patient Details */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-4 bg-white">
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400">Patient Details</span>
                <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
                <p className="text-slate-600">Phone: {order.phone || 'N/A'}</p>
                <p className="text-slate-500 text-[11px]">Uploaded: {order.timestamp}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Prescribed Medications in Order
                </span>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {rxDrugs.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                          Rx Restricted Drug
                        </span>
                      </div>
                      <span className="font-bold font-mono text-slate-700">Qty: {item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Pharmacist Clinical Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={pharmacistNote}
                  onChange={(e) => setPharmacistNote(e.target.value)}
                  placeholder="e.g. Validated with Dr. Registration #44921. Dosage verified."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                id="btn-approve-rx"
                onClick={() => handleDecision(true)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-200 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve & Release for Packaging</span>
              </button>
              <button
                id="btn-reject-rx"
                onClick={() => handleDecision(false)}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 border border-rose-200 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Decline Prescription (Invalid Slip)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
