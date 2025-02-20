
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { UserRoleProvider } from "./contexts/UserRoleContext";
import { NavBar } from "./components/NavBar";
import Index from "./pages/Index";

function App() {
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <Router>
        <UserRoleProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <NavBar />
              <div className="pt-16">
                <Index />
              </div>
              <Toaster />
            </div>
          </AuthProvider>
        </UserRoleProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
