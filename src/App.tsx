import { Navigate, Route, Routes } from "react-router-dom";
import { AdminShell } from "./components/admin/admin-shell";
import { ProtectedAdminRoute } from "./components/admin/protected-admin-route";
import { AdminCategoriesPage } from "./pages/admin/categories-page";
import { AdminLoginPage } from "./pages/admin/login-page";
import { AdminPackFormPage } from "./pages/admin/pack-form-page";
import { AdminPacksPage } from "./pages/admin/packs-page";
import { HomePage } from "./pages/home-page";
import { PackDetailPage } from "./pages/pack-detail-page";
import { AboutPage } from "./pages/about-page";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sobre" element={<AboutPage />} />
      <Route path="/packs/:slug" element={<PackDetailPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route element={<ProtectedAdminRoute />}>
        <Route element={<AdminShell />}>
          <Route path="/admin" element={<Navigate to="/admin/packs" replace />} />
          <Route path="/admin/packs" element={<AdminPacksPage />} />
          <Route path="/admin/packs/new" element={<AdminPackFormPage />} />
          <Route path="/admin/packs/:id/edit" element={<AdminPackFormPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
