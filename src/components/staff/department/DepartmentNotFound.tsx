'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DepartmentNotFound() {
  const router = useRouter();

  return (
    <div className="p-8 max-w-lg mx-auto text-center space-y-4 py-16">
      <Building2 className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
      <h2 className="text-xl font-bold">Department Not Found</h2>
      <p className="text-sm text-muted-foreground">
        The requested department could not be located or may have been archived.
      </p>
      <Button onClick={() => router.push('/admin/staff/departments')} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Departments
      </Button>
    </div>
  );
}