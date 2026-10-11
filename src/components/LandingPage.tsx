import React from 'react';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  BrainCircuit, 
  DollarSign, 
  ArrowRight, 
  Zap, 
  PieChart, 
  Briefcase, 
  UserCheck, 
  ChevronRight,
  Shield
} from 'lucide-react';
import { ChieffoLogo } from './ChieffoLogo';

interface LandingPageProps {
  onLoginClick: () => void;
  onSeeHowItWorksClick: () => void;
  onGoToPricing: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginClick,
  onSeeHowItWorksClick,
  onGoToPricing,
}) => {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white overflow-hidden selection:bg-emerald-500 selection:text-black">
      
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-600/15 via-emerald-600/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300 backdrop-blur-md mb-8 animate-fade-in shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Chieffo AI CFO</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Your Business Now Has a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">CFO.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
          Understand your cash flow, know what you can safely spend with SpendReady™, and make smarter financial decisions with your AI-powered chief financial officer.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={onLoginClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
          >
            <span>Get Started For Free</span>
            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onSeeHowItWorksClick}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 font-semibold text-base border border-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2"
          >
            <span>See How It Works</span>
          </button>
        </div>

        {/* Free plan disclaimer */}
        <div className="mt-4 text-xs text-gray-400 flex flex-col items-center justify-center gap-1 font-medium">
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Free Starter Plan</span>
          </p>
          <p>No credit card required</p>
        </div>

        {/* Interactive AI CFO Visual Mockup Card matching image */}
        <div className="mt-16 relative max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-emerald-500/40 via-white/10 to-transparent shadow-2xl shadow-emerald-900/30">
          <div className="bg-[#0E1520] rounded-[22px] p-4 sm:p-8 text-left border border-white/10">
            
            {/* Mock Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs text-gray-400 ml-2 font-mono">Chieffo Command Center</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SpendReady™ Live
              </span>
            </div>

            {/* Simulated CFO Core Answer Box */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Question & Answer Widget */}
              <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0B0F17] to-transparent border border-emerald-500/30">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300 mb-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white bg-white/5 p-3 rounded-xl border border-white/10">
                  "Can I hire a contractor for $2,500/month?"
                </p>
                <div className="mt-3 text-xs text-gray-300 space-y-2 leading-relaxed font-medium">
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓ Verdict:</span> 
                    <span>Yes, safely! Your SpendReady™ balance is <strong className="text-emerald-300">$12,650</strong>. After contractor costs, your cash runway remains <strong>8.2 months</strong> with $1,800 reserved for Q3 taxes.</span>
                  </p>
                </div>
              </div>

              {/* SpendReady Widget */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0D2E1F] to-[#0E1520] border border-emerald-500/40 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-extrabold">SpendReady™ Limit</span>
                  <div className="text-3xl font-black text-white mt-1">$12,650</div>
                  <p className="text-[11px] text-emerald-200/80 mt-1 font-medium">Available to spend without endangering upcoming bills or taxes.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-gray-300">Cash Balance</span>
                  <span className="text-emerald-400 font-bold">$28,430 ↑</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 mb-2">Built For Entrepreneurs</h2>
          <p className="text-3xl sm:text-4xl font-black text-white">
            The Intelligence Layer For Your Business Finances
          </p>
          <p className="mt-4 text-gray-400 text-sm sm:text-base font-medium">
            Chieffo turns complex spreadsheets into instant executive guidance, automated cash planning, and stress-free spending clarity with SpendReady™.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. AI CFO */}
          <div className="p-6 rounded-2xl bg-[#0E1520] hover:bg-white/[0.06] border border-white/10 transition-all hover:border-emerald-500/40 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">1. AI CFO</h3>
            <p className="text-xs text-emerald-300 font-medium mt-1">Your Intelligent Financial Officer</p>
            <ul className="mt-4 text-sm text-gray-300 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Executive Strategic Recommendations</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Proactive Risk & Overhead Detection</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Real-time Business Financial Guidance</li>
            </ul>
          </div>

          {/* 2. SpendReady Intelligence */}
          <div className="p-6 rounded-2xl bg-[#0E1520] hover:bg-white/[0.06] border border-white/10 transition-all hover:border-emerald-500/40 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">2. SpendReady™ Limit</h3>
            <p className="text-xs text-emerald-300 font-medium mt-1">Know What You Can Safely Spend</p>
            <ul className="mt-4 text-sm text-gray-300 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Analyzes recurring bills & subscription obligations</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Reserves quarterly tax obligations automatically</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Protects 30-to-90 day runway safety buffers</li>
            </ul>
          </div>

          {/* 3. Financial Command Center */}
          <div className="p-6 rounded-2xl bg-[#0E1520] hover:bg-white/[0.06] border border-white/10 transition-all hover:border-emerald-500/40 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">3. Financial Command Center</h3>
            <p className="text-xs text-emerald-300 font-medium mt-1">Complete Cash Control</p>
            <ul className="mt-4 text-sm text-gray-300 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Real-time cash position & liquidity view</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Categorized spending organization & analytics</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 90-day cash flow & runway forecasting</li>
            </ul>
          </div>

          {/* 4. AI Bookkeeper */}
          <div className="p-6 rounded-2xl bg-[#0E1520] hover:bg-white/[0.06] border border-white/10 transition-all hover:border-emerald-500/40 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">4. AI Bookkeeper</h3>
            <p className="text-xs text-emerald-300 font-medium mt-1">Automated Categorization & OCR</p>
            <ul className="mt-4 text-sm text-gray-300 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Instant receipt scanning & text extraction</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Smart tax category auto-assignments</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Transaction summaries & vendor breakdowns</li>
            </ul>
          </div>

          {/* 5. Invoice Intelligence */}
          <div className="p-6 rounded-2xl bg-[#0E1520] hover:bg-white/[0.06] border border-white/10 transition-all hover:border-emerald-500/40 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">5. Invoice Intelligence</h3>
            <p className="text-xs text-emerald-300 font-medium mt-1">Faster Payments & Revenue Forecasts</p>
            <ul className="mt-4 text-sm text-gray-300 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Modern client invoice generation & status tracking</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Overdue payment reminders & velocity tracking</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Direct impact modeling on future cash flow</li>
            </ul>
          </div>

          {/* 6. Business Memory */}
          <div className="p-6 rounded-2xl bg-[#0E1520] hover:bg-white/[0.06] border border-white/10 transition-all hover:border-emerald-500/40 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">6. Business Memory</h3>
            <p className="text-xs text-emerald-300 font-medium mt-1">Chieffo Learns & Remembers</p>
            <ul className="mt-4 text-sm text-gray-300 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Tracks historical spending habits over time</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Remembers recurring revenue seasonality</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Tailors AI recommendations to your exact goals</li>
            </ul>
          </div>

        </div>

      </section>

      {/* WHO IS CHIEFFO FOR? */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Designed For Modern Business Builders</h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 font-medium">Replace anxiety with clear financial answers tailored for your work style.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { title: 'Freelancers', desc: 'Designers, Developers, Writers' },
            { title: 'Creators', desc: 'YouTubers, Podcasters, Substackers' },
            { title: 'Consultants', desc: 'Strategy, Marketing, Tech Advisors' },
            { title: 'Coaches', desc: 'Executive, Fitness, Business' },
            { title: 'Independent Pros', desc: 'Lawyers, Accountants, Agents' },
            { title: 'Online Businesses', desc: 'E-commerce, SaaS, Agencies' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#0E1520] border border-white/10 text-center hover:border-emerald-500/30 transition-colors">
              <Briefcase className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-sm font-extrabold text-white">{item.title}</div>
              <div className="text-[10px] text-gray-400 mt-0.5 font-medium">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PREVIEW BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#0E1520] to-emerald-950/60 border border-emerald-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Bot className="w-48 h-48 text-emerald-400" />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Start Free Today
          </span>
          <h3 className="text-3xl font-black text-white mt-4">Get Your Virtual CFO in 60 Seconds</h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto mt-2 font-medium">
            No long onboarding calls. No expensive monthly accounting retainers. Just sign in with Google and let Chieffo secure your cash flow.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLoginClick}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>Get Started For Free</span>
            </button>
            
            <button
              onClick={onGoToPricing}
              className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs border border-white/10 transition-colors"
            >
              View Full Plan Breakdown
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <ChieffoLogo className="w-6 h-6" showGlow={false} />
          <span className="font-extrabold text-white">Chieffo</span>
          <span>© {new Date().getFullYear()} Chieffo AI Inc. All rights reserved.</span>
        </div>
        <p className="text-[11px] text-gray-400 max-w-md text-center sm:text-right font-medium">
          Chieffo is an AI financial decision engine, not a bank or licensed accounting firm. All insights are generated for business intelligence purposes.
        </p>
      </footer>

    </div>
  );
};
