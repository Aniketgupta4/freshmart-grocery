import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, Trash2, ArrowRight, ShieldCheck, MapPin, Phone, 
  Ticket, Minus, Plus, Receipt, Zap, CheckCircle2, Clock, 
  Sparkles, AlertCircle, ChevronRight, Lock
} from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(100);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [deliveryInstruction, setDeliveryInstruction] = useState('no-contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  
  let user = null; 
  try { user = JSON.parse(localStorage.getItem('user')); } catch(e) {}
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const res = await api.get('/config/delivery');
        setDeliveryCharge(res.data.charge !== undefined ? res.data.charge : 100);
      } catch (e) { setDeliveryCharge(100); }
    };
    fetchDelivery();
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get('/coupons');
        setAvailableCoupons(res.data.filter(c => c.isActive) || []);
      } catch (e) {}
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const saved = JSON.parse(localStorage.getItem(`cart_${(user?.email || 'guest')}`)) || [];
    setCart(saved);
    
    if (user) {
      setAddress(user.address || '');
      setPhone(user.phone || '');
    }
  }, [navigate]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const updateQty = (id, delta) => {
    let newCart = [...cart];
    const item = newCart.find(c => c.product?._id === id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        newCart = newCart.filter(c => c.product?._id !== id);
      }
    }
    setCart(newCart);
    localStorage.setItem(`cart_${(user?.email || 'guest')}`, JSON.stringify(newCart));

    // Recompute coupon if applied
    if (appliedCoupon && newCart.length > 0) {
      const itemTotal = newCart.reduce((acc, c) => acc + ((c.product?.price || 0) * c.quantity), 0);
      setDiscount(Math.floor(itemTotal * (appliedCoupon.discountPercentage / 100)));
    } else if (newCart.length === 0) {
      setDiscount(0);
      setAppliedCoupon(null);
    }
  };

  const removeItem = (id) => {
    const newCart = cart.filter(c => c.product?._id !== id);
    setCart(newCart);
    localStorage.setItem(`cart_${(user?.email || 'guest')}`, JSON.stringify(newCart));
    if (newCart.length === 0) {
      setDiscount(0);
      setAppliedCoupon(null);
    }
    showToast('Item removed from cart', 'info');
  };

  const applyCoupon = (codeToApply = couponCode) => {
    if (!codeToApply.trim()) return;
    const coupon = availableCoupons.find(c => c.code.toUpperCase() === codeToApply.trim().toUpperCase());
    if (coupon) {
      const itemTotal = cart.reduce((acc, c) => acc + ((c.product?.price || 0) * c.quantity), 0);
      const calculatedDiscount = Math.floor(itemTotal * (coupon.discountPercentage / 100));
      setDiscount(calculatedDiscount);
      setAppliedCoupon(coupon);
      setCouponCode(coupon.code);
      showToast(`Coupon applied! Saved ₹${calculatedDiscount}`, 'success');
    } else {
      showToast('Invalid or expired promo code', 'error');
      setDiscount(0);
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    showToast('Promo code removed', 'info');
  };

  const total = cart.reduce((acc, c) => acc + ((c.product?.price || 0) * c.quantity), 0);
  const finalTotal = total > 0 ? Math.max(0, total + deliveryCharge - discount) : 0;

  const placeOrder = async () => {
    if (cart.length === 0) return;
    if (!address.trim() || !phone.trim()) {
      showToast('Please provide delivery address and contact number', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Sync address and phone if updated
      if (address !== user.address || phone !== user.phone) {
        try {
          await api.post(`/auth/update-address`, { email: user?.email, phone, address });
          user.address = address;
          user.phone = phone;
          localStorage.setItem('user', JSON.stringify(user));
        } catch(err) {
          console.log('Failed to update profile silently');
        }
      }

      const orderReq = {
        orderId: "#FC" + Math.floor(Math.random() * 90000 + 10000),
        email: user.email,
        phone: phone,
        items: cart,
        total: finalTotal,
        discount: discount,
        date: new Date().toLocaleString(),
        address: address,
        status: "Pending",
        timestamp: Date.now() 
      };

      await api.post('/orders/place', orderReq);
      localStorage.removeItem(`cart_${user.email}`);
      showToast('Order Placed Successfully! Redirecting...', 'success');
      setTimeout(() => {
        navigate('/profile');
      }, 1200);
    } catch (err) {
      showToast('Failed to place order. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all transform animate-in slide-in-from-top-4 duration-300 ${
          notification.type === 'success' ? 'bg-emerald-600 text-white shadow-emerald-600/25' :
          notification.type === 'error' ? 'bg-rose-600 text-white shadow-rose-600/25' :
          'bg-slate-900 text-white shadow-slate-900/25'
        }`}>
          {notification.type === 'success' && <CheckCircle2 size={18} />}
          {notification.type === 'error' && <AlertCircle size={18} />}
          {notification.type === 'info' && <Sparkles size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Breadcrumb & Header Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-emerald-600">Checkout</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <span>Review Cart & Checkout</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Review your basket, choose delivery preferences, and place your order.</p>
            </div>

            {/* Express Delivery Pill */}
            <div className="inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-200/80 px-4 py-2.5 rounded-2xl text-emerald-800 text-xs sm:text-sm font-bold shadow-sm">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <Zap size={16} className="text-emerald-600" />
              <span>Instant Delivery in <strong>10–15 Minutes</strong></span>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          /* LUXURY EMPTY STATE */
          <div className="text-center py-20 sm:py-28 bg-white rounded-3xl shadow-[0_4px_25px_rgb(0,0,0,0.03)] border border-slate-200/70 flex flex-col items-center px-4">
            <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-tr from-emerald-50 to-teal-50 rounded-3xl flex items-center justify-center mb-6 border border-emerald-100 shadow-inner">
              <ShoppingBag size={56} className="text-emerald-500" strokeWidth={1.75} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Your Cart is Empty</h3>
            <p className="text-slate-500 mb-8 text-base max-w-md">Looks like you haven't added anything yet. Explore our farm fresh fruits, veggies, and daily dairy essentials.</p>
            <Link 
              to="/" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-xl shadow-emerald-600/25 flex items-center gap-2 active:scale-95 group"
            >
              <span>Explore Products</span> 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            
            {/* LEFT COLUMN: Items, Delivery, Instructions, Offers */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              
              {/* 1. CART ITEMS CARD */}
              <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgb(0,0,0,0.03)] border border-slate-200/80 overflow-hidden">
                <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <span>Order Items</span> 
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{cart.length}</span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">Delivered Fresh</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {cart.map((c) => {
                    const itemPrice = c.product?.price || 0;
                    const itemTotal = itemPrice * c.quantity;
                    const imageSrc = c.product?.emoji || c.product?.image;
                    const isEmoji = imageSrc && imageSrc.length <= 4 && !imageSrc.startsWith('http') && !imageSrc.startsWith('data:');

                    return (
                      <div key={c.product?._id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:bg-slate-50/40 transition-colors">
                        
                        {/* Image + Title */}
                        <div className="flex items-center gap-4 flex-grow">
                          <div className="w-20 h-20 sm:w-22 sm:h-22 bg-[#F8FAFC] rounded-2xl flex-shrink-0 flex items-center justify-center p-2.5 border border-slate-200/70 relative">
                            {isEmoji ? (
                              <span className="text-4xl">{imageSrc}</span>
                            ) : (
                              <img 
                                src={imageSrc || 'https://via.placeholder.com/150?text=FreshMart'} 
                                alt={c.product?.name}
                                onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/150?text=FreshMart'; }}
                                className="w-full h-full object-contain"
                              />
                            )}
                            <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded px-1.5 py-0.5 text-[9px] font-black text-emerald-700">
                              ⚡ 10M
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-snug tracking-tight mb-1">
                              {c.product?.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                              <span>{c.product?.unit || '1 pack'}</span>
                              <span>•</span>
                              <span className="text-emerald-700 font-bold">₹{itemPrice} each</span>
                            </div>
                          </div>
                        </div>

                        {/* Controls + Price */}
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:gap-8 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                          {/* Modern Quantity Pill */}
                          <div className="flex items-center gap-1.5 bg-emerald-50/70 border border-emerald-200 rounded-xl p-1 shadow-sm">
                            <button 
                              onClick={() => updateQty(c.product?._id, -1)} 
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                              title="Decrease quantity"
                            >
                              <Minus size={14} strokeWidth={2.5} />
                            </button>
                            <span className="w-8 text-center font-black text-emerald-900 text-sm">{c.quantity}</span>
                            <button 
                              onClick={() => updateQty(c.product?._id, 1)} 
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm active:scale-90"
                              title="Increase quantity"
                            >
                              <Plus size={14} strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Item Subtotal */}
                          <div className="text-right min-w-[70px]">
                            <span className="block font-black text-slate-900 text-lg">₹{itemTotal}</span>
                          </div>

                          {/* Trash Button */}
                          <button 
                            onClick={() => removeItem(c.product?._id)} 
                            className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors"
                            title="Remove from cart"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. DELIVERY ADDRESS & PHONE CARD */}
              <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgb(0,0,0,0.03)] border border-slate-200/80 p-6 sm:p-7">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <MapPin size={22} className="text-emerald-600" />
                    <span>Delivery Address & Contact</span>
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-full">
                    Home / Office
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Complete Street Address
                    </label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-3.5 text-slate-400" />
                      <textarea 
                        rows="3"
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-slate-900 font-medium placeholder-slate-400 outline-none resize-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                        placeholder="House / Flat No., Landmark, Street, City..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Receiver's Mobile Number
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="tel"
                          placeholder="10-digit mobile number"
                          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3 flex items-center gap-3">
                      <Clock size={18} className="text-emerald-600 flex-shrink-0" />
                      <p className="text-xs text-emerald-800 font-semibold leading-relaxed">
                        Delivery partner arrives in <strong>10–15 mins</strong> once the order is placed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Instructions Chips */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Delivery Instructions
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { id: 'no-contact', label: '🤝 Contactless Delivery' },
                      { id: 'doorstep', label: '🚪 Leave at Doorstep' },
                      { id: 'no-bell', label: '🔕 Do Not Ring Bell' },
                      { id: 'call', label: '📞 Call Before Arriving' }
                    ].map(inst => (
                      <button
                        key={inst.id}
                        type="button"
                        onClick={() => setDeliveryInstruction(inst.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                          deliveryInstruction === inst.id 
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {inst.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. PROMO CODE & COUPONS CARD */}
              <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgb(0,0,0,0.03)] border border-slate-200/80 p-6 sm:p-7">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <Ticket size={22} className="text-emerald-600" />
                    <span>Coupons & Bank Offers</span>
                  </h3>
                  {appliedCoupon && (
                    <button 
                      onClick={removeCoupon} 
                      className="text-xs text-rose-600 font-bold hover:underline"
                    >
                      Remove Code
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <input 
                    type="text" 
                    placeholder="ENTER COUPON CODE" 
                    className="flex-grow bg-[#F8FAFC] border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-black text-slate-900 placeholder-slate-400 transition-all uppercase tracking-wider"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button 
                    onClick={() => applyCoupon()} 
                    className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-md"
                  >
                    Apply Coupon
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-emerald-800">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      <span className="text-xs font-bold">
                        Code <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.discountPercentage}% OFF)
                      </span>
                    </div>
                    <span className="font-black text-emerald-700 text-sm">- ₹{discount}</span>
                  </div>
                )}

                {/* Available Offers Chips */}
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Available Offers
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {availableCoupons.length === 0 ? (
                      <span className="text-xs text-slate-400">No promo coupons available at this time.</span>
                    ) : (
                      availableCoupons.map(c => (
                        <div 
                          key={c._id}
                          onClick={() => applyCoupon(c.code)}
                          className={`cursor-pointer px-4 py-2.5 rounded-xl border transition-all text-xs flex items-center gap-2.5 ${
                            appliedCoupon?.code === c.code 
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-[#F8FAFC] border-slate-200 hover:border-emerald-500 text-slate-800'
                          }`}
                        >
                          <span className="font-black tracking-wider">{c.code}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            appliedCoupon?.code === c.code ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {c.discountPercentage}% OFF
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Bill Details & Sticky Place Order */}
            <div className="w-full lg:w-1/3 lg:sticky lg:top-8">
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 p-6 sm:p-7 flex flex-col gap-5">
                
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Receipt size={22} className="text-emerald-600" />
                  <span>Bill Details</span>
                </h3>

                <div className="flex flex-col gap-3.5 text-sm text-slate-600 pb-5 border-b border-dashed border-slate-200">
                  <div className="flex justify-between items-center font-medium">
                    <span>Items Total ({cart.length} items)</span>
                    <span className="font-bold text-slate-900">₹{total}</span>
                  </div>

                  <div className="flex justify-between items-center font-medium">
                    <span className="flex items-center gap-1.5">
                      <span>Delivery Partner Fee</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">Standard</span>
                    </span>
                    <span className="font-bold text-slate-900">₹{deliveryCharge}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
                      <span>Promo Discount</span>
                      <span>− ₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Govt. Taxes & Packing</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                </div>

                {/* Savings Banner */}
                {discount > 0 && (
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={16} /> Total Savings
                    </span>
                    <span>₹{discount} saved on this order</span>
                  </div>
                )}

                {/* Grand Total */}
                <div className="flex justify-between items-baseline pt-1">
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">To Pay</span>
                    <span className="font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">₹{finalTotal}</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Cash on Delivery
                  </span>
                </div>

                {/* Primary Place Order CTA */}
                <button 
                  onClick={placeOrder} 
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white py-4.5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  <Lock size={18} />
                  <span>{isSubmitting ? 'Placing Order...' : `Place Order • ₹${finalTotal}`}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-slate-500 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>Safe & Secure Contactless Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>Guaranteed Fresh or 100% Refund</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;