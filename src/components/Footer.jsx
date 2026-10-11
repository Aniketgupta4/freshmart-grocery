import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Zap, ShieldCheck, HeartHandshake, Award, Smartphone, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white text-slate-600 pt-12 pb-8 mt-auto font-sans border-t border-gray-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* 1. Trust Value Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 pb-10 border-b border-gray-100">
          
          <div className="bg-slate-50 border border-slate-100 p-4 sm:p-5 rounded-2xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Zap size={22} />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm">10-Min Fast Delivery</h4>
              <p className="text-slate-400 text-xs mt-0.5">Instant hyperlocal fulfillment</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 sm:p-5 rounded-2xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Award size={22} />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm">Farm Fresh Produce</h4>
              <p className="text-slate-400 text-xs mt-0.5">Sourced daily from certified growers</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 sm:p-5 rounded-2xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm">Hassle-Free Returns</h4>
              <p className="text-slate-400 text-xs mt-0.5">Instant replacement or refund</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 sm:p-5 rounded-2xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <HeartHandshake size={22} />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm">24/7 Helpline Support</h4>
              <p className="text-slate-400 text-xs mt-0.5">Always ready to resolve issues</p>
            </div>
          </div>

        </div>

        {/* 2. Directory Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-10 text-left">
          
          {/* Brand Info & App Download (Col 1-4) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2.5 text-slate-900 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Package strokeWidth={2.4} size={22} />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Fresh<span className="text-emerald-600">Mart</span>
              </span>
            </Link>
            
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
              Your neighborhood quick-commerce destination for daily essentials, organic fruits, vegetables, and pantry staples delivered in 10 minutes.
            </p>

            {/* App Promotion Pill */}
            <div className="bg-emerald-50 border border-emerald-200/80 p-3 rounded-2xl flex items-center gap-3 w-full max-w-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <Smartphone size={18} />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-900">Download FreshMart App</p>
                <p className="text-[11px] text-emerald-700 font-semibold">1-Click Android APK Install</p>
              </div>
              <a 
                href="/FreshMart-FinalApp.apk" 
                download
                className="ml-auto p-2 bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-200 rounded-xl transition shadow-sm"
                title="Download APK"
              >
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          {/* Aisles (Col 5-7) */}
          <div className="lg:col-span-3">
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs sm:text-sm uppercase tracking-wider">
              Popular Aisles
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-500 font-medium">
              <li><Link to="/?search=Vegetables" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition">Fresh Vegetables & Greens</Link></li>
              <li><Link to="/?search=Fruits" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition">Farm Fresh Fruits</Link></li>
              <li><Link to="/?search=Dairy" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition">Dairy, Bread & Eggs</Link></li>
              <li><Link to="/?search=Snacks" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition">Snacks & Munchies</Link></li>
              <li><Link to="/?search=Drinks" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition">Juices & Cold Drinks</Link></li>
            </ul>
          </div>

          {/* Quick Links (Col 8-9) */}
          <div className="lg:col-span-2">
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs sm:text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-500 font-medium">
              <li><Link to="/" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition">Home</Link></li>
              <li><Link to="/cart" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition">Shopping Cart</Link></li>
              <li><Link to="/profile" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition">My Account</Link></li>
              <li><Link to="/support" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition">Customer Care</Link></li>
              <li><Link to="/login" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact Details (Col 10-12) */}
          <div className="lg:col-span-3">
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs sm:text-sm uppercase tracking-wider">
              Contact Desk
            </h3>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm text-slate-500 font-medium">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Phone size={15} />
                </div>
                <div>
                  <a href="tel:8770191425" className="text-slate-900 font-bold hover:text-emerald-600 transition">
                    +91 8770191425
                  </a>
                  <p className="text-[10px] text-slate-400">Toll-free 24/7 Helpline</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Mail size={15} />
                </div>
                <div>
                  <a href="mailto:aniketkumargupta302@gmail.com" className="hover:text-slate-900 transition break-all">
                    aniketkumargupta302@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={15} />
                </div>
                <span className="leading-snug">
                  Baniyan Tola, Burhar, Shahdol, MP 484110
                </span>
              </li>
            </ul>
          </div>

        </div>
        
        {/* 3. Bottom Legal Bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-slate-400">
          <p className="font-medium">
            © 2026 FreshMart India. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-semibold">

            <span className="hover:text-slate-600 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 transition cursor-pointer">Terms of Use</span>
            <span className="hover:text-slate-600 transition cursor-pointer">FSSAI Certified</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;