
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getUserRole } from "@/utils/auth";
import { useUserRole } from "./UserRoleContext";

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
  const { setRole } = useUserRole();

  const handleSession = async (newSession: Session | null) => {
    if (newSession) {
      // Store session in cookie with 30 days expiry
      Cookies.set(COOKIE_NAME, JSON.stringify(newSession), {
        expires: COOKIE_EXPIRY,
        secure: true,
        sameSite: 'strict'
      });
      
      // Fetch and set user role
      try {
        const userRole = await getUserRole(newSession.user.id);
        setRole(userRole);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    } else {
      // Remove session cookie on logout/session expiry
      Cookies.remove(COOKIE_NAME);
      setRole('user'); // Reset role to default
    }
    setSession(newSession);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Try to get session from cookie first
      const cookieSession = Cookies.get(COOKIE_NAME);
      if (cookieSession) {
        try {
          const parsedSession = JSON.parse(cookieSession);
          await handleSession(parsedSession);
        } catch (error) {
          console.error('Error parsing session cookie:', error);
          Cookies.remove(COOKIE_NAME);
        }
      }

      // Get initial session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      await handleSession(session);
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      await handleSession(session);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        await handleSession(null);
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
        await handleSession(null);
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
