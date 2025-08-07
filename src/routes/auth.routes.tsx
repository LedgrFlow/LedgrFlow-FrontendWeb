import LoginView from "@/views/auth/login/login.index";
import RegisterView from "@/views/auth/register/register.view";
import { Route } from "react-router-dom";
import { RoutesConfig } from "@/config/routes.config";
import { PublicRoute } from "./protected.routes";
const { rootPaths } = RoutesConfig;

export const AuthRoutes = [
  <Route
    path={rootPaths.auth.login.href}
    element={
      <PublicRoute>
        <LoginView />
      </PublicRoute>
    }
  />,
  <Route
    path={rootPaths.auth.register.href}
    element={
      <PublicRoute>
        <RegisterView />
      </PublicRoute>
    }
  />,
];
