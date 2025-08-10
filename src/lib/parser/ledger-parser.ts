// ledgerParser.ts
export interface AccountEntry {
  account: string;
  subAccounts: string[];
  unit: string;
  amount: number;
  tax?: string;
}

export interface Transaction {
  date: string;
  time?: string;
  verified: boolean;
  description: string;
  accounts: AccountEntry[];
}

export class LedgerParser {
  static parse(content: string): Transaction[] {
    const lines = content.split(/\r?\n/).map((l) => l.trim());
    const transactions: Transaction[] = [];
    let currentTransaction: Transaction | null = null;
    let lastAmount: number | null = null;
    let lastUnit: string | null = null;

    for (const line of lines) {
      if (!line) {
        if (currentTransaction) {
          transactions.push(currentTransaction);
          currentTransaction = null;
        }
        continue;
      }

      if (line.startsWith(";")) continue; // comentario

      // Encabezado de transacción
      const dateMatch = line.match(
        /^(\d{4}[-/]\d{2}[-/]\d{2})(?: (\d{2}:\d{2}:\d{2}))?( \*?)?(.*)$/
      );
      if (dateMatch) {
        const [, date, time, verified, description] = dateMatch;
        currentTransaction = {
          date,
          time: time || undefined,
          verified: Boolean(verified && verified.trim() === "*"),
          description: description.trim(),
          accounts: [],
        };
        continue;
      }

      if (!currentTransaction) continue;

      // Detectar impuesto tipo +{IVA}
      const taxMatch = line.match(/\+\{([^}]+)\}$/);
      const tax = taxMatch ? taxMatch[1] : undefined;
      const cleanLine = tax ? line.replace(/\+\{[^}]+\}$/, "").trim() : line;

      // Patrones para cuenta, monto y moneda
      const accountMatch = cleanLine.match(
        /^([A-Za-z0-9: ]+)\s+(?:([A-Z]{3})\s+(-?\d{1,3}(?:,\d{3})*(?:\.\d+)?)|(-?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s+([A-Z]{3})|(\$?-?\d{1,3}(?:,\d{3})*(?:\.\d+)?))?$/
      );

      let accountName = "";
      let unit = lastUnit || "N/A";
      let amount = lastAmount ?? 0;

      if (accountMatch) {
        accountName = accountMatch[1].trim();
        if (accountMatch[2] && accountMatch[3]) {
          unit = accountMatch[2];
          amount = parseFloat(accountMatch[3].replace(/[$,]/g, ""));
        } else if (accountMatch[4] && accountMatch[5]) {
          amount = parseFloat(accountMatch[4].replace(/[$,]/g, ""));
          unit = accountMatch[5];
        } else if (accountMatch[6]) {
          amount = parseFloat(accountMatch[6].replace(/[$,]/g, ""));
        }
      } else {
        accountName = cleanLine.trim();
        if (lastAmount !== null) amount = -Math.abs(lastAmount);
      }

      lastAmount = amount;
      lastUnit = unit;

      currentTransaction.accounts.push({
        account: accountName.replace(/\s+/g, ""),
        subAccounts: accountName.split(":"),
        unit,
        amount,
        ...(tax ? { tax } : {}),
      });
    }

    if (currentTransaction) {
      transactions.push(currentTransaction);
    }

    return transactions;
  }
}
