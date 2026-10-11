import React from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  DollarSign, 
  AlertTriangle, 
  Sparkles,
  Percent
} from 'lucide-react';
import { BusinessProfile, ExpenseItem, InvoiceItem } from '../types';

interface QuarterlyTaxViewProps {
  business: BusinessProfile;
  expenses: ExpenseItem[];
  invoices: InvoiceItem[];
}

export const QuarterlyTaxView: React.FC<QuarterlyTaxViewProps> = ({
  business,
  expenses,
  invoices,
}) => {
  const totalPaidInvoices = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  
  // Net profit estimation
  const netIncome = Math.max(totalPaidInvoices - totalExpenses, 4500);
  
  // Estimated self-employment + income tax rate (approx 25%)
  const estTaxRate = 0.25;
  const totalAnnualTaxEst = Math.round(netIncome * 12 * estTaxRate);
  const quarterlyPaymentEst = Math.round(totalAnnualTaxEst / 4);

  const quarters = [
    { name: 'Q1 Estimated Tax', due: 'April 15', status: 'Completed', amount: quarterlyPaymentEst },
    { name: 'Q2 Estimated Tax', due: 'June 15', status: 'Completed', amount: quarterlyPaymentEst },
    { name: 'Q3 Estimated Tax', due: 'September 15', status: 'Upcoming', amount: quarterlyPaymentEst },
    { name: 'Q4 Estimated Tax', due: 'January 15', status: 'Scheduled', amount: quarterlyPaymentEst },
  ];

  return (
    <div className="space-y-6 text-white pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D111A] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <Calculator className="w-6 h-6 text-amber-400" />
            <span>Quarterly Tax Estimator & Reserve</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Chieffo automatically reserves your self-employment tax liabilities inside SpendReady to prevent year-end tax surprises.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>25% Auto-Reserved Buffer</span>
        </div>
      </div>

      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#0D111A] border border-white/10">
          <span className="text-xs uppercase text-gray-400 font-semibold">Estimated Monthly Profit</span>
          <div className="text-2xl font-extrabold text-white mt-1">${netIncome.toLocaleString()}</div>
          <p className="text-[11px] text-gray-400 mt-1">Net revenue minus tracked overhead</p>
        </div>

        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30">
          <span className="text-xs uppercase text-amber-300 font-semibold">Q3 Tax Payment Due</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">${quarterlyPaymentEst.toLocaleString()}</div>
          <p className="text-[11px] text-amber-300/80 mt-1">Due Sept 15 • Auto-subtracted from SpendReady</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111A] border border-white/10">
          <span className="text-xs uppercase text-gray-400 font-semibold">Annual Tax Liability Est.</span>
          <div className="text-2xl font-extrabold text-white mt-1">${totalAnnualTaxEst.toLocaleString()}</div>
          <p className="text-[11px] text-gray-400 mt-1">Based on ~25% federal + state rate</p>
        </div>

      </div>

      {/* Quarter Timeline */}
      <div className="bg-[#0D111A] border border-white/10 rounded-3xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span>Quarterly Tax Calendar</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quarters.map((q, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${
                q.status === 'Upcoming'
                  ? 'bg-amber-500/10 border-amber-500/40 text-white'
                  : 'bg-white/5 border-white/10 text-gray-300'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold">{q.name}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  q.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                  q.status === 'Upcoming' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {q.status}
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white">${q.amount.toLocaleString()}</div>
              <div className="text-[11px] text-gray-400 mt-1">Deadline: {q.due}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Deduction Recommendations */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950/30 to-[#0D111A] border border-blue-500/30">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Chieffo AI Tax Deduction Finder</span>
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Based on your business profile as a <strong>{business.businessType}</strong>, ensure you log these key write-offs:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="font-bold text-blue-300 mb-1">💻 Home Office & Internet</div>
            <p className="text-gray-300">Deduct dedicated workspace square footage and portion of monthly fiber internet.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="font-bold text-blue-300 mb-1">⚡ Software & AI Subscriptions</div>
            <p className="text-gray-300">Design software, domain hosting, cloud infrastructure, and AI productivity tools are 100% deductible.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="font-bold text-blue-300 mb-1">🎓 Education & Professional Fees</div>
            <p className="text-gray-300">Client meals (50%), industry conferences, domain courses, and legal/accounting advice.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
