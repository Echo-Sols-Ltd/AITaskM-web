'use client';

import PlaceholderPage from '../../../components/PlaceholderPage';
import RoleBasedRoute from '../../../components/RoleBasedRoute';
import { FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <RoleBasedRoute allowedRoles={['admin', 'manager']}>
      <PlaceholderPage
        title="Reports"
        description="Generate and view detailed reports on team performance, productivity, and project status."
        icon={FileText}
      />
    </RoleBasedRoute>
  );
}
