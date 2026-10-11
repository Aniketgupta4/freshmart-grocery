import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Phone, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="flex-grow bg-[#F8FAFC] py-6 sm:py-14 px-3 sm:px-6 min-h-screen font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-8 w-full">
        
        {/* Navigation Breadcrumb */}
        <div className="px-1 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500">
          <Link to="/" className="hover:text-emerald-600 transition flex items-center gap-1">
            <ArrowLeft size={15} />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800">Privacy Policy</span>
        </div>

        {/* Hero Header - Light Theme */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 md:p-10 border border-emerald-100/90 shadow-[0_4px_25px_rgba(16,185,129,0.06)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-black tracking-wide uppercase mb-2.5">
              <Shield size={12} className="text-emerald-700" />
              Your Privacy Matters
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Privacy Policy
            </h1>
            <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
              Last updated: October 2026. At FreshMart, we respect your privacy and are committed to protecting the personal data you share with us during your quick-commerce shopping journey.
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-slate-100 shadow-sm space-y-6 sm:space-y-8 text-slate-700 text-xs sm:text-base leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 sm:gap-2.5 text-slate-900 font-extrabold text-base sm:text-xl">
              <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0">1</span>
              <h2 className="leading-snug">Information We Collect</h2>
            </div>
            <p className="text-slate-600">
              To provide swift 10-minute grocery fulfillment and seamless checkout, we collect essential personal and operational information:
            </p>
            <ul className="space-y-2.5 pt-1">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Account Information:</strong> Name, mobile phone number, email address, and authentication credentials.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Delivery Addresses:</strong> Street address, flat/house numbers, landmarks, and GPS geolocation coordinates to dispatch delivery partners accurately.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Transactional Data:</strong> Ordered items, purchase history, order timestamps, and preferred payment methods (we do not store full card details or CVV).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Device & Technical Signals:</strong> Device model, OS, app version, IP address, and network telemetry for fraud prevention.</span>
              </li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 sm:gap-2.5 text-slate-900 font-extrabold text-base sm:text-xl">
              <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0">2</span>
              <h2 className="leading-snug">How We Use Your Information</h2>
            </div>
            <p className="text-slate-600">
              We process your data strictly to fulfill orders and improve service reliability:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Facilitating instant order processing, inventory booking, and hyperlocal dispatch.</li>
              <li>Sending live delivery updates, estimated arrival notifications, and electronic receipts.</li>
              <li>Handling customer care inquiries, ticket resolution, and processing refunds.</li>
              <li>Detecting fraudulent transactions, coupon exploitation, and unauthorized access attempts.</li>
              <li>Recommending frequently purchased grocery items and personalized discounts (which can be opted out anytime).</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 sm:gap-2.5 text-slate-900 font-extrabold text-base sm:text-xl">
              <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0">3</span>
              <h2 className="leading-snug">Data Protection & Security</h2>
            </div>
            <p className="text-slate-600">
              We employ bank-grade security protocols, including industry-standard SSL/TLS encryption for all data in transit. Access to personal consumer data is restricted exclusively to authorized operational personnel who need the information to assemble or dispatch orders.
            </p>
            <div className="bg-emerald-50/70 border border-emerald-100/90 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-start gap-2.5 sm:gap-3">
              <Lock size={18} className="text-emerald-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                <strong>We Never Sell Your Data:</strong> FreshMart does not rent, sell, or trade your personal contact details or order history to third-party marketing brokers under any circumstances.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 sm:gap-2.5 text-slate-900 font-extrabold text-base sm:text-xl">
              <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0">4</span>
              <h2 className="leading-snug">Data Retention & Your Rights</h2>
            </div>
            <p className="text-slate-600">
              You retain full control over your profile and account information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Access & Modification:</strong> You can view and edit your profile details and saved addresses via your Account Profile.</li>
              <li><strong>Account Deletion:</strong> You may request complete erasure of your account and personal identifiers by contacting our customer support desk.</li>
              <li><strong>Retention:</strong> Transaction logs are retained only as required by Indian taxation and e-commerce compliance guidelines.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 sm:gap-2.5 text-slate-900 font-extrabold text-base sm:text-xl">
              <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0">5</span>
              <h2 className="leading-snug">Grievance Officer & Contact Details</h2>
            </div>
            <p className="text-slate-600">
              If you have any questions or grievances regarding our privacy practices or data handling, reach out directly:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
              <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-xl flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider block">Email Support</span>
                  <a href="mailto:aniketkumargupta302@gmail.com" className="text-slate-900 font-bold hover:text-emerald-600 transition text-xs sm:text-sm break-all block">
                    aniketkumargupta302@gmail.com
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-xl flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider block">Toll-Free Helpline</span>
                  <a href="tel:8770191425" className="text-slate-900 font-bold hover:text-emerald-600 transition text-xs sm:text-sm block">
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

export default PrivacyPolicy;
