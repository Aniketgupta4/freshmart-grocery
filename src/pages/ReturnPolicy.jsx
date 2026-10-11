import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, CheckCircle2, Clock, AlertCircle, Phone, ArrowLeft, RefreshCw, Zap, HeadphonesIcon } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className="flex-grow bg-[#F8FAFC] py-8 sm:py-14 px-4 sm:px-6 min-h-screen font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
          <Link to="/" className="hover:text-emerald-600 transition flex items-center gap-1">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800">Return & Refund Policy</span>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0F392B] via-[#144737] to-[#0A261D] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-xl shadow-[#0F392B]/10 border border-emerald-900/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wide uppercase mb-3">
              <RotateCcw size={13} className="text-emerald-300" />
              100% Quality & Freshness Guarantee
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Return & Refund Policy
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              We stand behind every item we deliver. If something isn't fresh, damaged, or didn't meet your expectation, we make returns and refunds completely frictionless.
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">1</span>
              <h2>Return Window & Guidelines</h2>
            </div>
            <p className="text-slate-600">
              Depending on the nature of the product, the return windows are outlined below:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                  <Zap size={16} className="text-emerald-600" />
                  <span>Perishables (Fruits, Vegetables, Dairy, Bread)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>At Doorstep or within 2 hours:</strong> Since fresh produce is perishable, please inspect upon delivery. If quality is substandard, flag it immediately via our Customer Care tab or phone helpline for an instant replacement or full refund.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>Packaged Groceries & Pantry Staples</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Within 24 to 48 hours:</strong> Packaged goods (flour, oils, snacks, beverages) can be returned within 48 hours if sealed, expired, leaked, or physically damaged in transit.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">2</span>
              <h2>How to Request a Return or Replacement</h2>
            </div>
            <p className="text-slate-600">
              You do not need to go through cumbersome paperwork. We offer a 3-step rapid resolution:
            </p>
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <p className="text-xs sm:text-sm text-slate-700">
                  Open the <Link to="/support" className="text-emerald-700 font-bold underline hover:text-emerald-800">Customer Care</Link> tab or call our 24/7 Helpline at <strong>+91 8770191425</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <p className="text-xs sm:text-sm text-slate-700">
                  Mention your Order ID and the specific item name that is defective, missing, or compromised.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <p className="text-xs sm:text-sm text-slate-700">
                  Our resolution team will immediately issue an instant replacement rider or authorize a 100% refund.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">3</span>
              <h2>Refund Processing Timelines</h2>
            </div>
            <p className="text-slate-600">
              Once an eligible refund is initiated, the funds will reflect based on your original mode of payment:
            </p>
            <ul className="space-y-2 text-slate-600 pt-1">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>UPI Payments (GPay, PhonePe, Paytm):</strong> Reflected within 2 to 4 hours (usually instantaneous).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Credit & Debit Cards / NetBanking:</strong> Settled back into your source bank account within 2 to 4 business days.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Cash on Delivery (COD):</strong> Directly credited to your UPI ID or settled as an immediate wallet balance credit.</span>
              </li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">4</span>
              <h2>Order Cancellation Policy</h2>
            </div>
            <p className="text-slate-600">
              Because of our rapid 10-minute dispatch pipeline, orders can only be cancelled within <strong>60 seconds</strong> of placement, or before the dark store rider departs. Once the delivery partner is on the way, cancellations cannot be processed; however, you may still reject damaged goods at the doorstep.
            </p>
          </section>

          {/* Support Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <HeadphonesIcon size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Need immediate refund assistance?</h4>
                <p className="text-xs text-slate-600">Our customer care desk is live 24/7 to resolve issues on the spot.</p>
              </div>
            </div>
            <Link 
              to="/support" 
              className="px-5 py-2.5 bg-[#0F392B] hover:bg-[#16503c] text-white text-xs font-bold rounded-xl transition shadow-sm active:scale-95 flex-shrink-0"
            >
              Contact Support
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ReturnPolicy;
