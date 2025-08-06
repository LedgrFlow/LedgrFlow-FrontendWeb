import { EditorApi } from "@/services/backend/editor";
import { LedgerApi } from "@/services/backend/ledger";
import { FileStorage } from "@/utils/bd-local";
import { useEffect, useState } from "react";

type OriginalData = Record<string, Record<string, number>>;

type ParsedAccount = {
  name: string;
  amount: number[];
};

export function useEditorAPI() {
  const [content, setContent] = useState<string>();
  const [newFIle, setNewFile] = useState<File>();
  const [balances, setBalances] = useState<ParsedAccount[]>();
  const [accounts, setAccounts] = useState();
  const [totals, setTotals] = useState<{ debit: number; credit: number }>({
    debit: 0,
    credit: 0,
  });

  // FUNCTIONS AUXILIARS

  function parseAccounts(data: OriginalData): ParsedAccount[] {
    return Object.entries(data).map(([name, currencies]) => ({
      name,
      amount: Object.values(currencies),
    }));
  }

  /**
   * Load initial content from file
   */
  function loadInitialContent() {
    FileStorage.getAllFiles()
      .then((storedFile) => {
        if (storedFile) {
          EditorApi.uploadFile(storedFile[0]).then((data) => {
            setContent(data.content);
          });
        }
      })
      .catch(console.error);
  }

  function UpdateContent(text: string) {
    setContent(text);
  }

  function createFIleByContent(nameFile: string = "temp.ledger") {
    if (!content) return;
    return new File([content], nameFile, {
      type: "text/plain",
    });
  }

  function getAccounts() {
    if (!newFIle) return;

    LedgerApi.accounts(newFIle).then((data) => {
      setAccounts(data);
    });
  }

  function getBalances() {
    if (!newFIle) return;

    LedgerApi.balances(newFIle).then((data) => {
      if (data) {
        const parseData = parseAccounts(data);
        setBalances(parseData);
      }
    });
  }

  function calculateCreditAndDebit() {
    if (!newFIle) return;

    LedgerApi.parse(newFIle).then((data) => {
      let debit = 0;
      let credit = 0;

      for (const entry of data) {
        for (const account of entry.accounts) {
          if (account.amount > 0) {
            debit += account.amount;
          } else if (account.amount < 0) {
            credit += Math.abs(account.amount);
          }
        }
      }

      setTotals({ debit, credit });
    });
  }

  useEffect(() => {
    loadInitialContent();
  }, []);

  useEffect(() => {
    if (content) {
      const file = createFIleByContent();
      setNewFile(file);
    }
  }, [content]);

  useEffect(() => {
    calculateCreditAndDebit();
    getAccounts();
    getBalances();
  }, [newFIle]);

  /** Section of debug */
  useEffect(() => {
    console.log("BALANCES =>", balances);
    console.log("ACCOUNTS =>", accounts);
    console.log("TOTALES =>", totals);
  }, [balances, accounts, totals]);

  return {
    content,
    UpdateContent,
    totals,
    balances,
    accounts,
  };
}
