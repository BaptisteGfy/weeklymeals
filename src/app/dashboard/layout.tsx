import { Sidebar } from '@/components/Sidebar';
import { DashboardProvider } from '@/context/DashboardContext';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
