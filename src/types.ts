export type BusinessType = 'Freelancer' | 'Creator' | 'Consultant' | 'Agency' | 'Online Business' | 'Other';

export type MonthlyRevenueRange = 'Under $1K' | '$1K-$5K' | '$5K-$10K' | '$10K+';

export type FinanceMethod = 'Spreadsheet' | 'Accounting Software' | 'Bank App' | 'Accountant';

export type BusinessGoal = 'Increase profit' | 'Grow revenue' | 'Reduce expenses' | 'Prepare for taxes' | 'Better understand cash flow';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: string;
  lastLogin: string;
}

export interface BusinessProfile {
  businessId: string;
  userId: string;
  businessName: string;
  businessType: BusinessType;
  monthlyRevenueRange: MonthlyRevenueRange;
  financeManagementMethod: FinanceMethod;
  businessGoal?: BusinessGoal;
  createdAt: string;
}

export interface IncomeItem {
  incomeId: string;
  userId: string;
  businessId: string;
  source: string;
  amount: number;
  date: string;
  category?: string;
  notes?: string;
  createdAt: string;
}

export interface DailyBriefData {
  healthScore: number;
  healthRating: 'Excellent' | 'Good' | 'Fair' | 'At Risk';
  spendReady: number;
  revenueTrend: string;
  cashFlowStatus: 'Healthy' | 'Stable' | 'Tight' | 'Warning';
  aiRecommendation: string;
  priorityAction: string;
  keyInsights: string[];
}

export interface ExpenseItem {
  expenseId: string;
  userId: string;
  businessId: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  isRecurring?: boolean;
  createdAt: string;
}

export interface InvoiceItem {
  invoiceId: string;
  userId: string;
  businessId: string;
  clientName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
}

export interface ReceiptItem {
  receiptId: string;
  userId: string;
  imageUrl?: string;
  extractedData: {
    merchant: string;
    amount: number;
    category: string;
    date: string;
    tax?: number;
    summary?: string;
  };
  createdAt: string;
}

export interface FinancialInsightItem {
  insightId: string;
  userId: string;
  type: 'recommendation' | 'warning' | 'forecast' | 'opportunity';
  message: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface AIMemoryItem {
  memoryId: string;
  userId: string;
  category: string;
  insight: string;
  createdAt: string;
}

export interface UserSettings {
  userId: string;
  notificationsEnabled: boolean;
  onboardingComplete: boolean;
}

export interface SpendReadyResult {
  totalCash: number;
  reservedForTaxes: number;
  reservedFor30DayBills: number;
  safetyBuffer: number;
  safelySpendable: number;
  advice: string;
}

export interface HealthScoreResult {
  healthScore: number;
  scoreRating: 'Excellent' | 'Good' | 'Fair' | 'At Risk';
  scoreSummary: string;
  insights: {
    type: 'recommendation' | 'warning' | 'opportunity';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  spendReadyCalculation?: SpendReadyResult;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'cfo';
  text: string;
  timestamp: string;
  isSimulation?: boolean;
}
