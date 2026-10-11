import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/login', { email: email.trim(), password });
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.user.email === 'admin@freshmart.com') { 
          navigate('/admin'); 
        } else { 
          navigate('/'); 
        }
        window.location.reload();
      } else {
        setError(res.data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[90vh] bg-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      
      {/* Luxury Ambient Lighting */}
      <div className="absolute top-[-15%] left-[-10%] w-[520px] h-[520px] bg-gradient-to-br from-emerald-200/50 via-teal-100/30 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[520px] h-[520px] bg-gradient-to-tl from-emerald-100/40 via-cyan-100/30 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] border border-slate-100/90 p-8 sm:p-11 relative z-10 animate-fade-in">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/80 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-4 shadow-sm">
            <Zap size={14} className="text-emerald-600 fill-emerald-600" />
            Instant 10-Min Delivery
          </div>

          <Link to="/" className="flex items-center justify-center gap-2.5 text-slate-900 hover:opacity-90 transition-opacity">
            <div className="w-11 h-11 rounded-2xl bg-[#0F392B] flex items-center justify-center text-white shadow-md shadow-[#0F392B]/20">
              <Package size={24} strokeWidth={2.3} />
            </div>
            <span className="text-3xl font-black tracking-tight text-slate-900">
              Fresh<span className="text-emerald-600">Mart</span>
            </span>
          </Link>
          <h2 className="mt-5 text-2xl font-black text-slate-900 tracking-tight">Welcome back</h2>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">
            Sign in to access your carts, live orders & saved addresses
          </p>
        </div>
        
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50/90 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-sm flex items-start gap-3 animate-shake shadow-sm">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
            <span className="font-semibold text-xs sm:text-sm">{error}</span>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4.5">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              </div>
              <input 
                type="email" 
                placeholder="name@example.com" 
                required 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white transition-all text-slate-900 placeholder-slate-400 text-sm font-medium" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </div>
          
          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••" 
                required 
                className="w-full pl-11 pr-11 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white transition-all text-slate-900 placeholder-slate-400 text-sm font-medium" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0F392B] hover:bg-[#16503c] text-white py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-[#0F392B]/20 hover:shadow-xl hover:shadow-[#0F392B]/30 transition-all duration-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98] group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign in to FreshMart</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        
        {/* Footer */}
        <div className="mt-7 text-center">
          <p className="text-sm text-slate-500 font-medium">
            New to FreshMart?{' '}
            <Link to="/signup" className="text-emerald-700 font-black hover:text-emerald-800 transition-colors hover:underline underline-offset-4">
              Create an account
            </Link>
          </p>
          
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in {
          animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}} />
    </div>
  );
};

export default Login;