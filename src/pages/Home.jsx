import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronRight, Package, Zap, Clock, ArrowRight, 
  ShoppingBag, Check, Smartphone, Sparkles, Copy, Download, ExternalLink 
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

// --- SKELETON LOADER FOR CLEAN LIGHT THEME ---
const ProductSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 animate-pulse h-full flex flex-col shadow-sm">
    <div className="h-28 sm:h-36 w-full bg-gray-100 rounded-xl mb-3"></div>
    <div className="h-4 bg-gray-100 rounded-md w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-100 rounded-md w-1/2 mb-4"></div>
    <div className="mt-auto flex justify-between items-center pt-2">
      <div className="h-5 bg-gray-100 rounded-md w-1/3"></div>
      <div className="h-8 bg-gray-100 rounded-xl w-16"></div>
    </div>
  </div>
);

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [addedItemIds, setAddedItemIds] = useState({});
  const [copiedUrl, setCopiedUrl] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  const apkUrl = typeof window !== 'undefined' ? `${window.location.origin}/FreshMart-FinalApp.apk` : '/FreshMart-FinalApp.apk';

  const copyApkUrl = () => {
    navigator.clipboard.writeText(apkUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = async (cat = 'All') => {
    setLoading(true);
    try {
      let url = '/products?limit=1000';
      if (searchQuery) {
        const res = await api.get(url);
        setProducts(res.data.products?.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) || []);
      } else {
        url = cat === 'All' ? '/products?limit=1000' : `/products?category=${encodeURIComponent(cat)}&limit=1000`;
        const res = await api.get(url);
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const addToCart = (product) => {
    let user = null; 
    try { user = JSON.parse(localStorage.getItem('user')); } catch(e) {}
    
    if (!user) {
      alert("Please sign in to add items to your cart!");
      navigate('/login');
      return;
    }
    
    let cart = JSON.parse(localStorage.getItem(`cart_${(user?.email || 'guest')}`)) || [];
    const existing = cart.find(c => (c.product?._id || c.product?.id) === (product._id || product.id));
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ product, quantity: 1 });
    }
    localStorage.setItem(`cart_${(user?.email || 'guest')}`, JSON.stringify(cart));

    // Button feedback state
    const pid = product._id || product.id;
    setAddedItemIds(prev => ({ ...prev, [pid]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [pid]: false }));
    }, 1800);
  };

  const groupedProducts = () => {
    if (selectedCategory !== 'All' || searchQuery) {
      return [{ category: searchQuery ? `Results for "${searchQuery}"` : selectedCategory, items: products }];
    }
    
    const grouped = {};
    products.forEach(p => {
      const cat = p.category || 'General Essentials';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });
    
    return Object.keys(grouped).map(cat => ({ category: cat, items: grouped[cat] }));
  };

  return (
    <div className="flex-grow bg-[#FAFAFA] min-h-screen pb-16 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* 1. CLEAN LIGHT AISLE STRIP */}
      {!searchQuery && (
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/70 sticky top-[61px] sm:top-[69px] z-30 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex gap-2.5 sm:gap-4 overflow-x-auto py-3 scrollbar-hide snap-x items-center">
              
              {/* All Items Pill */}
              <button 
                onClick={() => setSelectedCategory('All')} 
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-pointer transition-all snap-start text-xs font-bold ${
                  selectedCategory === 'All' 
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30' 
                    : 'bg-white text-slate-700 hover:bg-gray-50 border border-gray-200/80'
                }`}
              >
                <ShoppingBag size={14} className={selectedCategory === 'All' ? 'text-white' : 'text-slate-500'} />
                <span>All Items</span>
              </button>

              {/* Dynamic Categories */}
              {categories.map(c => {
                const isSelected = selectedCategory === c.name;
                return (
                  <button 
                    key={c._id} 
                    onClick={() => setSelectedCategory(c.name)} 
                    className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-pointer transition-all snap-start text-xs font-bold ${
                      isSelected 
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30' 
                        : 'bg-white text-slate-700 hover:bg-gray-50 border border-gray-200/80'
                    }`}
                  >
                    <span className="text-sm">
                      {((c.emoji || c.image) && (c.emoji || c.image).startsWith('http')) ? (
                        <img src={c.emoji || c.image} alt={c.name} className="w-4 h-4 object-contain inline" />
                      ) : (
                        c.emoji || c.image || '🛒'
                      )}
                    </span>
                    <span>{c.name}</span>
                  </button>
                );
              })}

            </div>
          </div>
        </div>
      )}

      {/* 2. BRIGHT & CLEAN QUICK-COMMERCE HERO BANNER */}
      {!searchQuery && selectedCategory === 'All' && (
        <div className="container mx-auto px-4 lg:px-8 mt-6 mb-8">
          <div className="w-full rounded-[2rem] bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white overflow-hidden relative border border-emerald-100/90 shadow-sm flex items-center min-h-[300px]">
            
            {/* Soft Ambient Lights */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl"></div>
            </div>
            
            <div className="w-full flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 md:p-12 z-10 relative">
              <div className="w-full md:w-3/5 text-left">
                
                {/* 10-Min Express Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 text-emerald-800 font-extrabold rounded-full text-xs mb-4 shadow-sm">
                  <Zap size={13} className="fill-emerald-600 text-emerald-600" />
                  <span>Instant 10-Minute Delivery</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.18] mb-3 tracking-tight">
                  Fresh Groceries & Essentials, <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                    Delivered in Minutes.
                  </span>
                </h1>
                
                <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-md mb-6 font-medium leading-relaxed">
                  Daily vegetables, farm fruits, dairy products and kitchen essentials at wholesale rates, delivered right to your door.
                </p>
                
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={() => {
                      const shopSection = document.getElementById('shop-section');
                      if (shopSection) window.scrollTo({ top: shopSection.offsetTop - 110, behavior: 'smooth' });
                    }} 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>Start Shopping</span>
                    <ArrowRight size={16} />
                  </button>

                  <a 
                    href="/FreshMart-FinalApp.apk" 
                    download="FreshMart-FinalApp.apk"
                    className="bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 px-5 py-3 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 group"
                  >
                    <Smartphone size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span>Get App (v2.4 APK)</span>
                  </a>
                </div>

              </div>
              
              {/* Floating Produce Graphic */}
              <div className="w-full md:w-2/5 hidden md:flex justify-end relative mt-6 md:mt-0 pr-4">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3081/3081986.png" 
                  alt="Fresh Groceries" 
                  className="w-56 h-56 object-contain drop-shadow-xl floating-animation" 
                />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN PRODUCT & AISLE SHOWCASE */}
      <div id="shop-section" className="container mx-auto px-4 lg:px-8 mt-6">
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5 mt-4">
            {[...Array(10)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-4">
            <Search size={44} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-xl font-bold text-slate-800">No products found</h3>
            <p className="text-gray-500 text-xs mt-1">Try another search keyword or switch categories.</p>
            <button
              onClick={() => { setSelectedCategory('All'); navigate('/'); }}
              className="mt-4 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Browse All Items
            </button>
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-12">
            
            {(selectedCategory !== 'All' || searchQuery) ? (
              <div className="animate-fade-in">
                
                {/* Professional Category Heading */}
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {searchQuery ? `Search: "${searchQuery}"` : selectedCategory}
                      </h2>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    {products.length} products
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
                  {products.map(p => (
                    <ProductCard 
                      key={p._id || p.id} 
                      product={p} 
                      addToCart={addToCart} 
                      isRecentlyAdded={addedItemIds[p._id || p.id]} 
                    />
                  ))}
                </div>
              </div>
            ) : (
              groupedProducts().map((group) => {
                if (!group.items || group.items.length === 0) return null;
                return (
                  <div key={group.category} className="relative">
                    
                    {/* Professional Category Heading with Accent Indicator */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-5 bg-emerald-600 rounded-full"></div>
                        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                          {group.category}
                        </h2>
                      </div>
                      <button 
                        onClick={() => setSelectedCategory(group.category)}
                        className="text-emerald-700 hover:text-emerald-800 font-bold text-xs sm:text-sm flex items-center gap-1 hover:underline transition-all"
                      >
                        <span>See All</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                    
                    {/* Horizontal Smooth Carousel */}
                    <div className="flex overflow-x-auto gap-3.5 sm:gap-5 pb-4 scrollbar-hide snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
                      {group.items.slice(0, 8).map(p => (
                        <div key={p._id || p.id} className="snap-start flex-shrink-0 w-[155px] sm:w-[195px]">
                          <ProductCard 
                            product={p} 
                            addToCart={addToCart} 
                            isRecentlyAdded={addedItemIds[p._id || p.id]} 
                          />
                        </div>
                      ))}
                      
                      {group.items.length > 8 && (
                        <div 
                          onClick={() => setSelectedCategory(group.category)}
                          className="snap-start flex-shrink-0 w-[155px] sm:w-[195px] flex flex-col items-center justify-center rounded-2xl cursor-pointer bg-white border border-dashed border-gray-300 hover:bg-emerald-50 hover:border-emerald-300 transition-all group p-4"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                            <ArrowRight size={18} />
                          </div>
                          <span className="font-bold text-xs text-gray-600 group-hover:text-emerald-700">
                            View All ({group.items.length})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

          </div>
        )}
      </div>

      {/* 4. LIGHT APP BANNER WITH CURRENT VERSION & DIRECT URL */}
      {!searchQuery && (
        <div className="container mx-auto px-4 lg:px-8 mt-12">
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 rounded-3xl p-6 sm:p-10 border border-emerald-200/80 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-emerald-800 font-extrabold text-xs shadow-sm border border-emerald-100">
                    <Smartphone size={13} className="text-emerald-600" />
                    <span>Mobile Grocery App</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[11px] shadow-sm">
                    Current Version: v2.4 (Latest)
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    17.03 MB • Android 8.0+
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                  Get FreshMart App on your Android Phone
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  Faster 10-minute checkout, live dark-store order tracking, executive admin controls, and instant doorstep alerts.
                </p>

                {/* Direct Download URL Bar with 1-Click Copy */}
                <div className="mt-5 p-2 bg-white/95 backdrop-blur-sm border border-emerald-200/90 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-lg shadow-sm">
                  <div className="flex items-center gap-2 px-3 py-1 flex-grow overflow-hidden">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">URL:</span>
                    <span className="text-xs font-mono font-bold text-emerald-800 truncate select-all">
                      {apkUrl}
                    </span>
                  </div>
                  <button
                    onClick={copyApkUrl}
                    className="flex-shrink-0 px-3.5 py-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs rounded-xl border border-gray-200/80 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    title="Copy direct APK download link"
                  >
                    {copiedUrl ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-700 font-extrabold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
                <a 
                  href="/FreshMart-FinalApp.apk" 
                  download="FreshMart-FinalApp.apk"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-2xl font-black text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 whitespace-nowrap text-center"
                >
                  <Download size={18} />
                  <span>Download APK (v2.4)</span>
                </a>

                <a
                  href="/FreshMart-FinalApp.apk"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 text-center shadow-sm"
                >
                  <ExternalLink size={14} className="text-emerald-600" />
                  <span>Direct Download Link</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0px); } }
        .floating-animation { animation: float 3.5s ease-in-out infinite; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

// --- MODIFIED CLEAN & PROFESSIONAL LIGHT PRODUCT CARD ---
const ProductCard = ({ product, addToCart, isRecentlyAdded }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id || product.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white border border-gray-100 hover:border-emerald-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-2xl flex flex-col h-full relative transition-all duration-300 ease-out overflow-hidden cursor-pointer group p-3 sm:p-3.5 hover:-translate-y-1"
    >
      
      {/* Product Image Stage */}
      <div className="h-28 sm:h-36 w-full flex items-center justify-center bg-gray-50/70 rounded-xl mb-3 overflow-hidden relative group-hover:bg-emerald-50/20 transition-colors">
        
        {/* 10-Min Fast Pill */}
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm border border-gray-200/60 z-20">
          <Clock size={9} className="text-emerald-700" />
          <span className="text-[9px] font-extrabold text-slate-800">10 MIN</span>
        </div>

        {((product.emoji || product.image) && (product.emoji || product.image).length <= 4 && !(product.emoji || product.image).startsWith('http')) ? (
          <span className="text-5xl sm:text-6xl transform group-hover:scale-110 transition-transform duration-300 select-none">
            {product.emoji || product.image}
          </span>
        ) : (
          <img 
            onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/150?text=FreshMart'; }} 
            src={(product.emoji || product.image) || 'https://via.placeholder.com/150?text=FreshMart'} 
            alt={product.name || 'Grocery'} 
            loading="lazy"
            className="object-contain h-[75%] w-[75%] transform group-hover:scale-110 transition-transform duration-300" 
          />
        )}
      </div>
      
      {/* Product Info */}
      <div className="flex flex-col flex-grow">
        <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug mb-1 line-clamp-2 h-[34px] sm:h-[38px] tracking-tight group-hover:text-emerald-700 transition-colors">
          {product.name || 'Grocery Item'}
        </h3>
        
        <p className="text-gray-400 text-[11px] font-medium mb-3">
          {product.unit || '1 pc'}
        </p>
        
        {/* Price & Action Button */}
        <div className="mt-auto flex items-center justify-between pt-1 border-t border-gray-50">
          <span className="font-extrabold text-sm sm:text-base text-slate-900">
            ₹{product.price}
          </span>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }} 
            className={`px-3 py-1.5 rounded-xl font-bold text-xs active:scale-95 transition-all duration-200 flex items-center gap-1 ${
              isRecentlyAdded 
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30' 
                : 'bg-white text-emerald-700 border border-emerald-600 hover:bg-emerald-600 hover:text-white'
            }`}
          >
            {isRecentlyAdded ? (
              <>
                <Check size={13} /> Added
              </>
            ) : (
              <span>Add +</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;