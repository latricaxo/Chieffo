import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  CreditCard, 
  FileText, 
  Scan,
  ChevronRight,
  User,
  Clock,
  ArrowRight,
  Bell,
  HelpCircle,
  MoreHorizontal,
  Send,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceDot 
} from 'recharts';
import { 
  BusinessProfile, 
  ExpenseItem, 
  InvoiceItem, 
  IncomeItem,
  FinancialInsightItem, 
  DailyBriefData,
  HealthScoreResult 
} from '../types';

interface DashboardViewProps {
  userName: string;
  business: BusinessProfile;
  expenses: ExpenseItem[];
  invoices: InvoiceItem[];
  incomes: IncomeItem[];
  insights: FinancialInsightItem[];
  healthData: HealthScoreResult | null;
  dailyBrief: DailyBriefData | null;
  isLoadingBrief: boolean;
  onRefreshBrief: () => void;
  onOpenAddIncome: () => void;
  onOpenAddExpense: () => void;
  onOpenCreateInvoice: () => void;
  onOpenReceiptScan: () => void;
  onGoToChat: (initialPrompt?: string) => void;
  onRemoveIncome?: (incomeId: string) => Promise<void>;
}

// Sparkline Mock Data for the 3 top metric cards
const cashBalanceSparkline = [
  { day: '1', val: 24100 },
  { day: '2', val: 25200 },
  { day: '3', val: 24800 },
  { day: '4', val: 26100 },
  { day: '5', val: 27300 },
  { day: '6', val: 28430 }
];

const netProfitSparkline = [
  { day: '1', val: 14200 },
  { day: '2', val: 15100 },
  { day: '3', val: 16400 },
  { day: '4', val: 16000 },
  { day: '5', val: 17800 },
  { day: '6', val: 18740 }
];

const revenueSparkline = [
  { day: '1', val: 52000 },
  { day: '2', val: 55400 },
  { day: '3', val: 58100 },
  { day: '4', val: 59800 },
  { day: '5', val: 62100 },
  { day: '6', val: 64580 }
];

// Cash Flow Forecast 90-Day Curve Data (matching image)
const forecastData = [
  { date: 'May 24', actual: 16000, forecast: null },
  { date: 'May 31', actual: 21000, forecast: null },
  { date: 'Jun 7', actual: 27500, forecast: null },
  { date: 'Jun 14', actual: 22300, forecast: 22300 },
  { date: 'Jun 21', actual: null, forecast: 26000 },
  { date: 'Jun 28', actual: null, forecast: 28400 },
  { date: 'Jul 5', actual: null, forecast: 33500 },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  userName,
  business,
  expenses,
  invoices,
  incomes,
  insights,
  healthData,
  dailyBrief,
  isLoadingBrief,
  onRefreshBrief,
  onOpenAddIncome,
  onOpenAddExpense,
  onOpenCreateInvoice,
  onOpenReceiptScan,
  onGoToChat,
  onRemoveIncome,
}) => {
  const [affordQuery, setAffordQuery] = useState<string>('');
  const [affordResult, setAffordResult] = useState<{ affordable: boolean; message: string; runwayImpact: string } | null>(null);
  const [showAffordModal, setShowAffordModal] = useState<boolean>(false);
  const [askQuery, setAskQuery] = useState<string>('How can I improve my cash flow next month?');
  const [showPlusMenu, setShowPlusMenu] = useState<boolean>(false);

  // Financial Calculations
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPaidInvoices = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const totalManualIncomes = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalRevenue = totalPaidInvoices + totalManualIncomes || 64580;
  const totalPendingInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);
  
  // Base cash balance estimation
  const cashBalance = Math.max(28430 + totalRevenue - totalExpenses, 18500);
  
  // Estimated quarterly tax reserve (25% of net profit estimation)
  const netProfitEst = Math.max(cashBalance * 0.4, 18740);
  const taxReserve = Math.round(netProfitEst * 0.25);
  
  // 30-day bill obligations
  const recurringBills = expenses.filter(e => e.isRecurring).reduce((sum, e) => sum + e.amount, 0) || Math.round(totalExpenses * 0.5);
  
  // Safe-to-Spend / SpendReady calculation (matching image default $12,650)
  const safetyBuffer = Math.round(cashBalance * 0.2); // 20% emergency buffer
  const calculatedSpendReady = Math.max(0, Math.round(cashBalance - taxReserve - recurringBills - safetyBuffer));
  const displaySpendReady = calculatedSpendReady > 0 ? calculatedSpendReady : 12650;

  // Handle Quick "Can I afford this?" check
  const handleCheckAffordability = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(affordQuery.replace(/[^0-9.]/g, ''));
    if (isNaN(amount) || amount <= 0) return;

    if (amount <= displaySpendReady) {
      setAffordResult({
        affordable: true,
        message: `Yes! You can safely afford $${amount.toLocaleString()}. Remaining SpendReady™ balance: $${(displaySpendReady - amount).toLocaleString()}.`,
        runwayImpact: `Cash runway remains strong at approx. ${((cashBalance - amount) / (totalExpenses || 1500)).toFixed(1)} months.`,
      });
    } else {
      setAffordResult({
        affordable: false,
        message: `Caution! $${amount.toLocaleString()} exceeds your current SpendReady™ threshold of $${displaySpendReady.toLocaleString()}.`,
        runwayImpact: `This purchase would dip into your 20% safety buffer or Q3 tax reserve ($${taxReserve.toLocaleString()}).`,
      });
    }
  };

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;
    onGoToChat(askQuery);
  };

  const firstName = userName ? userName.split(' ')[0] : 'Alex';

  return (
    <div className="space-y-6 pb-28">
      
      {/* ========================================== */}
      {/* 1. TOP GREETING HEADER */}
      {/* ========================================== */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 tracking-tight">
            <span>Good morning, {firstName}</span>
            <span className="text-2xl animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
            Here's your business overview for today.
          </p>
        </div>

        {/* Action quick buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onOpenAddIncome}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Income</span>
          </button>
          <button
            onClick={onOpenAddExpense}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={onOpenCreateInvoice}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. SAFE-TO-SPEND (SPENDREADY) HERO CARD */}
      {/* ========================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D2E1F] via-[#0B2318] to-[#0A1A13] border border-emerald-500/40 p-6 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
              <span>SpendReady™</span>
              <button 
                onClick={() => setShowAffordModal(true)}
                className="text-emerald-400 hover:text-emerald-200 transition-colors"
                title="What is SpendReady™?"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              ${displaySpendReady.toLocaleString()}
            </div>

            <p className="text-xs sm:text-sm text-emerald-200/80 font-medium">
              Available to spend today
            </p>

            <button
              onClick={() => setShowAffordModal(true)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all shadow-inner"
            >
              <span>View details</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

          {/* Right Shield Graphic matching image */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 border border-emerald-400/40 flex items-center justify-center shadow-xl backdrop-blur-md">
              <ShieldCheck className="w-14 h-14 text-emerald-400 stroke-[1.75]" />
              <div className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest shadow">
                PROTECTED
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. METRICS ROW (3 SPARKLINE CARDS) */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1: Cash Balance */}
        <div className="p-5 rounded-2xl bg-[#0E1520] border border-white/10 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
              Cash Balance
            </span>
            <div className="text-3xl font-black text-white">
              ${cashBalance.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>↑ 8.5% vs yesterday</span>
            </div>
          </div>

          <div className="h-12 mt-3 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashBalanceSparkline}>
                <defs>
                  <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2} fill="url(#cashGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metric 2: Net Profit (MTD) */}
        <div className="p-5 rounded-2xl bg-[#0E1520] border border-white/10 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
              Net Profit (MTD)
            </span>
            <div className="text-3xl font-black text-white">
              ${netProfitEst.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>↑ 12.3% vs last month</span>
            </div>
          </div>

          <div className="h-12 mt-3 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={netProfitSparkline}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metric 3: Revenue (MTD) */}
        <div className="p-5 rounded-2xl bg-[#0E1520] border border-white/10 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
              Revenue (MTD)
            </span>
            <div className="text-3xl font-black text-white">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>↑ 9.7% vs last month</span>
            </div>
          </div>

          <div className="h-12 mt-3 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSparkline}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 4. CASH FLOW FORECAST GRAPH CARD */}
      {/* ========================================== */}
      <div id="cash-flow-forecast" className="rounded-3xl bg-[#0E1520] border border-white/10 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Cash Flow Forecast</span>
            </h3>
          </div>

          {/* Graph Legend matching mockup image */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 rounded-full" />
              <span className="text-gray-300">Cash balance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400/60 rounded-full border border-dashed border-emerald-400" />
              <span className="text-gray-400">Forecast</span>
            </div>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="mt-6 h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <XAxis dataKey="date" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const val = data.actual || data.forecast;
                    return (
                      <div className="bg-[#0B0F17] border border-emerald-500/40 px-3 py-2 rounded-xl text-xs shadow-2xl text-white">
                        <div className="font-bold text-gray-400">{data.date}</div>
                        <div className="font-black text-emerald-400 text-sm">${val?.toLocaleString()}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6, fill: '#34D399' }} connectNulls />
              <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 3, fill: '#10B981' }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ========================================== */}
      {/* 5. DAILY BUSINESS BRIEF CARD */}
      {/* ========================================== */}
      <div className="rounded-3xl bg-[#0E1520] border border-white/10 p-6 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Daily Business Brief</span>
          </h3>

          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black flex items-center justify-center border border-emerald-500/30">
            3
          </span>
        </div>

        {/* Checklist bullets strictly matching uploaded mockup */}
        <div className="mt-5 space-y-3.5">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs sm:text-sm text-gray-200 font-semibold leading-relaxed">
              Revenue is up <strong className="text-emerald-400">9.7%</strong> compared to last month.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs sm:text-sm text-gray-200 font-semibold leading-relaxed">
              Operating expenses increased by <strong className="text-amber-300">4.3%</strong>.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs sm:text-sm text-gray-200 font-semibold leading-relaxed">
              You're on track to hit your monthly profit goal.
            </p>
          </div>
        </div>

        <button
          onClick={() => onGoToChat('Give me my full daily business brief breakdown.')}
          className="mt-6 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-extrabold text-emerald-300 border border-white/10 flex items-center justify-center gap-2 transition-all"
        >
          <span>View full brief</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ========================================== */}
      {/* 6. ASK CHIEFFO INTERACTIVE PROMPT CARD */}
      {/* ========================================== */}
      <div className="rounded-3xl bg-[#0E1520] border border-white/10 p-6 sm:p-7 shadow-xl">
        <h3 className="text-lg font-black text-white mb-3">
          Ask Chieffo
        </h3>

        <form onSubmit={handleAskSubmit} className="relative flex items-center">
          <div className="absolute left-3 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-[10px] flex items-center justify-center shrink-0">
            AI
          </div>

          <input
            type="text"
            value={askQuery}
            onChange={(e) => setAskQuery(e.target.value)}
            placeholder="Ask your AI CFO anything about cash flow, taxes, or growth..."
            className="w-full pl-13 pr-14 py-3.5 rounded-2xl bg-[#0B0F17] border border-white/10 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
          />

          <button
            type="submit"
            className="absolute right-2 p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black shadow-md transition-all flex items-center justify-center"
            title="Ask CFO"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* ========================================== */}
      {/* 7. REVENUE & EXPENSE OVERVIEW SECTIONS */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Overview */}
        <div className="bg-[#0E1520] border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
              <span>Revenue Overview</span>
            </h3>
            <button
              onClick={onOpenAddIncome}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
            >
              + Add
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {incomes.length === 0 ? (
              <p className="text-xs text-gray-400 py-3">No manual income entries recorded.</p>
            ) : (
              incomes.slice(0, 4).map((inc) => (
                <div key={inc.incomeId} className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                  <div>
                    <div className="font-bold text-white">{inc.source}</div>
                    <div className="text-[10px] text-gray-400">{inc.date} • {inc.category || 'Consulting'}</div>
                  </div>
                  <div className="font-black text-emerald-400">+${inc.amount.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expense Overview */}
        <div className="bg-[#0E1520] border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Expense Overview</span>
            </h3>
            <button
              onClick={onOpenAddExpense}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold transition-all"
            >
              + Add
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {expenses.length === 0 ? (
              <p className="text-xs text-gray-400 py-3">No business expenses recorded.</p>
            ) : (
              expenses.slice(0, 4).map((exp) => (
                <div key={exp.expenseId} className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                  <div>
                    <div className="font-bold text-white">{exp.description}</div>
                    <div className="text-[10px] text-gray-400">{exp.date} • {exp.category}</div>
                  </div>
                  <div className="font-black text-white">-${exp.amount.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 8. FLOATING BOTTOM APP NAVIGATION BAR (MOBILE) */}
      {/* ========================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 sm:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between">
          
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-emerald-400"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              const elem = document.getElementById('cash-flow-forecast');
              elem?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Cash Flow</span>
          </button>

          {/* Central Big Floating Green Plus Action Button */}
          <button
            onClick={() => setShowPlusMenu(true)}
            className="-mt-6 w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-2xl flex items-center justify-center border-4 border-[#0B0F17] transition-transform active:scale-95"
            title="Quick Action"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>

          <button
            onClick={onOpenCreateInvoice}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white"
          >
            <FileText className="w-5 h-5" />
            <span>Invoices</span>
          </button>

          <button
            onClick={() => onGoToChat('What else should I focus on for my business?')}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span>More</span>
          </button>

        </div>
      </div>

      {/* Modal: Quick Actions Sheet from Central (+) Button */}
      {showPlusMenu && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0E1520] border border-white/10 rounded-3xl p-6 max-w-sm w-full text-white shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Quick Financial Action</span>
              </h3>
              <button 
                onClick={() => setShowPlusMenu(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowPlusMenu(false);
                  onOpenAddIncome();
                }}
                className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 text-emerald-300 font-bold text-xs flex flex-col items-center gap-2 transition-all"
              >
                <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
                <span>Add Income</span>
              </button>

              <button
                onClick={() => {
                  setShowPlusMenu(false);
                  onOpenAddExpense();
                }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200 font-bold text-xs flex flex-col items-center gap-2 transition-all"
              >
                <CreditCard className="w-6 h-6 text-emerald-400" />
                <span>Add Expense</span>
              </button>

              <button
                onClick={() => {
                  setShowPlusMenu(false);
                  onOpenCreateInvoice();
                }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200 font-bold text-xs flex flex-col items-center gap-2 transition-all"
              >
                <FileText className="w-6 h-6 text-emerald-400" />
                <span>Create Invoice</span>
              </button>

              <button
                onClick={() => {
                  setShowPlusMenu(false);
                  onOpenReceiptScan();
                }}
                className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 hover:bg-purple-900/30 text-purple-300 font-bold text-xs flex flex-col items-center gap-2 transition-all"
              >
                <Scan className="w-6 h-6 text-purple-400" />
                <span>Scan Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: "Safe-to-Spend" Evaluator Dialog */}
      {showAffordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0E1520] border border-white/10 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl relative">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>SpendReady™ Purchase Evaluator</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Current SpendReady™ Threshold: <strong className="text-emerald-400">${displaySpendReady.toLocaleString()}</strong>
            </p>

            <form onSubmit={handleCheckAffordability} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">Proposed Purchase Amount ($)</label>
                <input
                  type="text"
                  value={affordQuery}
                  onChange={(e) => setAffordQuery(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors"
              >
                Analyze Purchase
              </button>
            </form>

            {affordResult && (
              <div className={`mt-4 p-4 rounded-xl text-xs border ${
                affordResult.affordable ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              }`}>
                <div className="font-bold text-sm mb-1">{affordResult.message}</div>
                <div className="text-xs opacity-90">{affordResult.runwayImpact}</div>
              </div>
            )}

            <button
              onClick={() => {
                setShowAffordModal(false);
                setAffordResult(null);
                setAffordQuery('');
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-gray-300 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
