import api from "@/config/axios";
import type {
  ResponseLedgerAnalysis,
  ResponseLedgerParser,
} from "@/types/backend/ledger-back.types";

/**
 * Parses the specified file to extract raw ledger data.
 * @param fileId - The ID of the file to parse.
 * @returns Parsed ledger data including accounts, transactions, etc.
 */
async function parseFile(fileId: string): Promise<ResponseLedgerParser> {
  const res = await api.get(`ledger/parser/${fileId}`);
  return res.data;
}

/**
 * Analyzes the ledger file and returns financial summaries, stats, and balances.
 * @param fileId - The ID of the file to analyze.
 * @returns Analysis of the file with metrics such as balances, trends, etc.
 */
async function analyzeFile(fileId: string): Promise<ResponseLedgerAnalysis> {
  const res = await api.get(`ledger/analyst/${fileId}`);
  return res.data;
}

/**
 * Compares two months within the same file to highlight differences in balances, expenses, etc.
 * @param fileId - The ID of the file to compare.
 * @param month1 - First month to compare (format: YYYY-MM).
 * @param month2 - Second month to compare (format: YYYY-MM).
 * @returns Object containing comparison metrics between both months.
 */
async function compareMonths(fileId: string, month1: string, month2: string) {
  const res = await api.post(`ledger/compare/${fileId}`, {
    month1,
    month2,
  });
  return res.data;
}

/**
 * Detects financial alerts based on a given threshold using anomaly detection.
 * @param fileId - The ID of the file to analyze.
 * @param threshold - Sensitivity threshold for alert detection (default is 1.5).
 * @returns List of alerts or anomalies detected in the file.
 */
async function detectAlerts(fileId: string, threshold: number = 1.5) {
  const res = await api.post(`ledger/alerts/${fileId}`, { threshold });
  return res.data;
}

/**
 * Cleans up temporary or intermediate files generated during parsing or analysis.
 * @returns Server response with cleanup status.
 */
async function cleanupTempFiles() {
  const res = await api.post(`ledger/cleanup`);
  return res.data;
}

export const LedgerAnalysis = {
  parseFile,
  analyzeFile,
  compareMonths,
  detectAlerts,
  cleanupTempFiles,
};
