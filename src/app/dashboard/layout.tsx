import { DashboardProvider } from '@/context/DashboardContext';

import { DashboardWrapper } from './components/DashboardWrapper';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardProvider>
      <DashboardWrapper>{children}</DashboardWrapper>
    </DashboardProvider>
  );
};

export default DashboardLayout;
