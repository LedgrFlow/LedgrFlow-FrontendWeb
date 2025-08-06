import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Dashboard from "@/views/dashboard";
import Editor from "@/views/editor-vscode";
import Settings from "@/views/settings";
import Helps from "@/views/help";
import Login from "@/views/login";
import JournalView from "@/views/registers/journal.view";
import StatesResultsView from "@/views/registers/states-results.view";
import BalanceView from "@/views/registers/balance.view";
import ProfileView from "@/views/profile.view";
import BalanceDetailView from "@/views/registers/balance-detail.view";
import RegisterView from "@/views/auth/register.view";
import { ProtectedRoute, PublicRoute } from "@/components/auth/ProtectedRoute";
import { LedgerProvider } from "@/contexts/LedgerContext";
import { RoutesConfig } from "@/config/routes.config";

const { rootPaths } = RoutesConfig;

export function LedgerLayout() {
  return (
    <LedgerProvider>
      <Outlet />
    </LedgerProvider>
  );
}

export function AppRoute() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route
        path={rootPaths.auth.login.href}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path={rootPaths.auth.register.href}
        element={
          <PublicRoute>
            <RegisterView />
          </PublicRoute>
        }
      />

      {/* Rutas protegidas con LedgerProvider compartido */}
      <Route
        element={
          <ProtectedRoute>
            <LedgerLayout />
          </ProtectedRoute>
        }
      >
        <Route path={rootPaths.menu.darhboard.href} element={<Dashboard />} />
        <Route path={rootPaths.menu.editor.href} element={<Editor />} />
        <Route path={rootPaths.menu.register.href}>
          <Route
            path={rootPaths.menu.register.routes.journal.href}
            element={<JournalView />}
          />
          <Route
            path={rootPaths.menu.register.routes.results.href}
            element={<StatesResultsView />}
          />
          <Route
            path={rootPaths.menu.register.routes.balance.href}
            element={<BalanceView />}
          />
          <Route
            path={rootPaths.menu.register.routes.balance_detail.href}
            element={<BalanceDetailView />}
          />
        </Route>
        <Route path={rootPaths.index.profile.href} element={<ProfileView />} />
      </Route>

      {/* Rutas protegidas SIN LedgerProvider */}
      <Route
        path={rootPaths.general.Settings.href}
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path={rootPaths.general.Help.href}
        element={
          <ProtectedRoute>
            <Helps />
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
