
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from "@/contexts/UserRoleContext";
import { UserManagement } from "@/components/admin/UserManagement";

export default function AdminDashboard() {
  const { role } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  if (role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <UserManagement />
    </div>
  );
}
