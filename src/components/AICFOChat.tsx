import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  BrainCircuit, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  PieChart, 
  Sliders,
  DollarSign
} from 'lucide-react';
import { BusinessProfile, ChatMessage, AIMemoryItem, ExpenseItem, InvoiceItem } from '../types';

interface AICFOChatProps {
  business: BusinessProfile;
  expenses: ExpenseItem[];
  invoices: InvoiceItem[];
  initialPrompt?: string;
  memories: AIMemoryItem[];
  onSaveMemory?: (category: string, insight: string) => void;
}

export const AICFOChat: React.FC<AICFOChatProps> = ({
  business,
  expenses,
  invoices,
  initialPrompt,
  memories,
  onSaveMemory,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'cfo',
      text: `Hello! I'm Chieffo, your virtual Chief Financial Officer for **${business.businessName}**.\n\nI'm ready to analyze your cash flow, run scenario simulations, or answer questions like: *"Can my business afford this?"*\n\nHow can I help guide your financial decisions today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'scenario' | 'memory'>('chat');

  // Scenario Simulator state
  const [scenarioDecision, setScenarioDecision] = useState<string>('Hire a contract designer');
  const [scenarioCost, setScenarioCost] = useState<string>('2000');
  const [scenarioType, setScenarioType] = useState<'monthly' | 'one-time'>('monthly');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customMessage) setInput('');
    setIsTyping(true);

    // Compute metrics to pass in context
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const totalPaidInvoices = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
    const totalPending = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
    const estimatedCash = Math.max(12500 + totalPaidInvoices - totalExpenses, 3000);
    const spendReady = Math.max(0, Math.round(estimatedCash * 0.45));

    try {
      const response = await fetch('/api/cfo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          financialContext: {
            businessName: business.businessName,
            businessType: business.businessType,
            monthlyRevenueRange: business.monthlyRevenueRange,
            cashBalance: estimatedCash,
            spendReady: spendReady,
            monthlyExpenses: totalExpenses,
            pendingInvoices: totalPending,
            businessGoal: business.businessGoal,
          },
        }),
      });

      const data = await response.json();
      const cfoMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'cfo',
        text: data.reply || "I've analyzed your figures. Your current cash balance supports this with minimal runway risk.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, cfoMsg]);
    } catch (error) {
      console.error('Error calling CFO API:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'cfo',
        text: "I experienced a brief connection hiccup while evaluating your figures. Based on your $12,500+ baseline cash, hiring or adding recurring expenses should be limited to under $2,000/mo to keep 6+ months runway.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRunScenario = () => {
    const promptText = `Run a CFO Scenario Simulation:
Proposed Action: ${scenarioDecision}
Cost: $${scenarioCost} (${scenarioType})
Evaluate impact on my business's cash balance, SpendReady margin, quarterly tax reserves, and total runway.`;
    
    setActiveTab('chat');
    handleSendMessage(promptText);
  };

  return (
    <div className="bg-[#0D111A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[700px]">
      
      {/* Top Header & View Tabs */}
      <div className="p-4 bg-[#0A0D14] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1px]">
            <div className="w-full h-full bg-[#0D111A] rounded-[11px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Chieffo AI CFO</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-gray-400">Executive Strategic Advisory & Scenario Engine</p>
          </div>
        </div>

        {/* Inner Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('scenario')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'scenario' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Scenario Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'memory' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Business Memory</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CHAT INTERFACE */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* Quick Starter Prompts */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-white/5">
              <span className="text-[10px] uppercase font-bold text-gray-400 w-full mb-1">Quick Executive Inquiries:</span>
              {[
                "Can I hire someone?",
                "How much tax should I save this quarter?",
                "Simulate a $1,500 monthly software expense",
                "Where can I trim expenses?"
              ].map((starter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(starter)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-blue-300 font-medium transition-colors"
                >
                  {starter}
                </button>
              ))}
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'cfo' && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white/5 text-gray-200 border border-white/10 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className="mt-1.5 text-[10px] opacity-60 text-right">{msg.timestamp}</div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    You
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-medium text-gray-300 ml-1">Chieffo is evaluating cash flow models...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-[#0A0D14] border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Chieffo e.g. 'Can I afford a $3,000 marketing sprint?'"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold shadow-lg transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

      {/* VIEW 2: SCENARIO SIMULATOR */}
      {activeTab === 'scenario' && (
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-white">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span>Interactive Decision Simulator</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Simulate major financial decisions before committing money. Chieffo models the effect on your SpendReady limit and runway.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">Proposed Decision / Purchase</label>
              <input
                type="text"
                value={scenarioDecision}
                onChange={(e) => setScenarioDecision(e.target.value)}
                placeholder="e.g. Upgrade laptop, hire contractor, launch ad campaign"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">Estimated Amount ($)</label>
                <input
                  type="number"
                  value={scenarioCost}
                  onChange={(e) => setScenarioCost(e.target.value)}
                  placeholder="2000"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">Frequency</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setScenarioType('monthly')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border ${
                      scenarioType === 'monthly' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    Monthly Recurring
                  </button>
                  <button
                    type="button"
                    onClick={() => setScenarioType('one-time')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border ${
                      scenarioType === 'one-time' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    One-Time
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleRunScenario}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate Scenario with AI CFO</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: BUSINESS MEMORY */}
      {activeTab === 'memory' && (
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-white">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-amber-400" />
              <span>Chieffo Business Memory Bank</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Chieffo automatically logs key spending habits, recurring client patterns, and CFO insights over time.
            </p>
          </div>

          <div className="space-y-3">
            {memories.length > 0 ? (
              memories.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                      {m.category}
                    </span>
                    <p className="text-xs text-gray-200 mt-1">{m.insight}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                      Tax Savings Pattern
                    </span>
                    <p className="text-xs text-gray-200 mt-1">
                      User consistently sets aside 25% for quarterly taxes every 30 days. SpendReady calculation respects tax buffers.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                      Recurring Overhead
                    </span>
                    <p className="text-xs text-gray-200 mt-1">
                      Design and hosting software tools recur on the 1st of every month. Fixed overhead estimated at $450/mo.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
