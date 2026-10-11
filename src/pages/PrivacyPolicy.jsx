import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText, Bell, Phone, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const PrivacyPolicy = () => {
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
          <span className="text-slate-800">Privacy Policy</span>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0F392B] via-[#144737] to-[#0A261D] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-xl shadow-[#0F392B]/10 border border-emerald-900/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wide uppercase mb-3">
              <Shield size={13} className="text-emerald-300" />
              Your Privacy Matters
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Privacy Policy
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Last updated: October 2026. At FreshMart, we respect your privacy and are committed to protecting the personal data you share with us during your quick-commerce shopping journey.
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">1</span>
              <h2>Information We Collect</h2>
            </div>
            <p className="text-slate-600">
              To provide swift 10-minute grocery fulfillment and seamless checkout, we collect essential personal and operational information:
            </p>
            <ul className="space-y-2 pt-1">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Account Information:</strong> Name, mobile phone number, email address, and authentication credentials.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Delivery Addresses:</strong> Street address, apartment/flat numbers, landmarks, and GPS geolocation coordinates to dispatch delivery partners accurately.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Transactional Data:</strong> Ordered items, purchase history, order timestamps, and preferred payment methods (we do not store full card details or CVV).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Device & Technical Signals:</strong> Device type, OS version, app version, IP address, and network telemetry for fraud prevention and performance optimization.</span>
              </li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">2</span>
              <h2>How We Use Your Information</h2>
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
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">3</span>
              <h2>Data Protection & Security</h2>
            </div>
            <p className="text-slate-600">
              We employ bank-grade security protocols, including industry-standard SSL/TLS encryption for all data in transit. Access to personal consumer data is restricted exclusively to authorized operational personnel who need the information to assemble or dispatch orders.
            </p>
            <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3">
              <Lock size={20} className="text-emerald-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-emerald-900 font-medium">
                <strong>We Never Sell Your Data:</strong> FreshMart does not rent, sell, or trade your personal contact details or order history to third-party marketing brokers under any circumstances.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">4</span>
              <h2>Data Retention & Your Rights</h2>
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
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">5</span>
              <h2>Grievance Officer & Contact Details</h2>
            </div>
            <p className="text-slate-600">
              If you have any questions or grievances regarding our privacy practices or data handling, reach out directly:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                <Mail size={18} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Email Support</span>
                  <a href="mailto:aniketkumargupta302@gmail.com" className="text-slate-900 font-bold hover:text-emerald-600 transition text-sm">
                    aniketkumargupta302@gmail.com
                  </a>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                <Phone size={18} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Toll-Free Helpline</span>
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

export default PrivacyPolicy;
