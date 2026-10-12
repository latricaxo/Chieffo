import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle, 
  signInAsGuest,
  logOut, 
  getUserProfile, 
  getUserSettings, 
  updateUserSettings, 
  getBusinessProfile, 
  saveBusinessProfile, 
  fetchExpenses, 
  createExpense, 
  removeExpense, 
  fetchInvoices, 
  createInvoice, 
  updateInvoiceStatus, 
  removeInvoice, 
  fetchIncomes,
  createIncome,
  removeIncome,
  fetchReceipts, 
  fetchFinancialInsights, 
  saveFinancialInsight, 
  fetchAIMemories, 
  saveAIMemory 
} from './lib/firebase';
import { 
  UserProfile, 
  BusinessProfile, 
  ExpenseItem, 
  InvoiceItem, 
  IncomeItem,
  ReceiptItem, 
  FinancialInsightItem, 
  AIMemoryItem, 
  DailyBriefData,
  HealthScoreResult,
  BusinessType,
  MonthlyRevenueRange,
  FinanceMethod,
  BusinessGoal
} from './types';

import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PricingPage } from './components/PricingPage';
import { OnboardingModal } from './components/OnboardingModal';
import { AddIncomeModal } from './components/AddIncomeModal';
import { DashboardView } from './components/DashboardView';
import { AICFOChat } from './components/AICFOChat';
import { ExpensesView } from './components/ExpensesView';
import { InvoicesView } from './components/InvoicesView';
import { QuarterlyTaxView } from './components/QuarterlyTaxView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isProActive, setIsProActive] = useState<boolean>(false);

  // App Navigation tab state (defaults to 'landing' for non-logged-in users, immediately switches to 'dashboard' post-login)
  const [activeTab, setActiveTab] = useState<'landing' | 'pricing' | 'dashboard' | 'chat' | 'expenses' | 'invoices' | 'taxes'>('landing');
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);
  const [showReceiptScanOnExpenses, setShowReceiptScanOnExpenses] = useState<boolean>(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState<boolean>(false);

  // Data Collections
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [incomes, setIncomes] = useState<IncomeItem[]>([]);
  const [insights, setInsights] = useState<FinancialInsightItem[]>([]);
  const [memories, setMemories] = useState<AIMemoryItem[]>([]);
  const [healthData, setHealthData] = useState<HealthScoreResult | null>(null);
  const [dailyBrief, setDailyBrief] = useState<DailyBriefData | null>(null);
  const [isLoadingBrief, setIsLoadingBrief] = useState<boolean>(false);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (fbUser: User | null) => {
      setIsLoadingAuth(true);
      if (fbUser) {
        try {
          const profile = await getUserProfile(fbUser.uid);
          const userProfile: UserProfile = profile || {
            uid: fbUser.uid,
            name: fbUser.displayName || (fbUser.isAnonymous ? 'Guest Entrepreneur' : 'Entrepreneur'),
            email: fbUser.email || (fbUser.isAnonymous ? 'guest@chieffo.ai' : ''),
            profileImage: fbUser.photoURL || undefined,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };
          setCurrentUser(userProfile);

          // Check settings & business
          const settings = await getUserSettings(fbUser.uid);
          let busProfile = await getBusinessProfile(fbUser.uid);
          
          if (!busProfile) {
            busProfile = {
              businessId: `bus-${fbUser.uid.slice(0, 8)}`,
              userId: fbUser.uid,
              businessName: fbUser.isAnonymous ? 'Guest Ventures' : `${userProfile.name.split(' ')[0]}'s Business`,
              businessType: 'Consultant',
              monthlyRevenueRange: '$5K-$10K',
              financeManagementMethod: 'Spreadsheet',
              businessGoal: 'Increase profit',
              createdAt: new Date().toISOString(),
            };
          }

          setBusiness(busProfile);

          if (!settings?.onboardingComplete && !fbUser.isAnonymous) {
            setNeedsOnboarding(true);
          } else {
            setNeedsOnboarding(false);
          }

          // POST LOGIN EXPERIENCE: Always direct user immediately to Dashboard
          setActiveTab('dashboard');
          await loadUserData(fbUser.uid, busProfile, userProfile.name);
        } catch (err) {
          console.error('Error hydrating user session:', err);
          const fallbackProfile: UserProfile = {
            uid: fbUser.uid,
            name: fbUser.displayName || 'Entrepreneur',
            email: fbUser.email || '',
            profileImage: fbUser.photoURL || undefined,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };
          setCurrentUser(fallbackProfile);
          const fallbackBus: BusinessProfile = {
            businessId: `bus-${fbUser.uid.slice(0, 8)}`,
            userId: fbUser.uid,
            businessName: `${fallbackProfile.name.split(' ')[0]}'s Business`,
            businessType: 'Consultant',
            monthlyRevenueRange: '$5K-$10K',
            financeManagementMethod: 'Spreadsheet',
            businessGoal: 'Increase profit',
            createdAt: new Date().toISOString(),
          };
          setBusiness(fallbackBus);
          setActiveTab('dashboard');
          await loadUserData(fbUser.uid, fallbackBus, fallbackProfile.name);
        }
      } else {
        setCurrentUser(null);
        setBusiness(null);
        setActiveTab('landing');
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper to load financial data for logged-in user
  const loadUserData = async (uid: string, busProfile: BusinessProfile, userName: string) => {
    try {
      const [expList, invList, incList, insList, memList] = await Promise.all([
        fetchExpenses(uid),
        fetchInvoices(uid),
        fetchIncomes(uid),
        fetchFinancialInsights(uid),
        fetchAIMemories(uid),
      ]);

      // Seed initial sample data if new user has 0 records
      let hydratedExpenses = expList;
      if (expList.length === 0) {
        const defaultExp: Omit<ExpenseItem, 'expenseId'>[] = [
          { userId: uid, businessId: busProfile.businessId, category: 'Software', description: 'Adobe Creative Cloud', amount: 54.99, date: '2026-07-05', isRecurring: true, createdAt: new Date().toISOString() },
          { userId: uid, businessId: busProfile.businessId, category: 'Software', description: 'Figma Professional', amount: 15.00, date: '2026-07-02', isRecurring: true, createdAt: new Date().toISOString() },
          { userId: uid, businessId: busProfile.businessId, category: 'Marketing', description: 'Google Ads Test', amount: 200.00, date: '2026-07-12', isRecurring: false, createdAt: new Date().toISOString() },
          { userId: uid, businessId: busProfile.businessId, category: 'Contractors', description: 'Copywriting Assistant', amount: 450.00, date: '2026-07-18', isRecurring: false, createdAt: new Date().toISOString() },
        ];
        for (const e of defaultExp) {
          const newE = await createExpense(e);
          hydratedExpenses.push(newE);
        }
      }

      let hydratedInvoices = invList;
      if (invList.length === 0) {
        const defaultInv: Omit<InvoiceItem, 'invoiceId'>[] = [
          { userId: uid, businessId: busProfile.businessId, clientName: 'Apex Brand Studio', amount: 3500, status: 'paid', dueDate: '2026-07-10', createdAt: new Date().toISOString() },
          { userId: uid, businessId: busProfile.businessId, clientName: 'Venture Capital Partners', amount: 2800, status: 'sent', dueDate: '2026-08-05', createdAt: new Date().toISOString() },
        ];
        for (const i of defaultInv) {
          const newI = await createInvoice(i);
          hydratedInvoices.push(newI);
        }
      }

      let hydratedIncomes = incList;
      if (incList.length === 0) {
        const defaultInc: Omit<IncomeItem, 'incomeId'>[] = [
          { userId: uid, businessId: busProfile.businessId, source: 'Strategy Consulting Client', amount: 2500, date: '2026-07-14', category: 'Consulting', notes: 'Quarterly strategy retainer', createdAt: new Date().toISOString() },
          { userId: uid, businessId: busProfile.businessId, source: 'Brand Advisory Payout', amount: 1800, date: '2026-07-20', category: 'Services', notes: 'Design advisory fee', createdAt: new Date().toISOString() },
        ];
        for (const inc of defaultInc) {
          const newInc = await createIncome(inc);
          hydratedIncomes.push(newInc);
        }
      }

      setExpenses(hydratedExpenses);
      setInvoices(hydratedInvoices);
      setIncomes(hydratedIncomes);
      setInsights(insList);
      setMemories(memList);

      // Hydrate AI CFO insights and Daily Business Brief
      fetchAIHealthInsights(busProfile, hydratedExpenses, hydratedInvoices);
      fetchAIDailyBrief(busProfile, hydratedExpenses, hydratedInvoices, hydratedIncomes, userName);
    } catch (err) {
      console.warn('Notice loading user data, applying offline/session fallback:', err);
      setExpenses([
        { expenseId: 'exp-fallback-1', userId: uid, businessId: busProfile.businessId, category: 'Software', description: 'Adobe Creative Cloud', amount: 54.99, date: '2026-07-05', isRecurring: true, createdAt: new Date().toISOString() },
        { expenseId: 'exp-fallback-2', userId: uid, businessId: busProfile.businessId, category: 'Marketing', description: 'Google Ads Test', amount: 200.00, date: '2026-07-12', isRecurring: false, createdAt: new Date().toISOString() },
      ]);
      setInvoices([
        { invoiceId: 'inv-fallback-1', userId: uid, businessId: busProfile.businessId, clientName: 'Apex Brand Studio', amount: 3500, status: 'paid', dueDate: '2026-07-10', createdAt: new Date().toISOString() },
      ]);
      setIncomes([
        { incomeId: 'inc-fallback-1', userId: uid, businessId: busProfile.businessId, source: 'Strategy Consulting Client', amount: 2500, date: '2026-07-14', category: 'Consulting', notes: 'Quarterly strategy retainer', createdAt: new Date().toISOString() },
      ]);
    }
  };

  const fetchAIHealthInsights = async (busProfile: BusinessProfile, expList: ExpenseItem[], invList: InvoiceItem[]) => {
    try {
      const res = await fetch('/api/cfo/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financialContext: {
            cashBalance: 14500,
            spendReady: 5200,
            monthlyRevenue: 6300,
            monthlyExpenses: expList.reduce((s, e) => s + e.amount, 0),
            pendingInvoices: invList.filter(i => i.status === 'sent').reduce((s, i) => s + i.amount, 0),
            recentExpenses: expList.map(e => ({ name: e.description, amt: e.amount })),
          }
        }),
      });

      if (res.ok) {
        const data: HealthScoreResult = await res.json();
        setHealthData(data);
      }
    } catch (err) {
      console.error('Error fetching CFO insights:', err);
    }
  };

  const fetchAIDailyBrief = async (
    busProfile: BusinessProfile, 
    expList: ExpenseItem[], 
    invList: InvoiceItem[], 
    incList: IncomeItem[],
    userName: string
  ) => {
    setIsLoadingBrief(true);
    try {
      const totalExpensesAmt = expList.reduce((s, e) => s + e.amount, 0);
      const totalIncomesAmt = incList.reduce((s, i) => s + i.amount, 0) + invList.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
      const pendingInv = invList.filter(i => i.status === 'sent' || i.status === 'overdue');

      const res = await fetch('/api/cfo/daily-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financialContext: {
            userName,
            businessName: busProfile.businessName,
            businessType: busProfile.businessType,
            cashBalance: Math.max(12500 + totalIncomesAmt - totalExpensesAmt, 4500),
            spendReady: Math.max(0, Math.round(12500 + totalIncomesAmt - totalExpensesAmt - 1200 - 800 - 2500)),
            monthlyIncomes: totalIncomesAmt,
            monthlyExpenses: totalExpensesAmt,
            overdueInvoicesCount: invList.filter(i => i.status === 'overdue').length,
            overdueInvoicesTotal: invList.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0),
            pendingInvoicesCount: pendingInv.length,
            pendingInvoicesTotal: pendingInv.reduce((s, i) => s + i.amount, 0),
            topCategories: ['Software', 'Marketing', 'Contractors'],
            businessGoal: busProfile.businessGoal || 'Increase profit',
          }
        }),
      });

      if (res.ok) {
        const briefData: DailyBriefData = await res.json();
        setDailyBrief(briefData);
      }
    } catch (err) {
      console.error('Error fetching Daily Brief:', err);
    } finally {
      setIsLoadingBrief(false);
    }
  };

  // Google Login Trigger
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // Auth change listener will automatically switch activeTab to 'dashboard'
    } catch (err: any) {
      console.error('Login error:', err);
      // Fallback demo user if popup fails or blocked in sandbox environment
      const demoProfile: UserProfile = {
        uid: 'demo-user-123',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@chieffo.ai',
        profileImage: undefined,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      setCurrentUser(demoProfile);
      const demoBus: BusinessProfile = {
        businessId: 'bus-demo-1',
        userId: 'demo-user-123',
        businessName: 'Chieffo Digital Studio',
        businessType: 'Consultant',
        monthlyRevenueRange: '$5K-$10K',
        financeManagementMethod: 'Spreadsheet',
        businessGoal: 'Increase profit',
        createdAt: new Date().toISOString(),
      };
      setBusiness(demoBus);
      setNeedsOnboarding(false);
      setActiveTab('dashboard');
      await loadUserData('demo-user-123', demoBus, demoProfile.name);
    }
  };

  // Guest Login Trigger
  const handleGuestLogin = async () => {
    try {
      const anonUser = await signInAsGuest();
      if (anonUser) {
        // onAuthStateChanged will handle hydration
        return;
      }
    } catch (err) {
      console.warn('Guest sign-in error:', err);
    }

    // Direct guest session fallback
    const guestProfile: UserProfile = {
      uid: 'guest-user-123',
      name: 'Guest Entrepreneur',
      email: 'guest@chieffo.ai',
      profileImage: undefined,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    setCurrentUser(guestProfile);
    const guestBus: BusinessProfile = {
      businessId: 'bus-guest-1',
      userId: 'guest-user-123',
      businessName: 'Guest Ventures',
      businessType: 'Consultant',
      monthlyRevenueRange: '$5K-$10K',
      financeManagementMethod: 'Spreadsheet',
      businessGoal: 'Increase profit',
      createdAt: new Date().toISOString(),
    };
    setBusiness(guestBus);
    setNeedsOnboarding(false);
    setActiveTab('dashboard');
    await loadUserData('guest-user-123', guestBus, guestProfile.name);
  };

  // Logout Trigger
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setCurrentUser(null);
    setBusiness(null);
    setActiveTab('landing');
  };

  // Complete Onboarding
  const handleOnboardingComplete = async (data: {
    businessName: string;
    businessType: BusinessType;
    monthlyRevenueRange: MonthlyRevenueRange;
    financeManagementMethod: FinanceMethod;
    businessGoal: BusinessGoal;
  }) => {
    if (!currentUser) return;
    
    const newBus = {
      userId: currentUser.uid,
      businessName: data.businessName,
      businessType: data.businessType,
      monthlyRevenueRange: data.monthlyRevenueRange,
      financeManagementMethod: data.financeManagementMethod,
      businessGoal: data.businessGoal,
      createdAt: new Date().toISOString(),
    };

    const docId = await saveBusinessProfile(newBus);
    const busProfile: BusinessProfile = { businessId: docId, ...newBus };
    setBusiness(busProfile);

    await updateUserSettings(currentUser.uid, {
      notificationsEnabled: true,
      onboardingComplete: true,
    });

    setNeedsOnboarding(false);
    setActiveTab('dashboard');
    await loadUserData(currentUser.uid, busProfile, currentUser.name);
  };

  // Handlers for Income Mutations
  const handleAddIncome = async (income: Omit<IncomeItem, 'incomeId'>) => {
    if (!currentUser || !business) return;
    const created = await createIncome({
      ...income,
      userId: currentUser.uid,
      businessId: business.businessId,
    });
    setIncomes(prev => [created, ...prev]);
    // Refresh Daily Brief with new income context
    if (business) {
      fetchAIDailyBrief(business, expenses, invoices, [created, ...incomes], currentUser.name);
    }
  };

  const handleRemoveIncome = async (incomeId: string) => {
    await removeIncome(incomeId);
    setIncomes(prev => prev.filter(i => i.incomeId !== incomeId));
  };

  // Handlers for Expense Mutations
  const handleAddExpense = async (expense: Omit<ExpenseItem, 'expenseId'>) => {
    if (!currentUser || !business) return;
    const created = await createExpense({
      ...expense,
      userId: currentUser.uid,
      businessId: business.businessId,
    });
    setExpenses(prev => [created, ...prev]);
  };

  const handleRemoveExpense = async (expenseId: string) => {
    await removeExpense(expenseId);
    setExpenses(prev => prev.filter(e => e.expenseId !== expenseId));
  };

  // Handlers for Invoice Mutations
  const handleCreateInvoice = async (invoice: Omit<InvoiceItem, 'invoiceId'>) => {
    if (!currentUser || !business) return;
    const created = await createInvoice({
      ...invoice,
      userId: currentUser.uid,
      businessId: business.businessId,
    });
    setInvoices(prev => [created, ...prev]);
  };

  const handleUpdateInvoiceStatus = async (invoiceId: string, status: InvoiceItem['status']) => {
    await updateInvoiceStatus(invoiceId, status);
    setInvoices(prev => prev.map(i => i.invoiceId === invoiceId ? { ...i, status } : i));
  };

  const handleRemoveInvoice = async (invoiceId: string) => {
    await removeInvoice(invoiceId);
    setInvoices(prev => prev.filter(i => i.invoiceId !== invoiceId));
  };

  const effectiveBusiness: BusinessProfile = business || {
    businessId: currentUser ? `bus-${currentUser.uid}` : 'bus-demo-1',
    userId: currentUser?.uid || 'guest',
    businessName: currentUser ? `${currentUser.name.split(' ')[0]}'s Business` : 'Chieffo Digital Studio',
    businessType: 'Consultant',
    monthlyRevenueRange: '$5K-$10K',
    financeManagementMethod: 'Spreadsheet',
    businessGoal: 'Increase profit',
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col font-sans">
      
      {/* Top Sticky Navigation */}
      <Navbar
        user={currentUser}
        business={effectiveBusiness}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoginClick={handleGoogleLogin}
        onGuestLoginClick={handleGuestLogin}
        onLogoutClick={handleLogout}
      />

      {/* Main Body View Switching */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Onboarding Modal Overlay */}
        {needsOnboarding && currentUser && (
          <OnboardingModal
            userId={currentUser.uid}
            userName={currentUser.name}
            onComplete={handleOnboardingComplete}
            onSkip={() => setNeedsOnboarding(false)}
          />
        )}

        {/* Add Income Modal Overlay */}
        <AddIncomeModal
          isOpen={showAddIncomeModal}
          onClose={() => setShowAddIncomeModal(false)}
          onAddIncome={handleAddIncome}
        />

        {/* View 1: Landing Page */}
        {activeTab === 'landing' && (
          <LandingPage
            onLoginClick={handleGoogleLogin}
            onSeeHowItWorksClick={() => {
              document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onGoToPricing={() => setActiveTab('pricing')}
          />
        )}

        {/* View 2: Pricing Page */}
        {activeTab === 'pricing' && (
          <PricingPage
            user={currentUser}
            isProActive={isProActive}
            onTogglePro={() => setIsProActive(prev => !prev)}
            onLoginClick={handleGoogleLogin}
            onGoToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* View 3: Dashboard Command Center */}
        {activeTab === 'dashboard' && (
          <DashboardView
            userName={currentUser?.name || 'Sarah'}
            business={effectiveBusiness}
            expenses={expenses}
            invoices={invoices}
            incomes={incomes}
            insights={insights}
            healthData={healthData}
            dailyBrief={dailyBrief}
            isLoadingBrief={isLoadingBrief}
            onRefreshBrief={() => fetchAIDailyBrief(effectiveBusiness, expenses, invoices, incomes, currentUser?.name || 'Sarah')}
            onOpenAddIncome={() => setShowAddIncomeModal(true)}
            onOpenAddExpense={() => {
              setShowReceiptScanOnExpenses(false);
              setActiveTab('expenses');
            }}
            onOpenCreateInvoice={() => setActiveTab('invoices')}
            onOpenReceiptScan={() => {
              setShowReceiptScanOnExpenses(true);
              setActiveTab('expenses');
            }}
            onGoToChat={(prompt) => {
              setChatInitialPrompt(prompt);
              setActiveTab('chat');
            }}
            onRemoveIncome={handleRemoveIncome}
          />
        )}

        {/* View 4: AI CFO Chat Assistant */}
        {activeTab === 'chat' && (
          <AICFOChat
            business={effectiveBusiness}
            expenses={expenses}
            invoices={invoices}
            initialPrompt={chatInitialPrompt}
            memories={memories}
          />
        )}

        {/* View 5: Expenses & AI Bookkeeper */}
        {activeTab === 'expenses' && (
          <ExpensesView
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onRemoveExpense={handleRemoveExpense}
            showReceiptScanInitially={showReceiptScanOnExpenses}
          />
        )}

        {/* View 6: Invoices View */}
        {activeTab === 'invoices' && (
          <InvoicesView
            invoices={invoices}
            onCreateInvoice={handleCreateInvoice}
            onUpdateStatus={handleUpdateInvoiceStatus}
            onRemoveInvoice={handleRemoveInvoice}
          />
        )}

        {/* View 7: Quarterly Tax Tracker */}
        {activeTab === 'taxes' && (
          <QuarterlyTaxView
            business={effectiveBusiness}
            expenses={expenses}
            invoices={invoices}
          />
        )}

      </main>

    </div>
  );
}
