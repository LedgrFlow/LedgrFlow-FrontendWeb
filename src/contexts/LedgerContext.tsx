import { LedgerAnalysis } from "@/services/backend/backLedger";
import type {
  LedgerAnalysisData,
  LedgerParserData,
} from "@/types/backend/ledger-back.types";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

/**
 * Ledger context interface containing shared state and updater functions.
 */
interface LedgerContextProps {
  /** Updates the analysis data for a given file ID */
  updateAnalysis: (fileId: string) => void;
  /** Updates the parser data for a given file ID */
  updateParser: (fileId: string) => void;
  /** Updates both analysis and parser data */
  updateAll: (fileId: string) => void;
  /** Current ledger analysis data */
  analysis: LedgerAnalysisData | null;
  /** Current ledger parser data */
  parser: LedgerParserData | null;
  /** List of detected months in the analysis */
  listMonths: string[];
  /** Total debit and credit values computed from parsed transactions */
  totals: { debit: number; credit: number };
  /** Is the analysis data loading */
  isLoadingAnalysis: boolean;
  /** Is the parser data loading */
  isLoadingParser: boolean;
  /** Is the analysis data loading */
  isErrorAnalysis: boolean;
  /** Is the parser data loading */
  isErrorParser: boolean;
}

/**
 * Type representing a transaction account entry.
 */
type AccountEntry = {
  account: string;
  amount: number;
  subAccounts: string[];
  unit: string;
};

/**
 * Type representing a full ledger transaction.
 */
type Transaction = {
  accounts: AccountEntry[];
  date: string;
  description: string;
  time: string | null;
  verified: boolean;
};

const LedgerContext = createContext<LedgerContextProps | undefined>(undefined);

/**
 * Custom hook to access ledger context.
 * @throws Error if used outside of a `LedgerProvider`.
 * @returns LedgerContextProps
 */
export const useLedger = () => {
  const context = useContext(LedgerContext);
  if (context === undefined) {
    throw new Error("useLedger must be used within a LedgerProvider");
  }
  return context;
};

interface LedgerProviderProps {
  /** Children components to wrap with the context */
  children: ReactNode;
}

/**
 * Provider component that manages and exposes ledger analysis and parser state.
 * Fetches and updates analysis and parsed data for a given file ID.
 */
export const LedgerProvider: React.FC<LedgerProviderProps> = ({ children }) => {
  const [analysis, setAnalysis] = useState<LedgerAnalysisData | null>(null);
  const [parser, setParser] = useState<LedgerParserData | null>(null);
  const [listMonths, setListMonths] = useState<string[]>([]);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingParser, setIsLoadingParser] = useState(false);
  const [isErrorAnalysis, setIsErrorAnalysis] = useState(false);
  const [isErrorParser, setIsErrorParser] = useState(false);
  const [totals, setTotals] = useState<{ debit: number; credit: number }>({
    debit: 0,
    credit: 0,
  });

  /**
   * Fetches and updates the ledger analysis data for the given file ID.
   * Also updates the list of detected months.
   * @param fileId - The ID of the file to analyze
   */
  function updateAnalysis(fileId: string) {
    setIsLoadingAnalysis(true);
    resetErrors();
    LedgerAnalysis.analyzeFile(fileId)
      .then((res) => {
        setAnalysis(res.data);
        setListMonths(res.data.months);
        setIsLoadingAnalysis(false);
      })
      .catch((err) => {
        console.error("Failed to analyze file: ", err);
        setAnalysis(null);
        setListMonths([]);
        setIsLoadingAnalysis(false);
        setIsErrorAnalysis(true);
      });
  }

  /**
   * Fetches and updates the parsed ledger data for the given file ID.
   * @param fileId - The ID of the file to parse
   */
  function updateParser(fileId: string) {
    setIsLoadingParser(true);
    resetErrors();
    LedgerAnalysis.parseFile(fileId)
      .then((res) => {
        setParser(res.data);
        setIsLoadingParser(false);
      })
      .catch((err) => {
        console.error("Failed to parse file: ", err);
        setParser(null);
        setIsLoadingParser(false);
        setIsErrorParser(true);
      });
  }

  /**
   * Calculates total debits and credits from the list of parsed transactions.
   * @param transactions - List of parsed transactions
   * @returns Object containing total debit and credit values
   */
  function getTotalDebitsAndCredits(transactions: Transaction[]) {
    if (!transactions) return { debit: 0, credit: 0 };

    let debit = 0;
    let credit = 0;

    for (const transaction of transactions) {
      for (const entry of transaction.accounts) {
        if (entry.amount > 0) {
          debit += entry.amount;
        } else if (entry.amount < 0) {
          credit += Math.abs(entry.amount);
        }
      }
    }

    return { debit, credit };
  }

  /**
   * Updates both the analysis and parsed data for the selected file.
   * @param idSelected - The ID of the file
   */
  function updateAll(idSelected: string) {
    updateAnalysis(idSelected);
    updateParser(idSelected);
  }

  /** Resets the error states */
  function resetErrors() {
    setIsErrorAnalysis(false);
    setIsErrorParser(false);
  }

  /**
   * Recalculates total debits and credits when the parsed data changes.
   */
  useEffect(() => {
    if (parser) {
      const { debit, credit } = getTotalDebitsAndCredits(parser.transactions_resolved ?? parser.transactions ?? []);
      setTotals({ debit, credit });
    } else {
      setTotals({ debit: 0, credit: 0 });
    }
  }, [parser]);

  // Debug log in development mode
  if (import.meta.env.MODE === "development") {
    useEffect(() => {
      console.groupCollapsed("📦 LedgerContext Debug");
      console.log("ANALYSIS UPDATED => ", analysis);
      console.log("PARSER UPDATED => ", parser);
      console.log("TOTALS UPDATED => ", totals);
      console.log("IS LOADING ANALYSIS => ", isLoadingAnalysis);
      console.log("IS LOADING PARSER => ", isLoadingParser);
      console.log("LIST MONTHS => ", listMonths);
      console.groupEnd();
    }, [parser, analysis]);
  }

  const value: LedgerContextProps = {
    updateAnalysis,
    updateParser,
    updateAll,
    analysis,
    parser,
    listMonths,
    totals,
    isLoadingAnalysis,
    isLoadingParser,
    isErrorAnalysis,
    isErrorParser,
  };

  return (
    <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>
  );
};
