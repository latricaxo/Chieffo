import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously,
  signOut as firebaseSignOut,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import rawFirebaseConfig from '../../firebase-applet-config.json';
import { 
  UserProfile, 
  BusinessProfile, 
  ExpenseItem, 
  InvoiceItem, 
  IncomeItem,
  ReceiptItem, 
  FinancialInsightItem, 
  AIMemoryItem, 
  UserSettings 
} from '../types';

// Support Vite env variables or fallback to applet config
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
const firebaseConfig = {
  ...rawFirebaseConfig,
  apiKey: metaEnv?.VITE_FIREBASE_API_KEY || rawFirebaseConfig.apiKey,
  projectId: metaEnv?.VITE_FIREBASE_PROJECT_ID || rawFirebaseConfig.projectId,
  appId: metaEnv?.VITE_FIREBASE_APP_ID || rawFirebaseConfig.appId,
  authDomain: metaEnv?.VITE_FIREBASE_AUTH_DOMAIN || rawFirebaseConfig.authDomain,
  firestoreDatabaseId: metaEnv?.VITE_FIREBASE_FIRESTORE_DATABASE_ID || rawFirebaseConfig.firestoreDatabaseId,
  storageBucket: metaEnv?.VITE_FIREBASE_STORAGE_BUCKET || rawFirebaseConfig.storageBucket,
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with specific databaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Storage
export const storage = getStorage(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Auth helper function for Google Login
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const userRef = doc(db, 'users', user.uid);
    let userSnap;
    try {
      userSnap = await getDoc(userRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
      return user;
    }
    
    const now = new Date().toISOString();
    if (!userSnap || !userSnap.exists()) {
      const newUserProfile: UserProfile = {
        uid: user.uid,
        name: user.displayName || 'Entrepreneur',
        email: user.email || '',
        profileImage: user.photoURL || undefined,
        createdAt: now,
        lastLogin: now,
      };
      try {
        await setDoc(userRef, newUserProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }
    } else {
      try {
        await updateDoc(userRef, { lastLogin: now });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
    
    return user;
  } catch (error: any) {
    console.error('Google Sign-in error:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Auth helper function for Guest Anonymous Login
export async function signInAsGuest(): Promise<User | null> {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error: any) {
    console.warn('Firebase anonymous auth not available or failed:', error);
    return null;
  }
}

// Demo & Guest sample dataset
const DEFAULT_DEMO_EXPENSES: ExpenseItem[] = [
  { expenseId: 'exp-demo-1', userId: 'guest-user-123', businessId: 'bus-guest-1', category: 'Software', description: 'Adobe Creative Cloud', amount: 54.99, date: '2026-07-05', isRecurring: true, createdAt: new Date().toISOString() },
  { expenseId: 'exp-demo-2', userId: 'guest-user-123', businessId: 'bus-guest-1', category: 'Software', description: 'Figma Professional', amount: 15.00, date: '2026-07-02', isRecurring: true, createdAt: new Date().toISOString() },
  { expenseId: 'exp-demo-3', userId: 'guest-user-123', businessId: 'bus-guest-1', category: 'Marketing', description: 'Google Ads Test', amount: 200.00, date: '2026-07-12', isRecurring: false, createdAt: new Date().toISOString() },
  { expenseId: 'exp-demo-4', userId: 'guest-user-123', businessId: 'bus-guest-1', category: 'Contractors', description: 'Copywriting Assistant', amount: 450.00, date: '2026-07-18', isRecurring: false, createdAt: new Date().toISOString() },
];

const DEFAULT_DEMO_INVOICES: InvoiceItem[] = [
  { invoiceId: 'inv-demo-1', userId: 'guest-user-123', businessId: 'bus-guest-1', clientName: 'Apex Brand Studio', amount: 3500, status: 'paid', dueDate: '2026-07-10', createdAt: new Date().toISOString() },
  { invoiceId: 'inv-demo-2', userId: 'guest-user-123', businessId: 'bus-guest-1', clientName: 'Venture Capital Partners', amount: 2800, status: 'sent', dueDate: '2026-08-05', createdAt: new Date().toISOString() },
];

const DEFAULT_DEMO_INCOMES: IncomeItem[] = [
  { incomeId: 'inc-demo-1', userId: 'guest-user-123', businessId: 'bus-guest-1', source: 'Strategy Consulting Client', amount: 2500, date: '2026-07-14', category: 'Consulting', notes: 'Quarterly strategy retainer', createdAt: new Date().toISOString() },
  { incomeId: 'inc-demo-2', userId: 'guest-user-123', businessId: 'bus-guest-1', source: 'Brand Advisory Payout', amount: 1800, date: '2026-07-20', category: 'Services', notes: 'Design advisory fee', createdAt: new Date().toISOString() },
];

const DEFAULT_DEMO_INSIGHTS: FinancialInsightItem[] = [
  {
    insightId: 'ins-demo-1',
    userId: 'guest-user-123',
    type: 'opportunity',
    message: 'Your estimated margin sits at 44.8%. Software subscriptions represent 15% of monthly expenditures.',
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
  {
    insightId: 'ins-demo-2',
    userId: 'guest-user-123',
    type: 'recommendation',
    message: '$2,800 due on August 5 from Venture Capital Partners. Automatic reminder queued.',
    priority: 'high',
    createdAt: new Date().toISOString(),
  }
];

export function isGuestOrDemoUid(uid?: string | null): boolean {
  if (!uid) return true;
  if (uid.startsWith('guest-') || uid.startsWith('demo-')) return true;
  if (!auth.currentUser || auth.currentUser.uid !== uid) return true;
  return false;
}

// Firestore Helper API functions
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (isGuestOrDemoUid(uid)) {
    return {
      uid,
      name: 'Guest Entrepreneur',
      email: 'guest@chieffo.ai',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
  }
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function getUserSettings(uid: string): Promise<UserSettings | null> {
  if (isGuestOrDemoUid(uid)) {
    return {
      userId: uid,
      notificationsEnabled: true,
      onboardingComplete: true,
    };
  }
  const path = `settings/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'settings', uid));
    return snap.exists() ? (snap.data() as UserSettings) : null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function updateUserSettings(uid: string, settings: Partial<UserSettings>): Promise<void> {
  if (isGuestOrDemoUid(uid)) {
    return;
  }
  const path = `settings/${uid}`;
  try {
    const refDoc = doc(db, 'settings', uid);
    await setDoc(refDoc, { userId: uid, ...settings }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function getBusinessProfile(uid: string): Promise<BusinessProfile | null> {
  if (isGuestOrDemoUid(uid)) {
    return {
      businessId: `bus-${uid.slice(0, 8)}`,
      userId: uid,
      businessName: 'Guest Ventures',
      businessType: 'Consultant',
      monthlyRevenueRange: '$5K-$10K',
      financeManagementMethod: 'Spreadsheet',
      businessGoal: 'Increase profit',
      createdAt: new Date().toISOString(),
    };
  }
  const path = 'businesses';
  try {
    const q = query(collection(db, 'businesses'), where('userId', '==', uid));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docData = snap.docs[0];
      return { businessId: docData.id, ...docData.data() } as BusinessProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return null;
  }
}

export async function saveBusinessProfile(profile: Omit<BusinessProfile, 'businessId'>): Promise<string> {
  if (isGuestOrDemoUid(profile.userId)) {
    return `bus-${profile.userId.slice(0, 8)}`;
  }
  const path = 'businesses';
  try {
    const q = query(collection(db, 'businesses'), where('userId', '==', profile.userId));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      const docId = snap.docs[0].id;
      await updateDoc(doc(db, 'businesses', docId), profile);
      return docId;
    } else {
      const docRef = await addDoc(collection(db, 'businesses'), profile);
      return docRef.id;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    return `bus-${profile.userId.slice(0, 8)}`;
  }
}

// Expenses
export async function fetchExpenses(uid: string): Promise<ExpenseItem[]> {
  if (isGuestOrDemoUid(uid)) {
    return DEFAULT_DEMO_EXPENSES.map(e => ({ ...e, userId: uid }));
  }
  const path = 'expenses';
  try {
    const q = query(collection(db, 'expenses'), where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(docSnap => ({ expenseId: docSnap.id, ...docSnap.data() } as ExpenseItem));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function createExpense(expense: Omit<ExpenseItem, 'expenseId'>): Promise<ExpenseItem> {
  if (isGuestOrDemoUid(expense.userId)) {
    return { expenseId: `exp-${Date.now()}`, ...expense };
  }
  const path = 'expenses';
  try {
    const docRef = await addDoc(collection(db, 'expenses'), expense);
    return { expenseId: docRef.id, ...expense };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    return { expenseId: `exp-${Date.now()}`, ...expense };
  }
}

export async function removeExpense(expenseId: string): Promise<void> {
  if (!auth.currentUser) return;
  const path = `expenses/${expenseId}`;
  try {
    await deleteDoc(doc(db, 'expenses', expenseId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Incomes
export async function fetchIncomes(uid: string): Promise<IncomeItem[]> {
  if (isGuestOrDemoUid(uid)) {
    return DEFAULT_DEMO_INCOMES.map(i => ({ ...i, userId: uid }));
  }
  const path = 'incomes';
  try {
    const q = query(collection(db, 'incomes'), where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(docSnap => ({ incomeId: docSnap.id, ...docSnap.data() } as IncomeItem));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function createIncome(income: Omit<IncomeItem, 'incomeId'>): Promise<IncomeItem> {
  if (isGuestOrDemoUid(income.userId)) {
    return { incomeId: `inc-${Date.now()}`, ...income };
  }
  const path = 'incomes';
  try {
    const docRef = await addDoc(collection(db, 'incomes'), income);
    return { incomeId: docRef.id, ...income };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    return { incomeId: `inc-${Date.now()}`, ...income };
  }
}

export async function removeIncome(incomeId: string): Promise<void> {
  if (!auth.currentUser) return;
  const path = `incomes/${incomeId}`;
  try {
    await deleteDoc(doc(db, 'incomes', incomeId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Invoices
export async function fetchInvoices(uid: string): Promise<InvoiceItem[]> {
  if (isGuestOrDemoUid(uid)) {
    return DEFAULT_DEMO_INVOICES.map(i => ({ ...i, userId: uid }));
  }
  const path = 'invoices';
  try {
    const q = query(collection(db, 'invoices'), where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(docSnap => ({ invoiceId: docSnap.id, ...docSnap.data() } as InvoiceItem));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function createInvoice(invoice: Omit<InvoiceItem, 'invoiceId'>): Promise<InvoiceItem> {
  if (isGuestOrDemoUid(invoice.userId)) {
    return { invoiceId: `inv-${Date.now()}`, ...invoice };
  }
  const path = 'invoices';
  try {
    const docRef = await addDoc(collection(db, 'invoices'), invoice);
    return { invoiceId: docRef.id, ...invoice };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    return { invoiceId: `inv-${Date.now()}`, ...invoice };
  }
}

export async function updateInvoiceStatus(invoiceId: string, status: InvoiceItem['status']): Promise<void> {
  if (!auth.currentUser) return;
  const path = `invoices/${invoiceId}`;
  try {
    await updateDoc(doc(db, 'invoices', invoiceId), { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function removeInvoice(invoiceId: string): Promise<void> {
  if (!auth.currentUser) return;
  const path = `invoices/${invoiceId}`;
  try {
    await deleteDoc(doc(db, 'invoices', invoiceId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Receipts
export async function fetchReceipts(uid: string): Promise<ReceiptItem[]> {
  if (isGuestOrDemoUid(uid)) {
    return [];
  }
  const path = 'receipts';
  try {
    const q = query(collection(db, 'receipts'), where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(docSnap => ({ receiptId: docSnap.id, ...docSnap.data() } as ReceiptItem));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function saveReceipt(receipt: Omit<ReceiptItem, 'receiptId'>): Promise<ReceiptItem> {
  if (isGuestOrDemoUid(receipt.userId)) {
    return { receiptId: `rec-${Date.now()}`, ...receipt };
  }
  const path = 'receipts';
  try {
    const docRef = await addDoc(collection(db, 'receipts'), receipt);
    return { receiptId: docRef.id, ...receipt };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    return { receiptId: `rec-${Date.now()}`, ...receipt };
  }
}

// Financial Insights
export async function fetchFinancialInsights(uid: string): Promise<FinancialInsightItem[]> {
  if (isGuestOrDemoUid(uid)) {
    return DEFAULT_DEMO_INSIGHTS.map(ins => ({ ...ins, userId: uid }));
  }
  const path = 'financialInsights';
  try {
    const q = query(collection(db, 'financialInsights'), where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(docSnap => ({ insightId: docSnap.id, ...docSnap.data() } as FinancialInsightItem));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function saveFinancialInsight(insight: Omit<FinancialInsightItem, 'insightId'>): Promise<void> {
  if (isGuestOrDemoUid(insight.userId)) {
    return;
  }
  const path = 'financialInsights';
  try {
    await addDoc(collection(db, 'financialInsights'), insight);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// Business Memory
export async function fetchAIMemories(uid: string): Promise<AIMemoryItem[]> {
  if (isGuestOrDemoUid(uid)) {
    return [];
  }
  const path = 'businessMemory';
  try {
    const q = query(collection(db, 'businessMemory'), where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(docSnap => ({ memoryId: docSnap.id, ...docSnap.data() } as AIMemoryItem));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function saveAIMemory(memory: Omit<AIMemoryItem, 'memoryId'>): Promise<void> {
  if (isGuestOrDemoUid(memory.userId)) {
    return;
  }
  const path = 'businessMemory';
  try {
    await addDoc(collection(db, 'businessMemory'), memory);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}
