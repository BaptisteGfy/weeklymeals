import { getCurrentSession } from '@/lib/auth';

import { DashboardView } from './components/DashboardView';

const DashboardPage = async () => {
  const session = await getCurrentSession();
  const userName = session?.user?.name ?? '';

  return <DashboardView userName={userName} />;
};

export default DashboardPage;
