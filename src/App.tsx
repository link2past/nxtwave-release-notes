import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import Index from "@/pages/Index";
import Login from "@/pages/Login";

function App() {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <UserRoleProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </UserRoleProvider>
    </ThemeProvider>
  );
}

export default App;