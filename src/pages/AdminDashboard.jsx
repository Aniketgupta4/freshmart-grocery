import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingBag, LayoutDashboard, Settings, Truck, 
  HeadphonesIcon, Tag, Ticket, Box, Trash2, Edit2, CheckCircle2, 
  XCircle, Clock, ChevronLeft, ChevronRight, RefreshCw, Image as ImageIcon, Upload,
  DollarSign, TrendingUp, Sparkles, AlertCircle, Search, Filter, Phone, Check, ArrowRight,
  Users, UserCheck, UserX, ShieldAlert, Ban, AlertTriangle, ShieldCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(100);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('');
  const [newProd, setNewProd] = useState({ name: '', price: '', category: '', emoji: '', unit: '' });
  const [searchProd, setSearchProd] = useState('');
  const [orderFilter, setOrderFilter] = useState('ALL'); // ALL, Pending, Accepted, Delivered
  const [filter, setFilter] = useState('All Time');
  const [selectedTime, setSelectedTime] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [supportTickets, setSupportTickets] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [resolvingId, setResolvingId] = useState(null);

  // Customer Management & Moderation States
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('ALL'); // ALL, ACTIVE, SUSPENDED, HIGH_CANCEL
  const [blockingModalUser, setBlockingModalUser] = useState(null);
  const [blockDurationDays, setBlockDurationDays] = useState('7');
  const [blockReasonText, setBlockReasonText] = useState('Excessive order cancellations / return policy abuse');
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);
  
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch (e) {
    user = null;
  }
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.email !== 'admin@freshmart.com') {
      navigate('/');
      return;
    }
    fetchAdminData();
    fetchCategories();
    fetchDeliveryCharge();
    fetchProducts();
    fetchCoupons();
    fetchSupportTickets();
    fetchUsersList();
  }, [navigate]);

  const fetchUsersList = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/users');
      setUsersList(res.data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleOpenBlockModal = (targetUser) => {
    setBlockingModalUser(targetUser);
    setBlockDurationDays('7');
    setBlockReasonText('Excessive order cancellations / return policy abuse');
  };

  const handleConfirmBlock = async () => {
    if (!blockingModalUser) return;
    setIsSubmittingBlock(true);
    try {
      const days = blockDurationDays === 'permanent' ? 0 : Number(blockDurationDays);
      await api.post('/users/block', {
        email: blockingModalUser.email,
        days: days,
        reason: blockReasonText.trim()
      });
      alert(`User ${blockingModalUser.email} account has been suspended.`);
      setBlockingModalUser(null);
      fetchUsersList();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to suspend user.');
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  const handleUnblockUser = async (targetUser) => {
    if (!window.confirm(`Lift suspension and restore account access for ${targetUser.name || targetUser.email}?`)) return;
    try {
      await api.post('/users/unblock', { email: targetUser.email });
      alert(`User ${targetUser.email} has been unblocked successfully!`);
      fetchUsersList();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to unblock user.');
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await api.get('/orders/all?page=1&limit=10000');
      setOrders(Array.isArray(res.data) ? res.data : (res.data.orders || []));
    } catch (e) { console.error(e); }
    setLoading(false);
    setIsRefreshing(false);
  };

  const fetchSupportTickets = async () => {
    try {
      const res = await api.get('/support');
      setSupportTickets(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); }
  };

  const handleResolveTicket = async (ticketId) => {
    const reply = replyTexts[ticketId];
    if (!reply || !reply.trim()) return alert('Please write a reply before resolving.');
    try {
      setResolvingId(ticketId);
      await api.put(`/support/${ticketId}`, { reply: reply.trim() });
      setReplyTexts(prev => ({ ...prev, [ticketId]: '' }));
      fetchSupportTickets();
    } catch (e) { alert('Failed to resolve ticket.'); } 
    finally { setResolvingId(null); }
  };

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data || []);
    } catch (e) {}
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=1000');
      setProducts(res.data.products || []);
    } catch (e) {}
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (e) {}
  };

  const fetchDeliveryCharge = async () => {
    try {
      const res = await api.get('/config/delivery');
      setDeliveryCharge(res.data.charge || 100);
    } catch (e) { setDeliveryCharge(100); }
  };

  const updateOrderStatus = async (orderId, newStatus, estimatedDeliveryTime = null) => {
    try {
      await api.post(`/orders/update-status`, { orderId, status: newStatus, estimatedDeliveryTime });
      fetchAdminData();
    } catch (e) { alert("Failed to update status"); }
  };

  const handleAddCategory = async () => {
    if (!newCatName || !newCatEmoji) return alert("Please fill both name and image/emoji fields");
    try {
      await api.post('/categories', { name: newCatName.trim(), emoji: newCatEmoji.trim() });
      setNewCatName('');
      setNewCatEmoji('');
      fetchCategories();
    } catch (e) { alert("Failed to add category"); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (e) { alert("Failed to delete category"); }
  };

  const handleAddProduct = async () => {
    if (!newProd.name || !newProd.price || !newProd.category || !newProd.emoji || !newProd.unit) {
      return alert("Please fill in all product fields");
    }
    try {
      await api.post('/products/add', { ...newProd, price: Number(newProd.price), isAvailable: true });
      setNewProd({ name: '', price: '', category: '', emoji: '', unit: '' });
      fetchProducts();
    } catch (e) { alert("Failed to add product"); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product from catalog?")) return;
    try {
      await api.delete(`/products/delete/${id}`);
      fetchProducts();
    } catch (e) { alert("Failed to delete product"); }
  };

  const handleToggleVisibility = async (id, currentStatus) => {
    try {
      await api.post(`/products/toggle/${id}`);
      fetchProducts();
    } catch (e) { alert("Failed to update visibility"); }
  };

  const handleEditPrice = async (id, currentPrice) => {
    const newPrice = window.prompt("Enter new price in ₹:", currentPrice);
    if (!newPrice || isNaN(newPrice)) return;
    try {
      await api.put(`/products/update/${id}`, { price: Number(newPrice) });
      fetchProducts();
    } catch (e) { alert("Failed to update price"); }
  };

  const handleAddCoupon = async () => {
    if (!newCouponCode || !newCouponDiscount) return alert("Please enter both code and discount percentage");
    try {
      await api.post('/coupons', { code: newCouponCode.toUpperCase().trim(), discountPercentage: Number(newCouponDiscount) });
      setNewCouponCode('');
      setNewCouponDiscount('');
      fetchCoupons();
    } catch (e) { alert("Failed to add coupon"); }
  };

  const handleDeleteCoupon = async (id) => {
    if(!window.confirm("Revoke and delete this promotion?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (e) { alert("Failed to delete coupon"); }
  };

  const saveDeliveryCharge = async (charge) => {
    try {
      await api.post('/config/delivery', { charge: Number(charge) });
      setDeliveryCharge(charge);
      alert("Delivery Charge Saved & Broadcasted to Checkout!");
    } catch (e) { alert("Failed to save delivery charge."); }
  };

  // Safe Guard Screen
  if (!user || user.email !== 'admin@freshmart.com') {
    return (
      <div className="flex-grow bg-[#F8FAFC] flex items-center justify-center p-6 min-h-screen font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/80 shadow-2xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-50 text-[#0F392B] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Settings size={38} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Admin Executive Portal</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
            Authenticated administrator access required. Please sign in with <span className="font-bold text-slate-800">admin@freshmart.com</span>.
          </p>
          <button
            onClick={() => {
              localStorage.setItem('user', JSON.stringify({ name: 'FreshMart Admin', email: 'admin@freshmart.com', role: 'admin' }));
              window.location.reload();
            }}
            className="w-full bg-[#0F392B] hover:bg-[#16503c] text-white py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg shadow-[#0F392B]/20 mb-3"
          >
            Authenticate Executive Session
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-3.5 rounded-2xl font-bold text-sm transition-all border border-slate-200"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  // Derived Analytics Data
  const parseOrderTime = (dateStr) => {
    if (!dateStr) return 0;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.getTime();
    const cleaned = String(dateStr).replace(',', '');
    const d2 = new Date(cleaned);
    return isNaN(d2.getTime()) ? 0 : d2.getTime();
  };

  const cal = new Date(selectedTime);
  const filteredOrders = orders
    .filter(it => it.status !== 'Rejected' && it.status !== 'Pending')
    .filter(order => {
      const orderTime = parseOrderTime(order.date || order.createdAt);
      if (!orderTime) return filter === 'All Time';
      const orderCal = new Date(orderTime);

      switch (filter) {
        case 'Daily': return orderCal.toDateString() === cal.toDateString();
        case 'Weekly': return (Date.now() - orderTime) >= 0 && (Date.now() - orderTime) <= 7 * 86400000;
        case 'Monthly': return orderCal.getMonth() === cal.getMonth() && orderCal.getFullYear() === cal.getFullYear();
        case 'Yearly': return orderCal.getFullYear() === cal.getFullYear();
        default: return true;
      }
    });

  const totalRevenue = filteredOrders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const totalOrders = filteredOrders.length;
  const totalProfit = Math.floor(totalRevenue * 0.15);

  const productSales = {};
  filteredOrders.forEach(o => {
    (o.items || []).forEach(item => {
      if (!item) return;
      const name = item.product?.name || item.name || 'Unknown';
      const qty = Number(item.quantity) || Number(item.qty) || 1;
      productSales[name] = (productSales[name] || 0) + qty;
    });
  });

  const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSales = topProducts.length > 0 ? Math.max(...topProducts.map(p => p[1])) : 1;

  const handlePrevDate = () => {
    const d = new Date(selectedTime);
    if (filter === 'Daily') d.setDate(d.getDate() - 1);
    if (filter === 'Monthly') d.setMonth(d.getMonth() - 1);
    if (filter === 'Yearly') d.setFullYear(d.getFullYear() - 1);
    setSelectedTime(d.getTime());
  };

  const handleNextDate = () => {
    const d = new Date(selectedTime);
    if (filter === 'Daily') d.setDate(d.getDate() + 1);
    if (filter === 'Monthly') d.setMonth(d.getMonth() + 1);
    if (filter === 'Yearly') d.setFullYear(d.getFullYear() + 1);
    setSelectedTime(d.getTime());
  };

  const getDateDisplayString = () => {
    const d = new Date(selectedTime);
    if (filter === 'Daily') return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    if (filter === 'Monthly') return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (filter === 'Yearly') return d.getFullYear().toString();
    return '';
  };

  const NavItem = ({ id, icon: Icon, label, badge = null }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all duration-200 w-full whitespace-nowrap snap-start text-sm ${
        activeTab === id 
        ? 'bg-[#0F392B] text-white shadow-md shadow-[#0F392B]/20' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={activeTab === id ? 'text-[#10B981]' : 'text-slate-400'} />
        <span>{label}</span>
      </div>
      {badge !== null && badge > 0 && (
        <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${activeTab === id ? 'bg-[#10B981] text-slate-950' : 'bg-emerald-100 text-emerald-800'}`}>
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="font-sans antialiased bg-[#F8FAFC] min-h-screen flex flex-col md:flex-row selection:bg-emerald-500/20 selection:text-emerald-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white border-b md:border-b-0 md:border-r border-slate-200/80 flex flex-col md:sticky md:top-0 md:h-screen z-20 shadow-sm md:shadow-none flex-shrink-0">
        <div className="p-6 border-b border-slate-100 hidden md:flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0F392B] rounded-2xl flex items-center justify-center text-white shadow-sm">
            <Settings size={22} className="text-[#10B981]" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900">FreshMart HQ</h2>
            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Control Center</p>
          </div>
        </div>
        
        <nav className="flex overflow-x-auto md:flex-col gap-1.5 p-3 md:p-4 flex-grow scrollbar-hide snap-x">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Store Analytics" />
          <NavItem id="orders" icon={Package} label="Order Fulfillment" badge={orders.filter(o => o.status === 'Pending').length} />
          <NavItem id="customers" icon={Users} label="Customers & Safety" badge={usersList.filter(u => u.isBlocked).length} />
          <NavItem id="products" icon={Box} label="Live Inventory" badge={products.length} />
          <NavItem id="categories" icon={Tag} label="Categories" />
          <NavItem id="coupons" icon={Ticket} label="Promo Vouchers" badge={coupons.length} />
          <NavItem id="delivery" icon={Truck} label="Logistics & Delivery" />
          <NavItem id="support" icon={HeadphonesIcon} label="Helpdesk Inbox" badge={supportTickets.filter(t => t.status !== 'Resolved').length} />
        </nav>

        {/* Footer Admin Info */}
        <div className="p-4 border-t border-slate-100 hidden md:block">
          <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0F392B] text-white flex items-center justify-center font-black text-xs">
                A
              </div>
              <div className="leading-tight">
                <p className="text-xs font-black text-slate-800">Administrator</p>
                <p className="text-[10px] text-slate-400">admin@freshmart.com</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="text-[11px] font-bold text-red-600 hover:underline"
            >
              Exit
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 md:p-10 w-full max-w-7xl mx-auto overflow-hidden">
        
        {/* ================= DASHBOARD TAB ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide uppercase mb-1">
                  <Sparkles size={12} className="text-emerald-600" />
                  Live Database Synced
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Enterprise Analytics</h1>
                <p className="text-sm text-slate-500 font-medium">Real-time revenue, orders, inventory performance & profit margins.</p>
              </div>
              <button 
                onClick={fetchAdminData}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 active:scale-95 border border-slate-200 text-slate-800 px-4 py-2.5 rounded-2xl text-xs font-black shadow-sm transition-all"
              >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin text-emerald-600" : "text-slate-400"} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
              </button>
            </header>

            {/* Time Filter Pills */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-1.5 inline-flex overflow-x-auto max-w-full scrollbar-hide">
                {['All Time', 'Daily', 'Weekly', 'Monthly', 'Yearly'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setFilter(tab); setSelectedTime(Date.now()); }}
                    className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                      filter === tab 
                        ? 'bg-[#0F392B] text-white shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Date Navigator (When applicable) */}
              {(filter === 'Daily' || filter === 'Monthly' || filter === 'Yearly') && (
                <div className="flex items-center gap-3 bg-white py-2 px-4 rounded-2xl border border-slate-200 shadow-sm">
                  <button onClick={handlePrevDate} className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition">
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-xs sm:text-sm font-black text-slate-800 min-w-[120px] text-center">
                    {getDateDisplayString()}
                  </span>
                  <button onClick={handleNextDate} className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition">
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#0F392B] text-white p-6 rounded-[2rem] shadow-xl shadow-[#0F392B]/10 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-emerald-300 text-xs font-black uppercase tracking-wider">Gross Sales</span>
                  <DollarSign size={18} className="text-emerald-400" />
                </div>
                <h3 className="text-3xl font-black tracking-tight relative z-10">₹{totalRevenue.toLocaleString()}</h3>
                <p className="text-[11px] text-slate-300 mt-2 font-medium relative z-10">From {totalOrders} fulfilled orders</p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400 text-xs font-black uppercase tracking-wider">Order Volume</span>
                  <ShoppingBag size={18} className="text-slate-400" />
                </div>
                <h3 className="text-3xl font-black text-slate-900">{totalOrders}</h3>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">Delivered & verified checkouts</p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400 text-xs font-black uppercase tracking-wider">Net Profit (15%)</span>
                  <TrendingUp size={18} className="text-emerald-600" />
                </div>
                <h3 className="text-3xl font-black text-emerald-700">₹{totalProfit.toLocaleString()}</h3>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">Estimated gross margin</p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400 text-xs font-black uppercase tracking-wider">Delivery Rate</span>
                  <Truck size={18} className="text-slate-400" />
                </div>
                <h3 className="text-3xl font-black text-slate-900">₹{deliveryCharge}</h3>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">Standard partner fulfillment fee</p>
              </div>
            </div>

            {/* Top Products Analytics */}
            <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Top-Selling Groceries</h2>
                  <p className="text-xs text-slate-400 font-medium">Most demanded inventory items across customer baskets</p>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
                  {topProducts.length} items tracked
                </span>
              </div>

              {topProducts.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-semibold text-sm">
                  No sales recorded for this timeframe.
                </div>
              ) : (
                <div className="space-y-5">
                  {topProducts.map(([name, qty]) => {
                    const ratio = maxSales > 0 ? (qty / maxSales) * 100 : 0;
                    return (
                      <div key={name} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-extrabold text-slate-900">{name}</span>
                          <span className="font-black text-emerald-700">{qty} units sold</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${Math.max(ratio, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= ORDERS TAB ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Order Dispatch & Fulfillment</h1>
                <p className="text-sm text-slate-500 font-medium">Accept, assign estimated dispatch times, or mark orders delivered.</p>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200">
                {['ALL', 'Pending', 'Accepted', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      orderFilter === st ? 'bg-[#0F392B] text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </header>
            
            {orders.length === 0 ? (
               <div className="bg-white p-16 text-center rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center">
                 <Package size={52} className="text-slate-300 mb-3" />
                 <p className="font-bold text-slate-700 text-base">No customer orders in queue</p>
                 <p className="text-xs text-slate-400 mt-1">Orders placed via the app or website will appear here live.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {orders
                  .filter(o => orderFilter === 'ALL' || o.status === orderFilter)
                  .map(order => (
                  <div key={order._id || order.orderId} className="bg-white p-6 rounded-[2rem] border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                    <div className={`absolute top-0 left-0 w-full h-1.5 ${
                      order.status === 'Pending' ? 'bg-amber-400' : 
                      order.status === 'Delivered' ? 'bg-emerald-500' : 
                      order.status === 'Accepted' ? 'bg-blue-500' : 'bg-red-500'
                    }`} />
                    
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-black text-lg text-slate-900 tracking-tight">
                            {(order.orderId || order._id.substring(0,6).toUpperCase()).replace("##", "#")}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-medium">
                            <Clock size={12} /> {order.date || new Date(order.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-[#0F392B]">₹{order.totalAmount || order.total}</span>
                          <div>
                            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                              order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 
                              order.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              ● {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Customer Contact & Address */}
                      <div className="bg-slate-50/80 rounded-2xl p-4 mb-4 border border-slate-100 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 font-bold uppercase">Customer</span>
                          <span className="font-extrabold text-slate-900">{order.phone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 font-bold uppercase">Email</span>
                          <span className="font-medium text-slate-600">{order.email || order.userEmail || order.user?.email || 'N/A'}</span>
                        </div>
                        <div className="border-t border-slate-200/60 pt-2 flex justify-between text-xs">
                          <span className="text-slate-400 font-bold uppercase">Address</span>
                          <span className="font-bold text-slate-800 text-right max-w-[240px] truncate">{order.address || 'N/A'}</span>
                        </div>
                      </div>
                      
                      {/* Items Pill List */}
                      <div className="mb-5">
                        <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Order Basket</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {order.items?.map((i, idx) => (
                             <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                               {i.product?.name || 'Item'} <span className="ml-1.5 text-emerald-700 font-black">×{i.quantity}</span>
                             </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Dispatch Controls */}
                    <div className="pt-3 border-t border-slate-100">
                      {order.status === 'Pending' && (
                        <div>
                          <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Dispatch Timer</p>
                          <div className="grid grid-cols-4 gap-2">
                            <button onClick={() => updateOrderStatus(order.orderId || order._id, 'Accepted', Date.now() + 15 * 60000)} className="bg-[#0F392B] hover:bg-[#16503c] text-white py-2 rounded-xl text-xs font-bold transition shadow-sm">15m</button>
                            <button onClick={() => updateOrderStatus(order.orderId || order._id, 'Accepted', Date.now() + 30 * 60000)} className="bg-[#0F392B] hover:bg-[#16503c] text-white py-2 rounded-xl text-xs font-bold transition shadow-sm">30m</button>
                            <button onClick={() => updateOrderStatus(order.orderId || order._id, 'Accepted', Date.now() + 45 * 60000)} className="bg-[#0F392B] hover:bg-[#16503c] text-white py-2 rounded-xl text-xs font-bold transition shadow-sm">45m</button>
                            <button onClick={() => updateOrderStatus(order.orderId || order._id, 'Rejected')} className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 py-2 rounded-xl text-xs font-bold transition">Reject</button>
                          </div>
                        </div>
                      )}
                      
                      {['Accepted'].includes(order.status) && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-700">🛵 Order In Transit</span>
                          <button
                            onClick={() => updateOrderStatus(order.orderId || order._id, 'Delivered')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm transition"
                          >
                            Mark as Delivered ✓
                          </button>
                        </div>
                      )}

                      {order.status === 'Delivered' && (
                        <div className="text-center text-xs font-bold text-emerald-700 py-1">
                          ✓ Successfully Delivered to Customer
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= CUSTOMERS & MODERATION TAB ================= */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fade-in">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide uppercase mb-1">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  Customer Safety & Fraud Prevention
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Customer Moderation & Analytics</h1>
                <p className="text-sm text-slate-500 font-medium">Track total order activity, cancellation abuse, and manage temporary user suspensions.</p>
              </div>

              <button
                onClick={fetchUsersList}
                disabled={loadingUsers}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 active:scale-95 border border-slate-200 text-slate-800 px-4 py-2.5 rounded-2xl text-xs font-black shadow-xs transition-all"
              >
                <RefreshCw size={14} className={loadingUsers ? "animate-spin text-emerald-600" : "text-slate-400"} />
                <span>{loadingUsers ? 'Refreshing...' : 'Refresh Users'}</span>
              </button>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Users</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{usersList.length}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Users size={24} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Customers</p>
                  <p className="text-2xl font-black text-emerald-700 mt-1">{usersList.filter(u => !u.isBlocked).length}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <UserCheck size={24} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suspended / Blocked</p>
                  <p className="text-2xl font-black text-rose-600 mt-1">{usersList.filter(u => u.isBlocked).length}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <ShieldAlert size={24} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Frequent Cancellers</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">
                    {usersList.filter(u => u.totalOrders > 0 && u.cancelRate >= 25).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <AlertTriangle size={24} />
                </div>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-grow max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by customer name, email or phone..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition text-sm font-medium shadow-xs"
                />
              </div>

              <div className="bg-white p-1 rounded-2xl border border-slate-200 flex items-center gap-1 overflow-x-auto">
                {[
                  { id: 'ALL', label: 'All Users' },
                  { id: 'ACTIVE', label: 'Active Only' },
                  { id: 'SUSPENDED', label: 'Suspended' },
                  { id: 'HIGH_CANCEL', label: 'Frequent Cancellations' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setUserStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      userStatusFilter === tab.id
                        ? 'bg-[#0F392B] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Cards List */}
            {loadingUsers && usersList.length === 0 ? (
              <div className="bg-white p-16 text-center rounded-[2.5rem] border border-slate-200 shadow-xs flex flex-col items-center">
                <RefreshCw size={36} className="animate-spin text-emerald-600 mb-3" />
                <p className="font-bold text-slate-700">Loading customer database...</p>
              </div>
            ) : usersList.length === 0 ? (
              <div className="bg-white p-16 text-center rounded-[2.5rem] border border-slate-200 shadow-xs flex flex-col items-center">
                <Users size={52} className="text-slate-300 mb-3" />
                <p className="font-bold text-slate-700 text-base">No registered customers found</p>
                <p className="text-xs text-slate-400 mt-1">Customers who register on the website or mobile app will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {usersList
                  .filter(u => {
                    const q = userSearch.toLowerCase();
                    const matchesSearch = !q || (u.name && u.name.toLowerCase().includes(q)) || 
                                          (u.email && u.email.toLowerCase().includes(q)) || 
                                          (u.phone && u.phone.includes(q));
                    if (!matchesSearch) return false;

                    if (userStatusFilter === 'ACTIVE') return !u.isBlocked;
                    if (userStatusFilter === 'SUSPENDED') return u.isBlocked;
                    if (userStatusFilter === 'HIGH_CANCEL') return u.totalOrders > 0 && u.cancelRate >= 25;
                    return true;
                  })
                  .map(targetUser => (
                    <div 
                      key={targetUser._id || targetUser.email}
                      className={`bg-white rounded-3xl p-6 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden ${
                        targetUser.isBlocked ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20' : 'border-slate-200/90'
                      }`}
                    >
                      {/* Top Stripe Indicator */}
                      <div className={`absolute top-0 left-0 w-full h-1.5 ${
                        targetUser.isBlocked ? 'bg-rose-500' : 
                        (targetUser.cancelRate >= 35 && targetUser.totalOrders > 1) ? 'bg-amber-400' : 'bg-emerald-500'
                      }`} />

                      <div>
                        {/* Customer Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-xs ${
                              targetUser.isBlocked ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {targetUser.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-black text-slate-900 text-base leading-tight">{targetUser.name}</h3>
                                {targetUser.totalOrders >= 5 && (
                                  <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                                    VIP
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-slate-500 mt-0.5">{targetUser.email}</p>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-1">
                                <span>📱 {targetUser.phone}</span>
                                <span>•</span>
                                <span>Joined {new Date(targetUser.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex flex-col items-end gap-1">
                            {targetUser.isBlocked ? (
                              <>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 rounded-full font-black text-xs">
                                  <Ban size={12} className="text-rose-600" />
                                  Suspended
                                </span>
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                  {targetUser.remainingDays 
                                    ? `⏳ ${targetUser.remainingDays} days remaining` 
                                    : '🔒 Indefinite Restriction'}
                                </span>
                              </>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full font-black text-xs">
                                <CheckCircle2 size={12} className="text-emerald-600" />
                                Active
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Customer Order Activity Dashboard */}
                        <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 my-4 text-center">
                          <div className="p-1.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Placed</p>
                            <p className="text-lg font-black text-slate-800 mt-0.5">{targetUser.totalOrders}</p>
                          </div>
                          <div className="p-1.5 border-l border-slate-200">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase">Delivered</p>
                            <p className="text-lg font-black text-emerald-700 mt-0.5">{targetUser.deliveredOrders}</p>
                          </div>
                          <div className="p-1.5 border-l border-slate-200">
                            <p className="text-[10px] font-bold text-rose-600 uppercase">Cancelled</p>
                            <p className="text-lg font-black text-rose-700 mt-0.5">{targetUser.cancelledOrders}</p>
                          </div>
                          <div className="p-1.5 border-l border-slate-200">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Lifetime ₹</p>
                            <p className="text-lg font-black text-slate-900 mt-0.5">₹{targetUser.totalSpent}</p>
                          </div>
                        </div>

                        {/* Cancellation Rate Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                            <span className="text-slate-600 flex items-center gap-1.5">
                              Cancellation / Return Rate:
                              {targetUser.cancelRate >= 25 && targetUser.totalOrders > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                  <AlertTriangle size={11} /> High Risk
                                </span>
                              )}
                            </span>
                            <span className={`font-black ${
                              targetUser.cancelRate >= 35 ? 'text-rose-600' :
                              targetUser.cancelRate >= 20 ? 'text-amber-600' : 'text-emerald-700'
                            }`}>
                              {targetUser.cancelRate}% ({targetUser.cancelledOrders}/{targetUser.totalOrders})
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                targetUser.cancelRate >= 35 ? 'bg-rose-500' :
                                targetUser.cancelRate >= 20 ? 'bg-amber-400' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, targetUser.cancelRate)}%` }}
                            />
                          </div>
                        </div>

                        {/* Suspension Notice (When Blocked) */}
                        {targetUser.isBlocked && (
                          <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-3.5 mb-4 text-xs space-y-1.5">
                            <div className="flex items-center gap-1.5 font-bold text-rose-900">
                              <ShieldAlert size={14} className="text-rose-600 flex-shrink-0" />
                              <span>Active Suspension Details</span>
                            </div>
                            <p className="text-rose-800 font-medium">
                              <strong>Reason:</strong> {targetUser.blockReason || 'Violation of ordering policy / excessive cancellations'}
                            </p>
                            <p className="text-[11px] text-rose-700 font-semibold">
                              <strong>Expires:</strong> {targetUser.blockedUntil 
                                ? new Date(targetUser.blockedUntil).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                                : 'Permanent Restriction (Until manual unblock)'
                              }
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {targetUser.address ? `📍 ${targetUser.address.substring(0, 30)}...` : '📍 No address saved'}
                        </span>

                        {targetUser.isBlocked ? (
                          <button
                            onClick={() => handleUnblockUser(targetUser)}
                            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5"
                          >
                            <CheckCircle2 size={14} />
                            Lift Suspension & Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenBlockModal(targetUser)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-200 px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 active:scale-95"
                          >
                            <Ban size={14} className="text-rose-600" />
                            Suspend Customer
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ================= PRODUCTS TAB ================= */}
        {activeTab === 'products' && (
          <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Inventory Management</h1>
                <p className="text-sm text-slate-500 font-medium">Add new grocery items, manage live pricing, and stock visibility.</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchProd} 
                  onChange={e => setSearchProd(e.target.value)} 
                  className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition text-sm font-medium shadow-sm" 
                />
              </div>
            </header>
            
            {/* Add Product Card */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200/80">
              <h3 className="font-black text-slate-900 text-lg mb-5 flex items-center gap-2">
                <Box size={20} className="text-emerald-700" />
                Add New Product to Catalog
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <input 
                  type="text" 
                  placeholder="Product Name (e.g. Fresh Avocado)" 
                  value={newProd.name} 
                  onChange={e => setNewProd({...newProd, name: e.target.value})} 
                  className="border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium" 
                />
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input 
                    type="number" 
                    placeholder="Price" 
                    value={newProd.price} 
                    onChange={e => setNewProd({...newProd, price: e.target.value})} 
                    className="w-full border border-slate-200 pl-8 pr-4 py-3 rounded-xl outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium" 
                  />
                </div>
                <select 
                  value={newProd.category} 
                  onChange={e => setNewProd({...newProd, category: e.target.value})} 
                  className="border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 bg-white font-medium text-slate-700 text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Emoji / URL" 
                    value={newProd.emoji} 
                    onChange={e => setNewProd({...newProd, emoji: e.target.value})} 
                    className="border border-slate-200 px-3 py-3 rounded-xl outline-none focus:border-emerald-600 text-sm" 
                  />
                  <input 
                    type="text" 
                    placeholder="Unit (500g, 1L)" 
                    value={newProd.unit} 
                    onChange={e => setNewProd({...newProd, unit: e.target.value})} 
                    className="border border-slate-200 px-3 py-3 rounded-xl outline-none focus:border-emerald-600 text-sm" 
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handleAddProduct} 
                  className="bg-[#0F392B] hover:bg-[#16503c] text-white px-8 py-3 rounded-2xl font-black text-sm shadow-md transition-all active:scale-[0.98]"
                >
                  Publish Product
                </button>
              </div>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
               {products
                 .filter(p => p.name.toLowerCase().includes(searchProd.toLowerCase()))
                 .map(p => (
                 <div key={p._id || p.id} className={`bg-white border ${p.isAvailable !== false ? 'border-slate-200/80 shadow-sm' : 'border-dashed border-slate-300 opacity-60'} rounded-[2rem] p-5 flex flex-col justify-between hover:shadow-md transition-all group`}>
                    <div className="flex items-start gap-4 mb-4">
                      {((p.emoji || p.image) && ((p.emoji || p.image).startsWith('http') || (p.emoji || p.image).startsWith('data:'))) ? (
                        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 shadow-inner">
                          <img src={p.emoji || p.image} alt={p.name} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl shadow-inner">
                          {p.emoji || p.image}
                        </div>
                      )}
                      <div className="flex-1 mt-1">
                        <h4 className="font-extrabold text-slate-900 tracking-tight leading-snug">{p.name}</h4>
                        <div className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider">{p.category} • {p.unit}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="text-xl font-black text-[#0F392B]">₹{p.price}</div>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEditPrice(p.id || p._id, p.price)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition" title="Edit Price">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleToggleVisibility(p.id || p._id, p.isAvailable)} className={`p-2 rounded-xl transition ${p.isAvailable !== false ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`} title="Toggle In-Stock">
                          {p.isAvailable !== false ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id || p._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Delete Product">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* ================= CATEGORIES TAB ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-8 animate-fade-in">
            <header>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Category Catalog</h1>
              <p className="text-sm text-slate-500 font-medium">Manage grocery aisles, high-res iconography, and customer navigation.</p>
            </header>
            
            {/* Create Category */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200/80 max-w-2xl">
               <h3 className="font-black text-slate-900 text-lg mb-4">Create New Category</h3>
               <div className="space-y-4">
                 <input 
                   type="text" 
                   placeholder="Category Name (e.g. Dairy & Breakfast)" 
                   value={newCatName} 
                   onChange={(e) => setNewCatName(e.target.value)} 
                   className="w-full border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium" 
                 />
                 
                 <div>
                   <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-2">
                     Visual Asset (Emoji, Online URL, or File Upload)
                   </label>
                   <div className="flex flex-col sm:flex-row gap-3">
                     <div className="relative flex-1">
                       <input 
                         type="text" 
                         placeholder="Paste URL or Emoji (🥛)" 
                         value={newCatEmoji} 
                         onChange={e => setNewCatEmoji(e.target.value)} 
                         className="w-full border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-sm" 
                       />
                     </div>
                     <label className="flex-shrink-0 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-5 py-3 rounded-xl cursor-pointer transition font-bold border border-slate-200 text-sm">
                       <Upload size={16} />
                       <span>Upload File</span>
                       <input 
                         type="file" 
                         accept="image/*" 
                         className="hidden" 
                         onChange={(e) => {
                           const file = e.target.files[0];
                           if (file) {
                             if (file.size > 2 * 1024 * 1024) return alert("Please select an image smaller than 2MB.");
                             const reader = new FileReader();
                             reader.onloadend = () => setNewCatEmoji(reader.result);
                             reader.readAsDataURL(file);
                           }
                         }}
                       />
                     </label>
                   </div>
                 </div>

                 {newCatEmoji && (
                   <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                     <span className="text-xs font-bold text-slate-400">Preview:</span>
                     {(newCatEmoji.startsWith('http') || newCatEmoji.startsWith('data:')) ? (
                       <img src={newCatEmoji} alt="Preview" className="w-12 h-12 object-contain rounded-lg border bg-white" />
                     ) : (
                       <span className="text-3xl bg-white w-12 h-12 rounded-lg border flex items-center justify-center">{newCatEmoji}</span>
                     )}
                   </div>
                 )}
                 
                 <button onClick={handleAddCategory} className="bg-[#0F392B] hover:bg-[#16503c] text-white px-8 py-3 rounded-2xl font-black text-sm shadow-md transition w-full sm:w-auto">
                   Save Category
                 </button>
               </div>
            </div>

            {/* Existing Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map(c => (
                <div key={c._id} className="bg-white border border-slate-200/80 rounded-[1.8rem] p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all group relative">
                   <button onClick={() => handleDeleteCategory(c._id)} className="absolute top-2.5 right-2.5 p-1.5 bg-white text-slate-300 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm border border-slate-100">
                     <Trash2 size={13} />
                   </button>
                   <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                     {((c.emoji || c.image) && ((c.emoji || c.image).startsWith('http') || (c.emoji || c.image).startsWith('data:'))) ? (
                       <img src={c.emoji || c.image} alt={c.name} className="w-10 h-10 object-contain" />
                     ) : (
                       <span className="text-3xl">{c.emoji || c.image}</span>
                     )}
                   </div>
                   <span className="font-extrabold text-slate-800 text-xs text-center">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PROMOTIONS / COUPONS TAB ================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-8 animate-fade-in">
            <header>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Promotions & Vouchers</h1>
              <p className="text-sm text-slate-500 font-medium">Issue percentage discount codes instantly redeemable at checkout.</p>
            </header>
            
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200/80 max-w-2xl">
               <h3 className="font-black text-slate-900 text-lg mb-4">Generate Campaign Voucher</h3>
               <div className="flex flex-col sm:flex-row gap-3">
                 <input 
                   type="text" 
                   placeholder="VOUCHER (e.g. SAVE20)" 
                   value={newCouponCode} 
                   onChange={(e)=>setNewCouponCode(e.target.value)} 
                   className="flex-1 border border-slate-200 px-4 py-3 rounded-xl font-mono uppercase font-bold text-sm outline-none focus:border-emerald-600" 
                 />
                 <div className="relative sm:w-44">
                   <input 
                     type="number" 
                     placeholder="Discount" 
                     value={newCouponDiscount} 
                     onChange={(e)=>setNewCouponDiscount(e.target.value)} 
                     className="w-full border border-slate-200 pl-4 pr-9 py-3 rounded-xl text-sm font-bold outline-none focus:border-emerald-600" 
                   />
                   <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                 </div>
                 <button onClick={handleAddCoupon} className="bg-[#0F392B] hover:bg-[#16503c] text-white px-7 py-3 rounded-2xl font-black text-sm shadow-md transition whitespace-nowrap">
                   Create
                 </button>
               </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
               {coupons.map((c, i) => (
                 <div key={c._id || i} className="bg-gradient-to-br from-[#0F392B] to-[#16503c] p-6 rounded-[2rem] shadow-lg relative overflow-hidden flex justify-between items-center text-white">
                   <div className="relative z-10">
                     <span className="text-emerald-300 text-[10px] font-black uppercase tracking-widest block mb-1">Active Voucher</span>
                     <h4 className="font-mono text-2xl font-black tracking-widest">{c.code}</h4>
                     <div className="mt-2.5 inline-block bg-white text-emerald-900 px-2.5 py-1 rounded-xl text-xs font-black shadow-sm">
                       {c.discountPercentage}% Instant Discount
                     </div>
                   </div>
                   
                   <button onClick={() => handleDeleteCoupon(c._id)} className="relative z-10 p-2.5 bg-white/10 hover:bg-red-500 text-white rounded-xl transition" title="Revoke Voucher">
                     <Trash2 size={18} />
                   </button>
                 </div>
               ))}
               {coupons.length === 0 && (
                 <div className="col-span-full py-12 text-center text-slate-400 font-bold bg-white rounded-[2rem] border border-dashed border-slate-200">
                   No active promotions. Create your first coupon voucher above.
                 </div>
               )}
            </div>
          </div>
        )}

        {/* ================= LOGISTICS & DELIVERY TAB ================= */}
        {activeTab === 'delivery' && (
          <div className="animate-fade-in flex justify-center py-8">
            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200/80 max-w-lg w-full text-center">
               <div className="w-20 h-20 bg-emerald-50 text-[#0F392B] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                 <Truck size={38} className="text-emerald-600" />
               </div>
               
               <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Logistics Configuration</h2>
               <p className="text-slate-500 text-xs sm:text-sm mb-8 leading-relaxed font-medium">
                 Set the global express delivery rate for 10-minute order fulfillment across the website and mobile apps.
               </p>
               
               <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100 text-left relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1.5 h-full bg-[#10B981]"></div>
                 <label className="font-extrabold text-slate-500 text-xs uppercase tracking-wider mb-2 block pl-2">Base Delivery Fee</label>
                 <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-2xl">₹</span>
                   <input 
                     type="number" 
                     value={deliveryCharge} 
                     onChange={(e) => setDeliveryCharge(e.target.value)} 
                     className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl font-black text-2xl text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 shadow-sm" 
                   />
                 </div>
               </div>
               
               <button onClick={() => saveDeliveryCharge(deliveryCharge)} className="bg-[#0F392B] hover:bg-[#16503c] text-white px-6 py-4 rounded-2xl font-black text-base w-full shadow-lg shadow-[#0F392B]/20 transition-all active:scale-[0.98]">
                 Save Delivery Configuration
               </button>
            </div>
          </div>
        )}
        
        {/* ================= SUPPORT TAB ================= */}
        {activeTab === 'support' && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Priority Helpdesk Inbox</h1>
                <p className="text-sm text-slate-500 font-medium">Review customer inquiries and publish official administrative replies.</p>
              </div>
              <button 
                onClick={fetchSupportTickets}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-4 py-2 rounded-2xl text-xs font-black shadow-sm transition active:scale-95"
              >
                <RefreshCw size={14} className="text-emerald-600" /> Sync Inbox
              </button>
            </header>

            {supportTickets.length === 0 ? (
              <div className="bg-white p-16 text-center rounded-[2.5rem] border border-slate-200 border-dashed shadow-sm">
                <HeadphonesIcon size={40} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-black text-slate-800">Inbox Zero</h3>
                <p className="text-slate-400 text-xs mt-1">All customer support inquiries have been resolved.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket._id} className="bg-white p-6 rounded-[2rem] border border-slate-200/80 shadow-sm relative overflow-hidden">
                    <div className={`absolute left-0 top-0 w-1.5 h-full ${ticket.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">{ticket.subject}</h3>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mt-1">
                          <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">{ticket.email}</span>
                          <span>• {ticket.date}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        ● {ticket.status}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
                      {ticket.message}
                    </div>

                    {ticket.status === 'Resolved' && ticket.reply && (
                      <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-1 text-xs font-black text-emerald-800 uppercase tracking-wide">
                          <CheckCircle2 size={14} className="text-emerald-600"/>
                          Official Support Reply
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 font-medium">{ticket.reply}</p>
                      </div>
                    )}

                    {ticket.status !== 'Resolved' && (
                      <div className="pt-3 border-t border-slate-100">
                        <textarea
                          placeholder="Draft administrative resolution message..."
                          value={replyTexts[ticket._id] || ''}
                          onChange={(e) => setReplyTexts(prev => ({ ...prev, [ticket._id]: e.target.value }))}
                          className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition shadow-sm resize-none h-24 mb-3"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleResolveTicket(ticket._id)}
                            disabled={resolvingId === ticket._id}
                            className="bg-[#0F392B] hover:bg-[#16503c] text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-md transition flex items-center gap-2 disabled:opacity-70"
                          >
                            {resolvingId === ticket._id ? 'Sending...' : 'Send Resolution & Mark Resolved'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= SUSPEND / BLOCK USER MODAL ================= */}
        {blockingModalUser && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <ShieldAlert size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Suspend Customer Account</h3>
                    <p className="text-xs text-slate-500">Prevent user from placing new orders during cooldown</p>
                  </div>
                </div>
                <button 
                  onClick={() => setBlockingModalUser(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Target User Info */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Customer</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">{blockingModalUser.name}</p>
                <p className="text-xs font-semibold text-slate-600">{blockingModalUser.email} • {blockingModalUser.phone}</p>
                <div className="flex items-center gap-3 text-xs mt-2 pt-2 border-t border-slate-200/80">
                  <span className="font-bold text-slate-700">Orders: {blockingModalUser.totalOrders}</span>
                  <span className="font-bold text-rose-600">Cancelled: {blockingModalUser.cancelledOrders}</span>
                  <span className="font-bold text-amber-600">Cancel Rate: {blockingModalUser.cancelRate}%</span>
                </div>
              </div>

              {/* Suspension Duration Selector */}
              <div className="mb-5">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Suspension Duration (Days)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { days: '1', label: '1 Day', sub: '24 Hours Cooldown' },
                    { days: '3', label: '3 Days', sub: 'Short Warning' },
                    { days: '7', label: '7 Days', sub: '1 Week (Recommended)' },
                    { days: '15', label: '15 Days', sub: 'Half Month Penalty' },
                    { days: '30', label: '30 Days', sub: '1 Month Restriction' },
                    { days: 'permanent', label: 'Permanent', sub: 'Until Manual Unblock' }
                  ].map(opt => (
                    <button
                      key={opt.days}
                      type="button"
                      onClick={() => setBlockDurationDays(opt.days)}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        blockDurationDays === opt.days
                          ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className={`text-xs font-black ${blockDurationDays === opt.days ? 'text-rose-700' : 'text-slate-800'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                        {opt.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Suspension Reason */}
              <div className="mb-6">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Suspension Reason (Shown to Customer)
                </label>
                
                {/* Preset Quick Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {[
                    'Excessive order cancellations & refund abuse',
                    'Fake orders & delivery address refusal',
                    'Unreachable phone & invalid coordinates',
                    'Policy violation & suspicious activity'
                  ].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBlockReasonText(preset)}
                      className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                <textarea
                  value={blockReasonText}
                  onChange={e => setBlockReasonText(e.target.value)}
                  placeholder="Specify the reason for this account restriction..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition shadow-xs resize-none h-20"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBlockingModalUser(null)}
                  disabled={isSubmittingBlock}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBlock}
                  disabled={isSubmittingBlock}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl font-black text-xs shadow-md transition flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmittingBlock ? 'Applying Suspension...' : 'Confirm & Suspend Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;