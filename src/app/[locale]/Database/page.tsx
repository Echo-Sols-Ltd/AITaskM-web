'use client';

import PlaceholderPage from '../../../components/PlaceholderPage';
import RoleBasedRoute from '../../../components/RoleBasedRoute';
import { Database } from 'lucide-react';

export default function DatabasePage() {
  return (
    <RoleBasedRoute allowedRoles={['admin']}>
      <PlaceholderPage
        title="Database Management"
        description="Database administration, backups, and monitoring tools."
        icon={Database}
      />
    </RoleBasedRoute>
  );
}
