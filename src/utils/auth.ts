
import { supabase } from "@/integrations/supabase/client";

export const checkUsernameExists = async (username: string) => {
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();
  
  return existingUser !== null;
};

export const getUserRole = async (userId: string) => {
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  if (roleError) {
    console.error("Error fetching user role:", roleError);
    throw roleError;
  }

  return roleData?.role || 'user';
};

export const createUserProfile = async (userId: string, username: string) => {
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ id: userId, username }]);

  if (profileError) throw profileError;
};

export const createUserRole = async (userId: string, isAdmin: boolean) => {
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert([{ user_id: userId, role: isAdmin ? 'admin' : 'user' }]);

  if (roleError) throw roleError;
};
