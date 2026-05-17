const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <p className="font-heading text-2xl font-semibold text-primary mb-8">WeeklyMeals</p>
      {children}
    </div>
  );
};

export default AuthLayout;
