import { useEffect, useState } from "react";
import { FileStorage } from "@/utils/bd-local";
import { LedgerApi } from "@/services/backend/ledger";
import dayjs from "dayjs";

dayjs.locale("es");

export function useLedgerRegister() {
  const [file, setFile] = useState<File | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    FileStorage.getFile("user-ledger")
      .then((loadedFile) => {
        if (loadedFile) {
          setFile(loadedFile);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!file) return;

    LedgerApi.parse(file)
      .then((data) => {
        setTransactions(data);
        console.log("Transactions loaded:", data);
      })
      .catch(console.error);

    LedgerApi.accounts(file)
      .then((data) => {
        setAccounts(data);
        console.log("Accounts loaded:", data);
      })
      .catch(console.error);
  }, [file]);

  useEffect(() => {
    console.log("Transactions", transactions);
    console.log("Accounts", accounts);
  }, [transactions, accounts]);

  return {
    file,
    transactions,
    accounts,
  };
}
