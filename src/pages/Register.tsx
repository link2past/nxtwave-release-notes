
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { checkUsernameExists, createUserProfile, createUserRole } from "@/utils/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname === '/nxtwave/register/admin';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        toast({
          title: "Username taken",
          description: "This username is already in use. Please choose another.",
          variant: "destructive",
        });
        return;
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error("Failed to create user");
      
      const userId = signUpData.user.id;

      await createUserProfile(userId, username);
      await createUserRole(userId, isAdmin);

      toast({
        title: "Registration successful!",
        description: "Please proceed to login.",
      });
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error.message;
      if (errorMessage.includes("User already registered")) {
        toast({
          title: "Email already registered",
          description: "This email is already in use. Please use a different email or login.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage || "Registration failed. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg border border-border/50">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Register as {isAdmin ? 'Admin' : 'User'}
          </h1>
          <p className="mt-2 text-muted-foreground">Create your account</p>
        </div>

        <RegisterForm
          email={email}
          password={password}
          username={username}
          loading={loading}
          isAdmin={isAdmin}
          onSubmit={handleRegister}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onUsernameChange={(e) => setUsername(e.target.value)}
        />
      </div>
    </div>
  );
}
