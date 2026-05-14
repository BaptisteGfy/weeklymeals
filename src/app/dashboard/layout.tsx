import { redirect } from 'next/navigation';

import { getMealIdeas } from '@/actions/meal-idea-actions';
import { getPlannedMeals } from '@/actions/planner-actions';
import { getRecipes } from '@/actions/recipe-actions';
import { DashboardShell } from '@/components/DashboardShell';
import { PlannerProvider } from '@/context/PlannerContext';
import { RecipesProvider } from '@/context/RecipesContext';
import { getWeekStart } from '@/features/planner/utils/date';
import { getCurrentSession } from '@/lib/auth';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const weekStart = getWeekStart();
  const [recipes, plannedMeals, mealIdeas, session] = await Promise.all([
    getRecipes(),
    getPlannedMeals(weekStart),
    getMealIdeas(),
    getCurrentSession(),
  ]);

  if (!session) redirect('/login');

  return (
    <RecipesProvider initialRecipes={recipes}>
      <PlannerProvider
        initialPlannedMeals={plannedMeals}
        initialMealIdeas={mealIdeas}
      >
        <DashboardShell user={session.user}>{children}</DashboardShell>
      </PlannerProvider>
    </RecipesProvider>
  );
};

export default DashboardLayout;
