// LEDGER ANALYSIS

export interface ResponseLedgerAnalysis {
  success: boolean;
  data: LedgerAnalysisData;
}

export interface LedgerAnalysisData {
  accounts_used: string[];
  assets_summary: AccountAmount[];
  balance_by_day: DailyBalance[];
  cashflow_by_month: MonthlyCashflow[];
  classify_months: ClassifyMonths;
  cumulative_net_income: CumulativeNetIncome[];
  daily_incomes_expenses: DailyInOut[];
  detected_alerts: DetectedAlert[];
  expenses_pie: AccountAmount[];
  expenses_trends: Record<string, Record<string, number>>;
  extreme_months: ExtremeMonths;
  income_dependency: MonthlyDependency[];
  incomes_pie: AccountAmount[];
  liabilities_summary: AccountAmount[];
  monthly_expense_ratio: MonthlyExpenseRatio[];
  monthly_growth_rates: MonthlyGrowthRate[];
  moving_average: MovingAverage[];
  predicted_months: PredictedMonth[];
  trend_slope: number;
  months: string[];
}

export interface AccountAmount {
  account: string;
  amount: number;
}

export interface DailyBalance {
  date: string; // e.g., "2025-01-15"
  balance: number;
  incoming: number;
  expenses: number;
}

export interface MonthlyCashflow {
  month: string; // e.g., "2025-01"
  in: number;
  out: number;
  net: number;
}

export interface ClassifyMonths {
  positive: string[]; // ["2025-01", ...]
  neutral: string[];
  negative: string[];
}

export interface CumulativeNetIncome {
  month: string;
  cumulative_net: number;
}

export interface DailyInOut {
  date: string;
  incoming: number;
  expenses: number;
}

export interface DetectedAlert {
  account: string;
  alert: string;
  amount: number;
  average: number;
  month: string;
}

export interface ExtremeMonths {
  best_balance: MonthlyCashflow;
  highest_expense: MonthlyCashflow;
  highest_income: MonthlyCashflow;
}

export interface MonthlyDependency {
  month: string;
  dependency_ratio: number;
}

export interface MonthlyExpenseRatio {
  month: string;
  expense_ratio: number;
}

export interface MonthlyGrowthRate {
  month: string;
  in_growth: number;
  out_growth: number;
  net_growth: number;
}

export interface MovingAverage {
  month: string;
  in_moving_avg: number;
}

export interface PredictedMonth {
  month: string;
  predicted_in: number;
}

// LEDGER PARSER

export interface BalanceAmount {
  [currency: string]: number; // La clave puede ser cualquier string, representando la moneda
}

export interface BalancesByDetailsSubAccounts {
  balances: BalanceAmount;
  sub_accounts: {
    [key: string]: BalancesByDetailsSubAccounts;
  };
}

export interface BalancesByDetails {
  balances: BalanceAmount;
  sub_accounts: {
    [key: string]: BalancesByDetailsSubAccounts;
  };
}

export interface BalanceByParent {
  [currency: string]: number; // La clave puede ser cualquier string, representando la moneda
}

export interface Snippet {
  gasolina: string;
  sueldo: string;
}

export interface Metadata {
  currency: string;
  snippet: Snippet;
}

export interface StateResultDetail {
  [key: string]: {
    amount: number;
    currency: string;
  };
}

export interface StateResults {
  expenses_details: StateResultDetail[];
  income_details: StateResultDetail[];
  total_expenses_by_currency: BalanceAmount;
  total_income_by_currency: BalanceAmount;
  utility_by_currency: BalanceAmount;
}

export interface TransactionAccount {
  account: string;
  amount: number;
  subAccounts: string[];
  unit: string;
}

export interface Transaction {
  accounts: TransactionAccount[];
  date: string;
  description: string;
  time: string | null;
  verified: boolean;
}

export interface LedgerParserData {
  accounts: string[];
  accounts_advance: { account: string }[];
  balances: {
    [key: string]: BalanceAmount;
  };
  balances_by_details: {
    [key: string]: BalancesByDetails;
  };
  balances_by_parents: {
    [key: string]: BalanceByParent;
  };
  metadata: Metadata;
  period: [string, string];
  state_results: StateResults;
  transactions: Transaction[];
  parents: {
    Assets: string;
    Liabilities: string;
    Equity: string;
    Income: string;
    Expenses: string;
  }
  transactions_resolved: Transaction[];
}

export interface ResponseLedgerParser {
  data: LedgerParserData;
  success: boolean;
}
