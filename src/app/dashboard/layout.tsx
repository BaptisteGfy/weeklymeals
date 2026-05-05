import { getRecipes } from '@/actions/recipe-actions';
import { DashboardShell } from '@/components/DashboardShell';
import { DashboardProvider } from '@/context/DashboardContext';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const recipes = await getRecipes();
  return (
    <DashboardProvider initialRecipes={recipes}>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
};

export default DashboardLayout;
