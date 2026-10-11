import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingBag, Zap, Clock, ShieldCheck, Check, 
  Plus, Minus, Trash2, ChevronRight, CheckCircle2, RotateCcw, 
  Sparkles, Star, Package
} from 'lucide-react';
import api from '../api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [inCartQty, setInCartQty] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  // Get current user
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    user = null;
  }

  // Load product details
  useEffect(() => {
    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Sync cart quantity
  useEffect(() => {
    syncCartQuantity();
    const handleCartSync = () => syncCartQuantity();
    window.addEventListener('storage', handleCartSync);
    window.addEventListener('cartUpdated', handleCartSync);
    return () => {
      window.removeEventListener('storage', handleCartSync);
      window.removeEventListener('cartUpdated', handleCartSync);
    };
  }, [product, user?.email]);

  const syncCartQuantity = () => {
    if (!product) return;
    try {
      const cartKey = `cart_${user?.email || 'guest'}`;
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const item = cart.find(
        (c) => (c.product?._id || c.product?.id) === (product._id || product.id)
      );
      setInCartQty(item ? item.quantity : 0);
    } catch (e) {
      setInCartQty(0);
    }
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      // First try fetching product by id
      let targetProduct = null;
      try {
        const directRes = await api.get(`/products/${id}`);
        if (directRes.data && (directRes.data.name || directRes.data.product)) {
          targetProduct = directRes.data.product || directRes.data;
        }
      } catch (err) {
        // Fallback to searching all products
      }

      if (!targetProduct) {
        const allRes = await api.get('/products?limit=1000');
        const list = allRes.data.products || allRes.data || [];
        targetProduct = list.find(
          (p) => String(p._id) === String(id) || String(p.id) === String(id)
        );
      }

      setProduct(targetProduct || null);

      if (targetProduct) {
        // Fetch related products in same category
        try {
          const relRes = await api.get(
            `/products?category=${encodeURIComponent(targetProduct.category)}&limit=10`
          );
          const relList = relRes.data.products || relRes.data || [];
          setRelatedProducts(
            relList.filter(
              (p) => (p._id || p.id) !== (targetProduct._id || targetProduct.id)
            )
          );
        } catch (e) {}
      }
    } catch (err) {
      console.error('Failed to fetch product details:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = (newQty) => {
    if (!user) {
      alert('Please sign in to add items to your cart!');
      navigate('/login');
      return;
    }
    if (!product) return;

    const cartKey = `cart_${user?.email || 'guest'}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const prodId = product._id || product.id;
    const existingIndex = cart.findIndex(
      (c) => (c.product?._id || c.product?.id) === prodId
    );

    if (newQty <= 0) {
      if (existingIndex > -1) {
        cart.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex > -1) {
        cart[existingIndex].quantity = newQty;
      } else {
        cart.push({ product, quantity: newQty });
      }
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    setInCartQty(newQty);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleAddAndReturnHome = () => {
    const nextQty = inCartQty + 1;
    updateCart(nextQty);
    showToast(`Added ${product.name} to cart! Redirecting to home...`);
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  const handleIncrement = () => {
    const nextQty = inCartQty + 1;
    updateCart(nextQty);
    showToast(`Quantity updated to ${nextQty}!`);
  };

  const handleDecrement = () => {
    const nextQty = inCartQty - 1;
    updateCart(nextQty);
    if (nextQty <= 0) {
      showToast(`${product.name} removed from cart.`);
    } else {
      showToast(`Quantity updated to ${nextQty}.`);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow bg-[#FAFAFA] min-h-screen py-16 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold text-sm">Loading Product Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-grow bg-[#FAFAFA] min-h-screen py-20 font-sans">
        <div className="container mx-auto px-4 max-w-xl text-center bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
          <Package size={52} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-black text-slate-800">Product Not Found</h2>
          <p className="text-gray-500 text-sm mt-2 mb-6">
            The item you are looking for is either unavailable or has been removed from the catalog.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  const isImage = (product.emoji || product.image) && (
    (product.emoji || product.image).startsWith('http') || 
    (product.emoji || product.image).startsWith('data:')
  );
  const mrp = (product.price || 0) + 15;
  const currentTotal = (inCartQty > 0 ? inCartQty : 1) * (product.price || 0);

  return (
    <div className="flex-grow bg-[#FAFAFA] min-h-screen pb-20 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-fade-in text-sm font-bold">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP BREADCRUMB & BACK STRIP */}
      <div className="bg-white border-b border-gray-200/70 sticky top-[61px] sm:top-[69px] z-20">
        <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-700 hover:text-emerald-700 text-xs sm:text-sm font-bold transition-all px-3 py-1.5 rounded-xl hover:bg-gray-100"
          >
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-emerald-600 font-semibold">Home</Link>
            <ChevronRight size={12} />
            <span className="font-semibold">{product.category}</span>
            <ChevronRight size={12} />
            <span className="text-slate-800 font-bold truncate max-w-[200px]">{product.name}</span>
          </div>

          <Link
            to="/cart"
            className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-extrabold hover:bg-emerald-100 transition-all"
          >
            <ShoppingBag size={14} className="text-emerald-600" />
            <span>Cart</span>
            {inCartQty > 0 && (
              <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                {inCartQty}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 2. MAIN PRODUCT DETAILS GRID */}
      <div className="container mx-auto px-4 lg:px-8 mt-6 sm:mt-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: HERO SHOWCASE (ZERO OVERLAP) */}
          <div className="md:col-span-6 lg:col-span-6">
            <div className="bg-white rounded-[2rem] border border-gray-200/80 p-6 sm:p-8 shadow-sm flex flex-col">
              
              {/* Dedicated Top Badges Bar - Completely above the image! */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-black rounded-lg text-xs shadow-sm">
                  <Zap size={13} className="fill-emerald-600 text-emerald-600" />
                  <span>10 MINS DELIVERY</span>
                </div>
                
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 font-black rounded-lg text-xs shadow-sm">
                  <Sparkles size={13} className="text-amber-600" />
                  <span>100% CERTIFIED FRESH</span>
                </div>
              </div>

              {/* Dedicated Product Image Container (Large & Unobstructed) */}
              <div className="w-full h-72 sm:h-96 bg-gray-50/70 rounded-2xl flex items-center justify-center p-6 overflow-hidden relative border border-gray-100 group">
                {isImage ? (
                  <img
                    src={product.emoji || product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300?text=FreshMart';
                    }}
                  />
                ) : (
                  <span className="text-8xl sm:text-9xl transform group-hover:scale-110 transition-transform duration-300 select-none">
                    {product.emoji || product.image || '🛍️'}
                  </span>
                )}
              </div>

              {/* Trust Badges Strip Below Image */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-gray-100 text-center">
                <div className="p-2.5 bg-gray-50/80 rounded-xl">
                  <Zap size={18} className="mx-auto text-emerald-600 mb-1" />
                  <p className="text-[11px] font-bold text-slate-800">10 Min Dispatch</p>
                  <p className="text-[10px] text-gray-500">Dark store ready</p>
                </div>
                <div className="p-2.5 bg-gray-50/80 rounded-xl">
                  <ShieldCheck size={18} className="mx-auto text-teal-600 mb-1" />
                  <p className="text-[11px] font-bold text-slate-800">Quality Checked</p>
                  <p className="text-[10px] text-gray-500">100% Hygienic</p>
                </div>
                <div className="p-2.5 bg-gray-50/80 rounded-xl">
                  <RotateCcw size={18} className="mx-auto text-indigo-600 mb-1" />
                  <p className="text-[11px] font-bold text-slate-800">Easy Return</p>
                  <p className="text-[10px] text-gray-500">Doorstep refund</p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: PRODUCT INTEL & ACTIONS */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col space-y-6">
            
            <div className="bg-white rounded-[2rem] border border-gray-200/80 p-6 sm:p-8 shadow-sm">
              
              {/* Category Pill */}
              <div className="inline-block bg-slate-100 text-slate-700 font-extrabold text-[11px] px-3 py-1 rounded-lg tracking-wider uppercase mb-3">
                CATEGORY: {product.category}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-2">
                {product.name}
              </h1>

              {/* Net Weight Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-lg text-xs mb-4">
                <span>Net Wt. {product.unit || '1 pc'}</span>
              </div>



              <div className="w-full h-px bg-gray-100 mb-6"></div>

              {/* Price Row with in-card Add/Remove stepper */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">
                      ₹{product.price}
                    </span>
                    <span className="text-base text-gray-400 line-through font-medium">
                      ₹{mrp}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-black">
                      SAVE ₹15
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Inclusive of all applicable taxes</p>
                </div>

                {/* In-Card Stepper */}
                <div>
                  {inCartQty > 0 ? (
                    <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-600 rounded-2xl p-1.5 shadow-sm">
                      <button
                        onClick={handleDecrement}
                        className="w-8 h-8 rounded-xl bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center font-black text-lg active:scale-95 shadow-sm"
                        title="Remove 1 item"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-black text-emerald-900 text-base">
                        {inCartQty}
                      </span>
                      <button
                        onClick={handleIncrement}
                        className="w-8 h-8 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all flex items-center justify-center font-black text-lg active:scale-95 shadow-sm"
                        title="Add 1 more item"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleIncrement}
                      className="px-5 py-2.5 rounded-2xl bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white font-black text-sm transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
                    >
                      <span>ADD</span>
                      <Plus size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Total Calculation Strip */}
              {inCartQty > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Currently in Cart</p>
                      <p className="text-[11px] text-gray-500">{inCartQty} × ₹{product.price} / {product.unit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900">₹{currentTotal}</span>
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS (ADD MORE & RETURN HOME / REMOVE) */}
              <div className="space-y-3">
                {inCartQty > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => updateCart(0)}
                      className="w-full py-3.5 px-4 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Trash2 size={16} />
                      <span>Remove from Cart</span>
                    </button>

                    <button
                      onClick={handleAddAndReturnHome}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Zap size={16} />
                      <span>Add More & Go to Home</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddAndReturnHome}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Zap size={18} />
                    <span>ADD TO CART • ₹{product.price}</span>
                  </button>
                )}

                {/* View Full Cart Link */}
                <Link
                  to="/cart"
                  className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={14} className="text-slate-500" />
                  <span>Proceed to Checkout ({inCartQty} items in cart)</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

            </div>

            {/* FreshMart Promise Card */}
            <div className="bg-white rounded-[2rem] border border-gray-200/80 p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span>FreshMart Brand Assurance</span>
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold">
                    ⚡
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">10-Minute Dark Store Dispatch</p>
                    <p className="text-gray-500 text-[11px]">Packed with ice gel packs and hygienic safety seal.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold">
                    🌱
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">100% Quality & Freshness Guarantee</p>
                    <p className="text-gray-500 text-[11px]">Sourced directly from verified orchards and farms.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 font-bold">
                    🔄
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Instant Doorstep Return</p>
                    <p className="text-gray-500 text-[11px]">Not satisfied? Return directly to rider with zero questions asked.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 3. RELATED PRODUCTS IN SAME CATEGORY */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200/70">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  More in {product.category}
                </h2>
              </div>
              <Link
                to="/"
                className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <span>View All Store</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
              {relatedProducts.slice(0, 5).map((rel) => {
                const relIsImg = (rel.emoji || rel.image) && (
                  (rel.emoji || rel.image).startsWith('http') || 
                  (rel.emoji || rel.image).startsWith('data:')
                );
                return (
                  <div
                    key={rel._id || rel.id}
                    onClick={() => navigate(`/product/${rel._id || rel.id}`)}
                    className="bg-white border border-slate-200/80 hover:border-emerald-400 rounded-2xl p-2.5 sm:p-3 cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col hover:-translate-y-0.5"
                  >
                    <div className="h-32 sm:h-36 w-full bg-slate-50 rounded-xl mb-2.5 flex items-center justify-center overflow-hidden relative">
                      {relIsImg ? (
                        <img
                          src={rel.emoji || rel.image}
                          alt={rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-5xl">{rel.emoji || rel.image || '🛍️'}</span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 h-[34px] mb-1">
                      {rel.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 mb-2">{rel.unit}</p>
                    <div className="mt-auto flex items-center justify-between pt-1 border-t border-gray-50">
                      <span className="font-black text-sm text-slate-900">₹{rel.price}</span>
                      <span className="text-[11px] font-bold text-emerald-700 group-hover:underline">View →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default ProductDetails;
