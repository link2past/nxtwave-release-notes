
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { getUserRole } from "@/utils/auth";

type Role = 'admin' | 'user';

interface UserRoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('user');

  useEffect(() => {
    const initializeRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        try {
          const userRole = await getUserRole(session.user.id);
          setRole(userRole as Role);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    initializeRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.id) {
        try {
          const userRole = await getUserRole(session.user.id);
          setRole(userRole as Role);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setRole('user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}
