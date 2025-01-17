import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface ReleaseNote {
  id: string;
  title: string;
  description: string;
  datetime: string;
  category: "feature" | "bugfix" | "enhancement";
  tags: Tag[];
}

const categoryColors = {
  feature: "bg-emerald-500 text-white",
  bugfix: "bg-red-500 text-white",
  enhancement: "bg-purple-500 text-white",
} as const;

const categoryLabels = {
  feature: "Feature",
  bugfix: "Bug Fix",
  enhancement: "Enhancement",
} as const;

interface ReleaseCardProps {
  release: ReleaseNote;
  onEdit?: () => void;
}

export function ReleaseCard({ release, onEdit }: ReleaseCardProps) {
  const { role } = useAuth();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 backdrop-blur-sm cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span 
                className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${categoryColors[release.category]}`}
              >
                {categoryLabels[release.category]}
              </span>
              <time className="text-sm text-muted-foreground">
                {format(new Date(release.datetime), "MMM d, yyyy HH:mm")}
              </time>
            </div>
            {role === "admin" && onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Edit
              </button>
            )}
          </div>
          <h3 className="text-xl font-semibold mb-3 text-card-foreground">{release.title}</h3>
          <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">{release.description}</p>
          <div className="flex flex-wrap gap-2">
            {release.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 text-xs rounded-full transition-colors duration-200 hover:opacity-80"
                style={{ 
                  backgroundColor: `${tag.color}20`, 
                  color: tag.color,
                  boxShadow: `0 1px 2px ${tag.color}10`
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          

Let's add user roles and a popup card for release details.

<lov-code>
We'll need to:
1. Create a new context for user roles
2. Add a role selector component
3. Modify the Index page to handle roles
4. Add a popup card for release details

First, let's create the user role context:

<lov-write file_path="src/contexts/UserRoleContext.tsx">
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'admin' | 'user';

interface UserRoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('user');

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