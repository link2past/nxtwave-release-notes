
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function RegistrationChoice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg border border-border/50">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Choose Registration Type
          </h1>
          <p className="mt-2 text-muted-foreground">Select how you want to register</p>
        </div>

        <div className="mt-8 space-y-4">
          <Link to="/register/user" className="block w-full">
            <Button className="w-full" variant="default">
              Register as User
            </Button>
          </Link>
          
          <Link to="/register/admin" className="block w-full">
            <Button className="w-full" variant="outline">
              Register as Admin
            </Button>
          </Link>

          <div className="text-sm text-center pt-4">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
