import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  PhoneCall, 
  HeadphonesIcon, 
  LifeBuoy, 
  Ticket, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  RefreshCw,
  UserCheck
} from 'lucide-react';

const QUICK_TOPICS = [
  { label: 'Order Delayed', icon: '⏱️', subject: 'Delayed Delivery for my Order' },
  { label: 'Quality / Freshness', icon: '🍎', subject: 'Damaged or Poor Quality Item' },
  { label: 'Missing Items', icon: '📦', subject: 'Items Missing from Delivered Order' },
  { label: 'Refund / Payment', icon: '💳', subject: 'Payment Deduction / Refund Status' },
  { label: 'Delivery Partner', icon: '🛵', subject: 'Feedback regarding Delivery Partner' }
];

const Support = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, RESOLVED
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    let u = null;
    try {
      u = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      u = null;
    }

    if (!u || !u.email) {
      // Must be logged in to view support
      navigate('/login');
      return;
    }
    setUser(u);
    fetchTickets(u);
  }, [navigate]);

  const fetchTickets = async (currentUser) => {
    const activeUser = currentUser || user;
    if (!activeUser || !activeUser.email) {
      setTickets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/support');
      const allTickets = Array.isArray(res.data) ? res.data : [];
      // Strictly show ONLY tickets belonging to this specific user's email
      setTickets(allTickets.filter(t => t.email?.toLowerCase() === activeUser.email.toLowerCase()));
    } catch (e) {
      console.error("Failed to fetch tickets:", e);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic.label);
    setSubject(topic.subject);
  };

  const submitTicket = async (e) => {
    e.preventDefault();
    if (!user || !user.email) {
      navigate('/login');
      return;
    }

    if (!subject.trim() || !message.trim()) {
      alert("Please enter both subject and message.");
      return;
    }

    try {
      setSubmitting(true);
      const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      
      await api.post('/support', {
        email: user.email,
        subject: subject.trim(),
        message: message.trim(),
        date: dateStr
      });

      setFeedbackSuccess(true);
      setTimeout(() => setFeedbackSuccess(false), 5000);
      setSubject('');
      setMessage('');
      setSelectedTopic(null);
      fetchTickets(user);
    } catch (e) {
      alert("Failed to submit ticket: " + (e.response?.data?.message || e.message));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (filter === 'PENDING') return t.status !== 'Resolved';
    if (filter === 'RESOLVED') return t.status === 'Resolved';
    return true;
  });

  if (!user) {
    return (
      <div className="flex-grow bg-[#F8FAFC] py-24 flex flex-col items-center justify-center min-h-[60vh] text-center px-4 font-sans">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-slate-600 font-bold text-sm">Please log in to access Customer Support...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#F8FAFC] py-10 sm:py-14 px-4 sm:px-6 min-h-screen font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Executive Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0F392B] via-[#144737] to-[#0A261D] rounded-[2.5rem] p-8 sm:p-12 text-white shadow-xl shadow-[#0F392B]/10 border border-emerald-900/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wide uppercase mb-4">
                <Sparkles size={13} className="text-emerald-300" />
                24/7 Dedicated Concierge
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                How can we assist you today?
              </h1>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                Connect with our resolution specialists for instant order tracking, product replacement, or refund assistance within minutes.
              </p>
              
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                  <Clock size={14} className="text-emerald-400" /> Avg. Reply: &lt; 3 mins
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                  <ShieldCheck size={14} className="text-emerald-400" /> 100% Refund Assurance
                </span>
              </div>
            </div>

            {/* Direct Hotline Pill */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 p-6 rounded-3xl flex flex-col items-center sm:items-start text-center sm:text-left min-w-[260px]">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300 mb-1">Direct Helpline</span>
              <div className="flex items-center gap-2 text-2xl font-black text-white">
                <PhoneCall size={22} className="text-emerald-400 animate-pulse" />
                <span>8770191425</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 mb-4">Available 24x7 for all active orders</p>
              <a 
                href="tel:8770191425" 
                className="w-full py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-center text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Call Support Desk
              </a>
            </div>
          </div>
        </div>

        {/* 2-Column Working Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Create Ticket */}
          <div className="lg:col-span-6 bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <LifeBuoy size={22} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Create Support Ticket</h2>
                <p className="text-xs text-slate-500 font-medium">Select a category or write to our support desk</p>
              </div>
            </div>

            {/* Quick Topic Chips */}
            <div className="mb-6">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5">
                Quick Category
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic.label}
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all border flex items-center gap-1.5 ${
                      selectedTopic === topic.label
                        ? 'bg-[#0F392B] text-white border-[#0F392B] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span>{topic.icon}</span>
                    <span>{topic.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Success Banner */}
            {feedbackSuccess && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-fade-in">
                <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                <span>Ticket registered! Our support desk has received your request.</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={submitTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject / Issue Title
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Order #1042 item missing" 
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white text-sm font-medium transition"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Detailed Description
                  </label>
                  <span className="text-[11px] text-slate-400 font-semibold">{message.length}/500</span>
                </div>
                <textarea 
                  placeholder="Please describe the issue in detail including order number, specific product name, or replacement request..." 
                  required
                  rows={4}
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white text-sm font-medium resize-none transition"
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[#0F392B] hover:bg-[#16503c] text-white py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-[#0F392B]/20 hover:shadow-xl hover:shadow-[#0F392B]/30 transition-all duration-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98]"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit to Priority Support</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Ticket Tracking & History */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <Ticket size={20} className="text-emerald-700" />
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Your Support History</h3>
                </div>
                <button 
                  onClick={() => fetchTickets(user)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100"
                >
                  <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                {['ALL', 'PENDING', 'RESOLVED'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-xs font-black px-3.5 py-1.5 rounded-xl transition ${
                      filter === f
                        ? 'bg-[#0F392B] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* List of Tickets */}
              {loading ? (
                <div className="py-12 text-center text-slate-400 text-sm font-semibold flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span>Syncing tickets...</span>
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-8 text-center">
                  <MessageSquare size={36} className="mx-auto text-slate-300 mb-2.5" />
                  <p className="text-slate-700 text-sm font-bold">No active tickets found</p>
                  <p className="text-slate-400 text-xs mt-1">Submitted queries and administrative responses will be tracked here live.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
                  {filteredTickets.map((t, idx) => (
                    <div 
                      key={t._id || idx} 
                      className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 hover:bg-white hover:shadow-md hover:border-slate-300 transition-all"
                    >
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                          {t.subject}
                        </h4>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0 ${
                          t.status === 'Resolved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          ● {t.status || 'Pending'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-3">
                        <Clock size={12} />
                        <span>{t.date || 'Today'}</span>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-200/70 leading-relaxed">
                        {t.message}
                      </p>
                      
                      {/* Verified Admin / Support Specialist Response */}
                      {t.status === 'Resolved' && t.reply && (
                        <div className="mt-3.5 pt-3 border-t border-slate-200/60">
                          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 uppercase tracking-wide mb-1.5">
                            <UserCheck size={14} className="text-emerald-600" />
                            <span>FreshMart Support Resolution</span>
                          </div>
                          <div className="text-xs sm:text-sm text-slate-800 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 leading-relaxed font-medium">
                            {t.reply}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Support;
