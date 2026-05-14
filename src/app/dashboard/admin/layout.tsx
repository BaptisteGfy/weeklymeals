import { redirect } from 'next/navigation';

import { UserRole } from '@/generated/prisma/client';
import { getCurrentSession } from '@/lib/auth';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getCurrentSession();

  if (!session || session.user.role !== UserRole.admin)
    redirect('/dashboard/recipes');

  return <>{children}</>;
};

export default AdminLayout;
