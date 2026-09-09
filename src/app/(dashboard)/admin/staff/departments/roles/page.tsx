'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DepartmentRolesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/staff/departments');
  }, [router]);

  return null;
}

