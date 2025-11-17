'use client';

import PlaceholderPage from '../../../components/PlaceholderPage';
import RoleBasedRoute from '../../../components/RoleBasedRoute';
import { Shield } from 'lucide-react';

export default function AdminPage() {
  return (
    <RoleBasedRoute allowedRoles={['admin']}>
      <PlaceholderPage
        title="System Admin"
        description="Advanced system administration and configuration tools will be available here."
        icon={Shield}
      />
    </RoleBasedRoute>
  );
}
