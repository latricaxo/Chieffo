import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Send,
  User,
  Calendar
} from 'lucide-react';
import { InvoiceItem } from '../types';

interface InvoicesViewProps {
  invoices: InvoiceItem[];
  onCreateInvoice: (invoice: Omit<InvoiceItem, 'invoiceId'>) => Promise<void>;
  onUpdateStatus: (invoiceId: string, status: InvoiceItem['status']) => Promise<void>;
  onRemoveInvoice: (invoiceId: string) => Promise<void>;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  onCreateInvoice,
  onUpdateStatus,
  onRemoveInvoice,
}) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form state
  const [clientName, setClientName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<InvoiceItem['status']>('sent');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!clientName || isNaN(parsedAmount) || parsedAmount <= 0) return;

    await onCreateInvoice({
      userId: '',
      businessId: '',
      clientName,
      amount: parsedAmount,
      status,
      dueDate,
      createdAt: new Date().toISOString(),
    });

    setClientName('');
    setAmount('');
    setShowCreateModal(false);
  };

  const totalInvoiced = invoices.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, item) => sum + item.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 text-white pb-12">
      
      {/* Top Header & Overview Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D111A] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-400" />
            <span>Invoice Intelligence & Receivables</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Track client billing, accelerate payment velocity, and model cash inflow timing.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D111A] border border-white/10">
          <span className="text-xs uppercase text-gray-400 font-semibold">Total Invoiced</span>
          <div className="text-2xl font-extrabold text-white mt-1">${totalInvoiced.toLocaleString()}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111A] border border-emerald-500/30 bg-emerald-950/20">
          <span className="text-xs uppercase text-emerald-300 font-semibold">Paid & Collected</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">${totalPaid.toLocaleString()}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111A] border border-amber-500/30 bg-amber-950/20">
          <span className="text-xs uppercase text-amber-300 font-semibold">Pending Receivables</span>
          <div className="text-2xl font-extrabold text-amber-300 mt-1">${totalPending.toLocaleString()}</div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-[#0D111A] border border-white/10 rounded-3xl p-6 shadow-xl">
        {invoices.length === 0 ? (
          <div className="text-center py-12 text-gray-400 space-y-3">
            <FileText className="w-12 h-12 text-gray-600 mx-auto" />
            <p className="text-sm font-medium">No client invoices generated yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              Create First Invoice
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {invoices.map((item) => (
              <div key={item.invoiceId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-xl transition-colors">
                
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white flex items-center gap-2">
                      <span>{item.clientName}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                      <span>Due: {item.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="font-extrabold text-base text-white mr-2">${item.amount.toLocaleString()}</span>

                  {/* Status Picker Pill */}
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.invoiceId, e.target.value as InvoiceItem['status'])}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                      item.status === 'paid' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                      item.status === 'sent' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                      item.status === 'overdue' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                      'bg-gray-500/20 text-gray-300 border-gray-500/30'
                    }`}
                  >
                    <option value="draft" className="bg-[#161B26]">Draft</option>
                    <option value="sent" className="bg-[#161B26]">Sent</option>
                    <option value="paid" className="bg-[#161B26]">Paid</option>
                    <option value="overdue" className="bg-[#161B26]">Overdue</option>
                  </select>

                  <button
                    onClick={() => onRemoveInvoice(item.invoiceId)}
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

      {/* CREATE INVOICE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0D111A] border border-white/10 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4">Create Client Invoice</h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Acme Corp, TechStart Inc."
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
                    placeholder="2500.00"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as InvoiceItem['status'])}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#161B26] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="sent">Sent</option>
                    <option value="draft">Draft</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#161B26] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs text-white font-semibold shadow-lg"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
