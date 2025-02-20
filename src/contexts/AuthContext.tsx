
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const COOKIE_NAME = 'sb-session';
const COOKIE_EXPIRY = 30; // days

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSession = (newSession: Session | null) => {
    if (newSession) {
      // Store session in cookie with 30 days expiry
      Cookies.set(COOKIE_NAME, JSON.stringify(newSession), {
        expires: COOKIE_EXPIRY,
        secure: true,
        sameSite: 'strict'
      });
    } else {
      // Remove session cookie on logout/session expiry
      Cookies.remove(COOKIE_NAME);
      localStorage.removeItem('supabase.auth.token');
    }
    setSession(newSession);
  };

  useEffect(() => {
    // Try to get session from cookie first
    const cookieSession = Cookies.get(COOKIE_NAME);
    if (cookieSession) {
      try {
        const parsedSession = JSON.parse(cookieSession);
        setSession(parsedSession);
      } catch (error) {
        console.error('Error parsing session cookie:', error);
        Cookies.remove(COOKIE_NAME);
      }
    }

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      handleSession(session);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        handleSession(null);
        navigate('/login');
      }

      // Handle session expired
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.log('Token refresh failed');
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        handleSession(null);
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
