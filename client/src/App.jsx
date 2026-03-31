import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import PublicLayout from "./components/layout/PublicLayout";
import HomePage from "./pages/HomePage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import RequestDetailPage from "./pages/admin/RequestDetailPage";
import RequestListPage from "./pages/admin/RequestListPage";
import ApplicationStatusPage from "./pages/customer/ApplicationStatusPage";
import DashboardPage from "./pages/customer/DashboardPage";
import LoginPage from "./pages/customer/LoginPage";
import RegisterPage from "./pages/customer/RegisterPage";
import RequestServicePage from "./pages/customer/RequestServicePage";
import UploadDocumentsPage from "./pages/customer/UploadDocumentsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Route>

      <Route element={<ProtectedRoute role="user" />}>
        <Route element={<DashboardLayout role="user" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/services/request" element={<RequestServicePage />} />
          <Route path="/applications/:id/upload" element={<UploadDocumentsPage />} />
          <Route path="/applications/:id" element={<ApplicationStatusPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<DashboardLayout role="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/requests" element={<RequestListPage />} />
          <Route path="/admin/requests/:id" element={<RequestDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
