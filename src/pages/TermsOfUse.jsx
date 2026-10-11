import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, AlertTriangle, Scale, Clock, ShieldCheck, ArrowLeft, Phone, Mail } from 'lucide-react';

const TermsOfUse = () => {
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
          <span className="text-slate-800">Terms of Use</span>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0F392B] via-[#144737] to-[#0A261D] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-xl shadow-[#0F392B]/10 border border-emerald-900/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wide uppercase mb-3">
              <Scale size={13} className="text-emerald-300" />
              Service Terms & Conditions
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Terms of Use
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Last updated: October 2026. Please read these terms carefully before accessing or placing orders through the FreshMart website or mobile application.
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">1</span>
              <h2>Acceptance of Terms & Eligibility</h2>
            </div>
            <p className="text-slate-600">
              By accessing FreshMart, creating an account, or placing an order, you agree to be legally bound by these Terms of Use and our Privacy Policy. You must be at least 18 years of age or possess legal parental/guardian consent to enter into transactions on this platform.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">2</span>
              <h2>Hyperlocal 10-Minute Delivery Commitment</h2>
            </div>
            <p className="text-slate-600">
              FreshMart strives to deliver groceries, fruits, vegetables, and pantry items within the advertised 10-minute timeframe across designated fulfillment zones.
            </p>
            <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl flex items-start gap-3">
              <Clock size={20} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-amber-900 font-medium">
                <strong>Delivery Timing Exceptions:</strong> While over 95% of orders arrive in 10 minutes, unforeseen circumstances such as severe rainfall, traffic blockages, extreme weather, or peak surge hours may cause minor delays. Our riders' physical safety is prioritized at all times.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">3</span>
              <h2>Pricing, Billing & Inventory Availability</h2>
            </div>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>All listed prices are inclusive of applicable GST unless explicitly stated otherwise.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>We make reasonable efforts to reflect real-time dark store inventory. In rare cases where an item becomes out of stock after order placement, a prompt refund or substitution will be offered.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Promotional discount vouchers and promo codes are non-transferable and subject to per-user usage limits.</span>
              </li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">4</span>
              <h2>Fresh Produce & Weight Variances</h2>
            </div>
            <p className="text-slate-600">
              Farm-fresh fruits and vegetables are naturally unique in shape and size. FreshMart packs produce within a strict +/- 5% tolerance of the declared weight. If any delivered item fails to meet your quality expectations, you are protected by our Hassle-Free Return Policy.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">5</span>
              <h2>User Conduct & Fair Use</h2>
            </div>
            <p className="text-slate-600">
              Users agree not to engage in fraudulent chargebacks, create duplicate accounts to exploit new-user promotions, or subject delivery partners and customer support executives to abusive or discourteous behavior. Violations may result in account termination.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 6 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">6</span>
              <h2>Governing Law & Dispute Resolution</h2>
            </div>
            <p className="text-slate-600">
              These Terms of Use are governed by and construed in accordance with the laws of India. Any legal dispute or claims arising out of the use of FreshMart services shall fall under the jurisdiction of competent courts in Shahdol / Madhya Pradesh, India.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 7 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">7</span>
              <h2>Contact Legal Desk</h2>
            </div>
            <p className="text-slate-600">
              For legal inquiries, terms interpretation, or official notices, contact our compliance team:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                <Mail size={18} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Legal Email</span>
                  <a href="mailto:aniketkumargupta302@gmail.com" className="text-slate-900 font-bold hover:text-emerald-600 transition text-sm">
                    aniketkumargupta302@gmail.com
                  </a>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                <Phone size={18} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Customer Desk</span>
                  <a href="tel:8770191425" className="text-slate-900 font-bold hover:text-emerald-600 transition text-sm">
                    +91 8770191425
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

export default TermsOfUse;
