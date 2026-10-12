import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get Gemini AI instance
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured in environment.');
  }
  return new GoogleGenAI({ apiKey });
}

// System prompt for Chieffo AI CFO
const CFO_SYSTEM_INSTRUCTION = `
You are Chieffo, an elite virtual Chief Financial Officer (CFO) for freelancers, creators, consultants, agencies, and small business owners.
Your personality is professional, strategic, clear, executive-level, and deeply encouraging yet realistic.
Your core goal is to help entrepreneurs answer: "Can my business afford this?", understand cash flow, optimize expenses, predict financial runway, and make confident business decisions.

When analyzing data or answering questions:
1. Provide concise, direct financial insight first (e.g. "Yes, but with 2 caveats" or "Not safely right now").
2. Calculate clear numbers (e.g. impact on cash runway, net margin impact, tax implications).
3. Offer 2-3 actionable, concrete next steps.
4. Keep explanations strategic, free of overly bureaucratic jargon, and formatted with clean bullet points.
5. If user asks "Can I hire someone?" or "Can I buy X?", calculate the impact on SpendReady balance and runway.
`;

// API Route: Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Chieffo AI CFO Server' });
});

// API Route: AI CFO Conversational Chat & Scenario Simulation
app.post('/api/cfo/chat', async (req, res) => {
  try {
    const { message, financialContext, history } = req.body;
    const ai = getAIClient();

    const contextPrompt = `
CURRENT BUSINESS & FINANCIAL CONTEXT:
Business Name: ${financialContext?.businessName || 'My Business'}
Business Type: ${financialContext?.businessType || 'Freelancer'}
Monthly Revenue: ${financialContext?.monthlyRevenueRange || 'Unknown'}
Total Cash Balance: $${financialContext?.cashBalance ?? 0}
SpendReady (Safely Spendable Amount): $${financialContext?.spendReady ?? 0}
Monthly Expenses Total: $${financialContext?.monthlyExpenses ?? 0}
Pending Unpaid Invoices: $${financialContext?.pendingInvoices ?? 0}
Business Goals: ${financialContext?.businessGoal || 'Grow revenue & profitability'}

USER QUERY / DECISION TO EVALUATE:
"${message}"

Provide an executive CFO assessment and recommendations tailored specifically to this business's financial health.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contextPrompt,
      config: {
        systemInstruction: CFO_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/cfo/chat:', error);
    res.status(500).json({
      error: error.message || 'Failed to process CFO query',
      reply: "I'm having trouble analyzing your request right now. Please ensure your Gemini API key is configured or try again shortly."
    });
  }
});

// API Route: Generate Dynamic Financial Insights & Health Score Breakdown
app.post('/api/cfo/insights', async (req, res) => {
  try {
    const { financialContext } = req.body;
    const ai = getAIClient();

    const prompt = `
Analyze the following financial metrics for a small business and return 3 key AI CFO insights (warnings, recommendations, or opportunities) plus a structured Financial Health Score (0-100) evaluation.

Data:
- Cash Balance: $${financialContext?.cashBalance ?? 0}
- SpendReady Amount: $${financialContext?.spendReady ?? 0}
- Monthly Revenue Est: $${financialContext?.monthlyRevenue ?? 0}
- Monthly Expenses Total: $${financialContext?.monthlyExpenses ?? 0}
- Outstanding Invoices: $${financialContext?.pendingInvoices ?? 0}
- Recent Expenses List: ${JSON.stringify(financialContext?.recentExpenses || [])}

Respond ONLY in valid JSON matching this schema:
{
  "healthScore": number, // 0 to 100
  "scoreRating": "Excellent" | "Good" | "Fair" | "At Risk",
  "scoreSummary": "Short explanation of the score",
  "insights": [
    {
      "type": "recommendation" | "warning" | "opportunity",
      "title": "Short title",
      "message": "Detailed action-oriented advice",
      "priority": "high" | "medium" | "low"
    }
  ],
  "spendReadyCalculation": {
    "totalCash": number,
    "reservedForTaxes": number,
    "reservedFor30DayBills": number,
    "safetyBuffer": number,
    "safelySpendable": number,
    "advice": "Summary of spending readiness"
  }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/cfo/insights:', error);
    res.status(500).json({ error: error.message || 'Failed to generate insights' });
  }
});

// API Route: Scan & Process Receipt Image (Vision OCR + Data Extraction)
app.post('/api/cfo/scan-receipt', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    const ai = getAIClient();
    const prompt = `
Extract transaction metadata from this receipt image. Return ONLY valid JSON:
{
  "merchant": "Store or Vendor name",
  "amount": number (total amount paid),
  "tax": number or null,
  "date": "YYYY-MM-DD",
  "category": "Software" | "Office" | "Travel" | "Meals" | "Marketing" | "Contractors" | "Utilities" | "Other",
  "summary": "Brief items summary"
}
`;

    // Strip base64 prefix if provided (e.g., "data:image/jpeg;base64,...")
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType || 'image/jpeg',
          },
        },
        { text: prompt },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, extractedData: parsed });
  } catch (error: any) {
    console.error('Error in /api/cfo/scan-receipt:', error);
    res.status(500).json({ error: error.message || 'Failed to scan receipt' });
  }
});

// API Route: Daily Business Brief AI Generation
app.post('/api/cfo/daily-brief', async (req, res) => {
  try {
    const { financialContext } = req.body;
    const ai = getAIClient();

    const prompt = `
You are Chieffo, an executive AI CFO for ${financialContext?.userName || 'the business owner'}'s business: "${financialContext?.businessName || 'Business'}".
Analyze the user's REAL financial inputs and output an executive Daily Business Brief.

CRITICAL RULES:
1. ONLY analyze the provided financial data. Do not make up fake financial numbers.
2. If data is sparse, calculate estimates directly from the items provided.
3. Priority action must be specific (e.g., "Follow up with 2 overdue invoices", "Log new client payment", "Review software subscriptions").

FINANCIAL INPUTS:
- Business Name: ${financialContext?.businessName || 'My Business'}
- Business Type: ${financialContext?.businessType || 'Consultant'}
- Cash Balance: $${financialContext?.cashBalance ?? 0}
- SpendReady (Safely Spendable): $${financialContext?.spendReady ?? 0}
- Total Monthly Incomes Logged: $${financialContext?.monthlyIncomes ?? 0}
- Total Monthly Expenses Logged: $${financialContext?.monthlyExpenses ?? 0}
- Overdue Invoices Count: ${financialContext?.overdueInvoicesCount ?? 0} ($${financialContext?.overdueInvoicesTotal ?? 0})
- Pending Invoices Count: ${financialContext?.pendingInvoicesCount ?? 0} ($${financialContext?.pendingInvoicesTotal ?? 0})
- Top Expense Categories: ${JSON.stringify(financialContext?.topCategories || [])}
- Business Goal: ${financialContext?.businessGoal || 'Increase profit'}

Respond strictly with valid JSON conforming to this schema:
{
  "healthScore": number, // 0-100
  "healthRating": "Excellent" | "Good" | "Fair" | "At Risk",
  "spendReady": number,
  "revenueTrend": "e.g. +12% this month" or "Stable income baseline",
  "cashFlowStatus": "Healthy" | "Stable" | "Tight" | "Warning",
  "aiRecommendation": "Executive actionable summary advising on spend or income growth",
  "priorityAction": "1-line direct immediate priority action item",
  "keyInsights": [
    "Insight 1 about spending or revenue",
    "Insight 2 about tax reserves or cash flow buffer"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/cfo/daily-brief:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate Daily Business Brief',
    });
  }
});

// Vite middleware setup
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chieffo server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
