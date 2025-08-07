import { Route, Routes, Navigate } from "react-router-dom";
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";

export function AppRoute() {
  return (
    <Routes>
      {AuthRoutes}
      {AppRoutes}

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
