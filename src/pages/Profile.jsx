import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Package, MapPin, Clock, Star, Phone, ChevronRight, 
  X, Edit2, LogOut, CheckCircle2, ShieldCheck, Zap, 
  Receipt, ArrowUpRight, HeadphonesIcon, Printer, ShoppingBag
} from 'lucide-react';

const OrderTimer = ({ order }) => {
  const [remaining, setRemaining] = useState(
    order.estimatedDeliveryTime ? Math.max(0, Math.floor((order.estimatedDeliveryTime - Date.now()) / 60000)) : 0
  );

  useEffect(() => {
    if (!order.estimatedDeliveryTime) return;
    const interval = setInterval(() => {
      const mins = Math.max(0, Math.floor((order.estimatedDeliveryTime - Date.now()) / 60000));
      setRemaining(mins);
    }, 30000);
    return () => clearInterval(interval);
  }, [order.estimatedDeliveryTime]);

  if (order.status === 'Accepted') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
        <Clock size={13} className="text-emerald-600 animate-spin" />
        <span>{remaining > 0 ? `Arriving in ~${remaining} mins` : 'Arriving any moment!'}</span>
      </div>
    );
  }
  return null;
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'address'
  const [isEditing, setIsEditing] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [showBill, setShowBill] = useState(null);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    let u = null;
    try {
      u = JSON.parse(localStorage.getItem('user'));
    } catch (e) {}
    if (!u) {
      navigate('/login');
      return;
    }
    setUser(u);
    setEditPhone(u.phone || '');
    setEditAddress(u.address || '');
    fetchOrders(u.email);
  }, [navigate]);

  const fetchOrders = async (email) => {
    try {
      const res = await api.get(`/orders/user/${email || 'guest'}`);
      setOrders(res.data.orders || (Array.isArray(res.data) ? res.data : []));
    } catch (e) {}
  };

  const saveProfile = async () => {
    try {
      const res = await api.post(`/auth/update-address`, { email: user?.email, phone: editPhone, address: editAddress }).catch(() => {});
      const newUser = res?.data?.user || { ...user, phone: editPhone, address: editAddress };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsEditing(false);
      showToast('Profile and delivery details updated successfully!', 'success');
    } catch (e) {
      showToast('Failed to update profile details', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const submitRating = async (orderId, rating) => {
    try {
      await api.post('/orders/rate', { orderId, rating });
      fetchOrders(user?.email);
      showToast('Thank you for rating your delivery!', 'success');
    } catch (e) {
      showToast('Failed to submit rating', 'error');
    }
  };

  const handleViewBill = async (order) => {
    try {
      await api.post('/orders/view-bill', { orderId: order.orderId });
      setShowBill(order);
      fetchOrders(user?.email);
    } catch(e) {
      setShowBill(order);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Accepted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (!user) return null;

  const totalOrdersCount = orders?.length || 0;
  const deliveredCount = orders?.filter(o => o.status === 'Delivered').length || 0;
  const activeOrders = orders?.filter(o => o.status === 'Accepted' || o.status === 'Pending') || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all transform animate-in slide-in-from-top-4 duration-300 ${
          notification.type === 'success' ? 'bg-emerald-600 text-white shadow-emerald-600/25' :
          'bg-slate-900 text-white shadow-slate-900/25'
        }`}>
          <CheckCircle2 size={18} />
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        
        {/* ACTIVE LIVE ORDER HERO CARD */}
        {(() => {
          const activeOrder = orders?.find(o => o.status === 'Accepted' && o.estimatedDeliveryTime);
          if (!activeOrder) return null;
          const remaining = Math.max(0, Math.floor((activeOrder.estimatedDeliveryTime - Date.now()) / 60000));
          return (
            <div className="mb-8 bg-gradient-to-r from-[#0F392B] to-[#1B5E20] rounded-3xl p-6 sm:p-7 shadow-xl shadow-emerald-950/10 text-white border border-emerald-500/20 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="w-14 h-14 bg-emerald-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl border border-emerald-400/20 shadow-inner">
                    🛵
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-md">
                        LIVE TRACKING • ORDER {activeOrder.orderId}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                      {remaining > 0 ? `Arriving in ${remaining} minutes` : 'Arriving any moment now!'}
                    </h3>
                    <p className="text-emerald-200/90 text-xs sm:text-sm font-medium mt-0.5">
                      Delivering to: {activeOrder.address || user?.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleViewBill(activeOrder)}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors border border-white/10"
                  >
                    View Items
                  </button>
                  <div className="bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black shadow-lg">
                    ⚡ 10 Min Express
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgb(0,0,0,0.03)] border border-slate-200/80 p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 sm:w-22 sm:h-22 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-3xl flex items-center justify-center text-white font-black text-3xl sm:text-4xl shadow-lg shadow-emerald-600/20">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {user?.name}
                  </h1>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-600" /> VERIFIED
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium mt-0.5">{user?.email}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 font-semibold">
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-emerald-600" />
                    {user?.phone || 'Add phone number'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-emerald-600" />
                    {user?.address ? (user.address.length > 25 ? user.address.slice(0, 25) + '...' : user.address) : 'Add address'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between sm:justify-start">
              <div className="bg-[#F8FAFC] border border-slate-200/70 px-4 py-3 rounded-2xl text-center min-w-[90px]">
                <span className="block text-xl font-black text-slate-900">{totalOrdersCount}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-2xl text-center min-w-[90px]">
                <span className="block text-xl font-black text-emerald-700">{deliveredCount}</span>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Delivered</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-2xl text-center min-w-[90px]">
                <span className="block text-xl font-black text-amber-700">{activeOrders.length}</span>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Active</span>
              </div>
            </div>

          </div>
        </div>

        {/* MAIN BODY GRID */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT NAV PANEL */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgb(0,0,0,0.03)] border border-slate-200/80 p-3 lg:sticky lg:top-8 flex flex-col gap-1.5">
              <button 
                onClick={() => { setActiveTab('orders'); setIsEditing(false); }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === 'orders' && !isEditing
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package size={18} />
                  <span>Order History</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === 'orders' && !isEditing ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {totalOrdersCount}
                </span>
              </button>

              <button 
                onClick={() => setIsEditing(true)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl font-bold text-sm transition-all ${
                  isEditing
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Edit2 size={18} />
                  <span>Edit Profile & Address</span>
                </div>
                <ChevronRight size={16} />
              </button>

              <Link 
                to="/support"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <HeadphonesIcon size={18} />
                  <span>Help & Support</span>
                </div>
                <ArrowUpRight size={16} className="text-slate-400" />
              </Link>

              <div className="pt-2 mt-2 border-t border-slate-100">
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-3 text-rose-600 font-bold hover:bg-rose-50 p-3.5 rounded-2xl text-sm transition-colors"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN CONTENT */}
          <main className="w-full lg:w-3/4 space-y-6">
            
            {/* EDIT PROFILE DRAWER / CARD */}
            {isEditing && (
              <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-[0_4px_25px_rgb(0,0,0,0.03)] border border-slate-200/80 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-xl text-slate-900 tracking-tight">Edit Profile & Delivery Details</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Changes will sync across both website and app.</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Contact Mobile Number
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="tel" 
                        value={editPhone} 
                        onChange={(e) => setEditPhone(e.target.value)} 
                        placeholder="Enter 10-digit mobile number"
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Primary Delivery Address
                    </label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-4 text-slate-400" />
                      <textarea 
                        rows="3"
                        value={editAddress} 
                        onChange={(e) => setEditAddress(e.target.value)} 
                        placeholder="House / Flat No., Colony, City, Pin Code"
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm resize-none" 
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveProfile} 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* ORDER HISTORY LIST */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Recent Orders & Invoices</span>
                </h2>
                <span className="text-xs text-slate-400 font-semibold">Showing latest orders</span>
              </div>

              {(!orders || orders.length === 0) ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-[0_4px_25px_rgb(0,0,0,0.03)] text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-3xl">
                    📦
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">No Orders Yet</h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-sm">When you order groceries, vegetables or dairy, your items and e-invoices will appear here.</p>
                  <Link 
                    to="/" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o, i) => (
                    <div 
                      key={o.orderId || o._id || i} 
                      className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-md transition-shadow"
                    >
                      
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-4 border-b border-slate-100 gap-3 sm:gap-0">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-black text-lg text-slate-900 tracking-tight">
                              Order #{o.orderId || o._id}
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${getStatusBadge(o.status)}`}>
                              {o.status}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-400 mt-1">{o.date}</p>
                        </div>

                        <OrderTimer order={o} />
                      </div>
                      
                      {/* Items Preview */}
                      <div className="space-y-2.5 mb-5">
                        {o.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                                {item.quantity || item.qty}x
                              </span>
                              <span className="text-slate-800 font-semibold">{item.name || item.product?.name}</span>
                            </div>
                            <span className="text-slate-500 font-bold text-xs">
                              ₹{(item.price || item.product?.price || 0) * (item.quantity || item.qty || 1)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total & Action Row */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-slate-100 gap-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Paid:</span>
                          <span className="font-black text-xl text-slate-900">₹{o.total}</span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          {/* Rating if delivered */}
                          {o.status === 'Delivered' && (
                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                              <span className="text-xs font-bold text-slate-600">{o.rating ? 'Rated:' : 'Rate:'}</span>
                              <div className="flex gap-1 text-amber-400">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star 
                                    key={star} 
                                    size={16} 
                                    fill={star <= (o.rating || 0) ? "currentColor" : "none"} 
                                    className={`${!o.rating ? "cursor-pointer hover:scale-125 transition-transform" : ""}`}
                                    onClick={() => !o.rating && submitRating(o.orderId || o._id, star)}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* View E-Bill Button */}
                          <button 
                            onClick={() => handleViewBill(o)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                          >
                            <Receipt size={14} />
                            <span>View E-Invoice</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* ENTERPRISE E-BILL MODAL */}
        {showBill && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
              
              {/* Invoice Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                    FM
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 leading-tight">FreshMart Tax Invoice</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quick Commerce Pvt. Ltd.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowBill(null)} 
                  className="text-slate-400 hover:text-slate-600 p-2 bg-white rounded-full shadow-sm border border-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Invoice Body */}
              <div className="p-6 sm:p-7 overflow-y-auto">
                <div className="flex justify-between items-start mb-6 text-xs">
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Invoice To</p>
                    <p className="font-extrabold text-slate-900 text-sm">{user?.name}</p>
                    <p className="text-slate-600 mt-0.5">{showBill.address || user?.address}</p>
                    <p className="text-slate-600">{showBill.phone || user?.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Invoice Details</p>
                    <p className="font-extrabold text-slate-900 text-sm">#{showBill.orderId || showBill._id}</p>
                    <p className="text-slate-500 mt-0.5">{showBill.date}</p>
                    <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      {showBill.status}
                    </span>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-6">
                  <div className="bg-slate-50 rounded-xl p-3 text-xs font-bold text-slate-500 uppercase tracking-wider grid grid-cols-12 mb-2">
                    <span className="col-span-7">Item Description</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-3 text-right">Amount</span>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    {showBill.items?.map((item, idx) => {
                      const itemUnitPrice = item.price || item.product?.price || 0;
                      const itemQuantity = item.quantity || item.qty || 1;
                      return (
                        <div key={idx} className="py-2.5 grid grid-cols-12 items-center">
                          <span className="col-span-7 font-bold text-slate-800">{item.name || item.product?.name}</span>
                          <span className="col-span-2 text-center text-slate-500 font-semibold">{itemQuantity}</span>
                          <span className="col-span-3 text-right font-extrabold text-slate-900">
                            ₹{itemUnitPrice * itemQuantity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Calculation Summary */}
                <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">₹{showBill.total + (showBill.discount || 0)}</span>
                  </div>
                  {showBill.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Promo Discount</span>
                      <span>− ₹{showBill.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery & Convenience</span>
                    <span className="font-bold text-emerald-700">INCLUDED</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm">
                    <span className="font-black text-slate-900">Grand Total</span>
                    <span className="font-black text-2xl text-emerald-700">₹{showBill.total}</span>
                  </div>
                </div>
              </div>

              {/* Invoice Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                <button 
                  onClick={() => window.print()}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Printer size={15} />
                  <span>Print Receipt</span>
                </button>
                <button 
                  onClick={() => setShowBill(null)} 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;