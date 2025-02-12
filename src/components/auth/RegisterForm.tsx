
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { RegisterFormProps } from "@/types/auth";

export function RegisterForm({
  email,
  password,
  username,
  loading,
  isAdmin,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  onUsernameChange,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-foreground">
            Username
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={onUsernameChange}
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={onEmailChange}
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
            onChange={onPasswordChange}
            placeholder="Enter your password"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>

      <div className="text-sm text-center">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
