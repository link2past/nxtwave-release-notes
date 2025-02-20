
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserRole } from '@/utils/auth';

type Role = 'admin' | 'user';

interface UserRoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('user');
  const { session } = useAuth();

  useEffect(() => {
    async function fetchUserRole() {
      if (session?.user.id) {
        try {
          const userRole = await getUserRole(session.user.id);
          console.log('Fetched user role:', userRole);
          setRole(userRole);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    }

    fetchUserRole();
  }, [session]);

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
