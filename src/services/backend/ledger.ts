import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/ledger";

// Helper para enviar archivos
async function uploadFile(endpoint: string, file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error en ${endpoint}:`, error);
    throw error.response?.data || error.message;
  }
}

// Exporta funciones específicas por endpoint
export const LedgerApi = {
  parse: (file: File) => uploadFile("/parse", file),
  accounts: (file: File) => uploadFile("/accounts", file),
  balances: (file: File) => uploadFile("/balances", file),
  balancesByParents: (file: File) => uploadFile("/balances-by-parents", file),
  statusResults: (file: File) => uploadFile("/status-results", file),
  balancesDetails: (file: File) => uploadFile("/balances-details", file),
  dateRange: (file: File) => uploadFile("/date-range", file),
  dailySummary: (file: File) => uploadFile("/daily-summary", file),
  expensesPie: (file: File) => uploadFile("/expenses-pie", file),
  incomesPie: (file: File) => uploadFile("/incomes-pie", file),
  assetsSummary: (file: File) => uploadFile("/assets-summary", file),
  liabilitiesSummary: (file: File) => uploadFile("/liabilities-summary", file),
  balanceByDay: (file: File) => uploadFile("/balance-by-day", file),
  cashflow: (file: File) => uploadFile("/cashflow", file),
  expenseTrends: (file: File) => uploadFile("/expense-trends", file),
  monthlySummary: (file: File) => uploadFile("/monthly-summary", file),
  accountsUsed: (file: File) => uploadFile("/accounts-used", file),
  unusualExpenses: (file: File) => uploadFile("/unusual-expenses", file),
};
