import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Zap,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { DailyBriefData, BusinessProfile } from '../types';

interface DailyBusinessBriefCardProps {
  userName: string;
  business: BusinessProfile;
  brief: DailyBriefData | null;
  isLoading: boolean;
  onRefresh: () => void;
  onActionClick?: (action: string) => void;
}

export const DailyBusinessBriefCard: React.FC<DailyBusinessBriefCardProps> = ({
  userName,
  business,
  brief,
  isLoading,
  onRefresh,
  onActionClick,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const defaultBrief: DailyBriefData = brief || {
    healthScore: 87,
    healthRating: 'Good',
    spendReady: 4850,
    revenueTrend: '+12% this month',
    cashFlowStatus: 'Healthy',
    aiRecommendation: 'Your revenue is increasing, but software expenses increased 18%. Review unused subscriptions to save approximately $300/month.',
    priorityAction: 'Follow up with overdue client invoices.',
    keyInsights: [
      '25% tax reserve is safely allocated in SpendReady™',
      'Strongest revenue velocity observed over mid-month payments'
    ],
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#0D111A] to-[#1E1B4B] border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
      
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold tracking-wide uppercase border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Today's Business Brief</span>
            </span>
            <span className="text-xs text-gray-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {getGreeting()}, <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">{userName}</span>.
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Here is your daily AI financial briefing for <strong className="text-white">{business.businessName}</strong>.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
          <span>{isLoading ? 'Analyzing Data...' : 'Refresh AI Brief'}</span>
        </button>
      </div>

      {/* Primary Financial Snapshot Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-white/10">
        
        {/* Metric 1: Financial Health Score */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Financial Health
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{defaultBrief.healthScore}</span>
            <span className="text-xs font-semibold text-gray-400">/100</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${
              defaultBrief.healthScore >= 80 ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' :
              defaultBrief.healthScore >= 60 ? 'bg-amber-400' : 'bg-red-400'
            }`} />
            <span className="text-xs font-medium text-emerald-300">{defaultBrief.healthRating}</span>
          </div>
        </div>

        {/* Metric 2: SpendReady (TM) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-emerald-900/10 border border-emerald-500/30">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SpendReady™</span>
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300">
            ${defaultBrief.spendReady.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-2 block font-medium">
            Safely spendable today
          </span>
        </div>

        {/* Metric 3: Revenue Trend */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Revenue Trend
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-1">
            <span>{defaultBrief.revenueTrend}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-sky-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Positive velocity</span>
          </div>
        </div>

        {/* Metric 4: Cash Flow Status */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Cash Flow
          </span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-300">
            {defaultBrief.cashFlowStatus}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-indigo-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Buffer active</span>
          </div>
        </div>

      </div>

      {/* AI Recommendation & Priority Action Blocks */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        
        {/* Executive Recommendation */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-blue-950/20 border border-indigo-500/30 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-300 mt-0.5">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">
              AI CFO Recommendation
            </span>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
              "{defaultBrief.aiRecommendation}"
            </p>
          </div>
        </div>

        {/* Priority Action Item */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-orange-950/20 border border-amber-500/30 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300 mt-0.5">
            <Target className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
              Today's Priority Action
            </span>
            <p className="text-xs sm:text-sm text-white font-semibold">
              "{defaultBrief.priorityAction}"
            </p>
            {onActionClick && (
              <button
                onClick={() => onActionClick(defaultBrief.priorityAction)}
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 underline transition-colors"
              >
                <span>Execute Action</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
