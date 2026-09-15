import { useState } from 'react';
import { Heart, X, Coffee, CreditCard, Wallet } from 'lucide-react';

export default function DonationModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-950 border border-slate-700 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Heart className="text-rose-500 fill-rose-500" />
            Support the Project
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-rose-600 rounded p-1">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-slate-300">
          <p className="text-sm text-center bg-rose-900/10 border border-rose-500/20 p-4 rounded-xl">
            <strong className="text-rose-400 block mb-1">Completely Optional!</strong>
            Donations are not required to use the calculator. All funds go directly towards paying for the server and domain costs, and keeping the page updated with the latest mechanics and Pokemon.
          </p>

          <div className="space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2">Quick Options (No registration)</h3>
            
            <a href="https://paypal.me/EzChampionCalculator" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 p-3 rounded-xl transition-all group">
              <div className="bg-blue-900/50 p-2 rounded-lg text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CreditCard size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-slate-200">PayPal</div>
                <div className="text-xs text-slate-400">Pay with card or PayPal account</div>
              </div>
            </a>

            <a href="https://ko-fi.com/ezchampionscalculator" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-teal-500 p-3 rounded-xl transition-all group">
              <div className="bg-teal-900/50 p-2 rounded-lg text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <Coffee size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-slate-200">Ko-fi</div>
                <div className="text-xs text-slate-400">Fast checkout with Apple / Google Pay</div>
              </div>
            </a>

            

          </div>
        </div>
      </div>
    </div>
  );
}
