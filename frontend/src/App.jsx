import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";

import { isAuthed } from "./lib/auth";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AppLayout } from "./ui/AppLayout";
import { DashboardPage } from "./views/DashboardPage";
import { LoginPage } from "./views/LoginPage";
import { ProjectsPage } from "./views/ProjectsPage";
import { RegisterPage } from "./views/RegisterPage";
import { ProductionPage } from "./views/ProductionPage";
import { QualityPage } from "./views/QualityPage";
import { InventoryPage } from "./views/InventoryPage";
import { RequireAuth } from "./ui/RequireAuth";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            isAuthed() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/production" element={<ProductionPage />} />
          <Route path="/quality" element={<QualityPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
