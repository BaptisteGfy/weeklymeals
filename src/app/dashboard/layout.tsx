import { redirect } from 'next/navigation';

import { getPlannedMeals } from '@/actions/planner-actions';
import { getRecipes } from '@/actions/recipe-actions';
import { DashboardShell } from '@/components/DashboardShell';
import { DashboardProvider } from '@/context/DashboardContext';
import { getWeekStart } from '@/features/planner/utils/date';
import { getCurrentSession } from '@/lib/auth';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const weekStart = getWeekStart();
  const [recipes, plannedMeals, session] = await Promise.all([
    getRecipes(),
    getPlannedMeals(weekStart),
    getCurrentSession(),
  ]);

  if (!session) redirect('/login');

  return (
    <DashboardProvider
      initialRecipes={recipes}
      initialPlannedMeals={plannedMeals}
    >
      <DashboardShell user={session.user}>{children}</DashboardShell>
    </DashboardProvider>
  );
};

export default DashboardLayout;
