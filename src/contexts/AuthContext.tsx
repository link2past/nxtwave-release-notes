
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      setSession(session);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        setSession(null);
        navigate('/login');
      }

      // Handle refresh token failures
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.log('Token refresh failed');
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        setSession(null);
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
