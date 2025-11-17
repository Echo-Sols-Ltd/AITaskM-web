'use client';

import PlaceholderPage from '../../../components/PlaceholderPage';
import RoleBasedRoute from '../../../components/RoleBasedRoute';
import { Users } from 'lucide-react';

export default function UsersPage() {
  return (
    <RoleBasedRoute allowedRoles={['admin']}>
      <PlaceholderPage
        title="User Management"
        description="Manage users, roles, and permissions. Create, edit, and deactivate user accounts."
        icon={Users}
      />
    </RoleBasedRoute>
  );
}
