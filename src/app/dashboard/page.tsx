import { DashboardView } from '@/features/dashboard/components/DashboardView';
import { getCurrentSession } from '@/lib/auth';

const DashboardPage = async () => {
  const session = await getCurrentSession();
  const userName = session?.user?.name ?? '';

  return <DashboardView userName={userName} />;
};

export default DashboardPage;
