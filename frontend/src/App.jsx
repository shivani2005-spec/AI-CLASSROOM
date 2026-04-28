import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

// Pages
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import HodDashboard from "./pages/HodDashboard";
import ClassroomLive from "./pages/ClassroomLive";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected — any authenticated user */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Role-based */}
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["teacher", "admin"]}>
                <TeacherDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hod-dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["hod", "admin"]}>
                <HodDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/classroom-live"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["teacher", "hod", "admin"]}>
                <ClassroomLive />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["admin"]}>
                <Admin />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
