import { useState, useEffect } from 'react';
import { MessageSquare, X, Send, AlertCircle, CheckCircle } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submissionsToday, setSubmissionsToday] = useState(0);
  
  // REPLACE THIS WITH YOUR WEB3FORMS ACCESS KEY
  const ACCESS_KEY = "9ccb118d-1835-4d10-ad31-1bbc0c86bd3e";

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toDateString();
      try {
        const savedData = JSON.parse(localStorage.getItem('ez-feedback-limit') || '{"date": "", "count": 0}');
        if (savedData.date !== today) {
          setSubmissionsToday(0);
        } else {
          setSubmissionsToday(savedData.count);
        }
      } catch(e) {
        setSubmissionsToday(0);
      }
      setStatus('idle');
      setMessage('');
      setEmail('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || submissionsToday >= 5 || status === 'submitting') return;

    setStatus('submitting');
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: 'EZ Champions Feedback',
          email: email || 'Anonymous',
          message: message
        })
      });

      const result = await response.json();
      if (result.success) {
        setStatus('success');
        const newCount = submissionsToday + 1;
        setSubmissionsToday(newCount);
        localStorage.setItem('ez-feedback-limit', JSON.stringify({ date: new Date().toDateString(), count: newCount }));
        setTimeout(() => onClose(), 2500);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  const isLimitReached = submissionsToday >= 5;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-950 border border-slate-700 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="text-blue-400" />
            Send Feedback
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-rose-600 rounded p-1">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          <p className="text-sm text-slate-300">
            Found a bug? Have a suggestion? Let us know! You can send up to 5 messages per day.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email (Optional)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Leave it blank to remain anonymous"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
              disabled={status === 'submitting' || status === 'success' || isLimitReached}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Message <span className="text-rose-500">*</span></label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's on your mind?"
              required
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none placeholder:text-slate-600"
              disabled={status === 'submitting' || status === 'success' || isLimitReached}
            />
          </div>

          {isLimitReached && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-900/20 p-3 rounded-lg border border-rose-500/30 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>Daily limit reached (5/5). Please try again tomorrow!</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-900/20 p-3 rounded-lg border border-rose-500/30 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>An error occurred. Make sure the Access Key is valid!</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/30 text-sm font-bold">
              <CheckCircle size={16} className="shrink-0" />
              <span>Message sent successfully! Thank you.</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={status === 'submitting' || status === 'success' || isLimitReached || !message.trim()}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-xl transition-all"
          >
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
            <Send size={16} />
          </button>
          
          <div className="text-center text-[10px] text-slate-500 mt-2">
            {submissionsToday}/5 messages sent today
          </div>

        </form>
      </div>
    </div>
  );
}
