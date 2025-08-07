import { LedgerProvider } from "@/contexts/LedgerContext";
import { Outlet } from "react-router-dom";

/**
 * This component is used to wrap the routes that need to access the LedgerContext.
 * It provides a shared context for the routes to access the LedgerContext.
 * @returns 
 */
export function LedgerLayout() {
  return (
    <LedgerProvider>
      <Outlet />
    </LedgerProvider>
  );
}
