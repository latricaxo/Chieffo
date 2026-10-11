import React from 'react';
import { 
  Check, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Bot, 
  Building2,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface PricingPageProps {
  user: UserProfile | null;
  isProActive?: boolean;
  onTogglePro?: () => void;
  onLoginClick: () => void;
  onGoToDashboard: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  user,
  isProActive = false,
  onTogglePro,
  onLoginClick,
  onGoToDashboard,
}) => {
  return (
    <div className="min-h-screen bg-[#07090E] text-white py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Transparent Pricing</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Simple, Fair Plans for Every Entrepreneur
        </h1>
        <p className="mt-4 text-gray-400 text-base">
          Start with our feature-rich Free plan today. Upgrade to Pro when your business scales.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* FREE PLAN CARD */}
        <div className="rounded-3xl p-8 bg-[#0D111A] border border-white/10 relative flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">Free</h3>
                <p className="text-xs text-gray-400 mt-1">Essential CFO intelligence for freelancers & creators.</p>
              </div>
            </div>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-black text-white">$0</span>
              <span className="text-sm text-gray-400">/month</span>
            </div>

            <p className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-400" /> No credit card required
            </p>

            <hr className="my-6 border-white/10" />

            {/* Included Features */}
            <div className="space-y-3 text-sm text-gray-300">
              <div className="font-semibold text-xs uppercase text-gray-400 tracking-wider">Includes:</div>
              <ul className="space-y-2.5">
                {[
                  'Financial Dashboard',
                  'SpendReady™ Safe Spending Limit',
                  'Expense Tracking',
                  'Basic AI CFO Chat',
                  'Cash Flow Overview',
                  '90-Day Runway Forecasting',
                  'Client Invoicing',
                  'Quarterly Tax Tracker',
                  'Business Financial Health Score',
                  'Automated Alerts & Reminders',
                  'Strategic Financial Recommendations'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4">
            {user ? (
              <button
                onClick={onGoToDashboard}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Go to Your Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* PRO PLAN CARD */}
        <div className="rounded-3xl p-8 bg-gradient-to-b from-[#111625] to-[#0A0D14] border-2 border-indigo-500/40 relative flex flex-col justify-between shadow-2xl overflow-hidden">
          
          {/* Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {isProActive ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> PRO ACTIVATED
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> COMING SOON
              </span>
            )}
          </div>

          <div>
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                Pro
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </h3>
              <p className="text-xs text-gray-400 mt-1">Full autonomous CFO intelligence for scaling businesses.</p>
            </div>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-black text-white">$39</span>
              <span className="text-sm text-gray-400">/month</span>
            </div>

            <p className="text-xs text-indigo-300 font-medium mt-2">
              Everything in Free, plus advanced AI tools & OCR bookkeeper.
            </p>

            <hr className="my-6 border-white/10" />

            {/* Pro Features */}
            <div className="space-y-3 text-sm text-gray-300">
              <div className="font-semibold text-xs uppercase text-indigo-300 tracking-wider">Everything in Free, PLUS:</div>
              <ul className="space-y-2.5">
                {[
                  'Advanced AI CFO',
                  'AI Bookkeeper',
                  'Invoice Intelligence',
                  'Advanced Financial Reports',
                  'Business Memory',
                  'Scenario Simulation',
                  'Receipt Capture',
                  'Deeper Financial Insights',
                  'Advanced Recommendations'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-medium text-white">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4">
            <button
              disabled
              className="w-full py-3.5 rounded-xl bg-white/10 text-gray-400 font-semibold text-sm border border-white/10 flex items-center justify-center gap-2 cursor-not-allowed opacity-75"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{isProActive ? 'Pro Features Active' : 'Coming Soon'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Security & Guarantee Note */}
      <div className="mt-16 text-center text-xs text-gray-400 max-w-md mx-auto space-y-1">
        <p className="flex items-center justify-center gap-2 font-medium text-gray-300">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Bank-Grade Encryption • Firebase Authentication Secured</span>
        </p>
        <p>Your financial data is private and accessible only to your authenticated Google account.</p>
      </div>

    </div>
  );
};
