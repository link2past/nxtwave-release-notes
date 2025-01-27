import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUserRole } from "@/contexts/UserRoleContext";

const ADMIN_CREDENTIALS = {
  email: "admin@example.com",
  password: "admin123"
};

const USER_CREDENTIALS = {
  email: "user@example.com",
  password: "user123"
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setRole } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setRole("admin");
      toast({
        title: "Welcome Admin!",
        description: "You have successfully logged in as an administrator.",
      });
      navigate("/");
    } else if (email === USER_CREDENTIALS.email && password === USER_CREDENTIALS.password) {
      setRole("user");
      toast({
        title: "Welcome!",
        description: "You have successfully logged in as a user.",
      });
      navigate("/");
    } else {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg border border-border/50">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Release Notes
          </h1>
          <p className="mt-2 text-muted-foreground">Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>

          <div className="text-sm text-center text-muted-foreground">
            <p>Demo Credentials:</p>
            <p>Admin: admin@example.com / admin123</p>
            <p>User: user@example.com / user123</p>
          </div>
        </form>
      </div>
    </div>
  );
}