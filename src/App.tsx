
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RegistrationChoice from "@/pages/RegistrationChoice";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <AuthProvider>
          <UserRoleProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegistrationChoice />} />
              <Route path="/register/:type" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </UserRoleProvider>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
