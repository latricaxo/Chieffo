import React from 'react';
import { 
  Bot, 
  Sparkles, 
  LogOut, 
  User as UserIcon, 
  TrendingUp, 
  FileText, 
  CreditCard, 
  Calculator, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { UserProfile, BusinessProfile } from '../types';
import { ChieffoLogo } from './ChieffoLogo';

interface NavbarProps {
  user: UserProfile | null;
  business: BusinessProfile | null;
  activeTab: 'landing' | 'pricing' | 'dashboard' | 'chat' | 'expenses' | 'invoices' | 'taxes';
  setActiveTab: (tab: 'landing' | 'pricing' | 'dashboard' | 'chat' | 'expenses' | 'invoices' | 'taxes') => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  business,
  activeTab,
  setActiveTab,
  onLoginClick,
  onLogoutClick,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0B0F17]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setActiveTab(user ? 'dashboard' : 'landing')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <ChieffoLogo className="w-9 h-9 group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">Chieffo</span>
              <span className="hidden sm:inline-block text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 tracking-wider">
                AI CFO
              </span>
            </div>
            <p className="text-[10px] text-emerald-400/90 font-semibold tracking-wide uppercase hidden sm:block">
              AI CFO FOR EVERY BUSINESS
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {!user ? (
            <>
              <button
                onClick={() => setActiveTab('landing')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'landing' ? 'bg-emerald-500 text-black shadow-sm font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  setActiveTab('landing');
                  setTimeout(() => {
                    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'pricing' ? 'bg-emerald-500 text-black shadow-sm font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Pricing
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-emerald-500 text-black font-bold shadow' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'chat' ? 'bg-emerald-500 text-black font-bold shadow' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask Chieffo
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'expenses' ? 'bg-emerald-500 text-black font-bold shadow' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Expenses
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'invoices' ? 'bg-emerald-500 text-black font-bold shadow' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Invoices
              </button>
              <button
                onClick={() => setActiveTab('taxes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'taxes' ? 'bg-emerald-500 text-black font-bold shadow' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                Taxes
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'pricing' ? 'bg-emerald-500 text-black font-bold shadow' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Pricing
              </button>
            </>
          )}
        </nav>

        {/* User Status / Login Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {business && (
                <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-medium truncate max-w-[120px]">{business.businessName}</span>
                </div>
              )}

              {/* Notification Bell matching image */}
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                title="Notifications"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-black text-[9px] font-black flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-black">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-xs font-semibold text-gray-200 hidden sm:inline truncate max-w-[100px]">
                  {user.name.split(' ')[0]}
                </span>
              </div>

              <button
                onClick={onLogoutClick}
                title="Sign Out"
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 border border-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar for Logged-In Users */}
      {user && (
        <div className="md:hidden flex items-center justify-around border-t border-white/10 py-2 bg-[#0B0F17]/95 px-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
              activeTab === 'dashboard' ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
              activeTab === 'chat' ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask CFO</span>
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
              activeTab === 'expenses' ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Expenses</span>
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
              activeTab === 'invoices' ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Invoices</span>
          </button>
          <button
            onClick={() => setActiveTab('taxes')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
              activeTab === 'taxes' ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Taxes</span>
          </button>
        </div>
      )}
    </header>
  );
};
