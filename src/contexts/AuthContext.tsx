
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "@/utils/auth";
import { useUserRole } from "./UserRoleContext";

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
  const { setRole } = useUserRole();

  useEffect(() => {
    // Get initial session and set role
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        try {
          const userRole = await getUserRole(session.user.id);
          setRole(userRole);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event);
      setSession(session);
      setLoading(false);

      if (_event === 'TOKEN_REFRESHED') {
        console.log('Token was refreshed successfully');
      }

      if (session?.user) {
        try {
          const userRole = await getUserRole(session.user.id);
          setRole(userRole);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }

      if (_event === 'SIGNED_OUT') {
        // Clear any application state
        setSession(null);
        setRole('user');
        navigate('/login');
      }
    });

    // Add error handling for refresh token failures
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.log('Token refresh failed');
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, setRole]);

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
