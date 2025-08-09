import { Route } from "react-router-dom";
import { ProtectedRoute } from "./protected.routes";
import { LedgerLayout } from "./providers.routes";
import DashboardView from "@/views/app/dashboard/dashboard.index";
import EditorView from "@/views/app/editor_code/editor_vscode.index";
import ProfileView from "@/views/app/profile/profile.index";
import JournalView from "@/views/app/tables/journal/journal.index";
import StatesResultsView from "@/views/app/tables/states_results/states-results.index";
import BalanceView from "@/views/app/tables/balance/balance.index";
import BalanceDetailView from "@/views/app/tables/balance_details/balance-detail.index";
import SettingsView from "@/views/app/settings/settings.index";
import HelpsView from "@/views/app/helps/help.index";
import NotesView from "@/views/app/notes/notes.index";
import { RoutesConfig } from "@/config/routes.config";
const { rootPaths } = RoutesConfig;

export const AppRoutes = [
  <Route
    element={
      <ProtectedRoute>
        <LedgerLayout />
      </ProtectedRoute>
    }
  >
    <Route path={rootPaths.menu.darhboard.href} element={<DashboardView />} />
    <Route path={rootPaths.menu.editor.href} element={<EditorView />} />
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
    <Route path={rootPaths.index.profile.href} element={<ProfileView />} />,
    <Route path={"/test-editor"} element={<NotesView />} />,
  </Route>,

  <Route
    path={rootPaths.general.Settings.href}
    element={
      <ProtectedRoute>
        <SettingsView />
      </ProtectedRoute>
    }
  />,
  <Route
    path={rootPaths.general.Help.href}
    element={
      <ProtectedRoute>
        <HelpsView />
      </ProtectedRoute>
    }
  />,
];
