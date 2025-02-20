
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'admin' | 'user';

interface UserRoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available
  const [role, setRole] = useState<Role>(() => {
    const savedRole = localStorage.getItem('userRole');
    return (savedRole === 'admin' || savedRole === 'user') ? savedRole : 'user';
  });

  // Persist role changes to localStorage
  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem('userRole', newRole);
  };

  return (
    <UserRoleContext.Provider value={{ role, setRole: handleSetRole }}>
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
