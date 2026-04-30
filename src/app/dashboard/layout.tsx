import { DashboardShell } from '@/components/DashboardShell';
import { DashboardProvider } from '@/context/DashboardContext';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
};

export default DashboardLayout;
