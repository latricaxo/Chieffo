import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Building2, 
  DollarSign, 
  PieChart, 
  Target 
} from 'lucide-react';
import { BusinessType, MonthlyRevenueRange, FinanceMethod, BusinessGoal } from '../types';
import { ChieffoLogo } from './ChieffoLogo';

interface OnboardingModalProps {
  userId: string;
  userName: string;
  onComplete: (data: {
    businessName: string;
    businessType: BusinessType;
    monthlyRevenueRange: MonthlyRevenueRange;
    financeManagementMethod: FinanceMethod;
    businessGoal: BusinessGoal;
  }) => Promise<void>;
  onSkip?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  userId,
  userName,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState<number>(1);
  const [businessName, setBusinessName] = useState<string>(`${userName}'s Business`);
  const [businessType, setBusinessType] = useState<BusinessType>('Freelancer');
  const [monthlyRevenueRange, setMonthlyRevenueRange] = useState<MonthlyRevenueRange>('$1K-$5K');
  const [financeManagementMethod, setFinanceManagementMethod] = useState<FinanceMethod>('Spreadsheet');
  const [businessGoal, setBusinessGoal] = useState<BusinessGoal>('Increase profit');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await onComplete({
        businessName,
        businessType,
        monthlyRevenueRange,
        financeManagementMethod,
        businessGoal,
      });
    } catch (err) {
      console.error('Error completing onboarding:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0D111A] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative overflow-hidden animate-scale-in">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ChieffoLogo className="w-10 h-10" />
            <div>
              <h2 className="text-xl font-bold text-white">Meet Chieffo AI</h2>
              <p className="text-xs text-gray-400">Step {step} of 4: Personalize Your AI CFO</p>
            </div>
          </div>
          {onSkip && (
            <button
              onClick={onSkip}
              className="text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              Skip
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1.5 rounded-full my-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step 1: Business Name & Type */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                What is your business name?
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., Acme Studio, Jane Doe Design"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                What best describes your business structure?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  'Freelancer',
                  'Creator',
                  'Consultant',
                  'Agency',
                  'Online Business',
                  'Other'
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBusinessType(type as BusinessType)}
                    className={`p-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      businessType === type
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <span>Next: Monthly Revenue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Monthly Revenue Range */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                What is your approximate monthly business revenue?
              </label>
              <div className="space-y-2.5">
                {[
                  { label: 'Under $1K', value: 'Under $1K', desc: 'Starting out or early side-hustle' },
                  { label: '$1K - $5K', value: '$1K-$5K', desc: 'Growing steady client stream' },
                  { label: '$5K - $10K', value: '$5K-$10K', desc: 'Established independent business' },
                  { label: '$10K+', value: '$10K+', desc: 'Scaling agency or high-revenue pro' }
                ].map((rev) => (
                  <button
                    key={rev.value}
                    type="button"
                    onClick={() => setMonthlyRevenueRange(rev.value as MonthlyRevenueRange)}
                    className={`w-full p-3.5 rounded-xl text-left border transition-all flex justify-between items-center ${
                      monthlyRevenueRange === rev.value
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{rev.label}</div>
                      <div className="text-xs text-gray-400">{rev.desc}</div>
                    </div>
                    {monthlyRevenueRange === rev.value && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-sm transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Next: Finance Method</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Finance Management Method */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                How do you currently track business finances?
              </label>
              <div className="space-y-2.5">
                {[
                  { name: 'Spreadsheet', desc: 'Google Sheets or Excel' },
                  { name: 'Accounting Software', desc: 'QuickBooks, Xero, FreshBooks' },
                  { name: 'Bank App', desc: 'Checking bank statements directly' },
                  { name: 'Accountant', desc: 'External CPA or bookkeeper' }
                ].map((method) => (
                  <button
                    key={method.name}
                    type="button"
                    onClick={() => setFinanceManagementMethod(method.name as FinanceMethod)}
                    className={`w-full p-3.5 rounded-xl text-left border transition-all flex justify-between items-center ${
                      financeManagementMethod === method.name
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{method.name}</div>
                      <div className="text-xs text-gray-400">{method.desc}</div>
                    </div>
                    {financeManagementMethod === method.name && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-sm transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Next: Primary Goal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Primary Goal */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                What is your #1 financial goal right now?
              </label>
              <div className="space-y-2.5">
                {[
                  { goal: 'Increase profit', desc: 'Trim waste and boost net margin' },
                  { goal: 'Grow revenue', desc: 'Acquire more clients and scale sales' },
                  { goal: 'Reduce expenses', desc: 'Identify software bloat and overhead' },
                  { goal: 'Prepare for taxes', desc: 'Set aside quarterly taxes stress-free' },
                  { goal: 'Better understand cash flow', desc: 'Always know your SpendReady™ balance' }
                ].map((item) => (
                  <button
                    key={item.goal}
                    type="button"
                    onClick={() => setBusinessGoal(item.goal as BusinessGoal)}
                    className={`w-full p-3.5 rounded-xl text-left border transition-all flex justify-between items-center ${
                      businessGoal === item.goal
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{item.goal}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                    {businessGoal === item.goal && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-sm transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Launch AI CFO Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
