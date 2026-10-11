import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
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
import firebaseConfig from '../../firebase-applet-config.json';
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

// Firestore Helper API functions
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
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
  const path = `settings/${uid}`;
  try {
    const refDoc = doc(db, 'settings', uid);
    await setDoc(refDoc, { userId: uid, ...settings }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function getBusinessProfile(uid: string): Promise<BusinessProfile | null> {
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
  const path = `expenses/${expenseId}`;
  try {
    await deleteDoc(doc(db, 'expenses', expenseId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Incomes
export async function fetchIncomes(uid: string): Promise<IncomeItem[]> {
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
  const path = `incomes/${incomeId}`;
  try {
    await deleteDoc(doc(db, 'incomes', incomeId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Invoices
export async function fetchInvoices(uid: string): Promise<InvoiceItem[]> {
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
  const path = `invoices/${invoiceId}`;
  try {
    await updateDoc(doc(db, 'invoices', invoiceId), { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function removeInvoice(invoiceId: string): Promise<void> {
  const path = `invoices/${invoiceId}`;
  try {
    await deleteDoc(doc(db, 'invoices', invoiceId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Receipts
export async function fetchReceipts(uid: string): Promise<ReceiptItem[]> {
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
  const path = 'financialInsights';
  try {
    await addDoc(collection(db, 'financialInsights'), insight);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// Business Memory
export async function fetchAIMemories(uid: string): Promise<AIMemoryItem[]> {
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
  const path = 'businessMemory';
  try {
    await addDoc(collection(db, 'businessMemory'), memory);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}
