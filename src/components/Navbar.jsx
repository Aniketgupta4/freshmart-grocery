import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, User, LogOut, Package, Search, 
  Settings, HeadphonesIcon, Menu, Store, X
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  
  const [search, setSearch] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Safe user parsing
  let user = null; 
  try { 
    user = JSON.parse(localStorage.getItem('user')); 
  } catch(e) {
    user = null;
  }

  // Fetch cart count and total price
  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem(`cart_${(user?.email || 'guest')}`)) || [];
      const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
      const totalVal = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
      setCartCount(totalItems);
      setCartTotal(totalVal);
    } catch(e) {
      setCartCount(0);
      setCartTotal(0);
    }
  }, [location.pathname, user?.email]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setShowMobileMenu(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAdminUser = user?.email === 'admin@freshmart.com';

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-sm antialiased transition-all duration-300">
      
      {/* Main Desktop & Tablet Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4 lg:gap-8">
          
          {/* 1. Brand */}
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 group outline-none min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 group-hover:scale-105 transition-all duration-300">
                <Package className="w-4 h-4 sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                Fresh<span className="text-emerald-600 group-hover:text-slate-900 transition-colors">Mart</span>
              </span>
            </Link>
          </div>
          
          {/* 2. Main Search Bar (Visible ONLY on Home Page on Desktop) */}
          {isHomePage && (
            <div className="hidden md:flex flex-1 max-w-2xl">
              <form onSubmit={handleSearch} className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-300" />
                </div>
                <input 
                  type="text" 
                  placeholder='Search for fresh milk, vegetables, bread...' 
                  className="w-full pl-12 pr-24 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white text-sm font-medium text-slate-900 placeholder-slate-400 transition-all shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] rounded-xl text-white font-bold text-xs transition-all shadow-sm"
                >
                  Search
                </button>
              </form>
            </div>
          )}

          {/* 3. Desktop Actions & Mobile Toggles */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-3 lg:gap-4 flex-shrink-0 ml-auto">
            
            {/* Logged In Actions (Desktop) */}
            {user && (
              <div className="hidden md:flex items-center gap-3">
                {isAdminUser ? (
                  // Admin Only View (No Cart, No Profile)
                  <>
                    <Link
                      to={isAdminPage ? "/" : "/admin"}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/60 text-amber-900 font-bold text-sm transition-colors"
                    >
                      {isAdminPage ? <Store size={18} /> : <Settings size={18} />}
                      <span>{isAdminPage ? "View Store" : "Admin Dashboard"}</span>
                    </Link>
                    <button onClick={handleLogout} className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Log Out">
                      <LogOut size={20} />
                    </button>
                  </>
                ) : (
                  // Regular User View
                  <>
                    <Link to="/support" className="p-2.5 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Support">
                      <HeadphonesIcon size={20} />
                    </Link>

                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">{user.name ? user.name.split(' ')[0] : 'Profile'}</span>
                    </Link>
                    
                    <button onClick={handleLogout} className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Log Out">
                      <LogOut size={20} />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Auth Buttons (Logged Out - Desktop) */}
            {!user && (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                  Log In
                </Link>
                <Link to="/signup" className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 transition-all">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart Button (Hidden for Admin, Visible for Normal Users/Guests) */}
            {!isAdminUser && (
              <Link 
                to="/cart" 
                className={`flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all shadow-sm active:scale-[0.97]
                  ${cartCount > 0 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20' 
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700'
                  }
                `}
              >
                <div className="relative flex-shrink-0">
                  <ShoppingCart className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 sm:-top-2.5 sm:-right-2.5 bg-rose-500 text-white text-[9px] sm:text-[10px] font-extrabold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full border-2 border-emerald-600 shadow-sm animate-in zoom-in duration-300">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-[1.1]">
                  <span className={`text-[10px] uppercase ${cartCount > 0 ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {cartCount} items
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm truncate max-w-[60px]">₹{cartTotal}</span>
                </div>
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all bg-slate-50 border border-slate-200/80 flex-shrink-0"
            >
              {showMobileMenu ? <X className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={2.5} /> : <Menu className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={2.5} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Only: Secondary Search Row (Visible ONLY on Home Page) */}
      {isHomePage && (
        <div className="md:hidden px-3 sm:px-4 pb-3 border-t border-slate-100/50 pt-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <input 
              type="text" 
              placeholder='Search "milk, bread, fruits..."' 
              className="w-full pl-9 pr-14 sm:pl-10 sm:pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-4 sm:h-4" />
            <button 
              type="submit" 
              className="absolute right-1 top-1 bottom-1 px-3 sm:px-4 bg-emerald-600 text-white rounded-lg text-xs font-bold active:scale-[0.97] transition-transform"
            >
              Go
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Dropdown Panel */}
      <div 
        ref={menuRef} 
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-2xl origin-top transition-all duration-300 ease-out z-40 overflow-hidden
          ${showMobileMenu ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}
        `}
      >
        <div className="p-4 sm:p-6 space-y-2">
          {user ? (
            isAdminUser ? (
              // Admin Mobile Menu (No Profile/User Section)
              <>
                <Link to="/admin" className="flex items-center justify-center gap-3 px-4 py-3.5 sm:py-4 text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors">
                  <Settings size={18} /> Enter Admin Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex justify-center items-center gap-3 px-4 py-3.5 sm:py-4 mt-2 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                >
                  <LogOut size={18} /> Log Out
                </button>
              </>
            ) : (
              // Regular User Mobile Menu
              <>
                <div className="flex items-center gap-3 p-3 mb-2 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base shadow-sm">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">{user.name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <User size={18} className="text-slate-400 flex-shrink-0" /> <span className="truncate">My Profile & Orders</span>
                </Link>
                <Link to="/support" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <HeadphonesIcon size={18} className="text-slate-400 flex-shrink-0" /> <span className="truncate">Help & Support</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                >
                  <LogOut size={18} className="flex-shrink-0" /> <span className="truncate">Log Out</span>
                </button>
              </>
            )
          ) : (
            // Logged Out Mobile Menu
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link to="/login" className="flex justify-center items-center py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-colors truncate px-2">
                Log In
              </Link>
              <Link to="/signup" className="flex justify-center items-center py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-500/20 transition-all truncate px-2">
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;