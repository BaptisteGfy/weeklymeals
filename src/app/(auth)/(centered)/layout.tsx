import { Logo } from '@/components/ui/logo';

const CenteredLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-neutre-50 flex min-h-screen flex-col">
    <div className="flex justify-center pt-10 pb-6">
      <Logo size="md" />
    </div>
    <div className="flex flex-1 items-center justify-center px-4 pb-16">
      {children}
    </div>
  </div>
);

export default CenteredLayout;
