
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useUserRole } from "@/contexts/UserRoleContext";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { getUserRole } from "@/utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setRole } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Provide more specific error messages
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error(
            "Invalid login credentials. Please check your email and password, or register if you don't have an account."
          );
        }
        throw signInError;
      }

      if (signInData.user) {
        const userRole = await getUserRole(signInData.user.id);
        setRole(userRole);

        toast({
          title: `Welcome ${userRole === 'admin' ? 'Admin' : ''}!`,
          description: "You have successfully logged in.",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg border border-border/50">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Login
          </h1>
          <p className="mt-2 text-muted-foreground">Sign in to continue</p>
        </div>

        <AuthForm
          email={email}
          password={password}
          loading={loading}
          onSubmit={handleLogin}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
        />

        <div className="text-sm text-center text-muted-foreground">
          <p>
            For testing, you can use these credentials:
          </p>
          <p>
            Email: test@example.com<br />
            Password: password123
          </p>
        </div>
      </div>
    </div>
  );
}
