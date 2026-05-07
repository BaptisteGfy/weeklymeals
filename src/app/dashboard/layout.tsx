import { getPlannedMeals } from '@/actions/planner-actions';
import { getRecipes } from '@/actions/recipe-actions';
import { DashboardShell } from '@/components/DashboardShell';
import { DashboardProvider } from '@/context/DashboardContext';
import { getWeekStart } from '@/features/planner/utils/date';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const weekStart = getWeekStart();
  const [recipes, plannedMeals] = await Promise.all([
    getRecipes(),
    getPlannedMeals(weekStart),
  ]);

  return (
    <DashboardProvider
      initialRecipes={recipes}
      initialPlannedMeals={plannedMeals}
    >
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
};

export default DashboardLayout;
