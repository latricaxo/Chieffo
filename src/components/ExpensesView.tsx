import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Scan, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  Calendar, 
  Tag, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';
import { ExpenseItem } from '../types';

interface ExpensesViewProps {
  expenses: ExpenseItem[];
  onAddExpense: (expense: Omit<ExpenseItem, 'expenseId'>) => Promise<void>;
  onRemoveExpense: (expenseId: string) => Promise<void>;
  showReceiptScanInitially?: boolean;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onAddExpense,
  onRemoveExpense,
  showReceiptScanInitially = false,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showScanModal, setShowScanModal] = useState<boolean>(showReceiptScanInitially);

  // New Expense form state
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('Software');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);

  // Receipt Scan state
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanPreview, setScanPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  const categories = ['Software', 'Marketing', 'Contractors', 'Office & Equipment', 'Meals', 'Utilities', 'Travel', 'Other'];

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description || isNaN(parsedAmount) || parsedAmount <= 0) return;

    await onAddExpense({
      userId: '',
      businessId: '',
      category,
      description,
      amount: parsedAmount,
      date,
      isRecurring,
      createdAt: new Date().toISOString(),
    });

    // Reset Form
    setDescription('');
    setAmount('');
    setShowAddModal(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScanFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScanPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunReceiptScan = async () => {
    if (!scanPreview) return;
    setIsScanning(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/cfo/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: scanPreview,
          mimeType: scanFile?.type || 'image/jpeg',
        }),
      });

      const data = await res.json();
      if (data.extractedData) {
        setScanResult(data.extractedData);
        setDescription(data.extractedData.merchant || 'Receipt Expense');
        setAmount(data.extractedData.amount?.toString() || '0');
        if (data.extractedData.category) setCategory(data.extractedData.category);
        if (data.extractedData.date) setDate(data.extractedData.date);
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmScanAdd = async () => {
    if (!scanResult) return;
    await onAddExpense({
      userId: '',
      businessId: '',
      category: scanResult.category || category,
      description: scanResult.merchant || description || 'Scanned Receipt',
      amount: parseFloat(scanResult.amount) || parseFloat(amount) || 0,
      date: scanResult.date || date,
      isRecurring: false,
      createdAt: new Date().toISOString(),
    });

    setShowScanModal(false);
    setScanFile(null);
    setScanPreview(null);
    setScanResult(null);
  };

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 text-white pb-12">
      
      {/* Top Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D111A] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-400" />
            <span>Expense Tracking & AI Bookkeeper</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Total Tracked Expenses: <strong className="text-white">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowScanModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Scan className="w-4 h-4 text-purple-400" />
            <span>AI Receipt OCR</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-[#0D111A] border border-white/10 rounded-3xl p-6 shadow-xl">
        {expenses.length === 0 ? (
          <div className="text-center py-12 text-gray-400 space-y-3">
            <CreditCard className="w-12 h-12 text-gray-600 mx-auto" />
            <p className="text-sm font-medium">No expenses logged yet.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              Add First Expense
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {expenses.map((item) => (
              <div key={item.expenseId} className="py-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white flex items-center gap-2">
                      <span>{item.description}</span>
                      {item.isRecurring && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Recurring
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm text-white">${item.amount.toFixed(2)}</span>
                  <button
                    onClick={() => onRemoveExpense(item.expenseId)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: ADD MANUAL EXPENSE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0D111A] border border-white/10 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4">Add Business Expense</h3>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Figma Pro, Adobe CC, Webflow"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="150.00"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#161B26] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#161B26] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="w-4 h-4 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-0"
                    />
                    <span>Recurring Monthly</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs text-white font-semibold shadow-lg"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: AI RECEIPT SCANNER OCR */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0D111A] border border-white/10 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl relative">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scan className="w-5 h-5 text-purple-400" />
              <span>AI Receipt Scanner & OCR</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Upload a receipt photo or PDF snapshot. Gemini Vision extracts merchant name, date, total amount, and category automatically.
            </p>

            <div className="mt-4 space-y-4">
              <div className="border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-2xl p-6 text-center bg-white/5 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="receipt-file-input"
                />
                <label htmlFor="receipt-file-input" className="cursor-pointer space-y-2 block">
                  {scanPreview ? (
                    <img src={scanPreview} alt="Receipt preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-purple-400 mx-auto" />
                      <div className="text-xs font-semibold text-white">Click or drag image to upload receipt</div>
                      <div className="text-[10px] text-gray-400">Supports JPG, PNG, WEBP</div>
                    </>
                  )}
                </label>
              </div>

              {scanPreview && !scanResult && (
                <button
                  onClick={handleRunReceiptScan}
                  disabled={isScanning}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  {isScanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Gemini Vision Extracting Data...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Extract Receipt Data with AI</span>
                    </>
                  )}
                </button>
              )}

              {scanResult && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Receipt Data Extracted Successfully:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-gray-200 pt-1">
                    <div>Merchant: <strong>{scanResult.merchant}</strong></div>
                    <div>Amount: <strong>${scanResult.amount}</strong></div>
                    <div>Category: <strong>{scanResult.category}</strong></div>
                    <div>Date: <strong>{scanResult.date}</strong></div>
                  </div>

                  <button
                    onClick={handleConfirmScanAdd}
                    className="w-full mt-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Confirm & Save Expense
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowScanModal(false);
                  setScanPreview(null);
                  setScanResult(null);
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
